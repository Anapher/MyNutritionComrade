import { Meal } from 'src/types';
import { SQLiteDatabase } from './types';

export async function createTables(db: SQLiteDatabase): Promise<void> {
   const actions = new Array<Promise<any>>();

   db.executeTransaction((tx) => {
      actions.push(
         tx.executeSql('CREATE TABLE IF NOT EXISTS `meal` (`id` INTEGER PRIMARY KEY NOT NULL, `json` TEXT NOT NULL)'),
      );
   });

   await Promise.all(actions);
}

export async function createMeal(db: SQLiteDatabase, meal: Omit<Meal, 'id'>) {
   const json = JSON.stringify(meal);

   await db.executeSql('INSERT INTO `meal` (`json`) VALUES (?)', [json]);
}

export async function updateMeal(db: SQLiteDatabase, meal: Meal) {
   const json = JSON.stringify(meal);

   await db.executeSql('UPDATE `meal` SET `json` = ? WHERE `id` = ?', [json, meal.id]);
}

export async function fetchMeals(db: SQLiteDatabase): Promise<Meal[]> {
   const result = await db.executeSql('SELECT `id`, `json` FROM `meal` ORDER BY `id`');

   return result.map(({ json, id }) => ({ ...JSON.parse(json), id } as Meal));
}
