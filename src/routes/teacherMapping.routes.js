import { Router } from 'express';
import { 
  listTeacherMappings, 
  saveTeacherMapping, 
  removeTeacherMapping 
} from '../controllers/teacherMapping.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authenticateToken);

router.get('/', listTeacherMappings);
router.post('/', saveTeacherMapping);          // Add or Update (Agar req.body me 'id' hoga to update, nahi to create)
router.delete('/:id', removeTeacherMapping);  // Delete mapping if not required / not assigned

export default router;