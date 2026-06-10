const express = require("express");
const router = express.Router();

const controller = require("../controllers/permission.controller");
const validate = require("../middlewares/validate.middleware");

const {
  assignPermissionSchema,
} = require("../validations/permission.validation");

/**
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         role_id:
 *           type: integer
 *           example: 1
 *         module_id:
 *           type: integer
 *           example: 2
 *         can_add:
 *           type: boolean
 *           example: true
 *         can_view:
 *           type: boolean
 *           example: true
 *         can_update:
 *           type: boolean
 *           example: false
 *         can_delete:
 *           type: boolean
 *           example: false
 *
 *     AssignPermission:
 *       type: object
 *       required:
 *         - role_id
 *         - module_id
 *       properties:
 *         role_id:
 *           type: integer
 *           example: 1
 *         module_id:
 *           type: integer
 *           example: 2
 *         can_add:
 *           type: boolean
 *           example: true
 *         can_view:
 *           type: boolean
 *           example: true
 *         can_update:
 *           type: boolean
 *           example: false
 *         can_delete:
 *           type: boolean
 *           example: false
 *
 * tags:
 *   name: Permissions
 *   description: Permission Management APIs
 */

/**
 * @swagger
 * /api/permissions:
 *   post:
 *     summary: Assign Permission
 *     tags: [Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignPermission'
 *     responses:
 *       201:
 *         description: Permission assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       400:
 *         description: Validation Error
 */
router.post(
  "/",
  validate(assignPermissionSchema),
  controller.assign
);

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Get All Permissions
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: List of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /api/permissions/role/{roleId}:
 *   get:
 *     summary: Get Role Permissions
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Role permissions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 *       404:
 *         description: Role not found
 */
router.get("/role/:roleId", controller.getByRole);

module.exports = router;