const express = require("express");
const router = express.Router();

const controller = require("../controllers/permission.controller");
const validate = require("../middlewares/validate.middleware");

const {
  assignPermissionSchema,
  assignBulkPermissionSchema
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
 *           default: false
 *           example: true
 *         can_view:
 *           type: boolean
 *           default: false
 *           example: true
 *         can_update:
 *           type: boolean
 *           default: false
 *           example: false
 *         can_delete:
 *           type: boolean
 *           default: false
 *           example: false
 *
 *     BulkAssignPermission:
 *       type: object
 *       required:
 *         - role_id
 *         - permissions
 *       properties:
 *         role_id:
 *           type: integer
 *           example: 1
 *         permissions:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - module_id
 *             properties:
 *               module_id:
 *                 type: integer
 *                 example: 10
 *               can_add:
 *                 type: boolean
 *                 default: false
 *                 example: true
 *               can_view:
 *                 type: boolean
 *                 default: false
 *                 example: true
 *               can_update:
 *                 type: boolean
 *                 default: false
 *                 example: false
 *               can_delete:
 *                 type: boolean
 *                 default: false
 *                 example: false
 *
 * tags:
 *   name: Permissions
 *   description: Permission Management APIs
 */

/**
 * @swagger
 * /api/permissions:
 *   post:
 *     summary: Assign single permission
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
 */
router.post(
  "/",
  validate(assignPermissionSchema),
  controller.assign
);

/**
 * @swagger
 * /api/permissions/bulk:
 *   post:
 *     summary: Assign bulk permissions for a role
 *     tags: [Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkAssignPermission'
 *     responses:
 *       201:
 *         description: Bulk permissions assigned successfully
 */
router.post(
  "/bulk",
  validate(assignBulkPermissionSchema),
  controller.assignBulk
);

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: List of permissions
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /api/permissions/role/{roleId}:
 *   get:
 *     summary: Get permissions by role
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
 */
router.get("/role/:roleId", controller.getByRole);

module.exports = router;