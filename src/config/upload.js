import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { logger } from '../utils/logger.js';

// Ensure public/uploads directory exists for local strategy
const localUploadDir = path.join(process.cwd(), process.env.UPLOAD_PATH || 'public/uploads');

if (!fs.existsSync(localUploadDir)) {
  fs.mkdirSync(localUploadDir, { recursive: true });
  logger.info(`Created local upload directory at: ${localUploadDir}`);
}

// 1. Local Storage Strategy
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, localUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter (Images & PDF documents)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP and PDF are allowed.'), false);
  }
};

// Multer Upload Instance
export const upload = multer({
  storage: localStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max limit
  },
});

/**
 * Helper to resolve uploaded file URL based on configured storage strategy.
 */
export const getFileUrl = (file, req) => {
  if (!file) return null;

  if (process.env.STORAGE_TYPE === 's3') {
    // S3 Bucket URL Strategy
    const bucketName = process.env.AWS_S3_BUCKET_NAME || 'sahara-academy-uploads';
    const region = process.env.AWS_REGION || 'us-east-1';
    return `https://${bucketName}.s3.${region}.amazonaws.com/uploads/${file.filename || file.key}`;
  }

  // Local Storage URL Strategy
  const host = req ? `${req.protocol}://${req.get('host')}` : '';
  return `${host}/uploads/${file.filename}`;
};
