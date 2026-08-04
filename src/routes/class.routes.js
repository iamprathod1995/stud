import {Router} from 'express';
import {
    listClasses,
    saveClass,
    removeClass,
    getSectionsByClassController,
    getSubjectsByClassController
} from '../controllers/class.controller.js';
import {authenticateToken} from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

// Static routes ko dynamic se pehle rakhein
router.get('/sections-by-class', getSectionsByClassController);
router.get('/subjects-by-class', getSubjectsByClassController);

router.get('/', listClasses);
router.post('/', saveClass);
router.delete('/:id', removeClass);

export default router;