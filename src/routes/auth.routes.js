import { Router } from 'express';
import { login, getMe, logout } from '../controllers/auth.controller.js';
import { validateLogin } from '../middlewares/validate.middleware.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', validateLogin, login);
router.get('/me', authenticateToken, getMe);
router.post('/logout', logout);

export default router;
