interface SQLiteActions {
   executeSql(sql: string, params?: any[]): Promise<any[]>;
}

export interface SQLiteDatabase extends SQLiteActions {
   executeTransaction(tx: (actions: SQLiteActions) => void): void;
}
