import { Router } from 'express';

import {
  listStudents,
  saveStudent,
  removeStudent
} from '../controllers/student.controller.js';

import {
  authenticateToken
} from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', listStudents);

router.post('/', saveStudent);

router.delete('/:id', removeStudent);

export default router;