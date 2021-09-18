import * as SQLite from 'expo-sqlite';
import { SQLiteDatabase } from './types';

export default function wrapSQLDatabase(db: SQLite.WebSQLDatabase): SQLiteDatabase {
   return {
      executeSql: (sql, params) =>
         new Promise((resolve, reject) =>
            db.transaction((tx) =>
               tx.executeSql(
                  sql,
                  params,
                  (_, { rows }) => resolve((rows as any)._array as any[]),
                  (_, error) => {
                     reject(error);
                     return false;
                  },
               ),
            ),
         ),
      executeTransaction: (delegate) => {
         db.transaction((tx) => {
            delegate({
               executeSql: (sql, params) =>
                  new Promise((resolve, reject) =>
                     tx.executeSql(
                        sql,
                        params,
                        (_, { rows }) => resolve((rows as any)._array as any[]),
                        (_, error) => {
                           reject(error);
                           return false;
                        },
                     ),
                  ),
            });
         });
      },
   };
}
