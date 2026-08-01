import db, { query } from '../config/db.js';

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

  const rows = await query(
    `
    SELECT *
    FROM students
    WHERE school_id=?
    AND (
      admission_no LIKE ?
      OR first_name LIKE ?
      OR last_name LIKE ?
      OR father_name LIKE ?
      OR mobile LIKE ?
    )
    ORDER BY ${sortColumn} ${sortOrder}
    LIMIT ? OFFSET ?
    `,
    [
      user.school_id,
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
    FROM students
    WHERE school_id=?
    AND (
      admission_no LIKE ?
      OR first_name LIKE ?
      OR last_name LIKE ?
      OR father_name LIKE ?
      OR mobile LIKE ?
    )
    `,
    [
      user.school_id,
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