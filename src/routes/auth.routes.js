const express = require("express");
const router = express.Router();

const authController =
require("../controllers/auth.controller");

const authMiddleware =
require("../middlewares/auth.middleware");

const audit =
require("../middlewares/audit.middleware");
const authLimiter = require("../middlewares/authLimiter.middleware");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication APIs
 */

router.post(
  "/register",
  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Register New User
   *     tags: [Authentication]
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
   *                 example: Admin User
   *               email:
   *                 type: string
   *                 example: admin@example.com
   *               password:
   *                 type: string
   *                 example: Password@123
   *               role_id:
   *                 type: integer
   *                 example: 1
   *     responses:
   *       201:
   *         description: User registered successfully
   */
  audit("AUTH", "LOGIN"),
  audit("AUTH", "REGISTER"),
  authController.register
);


router.post(
  "/login",
  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Login User
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 example: admin@example.com
   *               password:
   *                 type: string
   *                 example: Password@123
   *     responses:
   *       200:
   *         description: Login successful
   */
  authLimiter,
  audit("AUTH", "LOGIN"),
  authController.login
);


router.post(
  "/logout",
  /**
   * @swagger
   * /api/auth/logout:
   *   post:
   *     summary: Logout User
   *     tags: [Authentication]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               refreshToken:
   *                 type: string
   *     responses:
   *       200:
   *         description: Logout successful
   */
  authMiddleware,
  audit("AUTH", "LOGOUT"),
  authController.logout
);





// router.get(
//   "/profile",
//   /**
//    * @swagger
//    * /api/auth/profile:
//    *   get:
//    *     summary: Get Logged In User Profile
//    *     tags: [Authentication]
//    *     security:
//    *       - BearerAuth: []
//    *     responses:
//    *       200:
//    *         description: User profile details
//    */
//   authController.profile
// );


module.exports = router;