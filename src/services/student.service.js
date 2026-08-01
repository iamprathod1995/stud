import db, { query } from '../config/db.js';

// export const getStudentList = async (params, user) => {

//   const page = Number(params.page) || 1;
//   const limit = Number(params.limit) || 10;
//   const offset = (page - 1) * limit;

//   const search = params.search || '';

//   const sortOrder =
//     params.sortOrder?.toUpperCase() === 'DESC'
//       ? 'DESC'
//       : 'ASC';

//   const allowedSortColumns = [
//     'admission_no',
//     'first_name',
//     'father_name',
//     'created_at'
//   ];

//   const sortColumn = allowedSortColumns.includes(params.sortBy)
//     ? params.sortBy
//     : 'created_at';

//   const rows = await query(
//     `
//     SELECT *
//     FROM students
//     WHERE school_id=?
//     AND (
//       admission_no LIKE ?
//       OR first_name LIKE ?
//       OR last_name LIKE ?
//       OR father_name LIKE ?
//       OR mobile LIKE ?
//     )
//     ORDER BY ${sortColumn} ${sortOrder}
//     LIMIT ? OFFSET ?
//     `,
//     [
//       user.school_id,
//       `%${search}%`,
//       `%${search}%`,
//       `%${search}%`,
//       `%${search}%`,
//       `%${search}%`,
//       limit,
//       offset
//     ]
//   );

//   const count = await query(
//     `
//     SELECT COUNT(*) total
//     FROM students
//     WHERE school_id=?
//     AND (
//       admission_no LIKE ?
//       OR first_name LIKE ?
//       OR last_name LIKE ?
//       OR father_name LIKE ?
//       OR mobile LIKE ?
//     )
//     `,
//     [
//       user.school_id,
//       `%${search}%`,
//       `%${search}%`,
//       `%${search}%`,
//       `%${search}%`,
//       `%${search}%`
//     ]
//   );

//   return {
//     page,
//     limit,
//     total: count[0].total,
//     totalPages: Math.ceil(count[0].total / limit),
//     sortBy: sortColumn,
//     sortOrder,
//     data: rows
//   };
// };


export const getStudentList = async (params, user) => {

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const offset = (page - 1) * limit;

  const search = params.search || '';

  const sortOrder =
    params.sortOrder?.toUpperCase() === 'DESC'
      ? 'DESC'
      : 'ASC';

  const allowedSortColumns = [
    'admission_no',
    'first_name',
    'father_name',
    'created_at'
  ];

  const sortColumn = allowedSortColumns.includes(params.sortBy)
    ? params.sortBy
    : 'created_at';


  let filterQuery = "";
  let filterParams = [];


  // Class Filter
  if (params.class_id) {
    filterQuery += `
      AND sah.class_id = ?
    `;
    filterParams.push(params.class_id);
  }


  // Section Filter
  if (params.section_id) {
    filterQuery += `
      AND sah.section_id = ?
    `;
    filterParams.push(params.section_id);
  }



  const rows = await query(
    `
    SELECT 
      s.*,

      c.id AS class_id,
      c.class_name,

      sec.id AS section_id,
      sec.section_name,

      sah.roll_no,
      ay.id AS academic_year_id,
      ay.year_name

    FROM students s

    INNER JOIN student_academic_history sah
      ON sah.student_id = s.id

    INNER JOIN academic_years ay
      ON ay.id = sah.academic_year_id
      AND ay.is_current = 1

    INNER JOIN classes c
      ON c.id = sah.class_id

    LEFT JOIN sections sec
      ON sec.id = sah.section_id


    WHERE s.school_id=?

    ${filterQuery}

    AND (
      s.admission_no LIKE ?
      OR s.first_name LIKE ?
      OR s.last_name LIKE ?
      OR s.father_name LIKE ?
      OR s.mobile LIKE ?
    )

    ORDER BY ${sortColumn} ${sortOrder}

    LIMIT ? OFFSET ?

    `,
    [

      user.school_id,

      ...filterParams,

      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,

      limit,
      offset
    ]
  );



  const count = await query(
    `
    SELECT COUNT(*) total

    FROM students s

    INNER JOIN student_academic_history sah
      ON sah.student_id = s.id

    INNER JOIN academic_years ay
      ON ay.id = sah.academic_year_id
      AND ay.is_current = 1


    WHERE s.school_id=?

    ${filterQuery}

    AND (
      s.admission_no LIKE ?
      OR s.first_name LIKE ?
      OR s.last_name LIKE ?
      OR s.father_name LIKE ?
      OR s.mobile LIKE ?
    )

    `,
    [

      user.school_id,

      ...filterParams,

      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`

    ]
  );


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
export const saveStudent = async (data, user) => {

  const school_id = user.school_id;

  let connection;

  try {

    connection = await db.getConnection();

    await connection.beginTransaction();


    // Generate admission number for new student
    let admission_no = data.admission_no;

    if (!data.id) {

      const year = new Date().getFullYear();

      const lastStudent = await connection.query(
        `
        SELECT admission_no
        FROM students
        WHERE school_id=?
        AND admission_no LIKE ?
        ORDER BY id DESC
        LIMIT 1
        `,
        [
          school_id,
          `${year}%`
        ]
      );


      let nextNumber = 1;


      if (lastStudent[0].length) {

        const lastAdmission = lastStudent[0][0].admission_no;

        const lastNumber = parseInt(
          lastAdmission.substring(4)
        );

        nextNumber = lastNumber + 1;
      }


      admission_no =
        `${year}${String(nextNumber).padStart(2,'0')}`;

    }



    // Duplicate admission check

    const duplicate = await connection.query(
      `
      SELECT id
      FROM students
      WHERE school_id=?
      AND admission_no=?
      ${data.id ? 'AND id!=?' : ''}
      LIMIT 1
      `,
      data.id
        ? [
            school_id,
            admission_no,
            data.id
          ]
        : [
            school_id,
            admission_no
          ]
    );


    if (duplicate[0].length) {
      throw new Error(
        'Admission number already exists'
      );
    }



    // UPDATE STUDENT

    if (data.id) {


      await connection.query(
        `
        UPDATE students SET

          first_name=?,
          last_name=?,
          father_name=?,
          mother_name=?,
          dob=?,
          gender=?,
          blood_group=?,
          mobile=?,
          address=?,
          photo=?,
          status=?

        WHERE id=?
        AND school_id=?
        `,
        [
          data.first_name,
          data.last_name,
          data.father_name,
          data.mother_name,
          data.dob,
          data.gender,
          data.blood_group,
          data.mobile,
          data.address,
          data.photo,
          data.status ?? 1,
          data.id,
          school_id
        ]
      );


      await connection.commit();


      return {

        message:
          'Student updated successfully',

        data:{
          id:data.id
        }

      };

    }



    // INSERT STUDENT


    const [studentResult] = await connection.query(
      `
      INSERT INTO students
      (
        school_id,
        admission_no,
        first_name,
        last_name,
        father_name,
        mother_name,
        dob,
        gender,
        blood_group,
        mobile,
        address,
        photo,
        status
      )

      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)

      `,
      [

        school_id,
        admission_no,
        data.first_name,
        data.last_name,
        data.father_name,
        data.mother_name,
        data.dob,
        data.gender,
        data.blood_group,
        data.mobile,
        data.address,
        data.photo,
        data.status ?? 1

      ]
    );


    const student_id =
      studentResult.insertId;



    // INSERT ACADEMIC HISTORY


    await connection.query(
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

      VALUES (?,?,?,?,?,?)

      `,
      [

        student_id,
        data.academic_year_id,
        data.class_id,
        data.section_id || null,
        data.roll_number || null,
        'Studying'

      ]
    );


// ===============================
// AUTO ASSIGN FEES TO STUDENT
// ===============================


const [feeStructures] = await connection.query(
  `
  SELECT 
    id,
    amount
  FROM fee_structures
  WHERE school_id=?
  AND academic_year_id=?
  AND class_id=?
  AND status=1
  `,
  [
    school_id,
    data.academic_year_id,
    data.class_id
  ]
);



if(feeStructures.length){


  const feeValues = feeStructures.map((fee)=>[
    student_id,
    fee.id,
    data.academic_year_id,
    fee.amount,
    0,
    'Pending'
  ]);



  await connection.query(
    `
    INSERT INTO student_fees
    (
      student_id,
      fee_structure_id,
        academic_year_id,
        amount,
      paid_amount,
      status
    )

    VALUES ?

    `,
    [
      feeValues
    ]
  );


} 
    await connection.commit();



    return {

      message:
        'Student added successfully',

      data:{
        id:student_id,
        admission_no
      }

    };


  }
  catch(error){

    if(connection){
      await connection.rollback();
    }

    throw error;

  }
  finally{

    if(connection){
      connection.release();
    }

  }

};  

export const deleteStudent = async (id, user) => {

  const student = await query(
    `
    SELECT id
    FROM students
    WHERE id=?
    AND school_id=?
    `,
    [id, user.school_id]
  );

  if (!student.length) {
    throw new Error('Student not found');
  }

  await query(
    `
    DELETE FROM students
    WHERE id=?
    AND school_id=?
    `,
    [id, user.school_id]
  );

  return true;
};