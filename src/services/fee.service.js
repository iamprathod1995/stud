import { query } from "../config/db.js";

// =============================
// FEE HEAD LIST
// =============================
export const listFees = async (params, user) => {
  const rows = await query(
    `SELECT * FROM fee_heads WHERE school_id=? ORDER BY id DESC`,
    [user.school_id]
  );
  return rows;
};

// =============================
// ADD / UPDATE FEE HEAD
// =============================
export const saveFee = async (data, user) => {
  const duplicate = await query(
    `SELECT id FROM fee_heads WHERE school_id=? AND fee_name=? ${
      data.id ? "AND id!=?" : ""
    }`,
    data.id
      ? [user.school_id, data.fee_name, data.id]
      : [user.school_id, data.fee_name]
  );

  if (duplicate.length) {
    throw new Error("Fee name already exists");
  }

  if (data.id) {
    await query(
      `UPDATE fee_heads SET fee_name=?, description=?, status=? WHERE id=? AND school_id=?`,
      [
        data.fee_name,
        data.description,
        data.status ?? 1,
        data.id,
        user.school_id,
      ]
    );

    return {
      message: "Fee updated successfully",
      data: { id: data.id },
    };
  }

  const result = await query(
    `INSERT INTO fee_heads (school_id, fee_name, description, status) VALUES(?,?,?,?)`,
    [user.school_id, data.fee_name, data.description, data.status ?? 1]
  );

  return {
    message: "Fee added successfully",
    data: { id: result.insertId },
  };
};

// =============================
// DELETE FEE HEAD
// =============================
export const deleteFee = async (id, user) => {
  const check = await query(
    `SELECT id FROM fee_heads WHERE id=? AND school_id=?`,
    [id, user.school_id]
  );

  if (!check.length) {
    throw new Error("Fee not found");
  }

  await query(`DELETE FROM fee_heads WHERE id=? AND school_id=?`, [
    id,
    user.school_id,
  ]);
};

// =============================
// FEE STRUCTURE
// =============================
export const saveFeeStructure = async (data, user) => {
  if (data.id) {
    const duplicate = await query(
      `SELECT id FROM fee_structures 
       WHERE school_id=? AND academic_year_id=? AND class_id=? AND fee_head_id=? AND id!=?`,
      [
        user.school_id,
        data.academic_year_id,
        data.class_id,
        data.fee_head_id,
        data.id,
      ]
    );

    if (duplicate.length) {
      throw new Error(
        "Fee structure already exists for this class and fee head"
      );
    }

    // 1. Update Fee Structure
    await query(
      `UPDATE fee_structures SET 
       academic_year_id=?, class_id=?, fee_head_id=?, amount=?, due_date=?, status=? 
       WHERE id=? AND school_id=?`,
      [
        data.academic_year_id,
        data.class_id,
        data.fee_head_id,
        data.amount,
        data.due_date,
        data.status ?? 1,
        data.id,
        user.school_id,
      ]
    );

    // 2. UPDATE Existing student_fees records (jinke paas pehle se entry hai)
    await query(
      `UPDATE student_fees 
       SET amount = ?, 
           due_amount = GREATEST(0, ? - paid_amount), 
           due_date = ?
       WHERE fee_structure_id = ? AND academic_year_id = ?`,
      [
        data.amount,
        data.amount,
        data.due_date || null,
        data.id,
        data.academic_year_id
      ]
    );

    // 3. INSERT for new students (agar update ke baad koi naya student us class me add hua ho ya pehle entry na bani ho)
    const assignToNewStudentsQuery = `
      INSERT INTO student_fees (student_id, fee_structure_id, academic_year_id, amount, paid_amount, due_amount, status, due_date)
      SELECT 
        sah.student_id, 
        ?, 
        ?, 
        ?, 
        0.00, 
        ?, 
        'Pending', 
        ?
      FROM student_academic_history sah
      JOIN students s ON s.id = sah.student_id
      WHERE sah.class_id = ? 
        AND sah.academic_year_id = ?
        AND s.school_id = ?
        AND NOT EXISTS (
          SELECT 1 FROM student_fees sf 
          WHERE sf.student_id = sah.student_id 
            AND sf.fee_structure_id = ?
            AND sf.academic_year_id = ?
        )
    `;

    await query(assignToNewStudentsQuery, [
      data.id,
      data.academic_year_id,
      data.amount,
      data.amount, // due_amount initially total amount ke barabar
      data.due_date || null,
      data.class_id,
      data.academic_year_id,
      user.school_id,
      data.id,
      data.academic_year_id
    ]);

    return {
      message: "Fee structure updated, synced, and missing student entries created successfully",
      data: { id: data.id },
    };
  }

  // --- Insert Logic (New Creation) ---
  const duplicate = await query(
    `SELECT id FROM fee_structures 
     WHERE school_id=? AND academic_year_id=? AND class_id=? AND fee_head_id=?`,
    [user.school_id, data.academic_year_id, data.class_id, data.fee_head_id]
  );

  if (duplicate.length) {
    throw new Error(
      "Fee structure already exists for this class and fee head"
    );
  }

  const result = await query(
    `INSERT INTO fee_structures (school_id, academic_year_id, class_id, fee_head_id, amount, due_date, status)
     VALUES(?,?,?,?,?,?,?)`,
    [
      user.school_id,
      data.academic_year_id,
      data.class_id,
      data.fee_head_id,
      data.amount,
      data.due_date || null,
      data.status ?? 1,
    ]
  );

  const newFeeStructureId = result.insertId;

  const assignToStudentsQuery = `
    INSERT INTO student_fees (student_id, fee_structure_id, academic_year_id, amount, paid_amount, due_amount, status, due_date)
    SELECT 
      sah.student_id, 
      ?, 
      ?, 
      ?, 
      0.00, 
      ?, 
      'Pending', 
      ?
    FROM student_academic_history sah
    JOIN students s ON s.id = sah.student_id
    WHERE sah.class_id = ? 
      AND sah.academic_year_id = ?
      AND s.school_id = ?
      AND NOT EXISTS (
        SELECT 1 FROM student_fees sf 
        WHERE sf.student_id = sah.student_id 
          AND sf.fee_structure_id = ?
          AND sf.academic_year_id = ?
      )
  `;

  await query(assignToStudentsQuery, [
    newFeeStructureId,
    data.academic_year_id,
    data.amount,
    data.amount,
    data.due_date || null,
    data.class_id,
    data.academic_year_id,
    user.school_id,
    newFeeStructureId,
    data.academic_year_id
  ]);

  return {
    message: "Fee structure created and assigned to students successfully",
    data: { id: newFeeStructureId },
  };
};
// export const saveFeeStructure = async (data, user) => {
//   if (data.id) {
//     const duplicate = await query(
//       `SELECT id FROM fee_structures 
//        WHERE school_id=? AND academic_year_id=? AND class_id=? AND fee_head_id=? AND id!=?`,
//       [
//         user.school_id,
//         data.academic_year_id,
//         data.class_id,
//         data.fee_head_id,
//         data.id,
//       ]
//     );

//     if (duplicate.length) {
//       throw new Error(
//         "Fee structure already exists for this class and fee head"
//       );
//     }

//     await query(
//       `UPDATE fee_structures SET 
//         academic_year_id=?, class_id=?, fee_head_id=?, amount=?, due_date=?, status=? 
//        WHERE id=? AND school_id=?`,
//       [
//         data.academic_year_id,
//         data.class_id,
//         data.fee_head_id,
//         data.amount,
//         data.due_date,
//         data.status ?? 1,
//         data.id,
//         user.school_id,
//       ]
//     );

//     return {
//       message: "Fee structure updated successfully",
//       data: { id: data.id },
//     };
//   }

//   const duplicate = await query(
//     `SELECT id FROM fee_structures 
//      WHERE school_id=? AND academic_year_id=? AND class_id=? AND fee_head_id=?`,
//     [user.school_id, data.academic_year_id, data.class_id, data.fee_head_id]
//   );

//   if (duplicate.length) {
//     throw new Error(
//       "Fee structure already exists for this class and fee head"
//     );
//   }

//   const result = await query(
//     `INSERT INTO fee_structures (school_id, academic_year_id, class_id, fee_head_id, amount, due_date, status)
//      VALUES(?,?,?,?,?,?,?)`,
//     [
//       user.school_id,
//       data.academic_year_id,
//       data.class_id,
//       data.fee_head_id,
//       data.amount,
//       data.due_date,
//       data.status ?? 1,
//     ]
//   );

//   return {
//     message: "Fee structure created successfully",
//     data: { id: result.insertId },
//   };
// };

// =============================
// PAYMENT / COLLECT FEE
// =============================
export const collectFee = async (data, user) => {
  const result = await query(
    `INSERT INTO fee_payments 
     (student_id, student_fees_id, amount_paid, payment_date, payment_mode, transaction_id, remarks)
     VALUES(?,?,?,?,?,?,?)`,
    [
      data.student_id,
      data.student_fees_id,
      data.amount_paid,
      data.payment_date || new Date(),
      data.payment_mode || "Cash",
      data.transaction_id || null,
      data.remarks || null,
    ]
  );

  // Update paid_amount & due_amount in student_fees
  await query(
    `UPDATE student_fees 
     SET paid_amount = paid_amount + ?,
         due_amount = amount - (paid_amount + ?),
         status = CASE 
           WHEN amount - (paid_amount + ?) <= 0 THEN 'Paid' 
           ELSE 'Partial' 
         END
     WHERE id = ?`,
    [data.amount_paid, data.amount_paid, data.amount_paid, data.student_fees_id]
  );

  return {
    payment_id: result.insertId,
  };
};

// =============================
// STUDENT LEDGER
// =============================
export const studentLedger = async (student_id, user) => {
  const data = await query(
    `SELECT 
      fh.fee_name,
      sf.amount AS fee_amount,
      sf.paid_amount AS paid,
      sf.due_amount AS due,
      sf.status,
      sf.due_date
     FROM student_fees sf
     JOIN fee_structures fs ON fs.id = sf.fee_structure_id
     JOIN fee_heads fh ON fh.id = fs.fee_head_id
     WHERE sf.student_id = ? AND fs.school_id = ?`,
    [student_id, user.school_id]
  );

  return data;
};


// =============================
// UNIQUE STUDENT FEES SUMMARY
// =============================
export const getStudentFeesSummary = async (params = {}, user = {}) => {
  try {
    console.log("========== getStudentFeesSummary START ==========");

    // 1. Pagination
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const offset = (page - 1) * limit;

    // 2. Filters
    const search = params.search || '';
    const classId = params.class_id || null;
    const academicYearId = params.academic_year_id || null;
    const schoolId = user?.school_id || user?.schoolId || user?.school || null;

    // console.log("Params :", params);
    // console.log("User :", user);
    // console.log("School ID :", schoolId);

    // Sorting
    const sortOrder =
      params.sortOrder?.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const allowedSortColumns = [
      "student_id",
      "admission_no",
      "student_name",
      "total_amount",
      "total_due_amount",
    ];

    const sortColumn = allowedSortColumns.includes(params.sortBy)
      ? params.sortBy
      : "student_id";

    let whereClauses = ["1=1"];
    const queryParams = [];

    if (schoolId) {
      whereClauses.push("s.school_id = ?");
      queryParams.push(schoolId);
    }

    if (academicYearId && academicYearId !== "undefined" && academicYearId !== "null") {
      whereClauses.push("sf.academic_year_id = ?");
      queryParams.push(academicYearId);
    }

    if (classId && classId !== "undefined" && classId !== "null") {
      whereClauses.push("sah.class_id = ?");
      queryParams.push(classId);
    }

    if (search.trim() !== "" && search !== "undefined") {
      whereClauses.push(
        "(s.first_name LIKE ? OR s.last_name LIKE ? OR s.admission_no LIKE ? OR s.mobile LIKE ?)"
      );

      const searchParam = `%${search.trim()}%`;

      queryParams.push(
        searchParam,
        searchParam,
        searchParam,
        searchParam
      );
    }

    const whereSQL = whereClauses.join(" AND ");

    // console.log("WHERE :", whereSQL);
    // console.log("Query Params :", queryParams);

    const dataSql = `
      SELECT
        s.id AS student_id,
        s.admission_no,
        CONCAT(IFNULL(s.first_name,''),' ',IFNULL(s.last_name,'')) AS student_name,
        s.father_name,
        s.mobile,
        ay.year_name,
        ay.id AS academic_year_id,
        c.class_name,
        COALESCE(SUM(sf.amount),0) total_amount,
        COALESCE(SUM(sf.paid_amount),0) total_paid_amount,
        COALESCE(SUM(sf.due_amount),0) total_due_amount,
        CASE
          WHEN COALESCE(SUM(sf.due_amount),0)=0 THEN 'Paid'
          WHEN COALESCE(SUM(sf.paid_amount),0)>0 THEN 'Partial'
          ELSE 'Pending'
        END overall_status
      FROM student_fees sf
      JOIN students s ON s.id=sf.student_id
      JOIN academic_years ay ON ay.id=sf.academic_year_id
      LEFT JOIN student_academic_history sah
        ON sah.student_id=s.id
       AND sah.academic_year_id=sf.academic_year_id
      LEFT JOIN classes c ON c.id=sah.class_id
      WHERE ${whereSQL}
      GROUP BY s.id,sf.academic_year_id
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    // console.log("Executing Data Query...");
    // console.time("Data Query");

    const rows = await query(dataSql, [...queryParams, limit, offset]);

    // console.timeEnd("Data Query");
    // console.log("Rows Count :", rows.length);

    const countSql = `
      SELECT COUNT(DISTINCT s.id, sf.academic_year_id) total
      FROM student_fees sf
      JOIN students s ON s.id=sf.student_id
      LEFT JOIN student_academic_history sah
        ON sah.student_id=s.id
       AND sah.academic_year_id=sf.academic_year_id
      WHERE ${whereSQL}
    `;

    // console.log("Executing Count Query...");
    // console.time("Count Query");

    const count = await query(countSql, queryParams);

    // console.timeEnd("Count Query");
    // console.log("Count Result :", count);

    const total = count[0]?.total || 0;

    // console.log("========== END ==========");

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      sortBy: sortColumn,
      sortOrder,
      data: rows,
    };
  } catch (err) {
    // console.error("getStudentFeesSummary ERROR");
    // console.error(err);
    throw err;
  }
};

// =============================
// SINGLE STUDENT FEE LIST
// =============================

export const getStudentFeeList = async (studentId, user, yearId) => {
  console.log("yearId", yearId);

  const rows = await query(
    `
    SELECT
      sf.id,
      sf.student_id,
      sf.fee_structure_id,

      fh.fee_name,

      ay.id AS academic_year_id,
      ay.year_name,

      sf.amount,
      sf.paid_amount,
      sf.due_amount,
      sf.status,
      sf.due_date,

      fs.class_id,
      c.class_name

    FROM student_fees sf

    INNER JOIN fee_structures fs
        ON fs.id = sf.fee_structure_id

    INNER JOIN fee_heads fh
        ON fh.id = fs.fee_head_id

    INNER JOIN academic_years ay
        ON ay.id = sf.academic_year_id

    LEFT JOIN classes c
        ON c.id = fs.class_id

    WHERE sf.student_id = ?
      AND fs.school_id = ?
      AND sf.academic_year_id = ?

    ORDER BY fh.fee_name ASC
    `,
    [studentId, user.school_id, yearId]
  );

  return rows;
};
// export const updateStudentFee = async (feeRecordId, data, user) => {
//   const { amount, paid_amount, status, payment_mode, remarks, transaction_id } = data;
  
//   // 1. Pehle database se purana record fetch karein taaki existing paid_amount mil sake
//   const existingRows = await query(
//     `SELECT paid_amount FROM student_fees WHERE id = ?`,
//     [feeRecordId]
//   );

//   if (!existingRows || existingRows.length === 0) {
//     throw new Error("Fee record not found");
//   }

//   const oldPaidAmount = Number(existingRows[0].paid_amount || 0);
//   const newAdditionalPaid = Number(paid_amount || 0);
  
//   // Total paid amount = purana paid + naya entry amount
//   const totalPaidAmount = oldPaidAmount + newAdditionalPaid;
  
//   // Total amount (agar user ne update kiya hai ya purana hi rahega)
//   const totalAmount = Number(amount || 0);
  
//   // Remaining due calculation
//   const calculatedDue = Math.max(0, totalAmount - totalPaidAmount);

//   // 2. student_fees table ko update karein
//   const updateFeeQuery = `
//     UPDATE student_fees 
//     SET amount = ?, paid_amount = ?, due_amount = ?, status = ?, updated_at = NOW()
//     WHERE id = ?
//   `;
  
//   await query(updateFeeQuery, [
//     totalAmount, 
//     totalPaidAmount, 
//     calculatedDue, 
//     status, 
//     feeRecordId
//   ]);

//   // 3. Agar naya paid amount > 0 hai, toh fee_payments table me transaction entry insert karein
//   if (newAdditionalPaid > 0) {
//     const insertPaymentQuery = `
//       INSERT INTO fee_payments (student_id, student_fees_id, amount_paid, payment_date, payment_mode, transaction_id, remarks)
//       SELECT student_id, ?, ?, CURDATE(), ?, ?, ?
//       FROM student_fees
//       WHERE id = ?
//     `;

//     await query(insertPaymentQuery, [
//       feeRecordId,
//       newAdditionalPaid,
//       payment_mode || 'Cash',
//       transaction_id || null,
//       remarks || null,
//       feeRecordId
//     ]);
//   }
  
//   return { success: true, message: "Fee record and payment updated successfully" };
// };

export const updateStudentFee = async (feeRecordId, data, user) => {
  const {
    paid_amount,
    payment_mode,
    remarks,
    transaction_id
  } = data;

  const newPayment = Number(paid_amount || 0);

  if (newPayment <= 0) {
    throw new Error("Payment amount must be greater than zero");
  }

  // 1. Existing fee record fetch
  const feeRows = await query(
    `
    SELECT 
      id,
      amount,
      paid_amount,
      due_amount,
      student_id
    FROM student_fees
    WHERE id = ?
    `,
    [feeRecordId]
  );


  if (!feeRows.length) {
    throw new Error("Fee record not found");
  }


  const fee = feeRows[0];


  const totalAmount = Number(fee.amount);


  // 2. Calculate current paid amount from payment history
  const paymentRows = await query(
    `
    SELECT COALESCE(SUM(amount_paid),0) AS total_paid
    FROM fee_payments
    WHERE student_fees_id = ?
    `,
    [feeRecordId]
  );


  const alreadyPaid = Number(paymentRows[0].total_paid || 0);


  const newTotalPaid = alreadyPaid + newPayment;


  // 3. Due calculation

  if (newTotalPaid > totalAmount) {
    throw new Error(
      `Payment exceeds fee amount. Remaining due is ${
        totalAmount - alreadyPaid
      }`
    );
  }


  const dueAmount = totalAmount - newTotalPaid;


  let status = "Pending";

  if (dueAmount === 0) {
    status = "Paid";
  } 
  else if (newTotalPaid > 0) {
    status = "Partial";
  }


  // 4. Insert payment history

  await query(
    `
    INSERT INTO fee_payments
    (
      student_id,
      student_fees_id,
      amount_paid,
      payment_date,
      payment_mode,
      transaction_id,
      remarks
    )
    VALUES(?,?,?,?,?,?,?)
    `,
    [
      fee.student_id,
      feeRecordId,
      newPayment,
      new Date(),
      payment_mode || "Cash",
      transaction_id || null,
      remarks || null
    ]
  );


  // 5. Update summary table

  await query(
    `
    UPDATE student_fees
    SET
      paid_amount = ?,
      due_amount = ?,
      status = ?,
      updated_at = NOW()
    WHERE id = ?
    `,
    [
      newTotalPaid,
      dueAmount,
      status,
      feeRecordId
    ]
  );


  return {
    success:true,
    message:"Payment collected successfully",
    data:{
      total_amount: totalAmount,
      paid_amount:newTotalPaid,
      due_amount:dueAmount,
      status
    }
  };
};