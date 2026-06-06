const express =
require("express");

const router =
express.Router();

const controller =
require(
  "../controllers/module.controller"
);

const validate =
require(
  "../middlewares/validate.middleware"
);

const {
  createModuleSchema
} = require(
  "../validations/module.validation"
);

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
 *         description: Success
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
 */
router.delete(
  "/:id",
  controller.delete
);

module.exports = router;