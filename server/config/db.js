import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool = null;

async function createDatabaseIfNeeded() {
  const { DB_HOST = '127.0.0.1', DB_USER = 'root', DB_PASSWORD = '', DB_NAME = 'cat_meow_db', DB_PORT = 3306 } = process.env;
  // connect without database to create it if missing
  const conn = await mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASSWORD, port: DB_PORT });
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  await conn.end();
}

export default {
  async init() {
    if (pool) return pool;
    await createDatabaseIfNeeded();
    const { DB_HOST = '127.0.0.1', DB_USER = 'root', DB_PASSWORD = '', DB_NAME = 'cat_meow_db', DB_PORT = 3306 } = process.env;
    pool = mysql.createPool({ host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME, port: DB_PORT, waitForConnections: true, connectionLimit: 10, queueLimit: 0 });
    return pool;
  }
};
