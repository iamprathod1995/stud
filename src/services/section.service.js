import { query } from '../config/db.js';



export const getSectionList = async(params,user)=>{

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const offset = (page-1)*limit;


    const search = params.search || '';

    const sortOrder =
        params.sortOrder?.toUpperCase()==='DESC'
        ? 'DESC'
        : 'ASC';



    const allowedSortColumns=[
        'section_name',
        'room_no',
        'capacity',
        'created_at'
    ];


    const sortColumn =
        allowedSortColumns.includes(params.sortBy)
        ? params.sortBy
        : 'section_name';



    const rows = await query(`
        SELECT 
            s.*,
            c.class_name
        FROM sections s
        INNER JOIN classes c 
        ON c.id=s.class_id
        WHERE c.school_id=?
        AND s.section_name LIKE ?
        ORDER BY ${sortColumn} ${sortOrder}
        LIMIT ? OFFSET ?
    `,
    [
        user.school_id,
        `%${search}%`,
        limit,
        offset
    ]);




    const count = await query(`
        SELECT COUNT(*) total
        FROM sections s
        INNER JOIN classes c
        ON c.id=s.class_id
        WHERE c.school_id=?
        AND s.section_name LIKE ?
    `,
    [
        user.school_id,
        `%${search}%`
    ]);



    return {

        page,
        limit,
        total:count[0].total,
        totalPages:Math.ceil(
            count[0].total/limit
        ),

        sortBy:sortColumn,
        sortOrder,

        data:rows

    };

};







export const saveSection = async(data,user)=>{


    const classCheck = await query(`
        SELECT id
        FROM classes
        WHERE id=?
        AND school_id=?
    `,
    [
        data.class_id,
        user.school_id
    ]);



    if(!classCheck.length){
        throw new Error(
            'Class not found'
        );
    }




    const duplicate = await query(`
        SELECT id
        FROM sections
        WHERE class_id=?
        AND section_name=?
        ${data.id ? 'AND id!=?' : ''}
        LIMIT 1
    `,
    data.id
    ?
    [
        data.class_id,
        data.section_name.trim(),
        data.id
    ]
    :
    [
        data.class_id,
        data.section_name.trim()
    ]);



    if(duplicate.length){
        throw new Error(
            'Section already exists in this class'
        );
    }





    if(data.id){


        await query(`
            UPDATE sections SET

            class_id=?,
            section_name=?,
            room_no=?,
            capacity=?,
            status=?

            WHERE id=?

        `,
        [
            data.class_id,
            data.section_name.trim(),
            data.room_no || null,
            data.capacity || 40,
            data.status ?? 1,
            data.id
        ]);



        return {

            message:'Section updated successfully',

            data:{
                id:data.id
            }

        };

    }







    const result = await query(`
        INSERT INTO sections
        (
            class_id,
            section_name,
            room_no,
            capacity,
            status
        )

        VALUES(?,?,?,?,?)
    `,
    [
        data.class_id,
        data.section_name.trim(),
        data.room_no || null,
        data.capacity || 40,
        data.status ?? 1
    ]);




    return {

        message:'Section added successfully',

        data:{
            id:result.insertId
        }

    };

};









export const deleteSection = async(id,user)=>{


    const check = await query(`
        SELECT 
            s.id

        FROM sections s

        INNER JOIN classes c
        ON c.id=s.class_id

        WHERE s.id=?
        AND c.school_id=?

    `,
    [
        id,
        user.school_id
    ]);



    if(!check.length){

        throw new Error(
            'Section not found'
        );

    }



    await query(`
        DELETE FROM sections
        WHERE id=?
    `,
    [
        id
    ]);



    return true;

};