import { Router } from 'express';
import { login, getMe, logout, changePassword, teacherlogin } from '../controllers/auth.controller.js';
import { validateLogin } from '../middlewares/validate.middleware.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', validateLogin, login);
router.get('/me', authenticateToken, getMe);
router.post('/logout', authenticateToken, logout);


router.post('/teacherlogin', validateLogin, teacherlogin);
// Naya Change Password Route (Protected)
router.post('/change-password', authenticateToken, changePassword);

export default router;