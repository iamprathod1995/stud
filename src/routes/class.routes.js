const express = require("express");
const router = express.Router();


const controller = require("../controllers/class.controller");

const pagination = require("../middlewares/pagination.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  createClassSchema,
  updateClassSchema
} = require("../validations/class.validation");

/**
 * @swagger
 * tags:
 *   name: Classes
 *   description: Class Management APIs
 */

/**
 * @swagger
 * /api/classes:
 *   get:
 *     summary: Get All Classes
 *     tags: [Classes]
 *     parameters:
 *       - in: query
 *         name: school_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, class_name, class_code, status, createdAt, updatedAt]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: Classes fetched successfully
 */
router.get("/", pagination, controller.getAll);

/**
 * @swagger
 * /api/classes:
 *   post:
 *     summary: Create Class
 *     tags: [Classes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - school_id
 *               - class_name
 *             properties:
 *               school_id:
 *                 type: integer
 *                 example: 1
 *               class_name:
 *                 type: string
 *                 example: Class 1
 *               class_code:
 *                 type: string
 *                 example: CLS01
 *               description:
 *                 type: string
 *                 example: Primary First Class
 *               status:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Class created successfully
 */
router.post(
  "/",
  validate(createClassSchema),
  controller.create
);

/**
 * @swagger
 * /api/classes/{id}:
 *   get:
 *     summary: Get Class By ID
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Class fetched successfully
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /api/classes/{id}:
 *   put:
 *     summary: Update Class
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               school_id:
 *                 type: integer
 *                 example: 1
 *               class_name:
 *                 type: string
 *                 example: Class 1
 *               class_code:
 *                 type: string
 *                 example: CLS01
 *               description:
 *                 type: string
 *                 example: Primary First Class
 *               status:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Class updated successfully
 */

router.put(
  "/:id",
  validate(updateClassSchema),
  controller.update
);

/**
 * @swagger
 * /api/classes/{id}:
 *   delete:
 *     summary: Delete Class
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Class deleted successfully
 */
router.delete("/:id", controller.delete);

module.exports = router;