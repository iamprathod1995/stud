import { Router } from 'express';
import { listSchools, getSchool, saveSchool, deleteSchool } from '../controllers/school.controller.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', listSchools);
router.get('/:id', getSchool);
// router.post('/', authorizeRoles('Super Administrator'), saveSchool);
router.post('/', saveSchool);
router.put('/:id', saveSchool);
router.delete('/:id', authorizeRoles('Super Administrator'), deleteSchool);

export default router;
