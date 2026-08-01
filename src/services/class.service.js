  import { query } from '../config/db.js';

  export const getClassList=async(params,user)=>{

    const page=Number(params.page)||1;
    const limit=Number(params.limit)||10;
    const offset=(page-1)*limit;

    const search=params.search||'';

    const sortOrder=params.sortOrder?.toUpperCase()==='DESC'
      ? 'DESC'
      : 'ASC';


    const allowedSortColumns=[
      'class_name',
      'class_order',
      'created_at'
    ];


    const sortColumn=allowedSortColumns.includes(params.sortBy)
      ? params.sortBy
      : 'class_order';



    const rows=await query(`
      SELECT *
      FROM classes
      WHERE school_id=?
    AND class_name LIKE ?
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT ? OFFSET ?
    `,[
      user.school_id,
      `%${search}%`,
      limit,
      offset
    ]);



    const count=await query(`
      SELECT COUNT(*) total
      FROM classes
      WHERE school_id=?
      AND status=1
      AND class_name LIKE ?
    `,[
      user.school_id,
      `%${search}%`
    ]);



    return {
      page,
      limit,
      total:count[0].total,
      totalPages:Math.ceil(count[0].total/limit),
      sortBy:sortColumn,
      sortOrder,
      data:rows
    };

  };



  export const saveClass = async (data, user) => {
    const school_id = user.school_id;

    // Check duplicate class name
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

    if (data.id) {
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
          data.id,
          school_id,
        ]
      );

      return {
        message: "Class updated successfully",
        data: {
          id: data.id,
        },
      };
    }

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

    return {
      message: "Class added successfully",
      data: {
        id: result.insertId,
      },
    };
  };





  export const deleteClass = async (id, user) => {


    const checkClass = await query(`
      SELECT id
      FROM classes
      WHERE id=?
      AND school_id=?
    `, [
      id,
      user.school_id
    ]);


    if (!checkClass.length) {
      throw new Error('Class not found');
    }



    // const students = await query(`
    //   SELECT id
    //   FROM students
    //   WHERE class_id=?
    //   LIMIT 1
    // `, [id]);


    // if (students.length) {
    //   throw new Error(
    //     'Class cannot be deleted because students are assigned'
    //   );
    // }



    const sections = await query(`
      SELECT id
      FROM sections
      WHERE class_id=?
      LIMIT 1
    `, [id]);


    if (sections.length) {
      throw new Error(
        'Class cannot be deleted because sections are assigned'
      );
    }



    await query(`
      DELETE FROM classes
      WHERE id=?
      AND school_id=?
    `, [
      id,
      user.school_id
    ]);



    return true;

  };