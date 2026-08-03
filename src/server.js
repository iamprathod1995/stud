import app from './app.js';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';

dotenv.config();

const PORT = process.env.APP_URL || 3005;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  logger.info(`=======================================================`);
  logger.info(` VidyaSetu Node.js Backend Server Active `);
  logger.info(` URL: ${APP_URL}`);
  logger.info(` Swagger Docs: ${APP_URL}/api-docs`);
  logger.info(` Storage Mode: ${process.env.STORAGE_TYPE || 'local'}`);
  logger.info(`=======================================================`);
});