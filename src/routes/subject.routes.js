import { Router } from 'express';
import { listSubjects, saveSubject, removeSubject } from '../controllers/subject.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authenticateToken);

router.get('/', listSubjects);
router.post('/', saveSubject);
router.delete('/:id', removeSubject);

export default router;