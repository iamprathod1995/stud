import mysql from 'mysql2/promise';
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
  port: Number(process.env.DB_PORT) || 3306,
  multipleStatements: true,
};

async function runMigration() {
  console.log("----------------------------------");
  console.log("🚀 School Management Migration");
  console.log("----------------------------------");

  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);
    const dbName = process.env.DB_NAME || "school_management";

    console.log("Creating Database...");
    await connection.query(`
      CREATE DATABASE IF NOT EXISTS \`${dbName}\`
      CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    await connection.query(`USE \`${dbName}\`;`);

    // 1. SCHOOLS
    console.log("Creating schools table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        school_code VARCHAR(50) UNIQUE NOT NULL,
        school_name VARCHAR(200) NOT NULL,
        email VARCHAR(150),
        phone VARCHAR(20),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(20),
        logo VARCHAR(255),
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. USERS (Roles: 1 = Super Admin, 2 = School Admin, 3 = Student, 4 = Teacher)
    console.log("Creating users table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        school_id INT NULL,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role TINYINT NOT NULL,
        avatar VARCHAR(255),
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY(school_id) REFERENCES schools(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. ACADEMIC YEARS
    console.log("Creating academic_years table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS academic_years (
        id INT AUTO_INCREMENT PRIMARY KEY,
        school_id INT NOT NULL,
        year_name VARCHAR(20) NOT NULL,
        start_date DATE,
        end_date DATE,
        is_current TINYINT DEFAULT 0,
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(school_id) REFERENCES schools(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. CLASSES
    console.log("Creating classes table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS classes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        school_id INT NOT NULL,
        class_name VARCHAR(100) NOT NULL,
        class_order INT DEFAULT 0,
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(school_id) REFERENCES schools(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 5. SECTIONS
    console.log("Creating sections table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        class_id INT NOT NULL,
        section_name VARCHAR(20) NOT NULL,
        room_no VARCHAR(50),
        capacity INT DEFAULT 40,
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(class_id) REFERENCES classes(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 6. STUDENTS
    console.log("Creating students table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        school_id INT NOT NULL,
        admission_no VARCHAR(50) UNIQUE NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        father_name VARCHAR(150),
        mother_name VARCHAR(150),
        dob DATE,
        gender VARCHAR(20),
        blood_group VARCHAR(20),
        mobile VARCHAR(20),
        address TEXT,
        photo VARCHAR(255),
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY(school_id) REFERENCES schools(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 7. TEACHERS
    console.log("Creating teachers table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        school_id INT NOT NULL,
        employee_code VARCHAR(50) UNIQUE NOT NULL,
        qualification VARCHAR(150),
        designation VARCHAR(100),
        joining_date DATE,
        mobile VARCHAR(20),
        address TEXT,
        dob DATE NULL,
        gender VARCHAR(20) NULL,
        blood_group VARCHAR(30) NULL,
        photo VARCHAR(255),
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY(school_id) REFERENCES schools(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 8. STUDENT ACADEMIC HISTORY
    console.log("Creating student_academic_history table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS student_academic_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        academic_year_id INT NOT NULL,
        class_id INT NOT NULL,
        section_id INT NULL,
        roll_no INT,
        status ENUM('Studying', 'Passed', 'Failed', 'Transferred', 'Left') DEFAULT 'Studying',
        promoted_to_class_id INT NULL,
        promoted_date DATE NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY(academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
        FOREIGN KEY(class_id) REFERENCES classes(id) ON DELETE CASCADE,
        FOREIGN KEY(section_id) REFERENCES sections(id) ON DELETE SET NULL,
        FOREIGN KEY(promoted_to_class_id) REFERENCES classes(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 10. SUBJECTS (Moved up as referenced in teacher_class_mapping)
    console.log("Creating subjects table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        school_id INT NOT NULL,
        subject_name VARCHAR(100) NOT NULL,
        subject_code VARCHAR(50),
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(school_id) REFERENCES schools(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 9. TEACHER CLASS MAPPING
    console.log("Creating teacher_class_mapping table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS teacher_class_mapping (
        id INT AUTO_INCREMENT PRIMARY KEY,
        teacher_id INT NOT NULL,
        class_id INT NOT NULL,
        section_id INT NULL,
        academic_year_id INT NOT NULL,
        subject_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
        FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
        FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL,
        FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
        UNIQUE KEY unique_teacher_assignment (
            teacher_id,
            class_id,
            section_id,
            academic_year_id,
            subject_id
        )
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 11. CLASS SUBJECT MAPPING
    console.log("Creating class_subjects table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS class_subjects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        class_id INT NOT NULL,
        subject_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(class_id) REFERENCES classes(id) ON DELETE CASCADE,
        FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 12. STUDENT ATTENDANCE
    console.log("Creating attendance table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        academic_year_id INT NOT NULL,
        attendance_date DATE NOT NULL,
        status ENUM('Present', 'Absent', 'Leave','Holiday') DEFAULT 'Present',
        remarks VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY(academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 13. TEACHER ATTENDANCE
  // 13. TEACHER ATTENDANCE
    console.log("Creating teacher_attendance table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS teacher_attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        teacher_id INT NOT NULL,
        school_id INT NOT NULL,
        academic_year_id INT NOT NULL,
        attendance_date DATE NOT NULL,
        status ENUM(
            'Present',
            'Absent',
            'Leave',
            'Late',
            'Half Day'
        ) DEFAULT 'Present',
        punch_in DATETIME NULL,
        punch_out DATETIME NULL,
        total_work_minutes INT DEFAULT 0,
        late_minutes INT DEFAULT 0,
        overtime_minutes INT DEFAULT 0,
        remarks VARCHAR(255),
        created_by INT NULL,
        updated_by INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
        FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
        FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
        UNIQUE KEY unique_teacher_date (teacher_id, attendance_date),
        INDEX idx_teacher (teacher_id),
        INDEX idx_school (school_id),
        INDEX idx_date (attendance_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Safety check: Agar table pehle se bani ho aur naye columns missing ho toh ye add kar dega
    console.log("Ensuring columns exist in teacher_attendance table...");
    await connection.query(`
      ALTER TABLE teacher_attendance 
      ADD COLUMN IF NOT EXISTS punch_in DATETIME NULL,
      ADD COLUMN IF NOT EXISTS punch_out DATETIME NULL,
      ADD COLUMN IF NOT EXISTS total_work_minutes INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS late_minutes INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS overtime_minutes INT DEFAULT 0;
    `);

    // TEACHER ATTENDANCE LOGS
    console.log("Creating teacher_attendance_logs table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS teacher_attendance_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        attendance_id INT NULL,
        teacher_id INT NOT NULL,
        school_id INT NOT NULL,
        action ENUM(
            'Punch In',
            'Punch Out'
        ) NOT NULL,
        action_time DATETIME NOT NULL,
        latitude DECIMAL(10,8) NULL,
        longitude DECIMAL(11,8) NULL,
        accuracy DECIMAL(8,2) NULL,
        address TEXT NULL,
        photo VARCHAR(255) NULL,
        device_id VARCHAR(255) NULL,
        device_name VARCHAR(150) NULL,
        device_os VARCHAR(100) NULL,
        app_version VARCHAR(30) NULL,
        battery_level TINYINT NULL,
        network_type VARCHAR(30) NULL,
        ip_address VARCHAR(50) NULL,
        is_mock_location TINYINT DEFAULT 0,
        is_fake_location TINYINT DEFAULT 0,
        face_score DECIMAL(5,2) DEFAULT NULL,
        liveness_score DECIMAL(5,2) DEFAULT NULL,
        remarks VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (attendance_id) REFERENCES teacher_attendance(id) ON DELETE SET NULL,
        FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
        FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
        INDEX idx_teacher (teacher_id),
        INDEX idx_action_time (action_time),
        INDEX idx_attendance (attendance_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 14. EXAMS
    console.log("Creating exams table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS exams (
        id INT AUTO_INCREMENT PRIMARY KEY,
        school_id INT NOT NULL,
        academic_year_id INT NOT NULL,
        exam_name VARCHAR(100) NOT NULL,
        exam_date DATE,
        total_marks INT DEFAULT 100,
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(school_id) REFERENCES schools(id) ON DELETE CASCADE,
        FOREIGN KEY(academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 15. MARKS
    console.log("Creating marks table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS marks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        exam_id INT NOT NULL,
        student_id INT NOT NULL,
        subject_id INT NOT NULL,
        marks_obtained DECIMAL(5,2),
        grade VARCHAR(10),
        remarks VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(exam_id) REFERENCES exams(id) ON DELETE CASCADE,
        FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 16. FEE HEADS
    console.log("Creating fee_heads table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS fee_heads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        school_id INT NOT NULL,
        fee_name VARCHAR(100) NOT NULL,
        description TEXT,
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 17. FEE STRUCTURES
    console.log("Creating fee_structures table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS fee_structures (
        id INT AUTO_INCREMENT PRIMARY KEY,
        school_id INT NOT NULL,
        academic_year_id INT NOT NULL,
        class_id INT NOT NULL,
        fee_head_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        due_date DATE NULL,
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(school_id) REFERENCES schools(id) ON DELETE CASCADE,
        FOREIGN KEY(academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
        FOREIGN KEY(class_id) REFERENCES classes(id) ON DELETE CASCADE,
        FOREIGN KEY(fee_head_id) REFERENCES fee_heads(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 18. STUDENT FEES
    console.log("Creating student_fees table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS student_fees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        fee_structure_id INT NOT NULL,
        academic_year_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        paid_amount DECIMAL(10,2) DEFAULT 0,
        due_amount DECIMAL(10,2) NOT NULL,
        status ENUM('Pending', 'Partial', 'Paid') DEFAULT 'Pending',
        due_date DATE NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY(fee_structure_id) REFERENCES fee_structures(id) ON DELETE CASCADE,
        FOREIGN KEY(academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 19. FEE PAYMENTS
    console.log("Creating fee_payments table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS fee_payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        student_fees_id INT NOT NULL,
        amount_paid DECIMAL(10,2) NOT NULL,
        payment_date DATE DEFAULT NULL,
        payment_mode ENUM('Cash', 'Online', 'Cheque', 'UPI', 'Card') DEFAULT 'Cash',
        transaction_id VARCHAR(150) DEFAULT NULL,
        remarks TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_payment_student FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
        CONSTRAINT fk_payment_student_fee FOREIGN KEY(student_fees_id) REFERENCES student_fees(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 20. SCHOOL SETTINGS
    console.log("Creating school_settings table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS school_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        school_id INT NOT NULL,
        setting_key VARCHAR(100) NOT NULL,
        setting_value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_setting(school_id, setting_key),
        FOREIGN KEY(school_id) REFERENCES schools(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // SEED DATA
    console.log("Adding default admin...");
    await connection.query(`
      INSERT IGNORE INTO users (name, email, password, role)
      VALUES ('Super Admin', 'admin@system.com', '$2b$10$examplehash', 1);
    `);

    console.log("Adding default academic year...");
    await connection.query(`
      INSERT INTO academic_years (school_id, year_name, start_date, end_date, is_current)
      SELECT id, '2026-27', '2026-04-01', '2027-03-31', 1
      FROM schools
      WHERE NOT EXISTS (
        SELECT 1 FROM academic_years WHERE year_name='2026-27'
      );
    `);

    console.log("Adding default classes...");
    await connection.query(`
      INSERT INTO classes (school_id, class_name, class_order)
      SELECT s.id, c.class_name, c.class_order
      FROM schools s
      CROSS JOIN (
        SELECT 'Nursery' AS class_name, 1 AS class_order UNION ALL
        SELECT 'LKG', 2 UNION ALL 
        SELECT 'UKG', 3 UNION ALL
        SELECT 'Class 1', 4 UNION ALL 
        SELECT 'Class 2', 5 UNION ALL
        SELECT 'Class 3', 6 UNION ALL 
        SELECT 'Class 4', 7 UNION ALL
        SELECT 'Class 5', 8 UNION ALL 
        SELECT 'Class 6', 9 UNION ALL
        SELECT 'Class 7', 10 UNION ALL 
        SELECT 'Class 8', 11 UNION ALL
        SELECT 'Class 9', 12 UNION ALL 
        SELECT 'Class 10', 13 UNION ALL
        SELECT 'Class 11', 14 UNION ALL 
        SELECT 'Class 12', 15
      ) c
      WHERE NOT EXISTS (
        SELECT 1 
        FROM classes cl 
        WHERE cl.school_id = s.id 
          AND cl.class_name = c.class_name
      );
    `);

    console.log("----------------------------------");
    console.log("✅ COMPLETE MIGRATION FINISHED");
    console.log("----------------------------------");

  } catch (error) {
    console.error("❌ Migration Error:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runMigration();


// ALTER TABLE schools CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
// ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
// ALTER TABLE academic_years CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
// ALTER TABLE classes CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
// ALTER TABLE sections CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
// ALTER TABLE students CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
// ALTER TABLE teachers CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
// ALTER TABLE student_academic_history CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
// ALTER TABLE subjects CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
// ALTER TABLE teacher_class_mapping CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
// ALTER TABLE class_subjects CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
// ALTER TABLE attendance CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
// ALTER TABLE teacher_attendance CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
// ALTER TABLE teacher_attendance_logs CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
// ALTER TABLE exams CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
// ALTER TABLE marks CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
// ALTER TABLE fee_heads CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
// ALTER TABLE fee_structures CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
// ALTER TABLE student_fees CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
// ALTER TABLE fee_payments CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
// ALTER TABLE school_settings CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;








// ALTER TABLE teachers CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
// ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
// ALTER TABLE teacher_attendance CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;