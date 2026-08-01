import { query } from "../config/db.js";
import * as feeService from "../services/fee.service.js";
import { sendResponse } from "../utils/response.js";

// ALL LIST
export const listFees = async (req, res, next) => {
  try {
    const data = await feeService.listFees(req.query, req.user);
    return sendResponse(res, 200, true, "Fees retrieved successfully", data);
  } catch (error) {
    next(error);
  }
};

// ADD / UPDATE FEE HEAD
export const saveFee = async (req, res, next) => {
  try {
    const data = await feeService.saveFee(req.body, req.user);
    return sendResponse(
      res,
      200,
      true,
      data.message || "Fee saved successfully",
      data.data
    );
  } catch (error) {
    next(error);
  }
};

// DELETE
export const deleteFee = async (req, res, next) => {
  try {
    await feeService.deleteFee(req.params.id, req.user);
    return sendResponse(res, 200, true, "Fee deleted successfully");
  } catch (error) {
    next(error);
  }
};

// GET FEE STRUCTURES
// GET FEE STRUCTURES
export const getFeeStructures = async (req, res, next) => {
  try {
    const schoolId = req.user?.school_id || req.user?.schoolId || null;
    const academicYearId = req.query?.academic_year_id || null;
    const classId = req.query?.class_id || null;

    let whereClauses = ["1=1"];
    const queryParams = [];

    if (schoolId) {
      whereClauses.push("fs.school_id = ?");
      queryParams.push(schoolId);
    }

    if (academicYearId && academicYearId !== "undefined" && academicYearId !== "null" && academicYearId !== "") {
      whereClauses.push("fs.academic_year_id = ?");
      queryParams.push(academicYearId);
    }

    if (classId && classId !== "undefined" && classId !== "null" && classId !== "") {
      whereClauses.push("fs.class_id = ?");
      queryParams.push(classId);
    }

    const whereSQL = whereClauses.join(" AND ");

    const data = await query(
      `
      SELECT 
        fs.*,
        fh.fee_name,
        c.class_name,
        ay.year_name
      FROM fee_structures fs
      LEFT JOIN fee_heads fh ON fh.id = fs.fee_head_id
      LEFT JOIN classes c ON c.id = fs.class_id
      LEFT JOIN academic_years ay ON ay.id = fs.academic_year_id
      WHERE ${whereSQL}
      ORDER BY fs.id DESC
      `,
      queryParams
    );

    return sendResponse(res, 200, true, "Fee structures fetched successfully", data);
  } catch (error) {
    next(error);
  }
};
// export const getFeeStructures = async (req, res, next) => {
//   try {
//     const data = await query(
//       `
//       SELECT 
//         fs.*,
//         fh.fee_name,
//         c.class_name,
//         ay.year_name
//       FROM fee_structures fs
//       LEFT JOIN fee_heads fh ON fh.id = fs.fee_head_id
//       LEFT JOIN classes c ON c.id = fs.class_id
//       LEFT JOIN academic_years ay ON ay.id = fs.academic_year_id
//       WHERE fs.school_id=?
//       ORDER BY fs.id DESC
//       `,
//       [req.user.school_id]
//     );

//     return sendResponse(res, 200, true, "Fee structures fetched successfully", data);
//   } catch (error) {
//     next(error);
//   }
// };

// SAVE FEE STRUCTURE
export const saveFeeStructure = async (req, res, next) => {
  try {
    const { id, academic_year_id, class_id, fee_head_id, amount, due_date, status } = req.body;

    if (!academic_year_id || !class_id || !fee_head_id || amount === undefined || amount === null) {
      return sendResponse(res, 400, false, "Academic year, class, fee head and amount are required");
    }

    const data = await feeService.saveFeeStructure(
      {
        id,
        academic_year_id,
        class_id,
        fee_head_id,
        amount,
        due_date: due_date || null,
        status: status ?? 1,
      },
      req.user
    );

    return sendResponse(res, 200, true, data.message || "Fee structure saved successfully", data.data);
  } catch (error) {
    next(error);
  }
};

// GET UNIQUE STUDENT FEES SUMMARY
export const getStudentFeesSummary = async (req, res, next) => {
  try {
    console.log("Controller Start");

    const data = await feeService.getStudentFeesSummary(req.query, req.user);

    console.log("Service Returned");
    console.log(data);

    return sendResponse(
      res,
      200,
      true,
      "Student fees summary fetched successfully",
      data
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// =============================
// SINGLE STUDENT FEE LIST
// =============================
export const getStudentFeeList = async (req, res, next) => {
  try {
    
    const data = await feeService.getStudentFeeList(
      req.params.student_id,
      req.user,
      req.params.academic_year_id
    );

    return sendResponse(
      res,
      200,
      true,
      "Student fee list fetched successfully",
      data
    );
  } catch (error) {
    next(error);
  }
};

// =============================
// UPDATE STUDENT FEE
// =============================
export const updateStudentFee = async (req, res, next) => {
  try {
    const data = await feeService.updateStudentFee(
      req.params.id,
      req.body,
      req.user
    );

    return sendResponse(
      res,
      200,
      true,
      "Student fee updated successfully",
      data
    );
  } catch (error) {
    next(error);
  }
};