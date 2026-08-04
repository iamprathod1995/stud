import { query } from '../config/db.js';

export const getSubjectList = async (params, user) => {
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const offset = (page - 1) * limit;
  const search = params.search || '';
  const sortOrder = params.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  const rows = await query(`
    SELECT * FROM subjects
    WHERE school_id = ? AND subject_name LIKE ?
    ORDER BY subject_name ${sortOrder}
    LIMIT ? OFFSET ?
  `, [user.school_id, `%${search}%`, limit, offset]);

  const count = await query(`
    SELECT COUNT(*) total FROM subjects
    WHERE school_id = ? AND subject_name LIKE ?
  `, [user.school_id, `%${search}%`]);

  return {
    page,
    limit,
    total: count[0].total,
    totalPages: Math.ceil(count[0].total / limit),
    data: rows
  };
};

export const saveSubject = async (data, user) => {
  const school_id = user.school_id;

  const duplicate = await query(`
    SELECT id FROM subjects WHERE school_id = ? AND subject_name = ? ${data.id ? "AND id != ?" : ""} LIMIT 1
  `, data.id ? [school_id, data.subject_name.trim(), data.id] : [school_id, data.subject_name.trim()]);

  if (duplicate.length > 0) {
    throw new Error("Subject name already exists");
  }

  if (data.id) {
    await query(`
      UPDATE subjects SET subject_name = ?, subject_code = ?, status = ? WHERE id = ? AND school_id = ?
    `, [data.subject_name.trim(), data.subject_code || null, data.status ?? 1, data.id, school_id]);
    return { message: "Subject updated successfully", data: { id: data.id } };
  } else {
    const result = await query(`
      INSERT INTO subjects (school_id, subject_name, subject_code, status) VALUES (?, ?, ?, ?)
    `, [school_id, data.subject_name.trim(), data.subject_code || null, data.status ?? 1]);
    return { message: "Subject added successfully", data: { id: result.insertId } };
  }
};

export const deleteSubject = async (id, user) => {
  const check = await query(`SELECT id FROM subjects WHERE id = ? AND school_id = ?`, [id, user.school_id]);
  if (!check.length) throw new Error("Subject not found");

  // Check if subject is assigned in classes or teacher mapping
  const mapped = await query(`SELECT id FROM class_subjects WHERE subject_id = ? LIMIT 1`, [id]);
  if (mapped.length > 0) {
    throw new Error("Subject cannot be deleted because it is mapped to classes");
  }

  await query(`DELETE FROM subjects WHERE id = ? AND school_id = ?`, [id, user.school_id]);
  return true;
};