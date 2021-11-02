import { FoodPortion } from 'src/types';
import { DateTime } from 'luxon';
import { ConsumedPortion, ConsumptionTime } from 'src/types';
import { SQLiteDatabase } from './types';
import { getFoodPortionId } from 'src/utils/food-portion-utils';

export async function createTables(db: SQLiteDatabase): Promise<void> {
   const actions = new Array<Promise<any>>();

   db.executeTransaction((tx) => {
      actions.push(
         tx.executeSql(
            'CREATE TABLE IF NOT EXISTS `consumedPortion` (`id` INTEGER PRIMARY KEY NOT NULL, `json` TEXT NOT NULL, `date` TEXT NOT NULL, `time` TEXT NOT NULL, `foodId` TEXT)',
         ),
      );
      actions.push(
         tx.executeSql(
            'CREATE UNIQUE INDEX IF NOT EXISTS `portionPerDay` ON `consumedPortion` (`date`, `time`, `foodId`)',
         ),
      );
   });

   await Promise.all(actions);
}

export async function selectFrequentlyUsedFood(
   db: SQLiteDatabase,
   time: ConsumptionTime,
   weekday: number,
): Promise<{ foodId: string; score: number }[]> {
   const maxAge = 60; // days

   // protection against SQL injections
   weekday = Number(weekday);
   if (time !== 'breakfast' && time !== 'dinner' && time !== 'lunch' && time !== 'snack')
      throw new Error('invalid consumption time');

   const result2 = await db.executeSql(`
      SELECT COUNT(*) AS count FROM \`consumedPortion\`
      WHERE julianday('now') - julianday(\`date\`) < ${maxAge}
         AND julianday('now') - julianday(\`date\`) >= 1
      `);

   const consumedFoodCount = result2[0]['count'] as number;

   const rewardSameWeekday = maxAge * 0.2 * consumedFoodCount;
   const rewardSameTime = maxAge * 0.1 * consumedFoodCount;

   const result = await db.executeSql(
      `SELECT \`foodId\`,
         SUM(${maxAge} - (julianday('now') - julianday(\`date\`)) +
            IIF(strftime("%w", \`date\`) = '${weekday}', ${rewardSameWeekday}, 0) +
            IIF(\`time\` = '${time}', ${rewardSameTime}, 0)
         ) AS score
      FROM consumedPortion
      WHERE julianday('now') - julianday(\`date\`) < ${maxAge}
         AND julianday('now') - julianday(\`date\`) >= 1
      GROUP BY \`foodId\`
      ORDER BY score DESC`,
   );

   return result.map(({ foodId, score }) => ({ foodId, score }));
}

/**
 * Insert or overwrite a given portion
 * @param db the database
 * @param consumed the consumed portion
 */
export async function setConsumedPortion(
   db: SQLiteDatabase,
   date: string,
   time: ConsumptionTime,
   foodPortion: FoodPortion,
): Promise<void> {
   date = DateTime.fromISO(date).toISODate(); // normalize

   const consumed: ConsumedPortion = { date, time, foodPortion };

   const foodId = getFoodPortionId(foodPortion);
   const json = JSON.stringify(consumed);

   await db.executeSql(
      'INSERT OR REPLACE INTO `consumedPortion` (`json`, `time`, `date`, `foodId`) VALUES (?, ?, ?, ?)',
      [json, consumed.time, date, foodId],
   );
}

export async function removeConsumedPortion(db: SQLiteDatabase, date: string, time: string, foodId: string) {
   await db.executeSql('DELETE FROM `consumedPortion` WHERE `date` = ? AND `time` = ? AND `foodId` = ?', [
      date,
      time,
      foodId,
   ]);
}

export async function fetchConsumedPortionsOfDay(db: SQLiteDatabase, date: string): Promise<ConsumedPortion[]> {
   const dateTime = DateTime.fromISO(date);
   const result = await db.executeSql('SELECT `json` FROM `consumedPortion` WHERE `date` = ? ORDER BY `id`', [
      dateTime.toISODate(),
   ]);

   return result.map(({ json }) => JSON.parse(json) as ConsumedPortion);
}
