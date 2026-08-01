import { query } from "../config/db.js";
import { Router } from "express";

import {
  listFees,
  saveFee,
  deleteFee,
  saveFeeStructure,
  getFeeStructures,
  getStudentFeesSummary,
  getStudentFeeList,
  updateStudentFee
} from "../controllers/fee.controller.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";


const router = Router();

// Sabhi routes par ek hi baar authentication middleware apply kar diya
router.use(authenticateToken);

// =====================
// GENERAL FEES
// =====================
router.get("/", listFees);
router.post("/", saveFee);
router.delete("/:id", deleteFee);


// =====================
// FEE STRUCTURE
// =====================
router.get("/structure", getFeeStructures);
router.post("/structure", saveFeeStructure);





router.get("/student-summary", getStudentFeesSummary);
router.get(
  "/student-summary/:student_id/:academic_year_id",
  getStudentFeeList
);
router.put("/student-summary/:id", updateStudentFee);


export default router;