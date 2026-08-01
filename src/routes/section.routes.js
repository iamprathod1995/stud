import { Router } from 'express';

import {
    listSections,
    saveSection,
    removeSection
} from '../controllers/section.controller.js';

import { authenticateToken } from '../middlewares/auth.middleware.js';


const router = Router();


router.use(authenticateToken);


router.get(
    '/',
    listSections
);


router.post(
    '/',
    saveSection
);


router.put(
    '/:id',
    saveSection
);


router.delete(
    '/:id',
    removeSection
);



export default router;