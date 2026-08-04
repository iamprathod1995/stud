import { query } from '../config/db.js';

let defaultSchools = [
  {
    id: 1,
    school_code: 'SCH-001',
    school_name: 'VidyaSetu Main Campus',
    city: 'Sahara Springs',
    state: 'California',
    pincode: '92262',
    address: '104 Oasis Avenue, Block B',
    phone: '+1 (555) 234-8900',
    email: 'main@saharaacademy.edu',
    logo: '',
    status: 'Active',
  },
  {
    id: 2,
    school_code: 'SCH-002',
    school_name: 'Sahara International North Campus',
    city: 'Springdale',
    state: 'California',
    pincode: '92263',
    address: '405 Pine Street, North Wing',
    phone: '+1 (555) 789-1122',
    email: 'north@saharainternational.edu',
    logo: '',
    status: 'Active',
  },
  {
    id: 3,
    school_code: 'SCH-003',
    school_name: 'Sahara Public School East',
    city: 'Eastwood',
    state: 'California',
    pincode: '92264',
    address: '88 Lake View Road',
    phone: '+1 (555) 444-9988',
    email: 'east@saharapublic.edu',
    logo: '',
    status: 'Active',
  },
];

export const getSchoolsList = async () => {
  try {
    const rows = await query('SELECT * FROM schools ORDER BY id ASC');
    if (rows && rows.length > 0) return rows;
  } catch (err) {
    // Fallback to in-memory store
  }
  return defaultSchools;
};

export const getSchoolById = async (id) => {
  try {
    const rows = await query('SELECT * FROM schools WHERE id = ? OR school_code = ? LIMIT 1', [id, id]);
    if (rows && rows.length > 0) return rows[0];
  } catch (err) {
    const found = defaultSchools.find(s => s.id === Number(id) || s.school_code === id);
    if (found) return found;
  }
  return null;
};

export const createOrUpdateSchool = async (data) => {
  const { 
    id, 
    schoolCode, 
    school_code: reqSchoolCode, 
    school_name, 
    name, 
    city, 
    state, 
    pincode, 
    address, 
    phone, 
    email, 
    logo, 
    status = 'Active' 
  } = data;

  const finalSchoolCode = schoolCode || reqSchoolCode || `SCH-00${defaultSchools.length + 1}`;
  const finalSchoolName = school_name || name || 'VidyaSetu';
  const finalCity = city || '';
  const finalState = state || '';
  const finalPincode = pincode || '';
  const finalAddress = address || '';
  const finalPhone = phone || '';
  const finalEmail = email || '';
  const finalLogo = logo || '';

  if (id) {
    // Update Query for School
    try {
      await query(
        `UPDATE schools SET school_code=?, school_name=?, city=?, state=?, pincode=?, address=?, phone=?, email=?, logo=?, status=? WHERE id=?`,
        [finalSchoolCode, finalSchoolName, finalCity, finalState, finalPincode, finalAddress, finalPhone, finalEmail, finalLogo, status, id]
      );

      // Agar logo update hua hai, toh is school_id se jude sabhi users ka avatar bhi update kar dein
      if (finalLogo) {
        await query(
          `UPDATE users SET avatar=? WHERE school_id=?`,
          [finalLogo, id]
        );
      }
    } catch (err) {
      const idx = defaultSchools.findIndex(s => s.id === Number(id));
      if (idx !== -1) {
        defaultSchools[idx] = { 
          ...defaultSchools[idx], 
          school_code: finalSchoolCode, 
          school_name: finalSchoolName, 
          city: finalCity, 
          state: finalState, 
          pincode: finalPincode, 
          address: finalAddress, 
          phone: finalPhone, 
          email: finalEmail, 
          logo: finalLogo, 
          status 
        };
      }
    }
    return { id, school_code: finalSchoolCode, school_name: finalSchoolName, city: finalCity, state: finalState, pincode: finalPincode, address: finalAddress, phone: finalPhone, email: finalEmail, logo: finalLogo, status };
  } else {
    // Create new school Query
    const newSchool = {
      id: Date.now(),
      school_code: finalSchoolCode,
      school_name: finalSchoolName,
      city: finalCity,
      state: finalState,
      pincode: finalPincode,
      address: finalAddress,
      phone: finalPhone,
      email: finalEmail,
      logo: finalLogo,
      status,
    };

    try {
      const res = await query(
        `INSERT INTO schools (school_code, school_name, city, state, pincode, address, phone, email, logo, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [newSchool.school_code, newSchool.newSchool_name || newSchool.school_name, newSchool.city, newSchool.state, newSchool.pincode, newSchool.address, newSchool.phone, newSchool.email, newSchool.logo, newSchool.status]
      );
      if (res && res.insertId) newSchool.id = res.insertId;
    } catch (err) {
      defaultSchools.push(newSchool);
    }

    return newSchool;
  }
};

export const deleteSchool = async (id) => {
  try {
    await query('DELETE FROM schools WHERE id = ?', [id]);
  } catch (err) {
    defaultSchools = defaultSchools.filter(s => s.id !== Number(id));
  }
  return true;
};

// Dashboard ke liye saara aggregated data fetch karne ka function

export const getDashboardStatsData = async (user) => {
  console.log("=== Dashboard API Hit for School ID ===", user?.school_id);
  
  try {
    // 1. Total Students
    const studentResult = await query(
      `SELECT COUNT(*) as total FROM students WHERE school_id = ? AND status = 1`,
      [user.school_id]
    );

    // 2. Total Teachers
    const teacherResult = await query(
      `SELECT COUNT(*) as total FROM teachers WHERE school_id = ? AND status = 1`,
      [user.school_id]
    );

    // 3. Today's Attendance Percentage
    const attendanceResult = await query(
      `SELECT 
         COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as present_count,
         COUNT(*) as total_records
       FROM attendance a
       JOIN students s ON a.student_id = s.id
       WHERE s.school_id = ? AND a.attendance_date = CURDATE()`,
      [user.school_id]
    );

    const totalRecords = attendanceResult?.[0]?.total_records || 0;
    const presentCount = attendanceResult?.[0]?.present_count || 0;
    const attendancePercentage = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;

    // 4. Monthly Fee Collection Summary
    const feeResult = await query(
      `SELECT SUM(fp.amount_paid) as total_collection 
       FROM fee_payments fp
       JOIN students s ON fp.student_id = s.id
       WHERE s.school_id = ? AND MONTH(fp.payment_date) = MONTH(CURDATE())`,
      [user.school_id]
    );

    // 5. Teachers on Leave Today
    const teachersOnLeave = await query(
      `SELECT 
         COALESCE(u.name, 'Unknown Teacher') as name, 
         t.designation as department, 
         ta.status as leave_type 
       FROM teacher_attendance ta
       JOIN teachers t ON ta.teacher_id = t.id
       LEFT JOIN users u ON t.user_id = u.id
       WHERE t.school_id = ? AND ta.attendance_date = CURDATE() AND ta.status IN ('Leave', 'Absent')`,
      [user.school_id]
    ).catch((err) => {
      console.error("Teachers on leave query error:", err);
      return [];
    });

    // 6. Today's Fee Collections List
    const todayTransactions = await query(
      `SELECT 
         CONCAT(s.first_name, ' ', COALESCE(s.last_name, '')) as student_name, 
         COALESCE(c.class_name, 'N/A') as class_name, 
         COALESCE(sec.section_name, '') as section, 
         fp.amount_paid, 
         fp.payment_mode,
         fp.payment_date
       FROM fee_payments fp
       JOIN students s ON fp.student_id = s.id
       LEFT JOIN student_academic_history sah ON s.id = sah.student_id
       LEFT JOIN classes c ON sah.class_id = c.id
       LEFT JOIN sections sec ON sah.section_id = sec.id
       WHERE s.school_id = ? AND DATE(fp.payment_date) = CURDATE()
       ORDER BY fp.payment_date DESC`,
      [user.school_id]
    ).catch((err) => {
      console.error("Today transactions query error:", err);
      return [];
    });

    const todayTotalCollection = todayTransactions.reduce((sum, item) => sum + Number(item.amount_paid || 0), 0);

    return {
      success: true,
      data: {
        totalStudents: studentResult?.[0]?.total || 0,
        totalTeachers: teacherResult?.[0]?.total || 0,
        attendancePercentage: attendancePercentage,
        feeCollection: feeResult?.[0]?.total_collection || 0,
        todayTotalCollection: todayTotalCollection,
        teachersOnLeave: teachersOnLeave || [],
        todayTransactions: todayTransactions || []
      }
    };

  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    return {
      success: false,
      data: {
        totalStudents: 0,
        totalTeachers: 0,
        attendancePercentage: 0,
        feeCollection: 0,
        todayTotalCollection: 0,
        teachersOnLeave: [],
        todayTransactions: []
      }
    };
  }
};