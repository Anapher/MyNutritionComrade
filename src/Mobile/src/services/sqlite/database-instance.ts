import { SQLiteDatabase } from './types';
import * as SQLite from 'expo-sqlite';
import config from 'src/config';
import { createTables as createDiaryTables } from './diary-repository';
import wrapSQLDatabase from './sqlite-database-wrapper';

let database: Promise<SQLiteDatabase> | undefined;

export default async function getDatabase(): Promise<SQLiteDatabase> {
   return database ?? (database = createDatabase());
}

async function createDatabase(): Promise<SQLiteDatabase> {
   const db = SQLite.openDatabase(config.userDataDatabaseName);
   const sqliteDb = wrapSQLDatabase(db);

   await createDiaryTables(sqliteDb);

   return sqliteDb;
}
