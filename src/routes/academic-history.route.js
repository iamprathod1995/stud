import { Router } from "express";
import {
  listPromotionStudents,
  promoteStudents
} from "../controllers/academic-history.controller.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";


const router = Router();


router.use(authenticateToken);


// Promotion list
router.get("/promotion-list", listPromotionStudents);


// Promote students
router.post("/promote", promoteStudents);


export default router;