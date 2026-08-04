import { Router } from 'express';
import { 
  listTeachers, 
  saveTeacher, 
  removeTeacher, 
  punchInTeacher,
  punchOutTeacher,
  adminSaveAttendance,
  bulkAdminSaveAttendance, // <-- Yahan import karein
  getAttendanceByDate,
  removeTeacherAttendance,
  getTeacherAttendanceDetail
} from '../controllers/teacher.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authenticateToken);

// Teacher CRUD routes
router.get('/', listTeachers);
router.post('/', saveTeacher);
router.delete('/:id', removeTeacher);

// Mobile App Attendance Routes (Teacher Side)
router.post('/attendance/punch-in', punchInTeacher);
router.post('/attendance/punch-out', punchOutTeacher);

// Admin Attendance Management Routes (Admin Side)
router.post('/attendance/admin/save', adminSaveAttendance);
router.post('/attendance/admin/bulk-save', bulkAdminSaveAttendance); // <-- Naya Bulk Save Route Add Kiya Gaya
router.get('/attendance/admin/date-sheet', getAttendanceByDate);

// ⚠️ IMPORTANT: Static route ko parameterized route (/:id) se upar rakhein
router.get('/attendance/detail', getTeacherAttendanceDetail);

router.delete('/attendance/:id', removeTeacherAttendance);

export default router;