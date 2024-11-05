import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

let db: any = null;

export async function openDB() {
  if (db) {
    return db;
  }
  
  db = await open({
    filename: path.join(process.cwd(), 'database', 'waste_management.db'),
    driver: sqlite3.Database
  });
  
  return db;
}