import { query } from '../config/db.js';

export const getMappingList = async (params, user) => {
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const offset = (page - 1) * limit;

  const { search, teacher_id, class_id, academic_year_id } = params;

  let whereConditions = ['t.school_id = ?'];
  let queryParams = [user.school_id];

  if (search && search.trim() !== '') {
    whereConditions.push(`(
      u.name LIKE ? OR 
      c.class_name LIKE ? OR 
      s.section_name LIKE ? OR 
      sub.subject_name LIKE ? OR 
      ay.year_name LIKE ?
    )`);
    const searchPattern = `%${search.trim()}%`;
    queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
  }

  if (teacher_id) {
    whereConditions.push('tcm.teacher_id = ?');
    queryParams.push(Number(teacher_id));
  }

  if (class_id) {
    whereConditions.push('tcm.class_id = ?');
    queryParams.push(Number(class_id));
  }

  if (academic_year_id) {
    whereConditions.push('tcm.academic_year_id = ?');
    queryParams.push(Number(academic_year_id));
  }

  const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

  const dataQuery = `
    SELECT 
      MIN(tcm.id) as id,
      tcm.teacher_id,
      u.name as teacher_name, 
      t.employee_code, 
      tcm.academic_year_id,
      ay.year_name as academic_year_name,
      GROUP_CONCAT(DISTINCT tcm.class_id) as class_ids,
      GROUP_CONCAT(DISTINCT tcm.section_id) as section_ids,
      GROUP_CONCAT(DISTINCT tcm.subject_id) as subject_ids,
      GROUP_CONCAT(DISTINCT c.class_name SEPARATOR ', ') as class_names,
      GROUP_CONCAT(DISTINCT s.section_name SEPARATOR ', ') as section_names,
      GROUP_CONCAT(DISTINCT sub.subject_name SEPARATOR ', ') as subject_names,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'class_id', tcm.class_id,
          'class_name', c.class_name,
          'section_id', tcm.section_id,
          'section_name', s.section_name,
          'subject_id', tcm.subject_id,
          'subject_name', sub.subject_name
        )
      ) as raw_mappings
    FROM teacher_class_mapping tcm
    JOIN teachers t ON tcm.teacher_id = t.id
    JOIN users u ON t.user_id = u.id
    JOIN classes c ON tcm.class_id = c.id
    LEFT JOIN sections s ON tcm.section_id = s.id
    LEFT JOIN subjects sub ON tcm.subject_id = sub.id
    JOIN academic_years ay ON tcm.academic_year_id = ay.id
    ${whereClause}
    GROUP BY tcm.teacher_id, tcm.academic_year_id
    ORDER BY MIN(tcm.id) DESC
    LIMIT ? OFFSET ?
  `;

  const rows = await query(dataQuery, [...queryParams, Number(limit), Number(offset)]);

  const formattedRows = rows.map((row) => {
    let parsedMappings = [];
    try {
      parsedMappings = typeof row.raw_mappings === 'string' ? JSON.parse(row.raw_mappings) : row.raw_mappings;
    } catch (e) {
      parsedMappings = [];
    }

    const classMap = {};

    parsedMappings.forEach((item) => {
      if (!item.class_id) return;

      if (!classMap[item.class_id]) {
        classMap[item.class_id] = {
          class_id: item.class_id,
          class_name: item.class_name,
          sections: {}
        };
      }

      const secKey = item.section_id || 'no_section';
      if (!classMap[item.class_id].sections[secKey]) {
        classMap[item.class_id].sections[secKey] = {
          section_id: item.section_id,
          section_name: item.section_name || 'All Sections',
          subjects: []
        };
      }

      if (item.subject_id) {
        const exists = classMap[item.class_id].sections[secKey].subjects.some(sub => sub.subject_id === item.subject_id);
        if (!exists) {
          classMap[item.class_id].sections[secKey].subjects.push({
            subject_id: item.subject_id,
            subject_name: item.subject_name
          });
        }
      }
    });

    const structuredClasses = Object.values(classMap).map((cls) => ({
      ...cls,
      sections: Object.values(cls.sections)
    }));

    return {
      id: row.id,
      teacher_id: row.teacher_id,
      teacher_name: row.teacher_name,
      employee_code: row.employee_code,
      academic_year_id: row.academic_year_id,
      academic_year_name: row.academic_year_name,
      class_ids: row.class_ids,
      section_ids: row.section_ids,
      subject_ids: row.subject_ids,
      class_names: row.class_names,
      section_names: row.section_names,
      subject_names: row.subject_names,
      structured_data: structuredClasses
    };
  });

  const countQuery = `
    SELECT COUNT(*) as total FROM (
      SELECT tcm.teacher_id
      FROM teacher_class_mapping tcm
      JOIN teachers t ON tcm.teacher_id = t.id
      JOIN users u ON t.user_id = u.id
      JOIN classes c ON tcm.class_id = c.id
      LEFT JOIN sections s ON tcm.section_id = s.id
      LEFT JOIN subjects sub ON tcm.subject_id = sub.id
      JOIN academic_years ay ON tcm.academic_year_id = ay.id
      ${whereClause}
      GROUP BY tcm.teacher_id, tcm.academic_year_id
    ) as grouped_teachers
  `;

  const countResult = await query(countQuery, queryParams);
  const total = countResult[0].total;

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: formattedRows
  };
};
export const saveMapping = async (data, user) => {
  const teacherId = data.teacher_id ? Number(data.teacher_id) : null;
  const academicYearId = data.academic_year_id ? Number(data.academic_year_id) : null;

  if (!teacherId || !academicYearId) {
    throw new Error("Teacher and Academic Year are required fields");
  }

  const teacherCheck = await query(
    `SELECT id FROM teachers WHERE id = ? AND school_id = ?`,
    [teacherId, user.school_id]
  );
  if (!teacherCheck.length) {
    throw new Error("Teacher not found");
  }

  // Ensure rows is always an array
  const rows = Array.isArray(data.rows) ? data.rows : [];

  // 1. Frontend se aayi hui saari valid rows ka ek Set bana lo (class_id - section_id - subject_id)
  const incomingCombinations = new Set();

  for (const row of rows) {
    const classId = row.class_id ? Number(row.class_id) : null;
    const sectionIds = Array.isArray(row.section_ids) ? row.section_ids.map(Number) : [];
    const subjectIds = Array.isArray(row.subject_ids) ? row.subject_ids.map(Number) : [];

    if (!classId || sectionIds.length === 0 || subjectIds.length === 0) continue;

    for (const secId of sectionIds) {
      for (const subId of subjectIds) {
        incomingCombinations.add(`${classId}-${secId}-${subId}`);
      }
    }
  }

  // 2. Database se is teacher aur academic year ke saare existing records nikalo
  const existingMappings = await query(
    `SELECT id, class_id, section_id, subject_id 
     FROM teacher_class_mapping 
     WHERE teacher_id = ? AND academic_year_id = ?`,
    [teacherId, academicYearId]
  );

  const existingKeys = new Set(
    existingMappings.map(e => `${e.class_id}-${e.section_id}-${e.subject_id}`)
  );

  let totalDeleted = 0;
  let totalInserted = 0;

  // 3. Jo database mein hain par frontend ki list mein nahi hain, sirf unhi ko DELETE karo
  for (const existing of existingMappings) {
    const comboKey = `${existing.class_id}-${existing.section_id}-${existing.subject_id}`;
    if (!incomingCombinations.has(comboKey)) {
      await query(`DELETE FROM teacher_class_mapping WHERE id = ?`, [existing.id]);
      totalDeleted++;
    }
  }

  // 4. Jo naye combinations hain jo database mein nahi the, unhe INSERT karo
  for (const comboKey of incomingCombinations) {
    if (!existingKeys.has(comboKey)) {
      const [classId, secId, subId] = comboKey.split('-').map(Number);
      await query(
        `INSERT INTO teacher_class_mapping (teacher_id, class_id, section_id, academic_year_id, subject_id)
         VALUES (?, ?, ?, ?, ?)`,
        [teacherId, classId, secId, academicYearId, subId]
      );
      totalInserted++;
    }
  }

  return {
    message: `Mappings updated successfully (${totalInserted} added, ${totalDeleted} removed)`,
  };
};
export const deleteMapping = async (id, user) => {
  const mapping = await query(`
    SELECT tcm.id 
    FROM teacher_class_mapping tcm
    JOIN teachers t ON tcm.teacher_id = t.id
    WHERE tcm.id = ? AND t.school_id = ?
  `, [id, user.school_id]);

  if (!mapping.length) {
    throw new Error("Teacher mapping not found");
  }
  
  await query(`DELETE FROM teacher_class_mapping WHERE id = ?`, [id]);
  return true;
};