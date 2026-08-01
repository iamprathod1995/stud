import {Router} from 'express';
import {listClasses,saveClass,removeClass} from '../controllers/class.controller.js';
import {authenticateToken} from '../middlewares/auth.middleware.js';

const router=Router();

router.use(authenticateToken);

router.get('/',listClasses);
router.post('/',saveClass);
router.delete('/:id',removeClass);

export default router;