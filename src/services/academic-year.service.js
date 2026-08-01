import { query } from "../config/db.js";


export const getAcademicYearList = async (params, user) => {


  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const offset = (page - 1) * limit;


  const search = params.search || "";


  const sortOrder =
    params.sortOrder?.toUpperCase() === "DESC"
      ? "DESC"
      : "ASC";


  const allowedSortColumns = [
    "year_name",
    "start_date",
    "end_date",
    "created_at"
  ];


  const sortColumn =
    allowedSortColumns.includes(params.sortBy)
      ? params.sortBy
      : "start_date";



  const rows = await query(
    `
SELECT *
FROM academic_years

WHERE school_id=?

AND (
 year_name LIKE ?
)

ORDER BY ${sortColumn} ${sortOrder}

LIMIT ? OFFSET ?

`,
    [
      user.school_id,
      `%${search}%`,
      limit,
      offset
    ]
  );





  const count = await query(
    `
SELECT COUNT(*) total

FROM academic_years

WHERE school_id=?

AND (
 year_name LIKE ?
)

`,
    [
      user.school_id,
      `%${search}%`
    ]
  );



  return {

    page,
    limit,

    total: count[0].total,

    totalPages:
      Math.ceil(count[0].total / limit),

    sortBy: sortColumn,

    sortOrder,

    data: rows

  };


};


// ... existing getAcademicYearList function ...

export const updateAcademicYear = async (id, body, user) => {
  // Destructure fields, and default them to null or handle undefined safely
  const year_name = body.year_name !== undefined ? body.year_name : null;
  const start_date = body.start_date !== undefined ? body.start_date : null;
  const end_date = body.end_date !== undefined ? body.end_date : null;
  const is_current = body.is_current !== undefined ? body.is_current : null;
  const status = body.status !== undefined ? body.status : null;

  // 1. Check if the record exists and belongs to the user's school
  const existing = await query(
    `SELECT * FROM academic_years WHERE id = ? AND school_id = ?`,
    [id, user.school_id]
  );

  if (existing.length === 0) {
    const error = new Error("Academic year not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. If setting this academic year as current, unset others for this school
  if (is_current === 1 || is_current === true) {
    await query(
      `UPDATE academic_years SET is_current = 0 WHERE school_id = ?`,
      [user.school_id]
    );
  }

  // 3. Perform the update query using COALESCE properly
  await query(
    `
    UPDATE academic_years 
    SET 
      year_name = COALESCE(?, year_name),
      start_date = COALESCE(?, start_date),
      end_date = COALESCE(?, end_date),
      is_current = COALESCE(?, is_current),
      status = COALESCE(?, status)
    WHERE id = ? AND school_id = ?
    `,
    [
      year_name,
      start_date,
      end_date,
      is_current,
      status,
      id,
      user.school_id
    ]
  );

  // 4. Fetch and return the updated record
  const updatedRecord = await query(
    `SELECT * FROM academic_years WHERE id = ?`,
    [id]
  );

  return updatedRecord[0];
};