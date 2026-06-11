const express = require("express");
const router = express.Router();

const controller = require("../controllers/student.controller");

const pagination = require("../middlewares/pagination.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  createStudentSchema,
  updateStudentSchema
} = require("../validations/student.validation");

//////////////////////////////////////////////////////
// 📌 STUDENT TAG
//////////////////////////////////////////////////////

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student Management APIs
 */

//////////////////////////////////////////////////////
// 📌 GET ALL STUDENTS
//////////////////////////////////////////////////////

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get All Students
 *     description: Get students with pagination, search, sorting and school filter.
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: school_id
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           example: Rahul
 *
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - id
 *             - student_name
 *             - admission_no
 *             - roll_no
 *             - status
 *             - createdAt
 *             - updatedAt
 *           default: id
 *
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - ASC
 *             - DESC
 *           default: DESC
 *
 *     responses:
 *       200:
 *         description: Students fetched successfully
 */
router.get("/", pagination, controller.getAll);

//////////////////////////////////////////////////////
// 📌 CREATE STUDENT
//////////////////////////////////////////////////////

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create Student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - school_id
 *               - student_name
 *               - admission_no
 *               - admission_date
 *             properties:
 *               school_id:
 *                 type: integer
 *                 example: 1
 *               student_name:
 *                 type: string
 *                 example: Rahul Sharma
 *               father_name:
 *                 type: string
 *                 example: Mohan Sharma
 *               mother_name:
 *                 type: string
 *                 example: Sita Sharma
 *               admission_no:
 *                 type: string
 *                 example: ADM001
 *               roll_no:
 *                 type: string
 *                 example: 12
 *               class_id:
 *                 type: integer
 *                 example: 1
 *               section_id:
 *                 type: integer
 *                 example: 1
 *               email:
 *                 type: string
 *                 example: student@gmail.com
 *               contact_number:
 *                 type: string
 *                 example: 9876543210
 *               gender:
 *                 type: string
 *                 example: M
 *               date_of_birth:
 *                 type: string
 *                 example: 2012-01-01
 *               admission_date:
 *                 type: string
 *                 example: 2024-04-01
 *               profile_image:
 *                 type: string
 *                 example: https://example.com/student.png
 *               address:
 *                 type: string
 *                 example: Bhopal, MP
 *               status:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Student created successfully
 */
router.post(
  "/",
  validate(createStudentSchema),
  controller.create
);

//////////////////////////////////////////////////////
// 📌 GET STUDENT BY ID
//////////////////////////////////////////////////////

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get Student By ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Student fetched successfully
 *       404:
 *         description: Student not found
 */
router.get("/:id", controller.getById);

//////////////////////////////////////////////////////
// 📌 UPDATE STUDENT
//////////////////////////////////////////////////////

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update Student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_name:
 *                 type: string
 *               father_name:
 *                 type: string
 *               mother_name:
 *                 type: string
 *               roll_no:
 *                 type: string
 *               class_id:
 *                 type: integer
 *               section_id:
 *                 type: integer
 *               contact_number:
 *                 type: string
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       404:
 *         description: Student not found
 */
router.put(
  "/:id",
  validate(updateStudentSchema),
  controller.update
);

//////////////////////////////////////////////////////
// 📌 DELETE STUDENT
//////////////////////////////////////////////////////

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Delete Student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 */
router.delete("/:id", controller.delete);

module.exports = router;