import { FoodPortion } from './../../types';
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
