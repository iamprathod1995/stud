import { query } from '../config/db.js';
import bcrypt from 'bcrypt';

// ================= TEACHER LIST =================
export const getTeacherList = async (params, user) => {
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const offset = (page - 1) * limit;
  const search = params.search || '';
  
  const class_id = params.class_id || '';
  const section_id = params.section_id || '';
  const subject_id = params.subject_id || '';

  const sortOrder = params.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  const allowedSortColumns = ['name', 'employee_code', 'designation', 'created_at'];
  const sortColumn = allowedSortColumns.includes(params.sortBy) ? params.sortBy : 'created_at';

  let whereConditions = ['t.school_id = ?'];
  let queryParams = [user.school_id];

  if (search.trim() !== '') {
    whereConditions.push('(u.name LIKE ? OR t.employee_code LIKE ? OR t.designation LIKE ?)');
    const searchPattern = `%${search}%`;
    queryParams.push(searchPattern, searchPattern, searchPattern);
  }

  if (class_id) {
    whereConditions.push('tcm.class_id = ?');
    queryParams.push(Number(class_id));
  }
  if (section_id) {
    whereConditions.push('tcm.section_id = ?');
    queryParams.push(Number(section_id));
  }
  if (subject_id) {
    whereConditions.push('tcm.subject_id = ?');
    queryParams.push(Number(subject_id));
  }

  const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

  const rows = await query(`
    SELECT t.*, u.name, u.email, u.status as user_status, t.photo,
           COALESCE(GROUP_CONCAT(c.class_name SEPARATOR '||'), '') as class_names,
           COALESCE(GROUP_CONCAT(s.section_name SEPARATOR '||'), '') as section_names,
           COALESCE(GROUP_CONCAT(sub.subject_name SEPARATOR '||'), '') as subject_names
    FROM teachers t
    JOIN users u ON t.user_id = u.id
    LEFT JOIN teacher_class_mapping tcm ON t.id = tcm.teacher_id
    LEFT JOIN classes c ON tcm.class_id = c.id
    LEFT JOIN sections s ON tcm.section_id = s.id
    LEFT JOIN subjects sub ON tcm.subject_id = sub.id
    ${whereClause}
    GROUP BY t.id
    ORDER BY t.${sortColumn} ${sortOrder}
    LIMIT ? OFFSET ?
  `, [...queryParams, Number(limit), Number(offset)]);

  const count = await query(`
    SELECT COUNT(DISTINCT t.id) total
    FROM teachers t
    JOIN users u ON t.user_id = u.id
    LEFT JOIN teacher_class_mapping tcm ON t.id = tcm.teacher_id
    LEFT JOIN classes c ON tcm.class_id = c.id
    LEFT JOIN sections s ON tcm.section_id = s.id
    LEFT JOIN subjects sub ON tcm.subject_id = sub.id
    ${whereClause}
  `, queryParams);

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

// ================= SAVE TEACHER (CREATE / UPDATE) =================
export const saveTeacher = async (data, user) => {
  const school_id = user.school_id;
  const email = data.email ? String(data.email).trim() : '';
  const name = data.name ? String(data.name).trim() : `${data.first_name || ''} ${data.last_name || ''}`.trim();

  if (!name) throw new Error("Teacher name is required");
  if (!email) throw new Error("Email is required");

  const duplicateEmail = await query(`
    SELECT id FROM users WHERE email = ? ${data.user_id ? "AND id != ?" : ""} LIMIT 1
  `, data.user_id ? [email, data.user_id] : [email]);

  if (duplicateEmail.length > 0) throw new Error("Email already exists in system");

  // UPDATE
  if (data.id) {
    const existingTeacher = await query(`SELECT user_id, photo, employee_code FROM teachers WHERE id = ? AND school_id = ?`, [data.id, school_id]);
    if (!existingTeacher.length) throw new Error("Teacher not found");

    const userId = existingTeacher[0].user_id;
    const employeeCode = data.employee_code ? String(data.employee_code).trim() : existingTeacher[0].employee_code;
    const photo = data.photo !== undefined && data.photo !== '' ? data.photo : existingTeacher[0].photo;

    await query(`UPDATE users SET name = ?, email = ?, avatar = ?, status = ? WHERE id = ?`, [name, email, photo || null, data.status ?? 1, userId]);
    
    await query(`
      UPDATE teachers SET employee_code = ?, qualification = ?, designation = ?, joining_date = ?, mobile = ?, address = ?, dob = ?, gender = ?, blood_group = ?, photo = ?, status = ?
      WHERE id = ? AND school_id = ?
    `, [employeeCode, data.qualification || null, data.designation || null, data.joining_date || null, data.mobile || null, data.address || null, data.dob || null, data.gender || null, data.blood_group || null, photo || null, data.status ?? 1, data.id, school_id]);

    if (data.class_id && data.academic_year_id && data.subject_id) {
      await query(`DELETE FROM teacher_class_mapping WHERE teacher_id = ? AND academic_year_id = ?`, [data.id, data.academic_year_id]);
      await query(`INSERT INTO teacher_class_mapping (teacher_id, class_id, section_id, academic_year_id, subject_id) VALUES (?,?,?,?,?)`, [data.id, data.class_id, data.section_id || null, data.academic_year_id, data.subject_id]);
    }

    return { message: "Teacher updated successfully", data: { id: data.id } };
  }

  // CREATE
  const lastTeacher = await query(`SELECT id FROM teachers ORDER BY id DESC LIMIT 1`);
  const nextId = lastTeacher.length ? lastTeacher[0].id + 1 : 1;
  const employeeCode = `EMP${new Date().getFullYear()}${String(nextId).padStart(3, '0')}`;
  const hashedPassword = await bcrypt.hash(data.password || 'Teacher@#123', 10);

  const userResult = await query(`
    INSERT INTO users (school_id, name, email, password, role, avatar, status) VALUES (?,?,?,?,4,?,?)
  `, [school_id, name, email, hashedPassword, data.photo || null, data.status ?? 1]);

  const userId = userResult.insertId;

  const teacherResult = await query(`
    INSERT INTO teachers (user_id, school_id, employee_code, qualification, designation, joining_date, mobile, address, dob, gender, blood_group, photo, status)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
  `, [userId, school_id, employeeCode, data.qualification || null, data.designation || null, data.joining_date || null, data.mobile || null, data.address || null, data.dob || null, data.gender || null, data.blood_group || null, data.photo || null, data.status ?? 1]);

  const teacherId = teacherResult.insertId;

  if (data.class_id && data.academic_year_id && data.subject_id) {
    await query(`
      INSERT INTO teacher_class_mapping (teacher_id, class_id, section_id, academic_year_id, subject_id) VALUES (?,?,?,?,?)
    `, [teacherId, data.class_id, data.section_id || null, data.academic_year_id, data.subject_id]);
  }

  return { message: "Teacher added successfully", data: { id: teacherId, employee_code: employeeCode } };
};

// ================= DELETE TEACHER =================
export const deleteTeacher = async (id, user) => {
  const teacher = await query(`SELECT user_id FROM teachers WHERE id = ? AND school_id = ?`, [id, user.school_id]);
  if (!teacher.length) throw new Error("Teacher not found");

  const mappingCheck = await query(`SELECT id FROM teacher_class_mapping WHERE teacher_id = ? LIMIT 1`, [id]);
  if (mappingCheck.length > 0) throw new Error("Teacher cannot be deleted because they are assigned to a class/subject");

  const userId = teacher[0].user_id;
  await query(`DELETE FROM teachers WHERE id = ?`, [id]);
  if (userId) await query(`DELETE FROM users WHERE id = ?`, [userId]);

  return true;
};

// ================= TEACHER MOBILE APP: PUNCH IN =================
export const saveTeacherPunchIn = async (data, user) => {
  const teacherQuery = await query(`SELECT id, school_id FROM teachers WHERE user_id = ?`, [user.id]);
  if (!teacherQuery.length) throw new Error("Teacher profile not found");
  
  const teacher_id = teacherQuery[0].id;
  const school_id = teacherQuery[0].school_id;
  const today = new Date().toISOString().split('T')[0];

  const activeYear = await query(`SELECT id FROM academic_years WHERE school_id = ? AND is_current = 1 LIMIT 1`, [school_id]);
  if (!activeYear.length) throw new Error("Active academic year not found");
  const academic_year_id = activeYear[0].id;

  let attendance = await query(`SELECT id, punch_in FROM teacher_attendance WHERE teacher_id = ? AND attendance_date = ?`, [teacher_id, today]);
  let attendanceId;

  if (attendance.length > 0) {
    if (attendance[0].punch_in) throw new Error("Already punched in for today");
    attendanceId = attendance[0].id;
    await query(`UPDATE teacher_attendance SET punch_in = NOW(), status = 'Present' WHERE id = ?`, [attendanceId]);
  } else {
    const result = await query(`
      INSERT INTO teacher_attendance (teacher_id, school_id, academic_year_id, attendance_date, status, punch_in, created_by)
      VALUES (?, ?, ?, ?, 'Present', NOW(), ?)
    `, [teacher_id, school_id, academic_year_id, today, user.id]);
    attendanceId = result.insertId;
  }

  await query(`
    INSERT INTO teacher_attendance_logs (
      attendance_id, teacher_id, school_id, action, action_time, latitude, longitude, accuracy, address, photo, device_id, device_name, device_os, app_version, battery_level, network_type, ip_address, is_mock_location, face_score, liveness_score, remarks
    ) VALUES (?, ?, ?, 'Punch In', NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    attendanceId, teacher_id, school_id, data.latitude || null, data.longitude || null, data.accuracy || null, data.address || null, data.photo || null, data.device_id || null, data.device_name || null, data.device_os || null, data.app_version || null, data.battery_level || null, data.network_type || null, data.ip_address || null, data.is_mock_location || 0, data.face_score || null, data.liveness_score || null, data.remarks || null
  ]);

  return { message: "Punched in successfully" };
};

// ================= TEACHER MOBILE APP: PUNCH OUT =================
export const saveTeacherPunchOut = async (data, user) => {
  const teacherQuery = await query(`SELECT id, school_id FROM teachers WHERE user_id = ?`, [user.id]);
  if (!teacherQuery.length) throw new Error("Teacher profile not found");
  
  const teacher_id = teacherQuery[0].id;
  const school_id = teacherQuery[0].school_id;
  const today = new Date().toISOString().split('T')[0];

  const attendance = await query(`SELECT id, punch_in FROM teacher_attendance WHERE teacher_id = ? AND attendance_date = ?`, [teacher_id, today]);
  if (!attendance.length || !attendance[0].punch_in) throw new Error("You have not punched in yet today");

  const attendanceId = attendance[0].id;

  await query(`
    UPDATE teacher_attendance SET punch_out = NOW(), total_work_minutes = TIMESTAMPDIFF(MINUTE, punch_in, NOW()) WHERE id = ?
  `, [attendanceId]);

  await query(`
    INSERT INTO teacher_attendance_logs (
      attendance_id, teacher_id, school_id, action, action_time, latitude, longitude, accuracy, address, photo, device_id, device_name, device_os, app_version, battery_level, network_type, ip_address, is_mock_location, remarks
    ) VALUES (?, ?, ?, 'Punch Out', NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    attendanceId, teacher_id, school_id, data.latitude || null, data.longitude || null, data.accuracy || null, data.address || null, data.photo || null, data.device_id || null, data.device_name || null, data.device_os || null, data.app_version || null, data.battery_level || null, data.network_type || null, data.ip_address || null, data.is_mock_location || 0, data.remarks || null
  ]);

  return { message: "Punched out successfully" };
};

// ================= ADMIN: MANUAL ATTENDANCE MANAGEMENT =================
// ================= ADMIN: MANUAL ATTENDANCE MANAGEMENT =================
// ================= ADMIN: MANUAL ATTENDANCE MANAGEMENT =================
export const adminSaveAttendance = async (data, user) => {
  if (user.role !== 1 && user.role !== 2) throw new Error("Unauthorized: Only admin can manage manual attendance");

  const { teacher_id, attendance_date, status, remarks, punch_in, punch_out } = data;
  const school_id = user.school_id;

  if (!teacher_id || !attendance_date || !status) throw new Error("Teacher ID, date, and status are required");

  const activeYear = await query(`SELECT id FROM academic_years WHERE school_id = ? AND is_current = 1 LIMIT 1`, [school_id]);
  if (!activeYear.length) throw new Error("Active academic year not found");
  const academic_year_id = activeYear[0].id;

  // Strict check with school_id and attendance_date
  const existing = await query(`
    SELECT id FROM teacher_attendance 
    WHERE teacher_id = ? AND school_id = ? AND attendance_date = ?
  `, [teacher_id, school_id, attendance_date]);

  let attendanceId;

  // Format punch times properly if passed as empty strings
  const formattedPunchIn = punch_in && punch_in.trim() !== '' ? punch_in : null;
  const formattedPunchOut = punch_out && punch_out.trim() !== '' ? punch_out : null;

  if (existing.length > 0) {
    attendanceId = existing[0].id;
    // UPDATE existing attendance record
    await query(`
      UPDATE teacher_attendance 
      SET status = ?, punch_in = ?, punch_out = ?, remarks = ?, updated_by = ?, academic_year_id = ?,
          total_work_minutes = CASE WHEN ? IS NOT NULL AND ? IS NOT NULL THEN TIMESTAMPDIFF(MINUTE, ?, ?) ELSE total_work_minutes END
      WHERE id = ? AND school_id = ?
    `, [
      status, 
      formattedPunchIn, 
      formattedPunchOut, 
      remarks || null, 
      user.id, 
      academic_year_id,
      formattedPunchIn, 
      formattedPunchOut, 
      formattedPunchIn, 
      formattedPunchOut, 
      attendanceId,
      school_id
    ]);
  } else {
    // INSERT new attendance record if not exists
    const result = await query(`
      INSERT INTO teacher_attendance (teacher_id, school_id, academic_year_id, attendance_date, status, punch_in, punch_out, remarks, created_by, total_work_minutes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CASE WHEN ? IS NOT NULL AND ? IS NOT NULL THEN TIMESTAMPDIFF(MINUTE, ?, ?) ELSE 0 END)
    `, [
      teacher_id, 
      school_id, 
      academic_year_id, 
      attendance_date, 
      status, 
      formattedPunchIn, 
      formattedPunchOut, 
      remarks || null, 
      user.id,
      formattedPunchIn,
      formattedPunchOut,
      formattedPunchIn,
      formattedPunchOut
    ]);
    attendanceId = result.insertId;
  }

  // Log the action
  await query(`
    INSERT INTO teacher_attendance_logs (attendance_id, teacher_id, school_id, action, action_time, remarks)
    VALUES (?, ?, ?, 'Manual Update', NOW(), ?)
  `, [attendanceId, teacher_id, school_id, `Manually marked as ${status} by Admin ID: ${user.id}`]);

  return { message: "Teacher attendance updated successfully by admin" };
};
// ================= ADMIN: DATE WISE ATTENDANCE SHEET =================
export const getAttendanceByDate = async (params, user) => {
  const date = params.date || new Date().toISOString().split('T')[0];
  const school_id = user.school_id;

  const rows = await query(`
    SELECT t.id as teacher_id, t.employee_code, u.name, u.email, ta.id as attendance_id,
           COALESCE(ta.status, 'Absent') as status, ta.punch_in, ta.punch_out, ta.remarks
    FROM teachers t
    JOIN users u ON t.user_id = u.id
    LEFT JOIN teacher_attendance ta ON t.id = ta.teacher_id AND ta.attendance_date = ?
    WHERE t.school_id = ? AND t.status = 1
    ORDER BY u.name ASC
  `, [date, school_id]);

  return { date, teachers: rows };
};

export const deleteTeacherAttendance = async (id, user) => {
  await query(`DELETE FROM teacher_attendance WHERE id = ?`, [id]);
  return true;
};

// ================= ADMIN: GET TEACHER MONTHLY ATTENDANCE DETAIL =================
export const getTeacherAttendanceDetail = async (params, user) => {
  const teacher_id = Number(params.teacher_id);
  const school_id = Number(user.school_id);
  const month_year =
    params.month_year || new Date().toISOString().slice(0, 7);

  if (!teacher_id || Number.isNaN(teacher_id)) {
    throw new Error("Teacher ID is required");
  }

  // Teacher Details
  const teacherResult = await query(
    `
      SELECT
        t.*,
        u.name,
        u.email,
        u.status AS user_status
      FROM teachers t
      INNER JOIN users u
        ON t.user_id = u.id
      WHERE t.id = ?
        AND t.school_id = ?
      LIMIT 1
    `,
    [teacher_id, school_id]
  );

  if (teacherResult.length === 0) {
    throw new Error("Teacher not found");
  }

  const teacher = teacherResult[0];

  // Attendance Details (Updated with DATE_FORMAT)
  const attendance = await query(
    `
      SELECT
        id,
        DATE_FORMAT(attendance_date, '%Y-%m-%d') AS attendance_date,
        status,
        punch_in,
        punch_out,
        total_work_minutes,
        late_minutes,
        overtime_minutes,
        remarks
      FROM teacher_attendance
      WHERE teacher_id = ?
        AND school_id = ?
        AND attendance_date BETWEEN
            STR_TO_DATE(CONCAT(?, '-01'), '%Y-%m-%d')
            AND LAST_DAY(STR_TO_DATE(CONCAT(?, '-01'), '%Y-%m-%d'))
      ORDER BY attendance_date ASC
    `,
    [teacher_id, school_id, month_year, month_year]
  );

  return {
    success: true,
    teacher,
    attendance,
  };
};

// ================= ADMIN: BULK ATTENDANCE MANAGEMENT =================
export const bulkAdminSaveAttendance = async (data, user) => {
  if (user.role !== 1 && user.role !== 2) throw new Error("Unauthorized: Only admin can manage manual attendance");

  const { attendance_date, records } = data;
  const school_id = user.school_id;

  if (!attendance_date || !records || !Array.isArray(records) || records.length === 0) {
    throw new Error("Attendance date and records array are required");
  }

  const activeYear = await query(`SELECT id FROM academic_years WHERE school_id = ? AND is_current = 1 LIMIT 1`, [school_id]);
  if (!activeYear.length) throw new Error("Active academic year not found");
  const academic_year_id = activeYear[0].id;

  for (const item of records) {
    const teacher_id = item.teacher_id || item.id;
    // Ensure status is valid and defaults to 'Present' if empty/null
    const status = item.status && item.status.trim() !== '' ? item.status : 'Present';
    const remarks = item.remarks || null;

    if (!teacher_id) continue;

    const existing = await query(`
      SELECT id FROM teacher_attendance 
      WHERE teacher_id = ? AND school_id = ? AND attendance_date = ?
    `, [teacher_id, school_id, attendance_date]);

    let attendanceId;

    if (existing.length > 0) {
      attendanceId = existing[0].id;
      await query(`
        UPDATE teacher_attendance 
        SET status = ?, remarks = ?, updated_by = ?, academic_year_id = ?
        WHERE id = ? AND school_id = ?
      `, [status, remarks, user.id, academic_year_id, attendanceId, school_id]);
    } else {
      await query(`
        INSERT INTO teacher_attendance (teacher_id, school_id, academic_year_id, attendance_date, status, remarks, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [teacher_id, school_id, academic_year_id, attendance_date, status, remarks, user.id]);
    }
  }

  return { message: "All attendance records updated successfully" };
};