const express = require("express");
const router = express.Router();

const controller = require("../controllers/school.controller");

const pagination = require("../middlewares/pagination.middleware");
const validate = require("../middlewares/validate.middleware");
const createUploader = require("../utils/upload"); // 🔥 multer config
const {
  createSchoolSchema
} = require("../validations/school.validation");

/**
 * @swagger
 * tags:
 *   name: Schools
 *   description: School Management APIs
 */

//////////////////////////////////////////////////////
// 📌 GET ALL SCHOOLS
//////////////////////////////////////////////////////

/**
 * @swagger
 * /api/schools:
 *   get:
 *     summary: Get All Schools
 *     description: Get schools with pagination, search and sorting.
 *     tags: [Schools]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *           example: 1
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           example: 10
 *         description: Number of records per page
 *
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           example: ABC School
 *         description: Search by school name, owner name, or contact number
 *
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - id
 *             - school_name
 *             - owner_name
 *             - contact_number
 *             - status
 *             - createdAt
 *             - updatedAt
 *           default: id
 *           example: school_name
 *         description: Field name used for sorting
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
 *           example: ASC
 *         description: Sorting order
 *
 *     responses:
 *       200:
 *         description: Schools fetched successfully
 */
router.get("/", pagination, controller.getAll);

//////////////////////////////////////////////////////
// 📌 CREATE SCHOOL
//////////////////////////////////////////////////////

/**
 * @swagger
 * /api/schools:
 *   post:
 *     summary: Create School
 *     tags: [Schools]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:           
 *               - password
 *               - school_name
 *               - owner_name
 *               - contact_number
 *               - address
 *               - role_id
 *             properties:
 *               school_name:
 *                 type: string
 *                 example: ABC Public School
 *               role_id:
 *                 type: integer
 *                 example: 2
 *               owner_name:
 *                 type: string
 *                 example: Rahul Sharma
 *               school_logo:
 *                 type: string
 *                 format: binary
 *               contact_number:
 *                 type: string
 *                 example: 9876543210
 *               email:
 *                 type: string
 *                 example: abc@gmail.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *               address:
 *                 type: string
 *                 example: Village Huzurganj, MP
 *               status:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: School created successfully
 */
router.post(
  "/",
  createUploader("school").single("school_logo"),
  validate(createSchoolSchema),
  controller.create
);

//////////////////////////////////////////////////////
// 📌 GET SCHOOL BY ID
//////////////////////////////////////////////////////

/**
 * @swagger
 * /api/schools/{id}:
 *   get:
 *     summary: Get School By ID
 *     tags: [Schools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: School ID
 *     responses:
 *       200:
 *         description: School fetched successfully
 *       404:
 *         description: School not found
 */
router.get("/:id", controller.getById);

//////////////////////////////////////////////////////
// 📌 UPDATE SCHOOL
//////////////////////////////////////////////////////

/**
 * @swagger
 * /api/schools/{id}:
 *   put:
 *     summary: Update School (with optional image upload)
 *     tags: [Schools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: School ID
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               school_name:
 *                 type: string
 *                 example: ABC Public School
 *               owner_name:
 *                 type: string
 *                 example: Rahul Sharma
 *               school_logo:
 *                 type: string
 *                 format: binary
 *                 description: Upload new school logo
 *               contact_number:
 *                 type: string
 *                 example: 9876543210
 *               address:
 *                 type: string
 *                 example: Village Huzurganj, MP
 *               status:
 *                 type: integer
 *                 example: 1
 *
 *     responses:
 *       200:
 *         description: School updated successfully
 *       404:
 *         description: School not found
 */
router.put(
  "/:id",
  createUploader("school").single("school_logo"),
  controller.update
);

//////////////////////////////////////////////////////
// 📌 DELETE SCHOOL
//////////////////////////////////////////////////////

/**
 * @swagger
 * /api/schools/{id}:
 *   delete:
 *     summary: Delete School
 *     tags: [Schools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: School ID
 *     responses:
 *       200:
 *         description: School deleted successfully
 *       404:
 *         description: School not found
 */
router.delete("/:id", controller.delete);

module.exports = router;