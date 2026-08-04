import { Router } from 'express';
import { listClassSubjects, saveClassSubject, removeClassSubject } from '../controllers/classSubject.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authenticateToken);

router.get('/', listClassSubjects);
router.post('/', saveClassSubject);       // For both Add (without id) and Update (with id in body)
router.delete('/:id', removeClassSubject);

export default router;