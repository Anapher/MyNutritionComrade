export interface SQLiteDatabase {
   executeSql(sql: string, params?: any[]): Promise<any[]>;
}
