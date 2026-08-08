import { Router } from 'express';
import { 
  punchInTeacherMobile,
  punchOutTeacherMobile,
  getMyAttendanceDetailMobile
} from '../controllers/teacher-mobile.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { isTeacher } from '../middlewares/role.middleware.js';

const router = Router();

// Dono middlewares lagaye hain: Token check + Role 4 (Teacher) check
router.use(authenticateToken, isTeacher);

router.post('/mobile-attendance/punch-in', punchInTeacherMobile);
router.post('/mobile-attendance/punch-out', punchOutTeacherMobile);
router.get('/mobile-attendance/my-detail', getMyAttendanceDetailMobile);

export default router;