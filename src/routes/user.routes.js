const express = require("express");
const router = express.Router();

const controller =
require("../controllers/user.controller");

const auth =
require("../middlewares/auth.middleware");

const validate =
require("../middlewares/validate.middleware");

const pagination =
require("../middlewares/pagination.middleware");

const {
  createUserSchema
} = require("../validations/user.validation");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User Management APIs
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create User
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@test.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *               role_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post(
  "/",
  auth,
  validate(createUserSchema),
  controller.create
);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: User List
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: john
 *     responses:
 *       200:
 *         description: User list
 */
router.get(
  "/",
  auth,
  pagination,
  controller.getAll
);

module.exports = router;