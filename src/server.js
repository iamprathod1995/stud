import app from './app.js';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';

dotenv.config();

const PORT = process.env.PORT || 3005;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  logger.info(`=======================================================`);
  logger.info(` VidyaSetu Node.js Backend Server Active `);
  logger.info(` URL: http://localhost:${PORT}`);
  logger.info(` Swagger Docs: http://localhost:${PORT}/api-docs`);
  logger.info(` Storage Mode: ${process.env.STORAGE_TYPE || 'local'}`);
  logger.info(`=======================================================`);
});
