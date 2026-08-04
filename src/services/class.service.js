import { query } from '../config/db.js';

export const getClassList = async (params, user) => {
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const offset = (page - 1) * limit;

  const search = params.search || '';

  const sortOrder = params.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  const allowedSortColumns = ['class_name', 'class_order', 'created_at'];

  const sortColumn = allowedSortColumns.includes(params.sortBy)
    ? params.sortBy
    : 'class_order';

  const rows = await query(`
    SELECT c.*, 
           GROUP_CONCAT(s.subject_name SEPARATOR ', ') AS subject_names
    FROM classes c
    LEFT JOIN class_subjects cs ON c.id = cs.class_id
    LEFT JOIN subjects s ON cs.subject_id = s.id
    WHERE c.school_id = ?
      AND c.class_name LIKE ?
    GROUP BY c.id
    ORDER BY c.${sortColumn} ${sortOrder}
    LIMIT ? OFFSET ?
  `, [
    user.school_id,
    `%${search}%`,
    limit,
    offset
  ]);

  const count = await query(`
    SELECT COUNT(DISTINCT c.id) total
    FROM classes c
    WHERE c.school_id = ?
      AND c.status = 1
      AND c.class_name LIKE ?
  `, [
    user.school_id,
    `%${search}%`
  ]);

  return {
    page,
    limit,
    total: count[0].total,
    totalPages: Math.ceil(count[0].total / limit),
    sortBy: sortColumn,
    sortOrder,
    data: rows
  };
};

export const saveClass = async (data, user) => {
  const school_id = user.school_id;

  const duplicate = await query(
    `
    SELECT id
    FROM classes
    WHERE school_id = ?
      AND class_name = ?
      ${data.id ? "AND id != ?" : ""}
    LIMIT 1
    `,
    data.id
      ? [school_id, data.class_name.trim(), data.id]
      : [school_id, data.class_name.trim()]
  );

  if (duplicate.length > 0) {
    throw new Error("Class name already exists");
  }

  let classId = data.id;

  if (classId) {
    await query(
      `
      UPDATE classes SET
        class_name = ?,
        class_order = ?,
        status = ?
      WHERE id = ?
        AND school_id = ?
      `,
      [
        data.class_name.trim(),
        data.class_order || 0,
        data.status ?? 1,
        classId,
        school_id,
      ]
    );

    await query(`DELETE FROM class_subjects WHERE class_id = ?`, [classId]);
  } else {
    const result = await query(
      `
      INSERT INTO classes
      (
        school_id,
        class_name,
        class_order,
        status
      )
      VALUES (?,?,?,?)
      `,
      [
        school_id,
        data.class_name.trim(),
        data.class_order || 0,
        data.status ?? 1,
      ]
    );

    classId = result.insertId;
  }

  if (Array.isArray(data.subject_ids) && data.subject_ids.length > 0) {
    for (const subject_id of data.subject_ids) {
      await query(
        `INSERT INTO class_subjects (class_id, subject_id) VALUES (?, ?)`,
        [classId, subject_id]
      );
    }
  }

  return {
    message: data.id ? "Class updated successfully" : "Class added successfully",
    data: {
      id: classId,
    },
  };
};

export const deleteClass = async (id, user) => {
  const checkClass = await query(`
    SELECT id
    FROM classes
    WHERE id = ?
      AND school_id = ?
  `, [
    id,
    user.school_id
  ]);

  if (!checkClass.length) {
    throw new Error('Class not found');
  }

  const sections = await query(`
    SELECT id
    FROM sections
    WHERE class_id = ?
    LIMIT 1
  `, [id]);

  if (sections.length) {
    throw new Error('Class cannot be deleted because sections are assigned');
  }

  await query(`DELETE FROM class_subjects WHERE class_id = ?`, [id]);
  
  await query(`
    DELETE FROM classes
    WHERE id = ?
      AND school_id = ?
  `, [
    id,
    user.school_id
  ]);

  return true;
};

// ==================== NEW FUNCTIONS FOR CLASS-WISE SECTIONS & SUBJECTS ====================

export const getSectionsByClass = async (params, user) => {
  const classId = params.class_id;
  if (!classId) {
    throw new Error("Class ID is required");
  }

  // school_id hata diya gaya hai kyunki column database mein nahi hai
  const rows = await query(`
    SELECT id, section_name 
    FROM sections 
    WHERE class_id = ? 
    ORDER BY section_name ASC
  `, [classId]);

  return { data: rows };
};

export const getSubjectsByClass = async (params, user) => {
  const classId = params.class_id;
  if (!classId) {
    throw new Error("Class ID is required");
  }

  // school_id hata diya gaya hai
  const rows = await query(`
    SELECT s.id, s.subject_name 
    FROM subjects s
    JOIN class_subjects cs ON s.id = cs.subject_id
    WHERE cs.class_id = ?
    ORDER BY s.subject_name ASC
  `, [classId]);

  return { data: rows };
};

