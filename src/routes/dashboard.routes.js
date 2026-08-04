import { Router } from 'express';
import { getDashboardStats } from '../controllers/school.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

// GET /api/dashboard/stats
router.get('/stats', getDashboardStats);

export default router;