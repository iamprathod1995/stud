const express =
require("express");

const router =
express.Router();

const controller =
require(
 "../controllers/permission.controller"
);

const validate =
require(
 "../middlewares/validate.middleware"
);

const {
 assignPermissionSchema
} = require(
 "../validations/permission.validation"
);

/**
 * @swagger
 * tags:
 *   name: Permissions
 */

/**
 * @swagger
 * /api/permissions:
 *   post:
 *     summary: Assign Permission
 *     tags: [Permissions]
 */
router.post(
 "/",
 validate(
  assignPermissionSchema
 ),
 controller.assign
);

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Get All Permissions
 *     tags: [Permissions]
 */
router.get(
 "/",
 controller.getAll
);

/**
 * @swagger
 * /api/permissions/role/{roleId}:
 *   get:
 *     summary: Get Role Permissions
 *     tags: [Permissions]
 */
router.get(
 "/role/:roleId",
 controller.getByRole
);

module.exports = router;