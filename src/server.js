import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { logger } from './utils/logger.js';
import { checkDatabaseConnection } from './config/db.js';

const PORT = process.env.PORT || 3005;
const HOST = '0.0.0.0';

async function startServer() {
  try {
    const dbConnected = await checkDatabaseConnection();

    if (!dbConnected) {
      logger.error('Database connection failed. Server stopped.');
      process.exit(1);
    }

    app.listen(PORT, HOST, () => {
      logger.info('=======================================================');
      logger.info('VidyaSetu Node.js Backend Server Active');
      logger.info(`URL: http://${HOST}:${PORT}`);
      logger.info(`Swagger Docs: http://${HOST}:${PORT}/api-docs`);
      logger.info(`Storage Mode: ${process.env.STORAGE_TYPE || 'local'}`);
      logger.info('=======================================================');
    });

  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

startServer();