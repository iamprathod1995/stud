import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';

import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/student.routes.js';
import classRoutes from './routes/class.routes.js';
import sectionRoutes from './routes/section.routes.js';
import settingRoutes from './routes/setting.routes.js';
import academicYearRoutes from './routes/academic-year.route.js';
import studentAcademicHistoryRoutes from './routes/academic-history.route.js';
import uploadRoutes from './routes/upload.route.js';
import feeRoutes from './routes/fee.routes.js';
import schoolRoutes from './routes/school.routes.js';

import teacherRoutes from './routes/teacher.routes.js';
import subjectRoutes from './routes/subject.routes.js';
import teacherMappingRoutes from './routes/teacherMapping.routes.js';
import classSubjectRoutes from './routes/classSubject.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';


import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import { logger } from './utils/logger.js';

const app = express();

// Request Parsers & Security Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging Middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Serve Local File Uploads Publicly
const publicUploads = path.join(process.cwd(), process.env.UPLOAD_PATH || 'public/uploads');
app.use('/uploads', express.static(publicUploads));

// Load Swagger Documentation
const swaggerDocumentPath = path.join(process.cwd(), 'src/docs/swagger.json');
if (fs.existsSync(swaggerDocumentPath)) {
  const swaggerDoc = JSON.parse(fs.readFileSync(swaggerDocumentPath, 'utf8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'VidyaSetu Backend API',
    database: 'MySQL Supported',
    storageStrategy: process.env.STORAGE_TYPE || 'local',
    timestamp: new Date().toISOString(),
  });
});

// Mount Modular API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/academic-years', academicYearRoutes);
app.use("/api/fees", feeRoutes);

// New Routes Added (Teachers, Subjects & Teacher Mappings)
app.use('/api/teachers', teacherRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/teacher-mappings', teacherMappingRoutes);

// Ye naya route add karein:
app.use('/api/class-subjects', classSubjectRoutes);
app.use('/api/dashboard', dashboardRoutes);



app.use(
  '/api/student-academic-history',
  studentAcademicHistoryRoutes
);
app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);
app.use("/api/upload", uploadRoutes);
// Centralized Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
