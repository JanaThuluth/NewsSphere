import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "newssphere.db";

let database: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!database) {
    database = await SQLite.openDatabaseAsync(DATABASE_NAME);
  }

  return database;
};