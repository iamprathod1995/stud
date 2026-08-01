import { query } from "../config/db.js";



// Promotion list

export const getPromotionList = async (params, user) => {
  let {
    academic_year_id,
    class_id,
    section_id
  } = params;

  if (!user.school_id) {
    throw new Error("School id is required");
  }

  let whereCondition = `
    WHERE s.school_id = ?
  `;

  let values = [
    user.school_id
  ];

  // Academic year filter (optional)
  if (academic_year_id) {
    whereCondition += `
      AND h.academic_year_id = ?
    `;
    values.push(academic_year_id);
  }

  // Class filter (optional)
  if (class_id) {
    whereCondition += `
      AND h.class_id = ?
    `;
    values.push(class_id);
  }

  // Section filter (optional)
  if (section_id) {
    whereCondition += `
      AND h.section_id = ?
    `;
    values.push(section_id);
  }

  const rows = await query(
    `
    SELECT

      s.id AS student_id,
      s.admission_no,
      s.first_name,
      s.last_name,

      h.id AS history_id,
      h.roll_no,
      h.status,

      h.promoted_date,

      h.promoted_to_class_id,
      pc.class_name AS promoted_to_class,

      ay.id AS academic_year_id,
      ay.year_name AS academic_year,

      c.id AS class_id,
      c.class_name,

      sec.id AS section_id,
      sec.section_name


    FROM student_academic_history h


    JOIN students s
      ON s.id = h.student_id


    JOIN academic_years ay
      ON ay.id = h.academic_year_id


    JOIN classes c
      ON c.id = h.class_id


    LEFT JOIN classes pc
      ON pc.id = h.promoted_to_class_id


    LEFT JOIN sections sec
      ON sec.id = h.section_id


    ${whereCondition}


    ORDER BY h.roll_no ASC
    `,
    values
  );

  return rows;
};
// Promote students

export const promoteStudents = async (data, user) => {

  const {
    student_ids,
    from_academic_year_id,
    to_academic_year_id,
    to_class_id,
    to_section_id,
    promoted_date
  } = data;

  if (!student_ids?.length) {
    throw new Error("Students are required");
  }

  if (!from_academic_year_id) {
    throw new Error("From academic year is required");
  }

  if (!to_academic_year_id) {
    throw new Error("To academic year is required");
  }

  if (!to_class_id) {
    throw new Error("To class is required");
  }

  if (!to_section_id) {
    throw new Error("To section is required");
  }

  for (const student_id of student_ids) {

    // Old academic history update
    await query(
      `
      UPDATE student_academic_history
      SET
        status = 'Passed',
        promoted_to_class_id = ?,
        promoted_date = ?
      WHERE student_id = ?
        AND academic_year_id = ?
      `,
      [
        to_class_id,
        promoted_date,
        student_id,
        from_academic_year_id
      ]
    );

    // Next Roll Number
    const rows = await query(
      `
      SELECT COALESCE(MAX(roll_no), 0) AS last_roll
      FROM student_academic_history
      WHERE academic_year_id = ?
        AND class_id = ?
        AND section_id = ?
      `,
      [
        to_academic_year_id,
        to_class_id,
        to_section_id
      ]
    );

    const rollNo = Number(rows[0].last_roll) + 1;
const alreadyPromoted = await query(
  `
  SELECT id
  FROM student_academic_history
  WHERE student_id = ?
    AND academic_year_id = ?
  LIMIT 1
  `,
  [
    student_id,
    to_academic_year_id
  ]
);

if (alreadyPromoted.length) {
  throw new Error(
    `Student ${student_id} is already promoted to the selected academic year.`
  );
}
    // New Academic History
    await query(
      `
      INSERT INTO student_academic_history
      (
        student_id,
        academic_year_id,
        class_id,
        section_id,
        roll_no,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        student_id,
        to_academic_year_id,
        to_class_id,
        to_section_id,
        rollNo,
        "Studying"
      ]
    );
  }

  return {
    count: student_ids.length,
    message: "Students promoted successfully."
  };
};