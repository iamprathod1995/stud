const express =
require("express");

const router =
express.Router();

const controller =
require(
 "../controllers/role.controller"
);

const validate =
require(
 "../middlewares/validate.middleware"
);

const {
 createRoleSchema
} = require(
 "../validations/role.validation"
);

/**
 * @swagger
 * tags:
 *   name: Roles
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get All Roles
 *     tags: [Roles]
 */
router.get(
 "/",
 controller.getAll
);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create Role
 *     tags: [Roles]
 */
router.post(
 "/",
 validate(
  createRoleSchema
 ),
 controller.create
);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get Role
 *     tags: [Roles]
 */
router.get(
 "/:id",
 controller.getById
);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Update Role
 *     tags: [Roles]
 */
router.put(
 "/:id",
 controller.update
);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete Role
 *     tags: [Roles]
 */
router.delete(
 "/:id",
 controller.delete
);

module.exports = router;