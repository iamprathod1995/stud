import { query } from '../config/db.js';

// ================= MOBILE APP: PUNCH IN =================
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

// ================= MOBILE APP: PUNCH OUT =================
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

// ================= MOBILE APP: GET LOGGED-IN TEACHER ATTENDANCE DETAIL =================
export const getMyTeacherAttendanceDetail = async (params, user) => {
  const school_id = Number(user.school_id);
  const month_year = params.month_year || new Date().toISOString().slice(0, 7);

  // Sirf logged-in teacher (Role 4) ka teacher_id nikalna
  const teacherQuery = await query(`SELECT id FROM teachers WHERE user_id = ? AND school_id = ? LIMIT 1`, [user.id, school_id]);
  if (!teacherQuery.length) throw new Error("Teacher profile not found");
  const teacher_id = teacherQuery[0].id;

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

  // Attendance Details
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