-- ============================================================
-- VidyaSetu MYSQL DATABASE SCHEMA & SEED DATA
-- Database: sahara_academy
-- ============================================================

CREATE DATABASE IF NOT EXISTS `sahara_academy` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sahara_academy`;

-- 1. Users Table (Authentication & Roles)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('Super Administrator', 'Teacher', 'Staff') DEFAULT 'Super Administrator',
  `avatar` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Classes Table
CREATE TABLE IF NOT EXISTS `classes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `class_code` VARCHAR(50) NOT NULL UNIQUE,
  `class_name` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Sections Table
CREATE TABLE IF NOT EXISTS `sections` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `class_id` INT NOT NULL,
  `section_name` VARCHAR(50) NOT NULL,
  `room_no` VARCHAR(50) DEFAULT NULL,
  `teacher_incharge` VARCHAR(100) DEFAULT NULL,
  `max_capacity` INT DEFAULT 40,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Students Table
CREATE TABLE IF NOT EXISTS `students` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_code` VARCHAR(50) NOT NULL UNIQUE,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `full_name` VARCHAR(200) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `grade` VARCHAR(50) NOT NULL,
  `section` VARCHAR(50) NOT NULL,
  `parent_name` VARCHAR(100) DEFAULT NULL,
  `parent_contact` VARCHAR(50) DEFAULT NULL,
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  `dob` DATE DEFAULT NULL,
  `gender` VARCHAR(20) DEFAULT NULL,
  `blood_group` VARCHAR(20) DEFAULT NULL,
  `home_address` TEXT DEFAULT NULL,
  `avatar` VARCHAR(255) DEFAULT NULL,
  `attendance_rate` VARCHAR(20) DEFAULT '95.0%',
  `gpa` VARCHAR(20) DEFAULT '3.8 / 4.0',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. School Settings Table
CREATE TABLE IF NOT EXISTS `school_settings` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `school_name` VARCHAR(150) NOT NULL DEFAULT 'VidyaSetu',
  `tagline` VARCHAR(255) DEFAULT 'Education Excellence',
  `logo_url` VARCHAR(255) DEFAULT '',
  `address` TEXT DEFAULT '104 Oasis Avenue, Block B',
  `city` VARCHAR(100) DEFAULT 'Sahara Springs',
  `state` VARCHAR(100) DEFAULT 'California',
  `pincode` VARCHAR(20) DEFAULT '92262',
  `phone` VARCHAR(50) DEFAULT '+1 (555) 234-8900',
  `email` VARCHAR(150) DEFAULT 'admin@saharaacademy.edu',
  `principal_name` VARCHAR(100) DEFAULT 'Dr. Evelyn Vance',
  `affiliation_number` VARCHAR(100) DEFAULT 'CBSE-987412-AC',
  `established_year` VARCHAR(10) DEFAULT '1998',
  `website` VARCHAR(150) DEFAULT 'https://saharaacademy.edu',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- INITIAL SEED DATA
-- ============================================================

-- Seed Default Admin User (Password: admin123)
INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `role`, `avatar`)
VALUES ('usr_admin_01', 'Admin Profile', 'admin@sahara.edu', '$2a$10$wO8oG.iJ4U8hU.vV.hB2v.wNfE0yA8yP8T9zK1.xM2n1q0L.a1O2', 'Super Administrator', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80')
ON DUPLICATE KEY UPDATE `name`=`name`;

-- Seed Classes
INSERT INTO `classes` (`class_code`, `class_name`, `description`) VALUES
('CLS-09', 'Grade 9', 'Junior Secondary Section'),
('CLS-10', 'Grade 10', 'Secondary Matriculation Section'),
('CLS-11', 'Grade 11', 'Higher Secondary Core'),
('CLS-12', 'Grade 12', 'Senior Secondary Graduation');

-- Seed Sections
INSERT INTO `sections` (`class_id`, `section_name`, `room_no`, `teacher_incharge`, `max_capacity`) VALUES
(1, 'Alpha', 'Block A - Room 101', 'Mr. Vikram Singh', 35),
(1, 'Beta', 'Block A - Room 102', 'Mrs. Anjali Sharma', 35),
(2, 'Alpha', 'Block B - Room 201', 'Mrs. Elena Sahara', 40),
(2, 'Beta', 'Block B - Room 202', 'Dr. Aris Thorne', 40),
(3, 'Alpha', 'Block C - Room 301', 'Prof. Julian Vance', 30),
(3, 'Gamma', 'Block C - Room 302', 'Mr. Vikram Singh', 30),
(4, 'Alpha', 'Block D - Auditorium', 'Prof. Julian Vance', 45);

-- Seed Initial Students
INSERT INTO `students` (`student_code`, `first_name`, `last_name`, `full_name`, `email`, `grade`, `section`, `parent_name`, `parent_contact`, `status`, `dob`, `gender`, `blood_group`, `home_address`, `avatar`) VALUES
('SHR-2024-001', 'Aria', 'Montgomery', 'Aria Montgomery', 'aria.m@academy.edu', 'Grade 11', 'Alpha', 'ELIAS MONTGOMERY', '+1 (555) 012-3456', 'Active', '2008-05-12', 'Female', 'O Positive', '42, Silver Oaks Apartments, Jaipur', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
('SHR-2024-124', 'Julian', 'Thorne', 'Julian Thorne', 'jthorne@academy.edu', 'Grade 10', 'Beta', 'SARAH THORNE', '+1 (555) 293-1002', 'Active', '2009-02-18', 'Male', 'A Positive', '18 Sunshine Enclave, Jaipur', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
('SHR-2023-982', 'Lila', 'Vane', 'Lila Vane', 'lila.v@academy.edu', 'Grade 12', 'Alpha', 'MARK VANE', '+1 (555) 777-4433', 'Inactive', '2007-09-24', 'Female', 'B Positive', '77 Heritage Villa, Jaipur', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80');

-- Seed Default School Settings
INSERT INTO `school_settings` (`id`, `school_name`, `tagline`, `logo_url`, `address`, `city`, `state`, `pincode`, `phone`, `email`, `principal_name`, `affiliation_number`, `established_year`, `website`)
VALUES (1, 'VidyaSetu', 'Education Excellence', '', '104 Oasis Avenue, Block B', 'Sahara Springs', 'California', '92262', '+1 (555) 234-8900', 'admin@saharaacademy.edu', 'Dr. Evelyn Vance', 'CBSE-987412-AC', '1998', 'https://saharaacademy.edu')
ON DUPLICATE KEY UPDATE `school_name`=`school_name`;
