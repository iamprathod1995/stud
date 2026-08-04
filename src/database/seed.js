import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management',
  port: Number(process.env.DB_PORT) || 3306,
};

async function runSeed() {
  console.log('--------------------------------------------------');
  console.log('🌱 Starting Database Seeding...');
  console.log('--------------------------------------------------');

  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    // 1. Seed Default School
    console.log('[1/7] Seeding Default School...');
    await connection.execute(
      `INSERT INTO \`schools\` (\`id\`, \`school_code\`, \`school_name\`, \`email\`, \`phone\`, \`address\`, \`city\`, \`state\`, \`pincode\`)
       VALUES (1, 'SCH-001', 'VidyaSetu Academy', 'admin@saharaacademy.edu', '+1 (555) 234-8900', '104 Oasis Avenue, Block B', 'Sahara Springs', 'California', '92262')
       ON DUPLICATE KEY UPDATE \`school_name\`=VALUES(\`school_name\`), \`email\`=VALUES(\`email\`)`
    );
    const schoolId = 1;

    // 2. Seed Default Academic Year
    console.log('[2/7] Seeding Academic Year...');
    await connection.execute(
      `INSERT INTO \`academic_years\` (\`school_id\`, \`year_name\`, \`start_date\`, \`end_date\`, \`is_current\`)
       SELECT ?, '2026-27', '2026-04-01', '2027-03-31', 1
       WHERE NOT EXISTS (
         SELECT 1 FROM \`academic_years\` WHERE \`school_id\` = ? AND \`year_name\` = '2026-27'
       )`,
      [schoolId, schoolId]
    );

    const [ayRows] = await connection.query(
      `SELECT id FROM \`academic_years\` WHERE \`school_id\` = ? AND \`year_name\` = '2026-27'`,
      [schoolId]
    );
    const academicYearId = ayRows[0]?.id;

    // 3. Seed Users (Roles: 1 = Super Admin, 2 = School Admin)
    console.log('[3/7] Seeding Users...');
    const hashedPassword = await bcrypt.hash('Admin@#123', 10);
    
    // Super Admin
    await connection.execute(
      `INSERT INTO \`users\` (\`school_id\`, \`name\`, \`email\`, \`password\`, \`role\`, \`avatar\`)
       VALUES (NULL, 'Super Admin', 'admin@system.com', ?, 1, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80')
       ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`), \`password\`=VALUES(\`password\`)`,
      [hashedPassword]
    );

    // School Admin
    await connection.execute(
      `INSERT INTO \`users\` (\`school_id\`, \`name\`, \`email\`, \`password\`, \`role\`, \`avatar\`)
       VALUES (?, 'School Admin', 'admin@gmail.com', ?, 2, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80')
       ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`), \`password\`=VALUES(\`password\`)`,
      [schoolId, hashedPassword]
    );

    // // 4. Seed Classes
    // console.log('[4/7] Seeding Classes...');
    // const classes = [
    //   ['Class 9', 12],
    //   ['Class 10', 13],
    //   ['Class 11', 14],
    //   ['Class 12', 15],
    // ];

    // for (const [className, order] of classes) {
    //   await connection.execute(
    //     `INSERT INTO \`classes\` (\`school_id\`, \`class_name\`, \`class_order\`)
    //      SELECT ?, ?, ?
    //      WHERE NOT EXISTS (
    //        SELECT 1 FROM \`classes\` WHERE \`school_id\` = ? AND \`class_name\` = ?
    //      )`,
    //     [schoolId, className, order, schoolId, className]
    //   );
    // }

    // // Map Class IDs
    // const [classRows] = await connection.query(
    //   `SELECT id, class_name FROM \`classes\` WHERE \`school_id\` = ?`,
    //   [schoolId]
    // );
    // const classMap = {};
    // classRows.forEach((r) => {
    //   classMap[r.class_name] = r.id;
    // });

    // // 5. Seed Sections
    // console.log('[5/7] Seeding Sections...');
    // const sections = [
    //   [classMap['Class 9'], 'Alpha', 'Block A - Room 101', 35],
    //   [classMap['Class 9'], 'Beta', 'Block A - Room 102', 35],
    //   [classMap['Class 10'], 'Alpha', 'Block B - Room 201', 40],
    //   [classMap['Class 10'], 'Beta', 'Block B - Room 202', 40],
    //   [classMap['Class 11'], 'Alpha', 'Block C - Room 301', 30],
    //   [classMap['Class 11'], 'Gamma', 'Block C - Room 302', 30],
    //   [classMap['Class 12'], 'Alpha', 'Block D - Auditorium', 45],
    // ];

    // for (const [classId, name, room, capacity] of sections) {
    //   if (classId) {
    //     const [existing] = await connection.query(
    //       `SELECT id FROM \`sections\` WHERE \`class_id\` = ? AND \`section_name\` = ?`,
    //       [classId, name]
    //     );
    //     if (existing.length === 0) {
    //       await connection.execute(
    //         `INSERT INTO \`sections\` (\`class_id\`, \`section_name\`, \`room_no\`, \`capacity\`)
    //          VALUES (?, ?, ?, ?)`,
    //         [classId, name, room, capacity]
    //       );
    //     }
    //   }
    // }

    // // 6. Seed Students & History
    // console.log('[6/7] Seeding Students & History...');
    // const studentsData = [
    //   {
    //     admission_no: 'SHR-2024-001',
    //     first_name: 'Aria',
    //     last_name: 'Montgomery',
    //     father_name: 'ELIAS MONTGOMERY',
    //     mother_name: 'ELLA MONTGOMERY',
    //     dob: '2008-05-12',
    //     gender: 'Female',
    //     blood_group: 'O+',
    //     mobile: '+1 (555) 012-3456',
    //     address: '42, Silver Oaks Apartments, Jaipur',
    //     photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    //     className: 'Class 11',
    //     sectionName: 'Alpha',
    //     rollNo: 101
    //   },
    //   {
    //     admission_no: 'SHR-2024-124',
    //     first_name: 'Julian',
    //     last_name: 'Thorne',
    //     father_name: 'SARAH THORNE',
    //     mother_name: 'CLARA THORNE',
    //     dob: '2009-02-18',
    //     gender: 'Male',
    //     blood_group: 'A+',
    //     mobile: '+1 (555) 293-1002',
    //     address: '18 Sunshine Enclave, Jaipur',
    //     photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    //     className: 'Class 10',
    //     sectionName: 'Beta',
    //     rollNo: 102
    //   },
    //   {
    //     admission_no: 'SHR-2023-982',
    //     first_name: 'Lila',
    //     last_name: 'Vane',
    //     father_name: 'MARK VANE',
    //     mother_name: 'ANNA VANE',
    //     dob: '2007-09-24',
    //     gender: 'Female',
    //     blood_group: 'B+',
    //     mobile: '+1 (555) 777-4433',
    //     address: '77 Heritage Villa, Jaipur',
    //     photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    //     className: 'Class 12',
    //     sectionName: 'Alpha',
    //     rollNo: 103
    //   },
    // ];

    // for (const s of studentsData) {
    //   // Insert / Update Student Profile
    //   await connection.execute(
    //     `INSERT INTO \`students\` (\`school_id\`, \`admission_no\`, \`first_name\`, \`last_name\`, \`father_name\`, \`mother_name\`, \`dob\`, \`gender\`, \`blood_group\`, \`mobile\`, \`address\`, \`photo\`)
    //      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    //      ON DUPLICATE KEY UPDATE \`first_name\`=VALUES(\`first_name\`), \`last_name\`=VALUES(\`last_name\`)`,
    //     [schoolId, s.admission_no, s.first_name, s.last_name, s.father_name, s.mother_name, s.dob, s.gender, s.blood_group, s.mobile, s.address, s.photo]
    //   );

    //   // Fetch Student ID
    //   const [stRows] = await connection.query(
    //     `SELECT id FROM \`students\` WHERE \`admission_no\` = ?`,
    //     [s.admission_no]
    //   );
    //   const studentId = stRows[0]?.id;

    //   // Fetch Section ID
    //   const targetClassId = classMap[s.className];
    //   if (studentId && targetClassId) {
    //     const [secRows] = await connection.query(
    //       `SELECT id FROM \`sections\` WHERE \`class_id\` = ? AND \`section_name\` = ?`,
    //       [targetClassId, s.sectionName]
    //     );
    //     const sectionId = secRows[0]?.id || null;

    //     // Add Academic History
    //     if (academicYearId) {
    //       const [histRows] = await connection.query(
    //         `SELECT id FROM \`student_academic_history\` WHERE \`student_id\` = ? AND \`academic_year_id\` = ?`,
    //         [studentId, academicYearId]
    //       );
          
    //       if (histRows.length === 0) {
    //         await connection.execute(
    //           `INSERT INTO \`student_academic_history\` (\`student_id\`, \`academic_year_id\`, \`class_id\`, \`section_id\`, \`roll_no\`, \`status\`)
    //            VALUES (?, ?, ?, ?, ?, 'Studying')`,
    //           [studentId, academicYearId, targetClassId, sectionId, s.rollNo]
    //         );
    //       }
    //     }
    //   }
    // }

    // // 7. Seed School Settings
    // console.log('[7/7] Seeding School Settings...');
    // const defaultSettings = [
    //   ['tagline', 'Education Excellence'],
    //   ['logo_url', ''],
    //   ['principal_name', 'Dr. Evelyn Vance'],
    //   ['affiliation_number', 'CBSE-987412-AC'],
    //   ['established_year', '1998'],
    //   ['website', 'https://saharaacademy.edu'],
    // ];

    // for (const [key, val] of defaultSettings) {
    //   await connection.execute(
    //     `INSERT INTO \`school_settings\` (\`school_id\`, \`setting_key\`, \`setting_value\`)
    //      VALUES (?, ?, ?)
    //      ON DUPLICATE KEY UPDATE \`setting_value\`=VALUES(\`setting_value\`)`,
    //     [schoolId, key, val]
    //   );
    // }

    console.log('--------------------------------------------------');
    console.log('✅ Database seeding completed successfully!');
    console.log('--------------------------------------------------');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runSeed();