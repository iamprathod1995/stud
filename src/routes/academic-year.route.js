import { Router } from "express";

import {
 listAcademicYears,
 updateAcademicYear
}
from "../controllers/academic-year.controller.js";


import { authenticateToken }
from "../middlewares/auth.middleware.js";


const router = Router();


router.use(authenticateToken);


router.get(
 "/",
 listAcademicYears
);
router.put("/:id", updateAcademicYear); // Added update route

export default router;