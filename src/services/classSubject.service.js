import { query } from '../config/db.js';

export const getClassSubjectList = async (params, user) => {
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const offset = (page - 1) * limit;
  const search = params.search || '';
  const classId = params.class_id || '';
  const sortOrder = params.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  let baseQuery = `
    FROM class_subjects cs
    JOIN classes c ON cs.class_id = c.id
    JOIN subjects s ON cs.subject_id = s.id
    WHERE c.school_id = ? 
  `;
  const queryParams = [user.school_id];

  if (classId) {
    baseQuery += ` AND cs.class_id = ? `;
    queryParams.push(classId);
  }

  if (search) {
    baseQuery += ` AND (s.subject_name LIKE ? OR c.class_name LIKE ?) `;
    queryParams.push(`%${search}%`, `%${search}%`);
  }

  // Fetch rows with pagination
  const rows = await query(`
    SELECT cs.id, cs.class_id, c.class_name, cs.subject_id, s.subject_name, s.subject_code, cs.created_at
    ${baseQuery}
    ORDER BY c.class_name ${sortOrder}, s.subject_name ${sortOrder}
    LIMIT ? OFFSET ?
  `, [...queryParams, limit, offset]);

  // Fetch total count
  const count = await query(`
    SELECT COUNT(*) AS total ${baseQuery}
  `, queryParams);

  return {
    page,
    limit,
    total: count[0].total,
    totalPages: Math.ceil(count[0].total / limit),
    data: rows
  };
};

export const saveClassSubject = async (data, user) => {
  const school_id = user.school_id;
  const { class_id, subject_id, id } = data;

  // Verify that class belongs to the user's school
  const classCheck = await query(`SELECT id FROM classes WHERE id = ? AND school_id = ?`, [class_id, school_id]);
  if (!classCheck.length) {
    throw new Error("Class not found or does not belong to your school");
  }

  // Verify that subject belongs to the user's school
  const subjectCheck = await query(`SELECT id FROM subjects WHERE id = ? AND school_id = ?`, [subject_id, school_id]);
  if (!subjectCheck.length) {
    throw new Error("Subject not found or does not belong to your school");
  }

  // Check for duplicate mapping (Same subject in the same class)
  const duplicate = await query(`
    SELECT cs.id FROM class_subjects cs
    JOIN classes c ON cs.class_id = c.id
    WHERE c.school_id = ? AND cs.class_id = ? AND cs.subject_id = ? ${id ? "AND cs.id != ?" : ""}
    LIMIT 1
  `, id ? [school_id, class_id, subject_id, id] : [school_id, class_id, subject_id]);

  if (duplicate.length > 0) {
    throw new Error("This subject is already assigned to this class");
  }

  if (id) {
    // Update mapping
    await query(`
      UPDATE class_subjects SET class_id = ?, subject_id = ? WHERE id = ?
    `, [class_id, subject_id, id]);
    return { message: "Class subject updated successfully", data: { id } };
  } else {
    // Insert new mapping
    const result = await query(`
      INSERT INTO class_subjects (class_id, subject_id) VALUES (?, ?)
    `, [class_id, subject_id]);
    return { message: "Subject assigned to class successfully", data: { id: result.insertId } };
  }
};

export const deleteClassSubject = async (id, user) => {
  // Verify ownership via school_id through join
  const check = await query(`
    SELECT cs.id FROM class_subjects cs
    JOIN classes c ON cs.class_id = c.id
    WHERE cs.id = ? AND c.school_id = ?
  `, [id, user.school_id]);

  if (!check.length) {
    throw new Error("Class subject mapping not found");
  }

  await query(`DELETE FROM class_subjects WHERE id = ?`, [id]);
  return true;
};