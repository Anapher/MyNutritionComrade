import { DateTime } from 'luxon';
import { ConsumedPortion } from 'src/types';
import { getFoodPortionId } from 'src/utils/product-utils';
import { SQLiteDatabase } from './types';

const epocheStart = DateTime.fromMillis(0);

export async function createTables(db: SQLiteDatabase): Promise<void> {
   await db.executeSql(
      'CREATE TABLE IF NOT EXISTS `consumedPortion` (`id` INTEGER PRIMARY KEY NOT NULL, `json` TEXT NOT NULL, `time` TEXT NOT NULL, `date` TEXT NOT NULL, `daysSinceEpoche` INTEGER NOT NULL, `foodId` TEXT)',
   );
}

export async function insertConsumedPortion(db: SQLiteDatabase, consumed: ConsumedPortion): Promise<void> {
   const date = DateTime.fromISO(consumed.date);
   const daysSinceEpoche = date.diff(epocheStart).days;
   const foodId = getFoodPortionId(consumed.foodPortion);
   const json = JSON.stringify(consumed);

   await db.executeSql(
      'INSERT INTO `consumedPortion` (`json`, `time`, `date`, `daysSinceEpoche`, `foodId`) VALUES (?, ?, ?, ?, ?)',
      [json, consumed.time, date.toISODate(), daysSinceEpoche, foodId],
   );
}

export async function fetchConsumedPortionsOfDay(db: SQLiteDatabase, date: string): Promise<ConsumedPortion[]> {
   const dateTime = DateTime.fromISO(date);
   const result = await db.executeSql('SELECT `json` FROM `consumedPortion` WHERE `date` = ? ORDER BY `id`', [
      dateTime.toISODate(),
   ]);

   return result.map(({ json }) => JSON.parse(json) as ConsumedPortion);
}
