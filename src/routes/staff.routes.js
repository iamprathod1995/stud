const express = require("express");
const router = express.Router();

const controller = require("../controllers/staff.controller");

const pagination = require("../middlewares/pagination.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  createStaffSchema
} = require("../validations/staff.validation");

//////////////////////////////////////////////////////
// 📌 STAFF TAG
//////////////////////////////////////////////////////

/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: Staff Management APIs
 */

//////////////////////////////////////////////////////
// 📌 GET ALL STAFF
//////////////////////////////////////////////////////

/**
 * @swagger
 * /api/staff:
 *   get:
 *     summary: Get All Staff
 *     description: Get staff with pagination, search, sorting and school filter.
 *     tags: [Staff]
 *     parameters:
 *       - in: query
 *         name: school_id
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Filter staff by school_id
 *
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *           example: 1
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           example: 10
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
 *             - staff_name
 *             - email
 *             - contact_number
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
 *         description: Staff fetched successfully
 */
router.get("/", pagination, controller.getAll);

//////////////////////////////////////////////////////
// 📌 CREATE STAFF
//////////////////////////////////////////////////////

/**
 * @swagger
 * /api/staff:
 *   post:
 *     summary: Create Staff
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - school_id
 *               - staff_name
 *               - contact_number
 *               - joining_date
 *             properties:
 *               school_id:
 *                 type: integer
 *                 example: 1
 *               staff_name:
 *                 type: string
 *                 example: Rahul Sharma
 *               father_name:
 *                 type: string
 *                 example: Mohan Sharma
 *               email:
 *                 type: string
 *                 example: staff@gmail.com
 *               contact_number:
 *                 type: string
 *                 example: 9876543210
 *               gender:
 *                 type: string
 *                 example: M
 *               date_of_birth:
 *                 type: string
 *                 example: 1990-01-01
 *               role:
 *                 type: integer
 *                 example: 1
 *               qualification:
 *                 type: string
 *                 example: M.Sc, B.Ed
 *               experience:
 *                 type: integer
 *                 example: 5
 *               joining_date:
 *                 type: string
 *                 example: 2024-01-01
 *               salary:
 *                 type: number
 *                 example: 25000
 *               profile_image:
 *                 type: string
 *                 example: https://example.com/img.png
 *               address:
 *                 type: string
 *                 example: Huzurganj, MP
 *               status:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Staff created successfully
 */
router.post(
  "/",
  validate(createStaffSchema),
  controller.create
);

//////////////////////////////////////////////////////
// 📌 GET STAFF BY ID
//////////////////////////////////////////////////////

/**
 * @swagger
 * /api/staff/{id}:
 *   get:
 *     summary: Get Staff By ID
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Staff ID
 *     responses:
 *       200:
 *         description: Staff fetched successfully
 *       404:
 *         description: Staff not found
 */
router.get("/:id", controller.getById);

//////////////////////////////////////////////////////
// 📌 UPDATE STAFF
//////////////////////////////////////////////////////

/**
 * @swagger
 * /api/staff/{id}:
 *   put:
 *     summary: Update Staff
 *     tags: [Staff]
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
 *               staff_name:
 *                 type: string
 *               contact_number:
 *                 type: string
 *               email:
 *                 type: string
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Staff updated successfully
 *       404:
 *         description: Staff not found
 */
router.put("/:id", controller.update);

//////////////////////////////////////////////////////
// 📌 DELETE STAFF
//////////////////////////////////////////////////////

/**
 * @swagger
 * /api/staff/{id}:
 *   delete:
 *     summary: Delete Staff
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Staff ID
 *     responses:
 *       200:
 *         description: Staff deleted successfully
 *       404:
 *         description: Staff not found
 */
router.delete("/:id", controller.delete);

module.exports = router;