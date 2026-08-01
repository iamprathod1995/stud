import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/setting.controller.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';
import { upload } from '../config/upload.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getSettings);
router.put('/', authorizeRoles('Super Administrator'), upload.single('logoFile'), updateSettings);

export default router;
