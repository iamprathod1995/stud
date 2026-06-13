const express = require("express");
const router = express.Router();

const controller = require("../controllers/section.controller");

const pagination = require("../middlewares/pagination.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  createSectionSchema,
  updateSectionSchema
} = require("../validations/section.validation");

/**
 * @swagger
 * tags:
 *   name: Sections
 *   description: Section Management APIs
 */

/**
 * @swagger
 * /api/sections:
 *   get:
 *     summary: Get All Sections
 *     tags: [Sections]
 *     parameters:
 *       - in: query
 *         name: school_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: class_id
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
 *           enum: [id, section_name, status, createdAt, updatedAt]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: Sections fetched successfully
 */
router.get("/", pagination, controller.getAll);

/**
 * @swagger
 * /api/sections:
 *   post:
 *     summary: Create Section
 *     tags: [Sections]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - school_id
 *               - class_id
 *               - section_name
 *             properties:
 *               school_id:
 *                 type: integer
 *                 example: 1
 *               class_id:
 *                 type: integer
 *                 example: 1
 *               section_name:
 *                 type: string
 *                 example: A
 *               status:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Section created successfully
 */
router.post(
  "/",
  validate(createSectionSchema),
  controller.create
);

/**
 * @swagger
 * /api/sections/{id}:
 *   get:
 *     summary: Get Section By ID
 *     tags: [Sections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Section fetched successfully
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /api/sections/{id}:
 *   put:
 *     summary: Update Section
 *     tags: [Sections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Section updated successfully
 */
router.put(
  "/:id",
  validate(updateSectionSchema),
  controller.update
);

/**
 * @swagger
 * /api/sections/{id}:
 *   delete:
 *     summary: Delete Section
 *     tags: [Sections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Section deleted successfully
 */
router.delete("/:id", controller.delete);

module.exports = router;