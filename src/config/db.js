import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

dotenv.config();

let pool = null;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sahara_academy',
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
    queueLimit: 0,
  });

  logger.info('MySQL Pool initialized successfully.');
} catch (err) {
  logger.error('Failed to initialize MySQL Connection Pool:', err.message);
}

/**
 * Safe database query executor wrapping pool connection.
 */
export const query = async (sql, params = []) => {
  try {
    console.log("SQL:", sql);
    console.log("PARAMS:", params);

    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (err) {
    console.log("FAILED SQL:", sql);
    console.log("FAILED PARAMS:", params);
    throw err;
  }
};

export const checkDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    logger.info('✅ MySQL Database Connected Successfully');
    return true;

  } catch (err) {
    logger.error('❌ Database Connection Error');
    logger.error(`Message: ${err.message}`);
    logger.error(`Code: ${err.code}`);
    logger.error(`Host: ${process.env.DB_HOST}`);
    logger.error(`Database: ${process.env.DB_NAME}`);
    return false;
  }
};


export default pool;


