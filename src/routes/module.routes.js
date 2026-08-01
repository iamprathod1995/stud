const express = require("express");

const router = express.Router();

const controller = require(
  "../controllers/module.controller"
);

const validate = require(
  "../middlewares/validate.middleware"
);

const {
  createModuleSchema
} = require(
  "../validations/module.validation"
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Module:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: User Management
 *         parent_module_id:
 *           type: integer
 *           nullable: true
 *           example: null
 *         status:
 *           type: boolean
 *           example: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2026-06-06T12:10:30.000Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2026-06-06T12:10:30.000Z"
 *
 *     CreateModule:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: User Management
 *         parent_module_id:
 *           type: integer
 *           nullable: true
 *           example: null
 *         status:
 *           type: boolean
 *           example: true
 */
/**
 * @swagger
 * tags:
 *   name: Modules
 *   description: Module Management APIs
 */

/**
 * @swagger
 * /api/modules:
 *   get:
 *     summary: Get All Modules
 *     tags: [Modules]
 *     responses:
 *       200:
 *         description: Modules fetched successfully
 *         headers:
 *           X-Total-Count:
 *             description: Total records count
 *             schema:
 *               type: integer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Module'
 */
router.get(
  "/",
  controller.getAll
);

/**
 * @swagger
 * /api/modules:
 *   post:
 *     summary: Create Module
 *     tags: [Modules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateModule'
 *     responses:
 *       201:
 *         description: Module created successfully
 *         headers:
 *           Location:
 *             description: URL of newly created module
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Module created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Module'
 *
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/",
  validate(createModuleSchema),
  controller.create
);

/**
 * @swagger
 * /api/modules/{id}:
 *   get:
 *     summary: Get Module By ID
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Module ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Module found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Module'
 *
 *       404:
 *         description: Module not found
 */
router.get(
  "/:id",
  controller.getById
);

/**
 * @swagger
 * /api/modules/{id}:
 *   put:
 *     summary: Update Module
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Module ID
 *         schema:
 *           type: integer
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateModule'
 *
 *     responses:
 *       200:
 *         description: Module updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Module updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Module'
 *
 *       404:
 *         description: Module not found
 */
router.put(
  "/:id",
  controller.update
);

/**
 * @swagger
 * /api/modules/{id}:
 *   delete:
 *     summary: Delete Module
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Module ID
 *         schema:
 *           type: integer
 *
 *     responses:
 *       200:
 *         description: Module deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Module deleted successfully
 *
 *       404:
 *         description: Module not found
 */
router.delete(
  "/:id",
  controller.delete
);

module.exports = router;