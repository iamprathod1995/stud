const express = require("express");
const router = express.Router();

const controller = require("../controllers/staffLeave.controller");

const pagination = require("../middlewares/pagination.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  createStaffLeaveSchema,
  updateStaffLeaveSchema,
  approveLeaveSchema,
  rejectLeaveSchema
} = require("../validations/staffLeave.validation");

//////////////////////////////////////////////////////
// 📌 STAFF LEAVE TAG
//////////////////////////////////////////////////////

/**
 * @swagger
 * tags:
 *   name: Staff Leave
 *   description: Staff Leave Management APIs
 */

//////////////////////////////////////////////////////
// 📌 GET ALL LEAVES
//////////////////////////////////////////////////////

/**
 * @swagger
 * /api/staff-leaves:
 *   get:
 *     summary: Get All Staff Leaves (with filters, search, sort)
 *     tags: [Staff Leave]
 *     parameters:
 *       - in: query
 *         name: school_id
 *         schema:
 *           type: integer

 *       - in: query
 *         name: staff_id
 *         schema:
 *           type: integer

 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *           enum: [0,1,2]

 *       - in: query
 *         name: leave_type
 *         schema:
 *           type: integer

 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: fever

 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           example: 2026-06-01

 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *           example: 2026-06-30

 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum:
 *             - id
 *             - from_date
 *             - to_date
 *             - status
 *             - leave_type
 *             - created_at
 *             - updated_at
 *           default: id

 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC

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

 *     responses:
 *       200:
 *         description: Leave list fetched successfully
 */
router.get("/", pagination, controller.getAll);

//////////////////////////////////////////////////////
// 📌 APPLY LEAVE
//////////////////////////////////////////////////////

/**
 * @swagger
 * /api/staff-leaves:
 *   post:
 *     summary: Apply Staff Leave
 *     tags: [Staff Leave]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - school_id
 *               - staff_id
 *               - leave_type
 *               - from_date
 *               - to_date
 *               - reason
 *             properties:
 *               school_id:
 *                 type: integer
 *                 example: 1
 *               staff_id:
 *                 type: integer
 *                 example: 5
 *               leave_type:
 *                 type: integer
 *                 example: 2
 *               from_date:
 *                 type: string
 *                 example: 2026-06-15
 *               to_date:
 *                 type: string
 *                 example: 2026-06-17
 *               reason:
 *                 type: string
 *                 example: Fever
 *     responses:
 *       201:
 *         description: Leave applied successfully
 */
router.post(
  "/",
  validate(createStaffLeaveSchema),
  controller.create
);

//////////////////////////////////////////////////////
// 📌 GET LEAVE BY ID
//////////////////////////////////////////////////////

/**
 * @swagger
 * /api/staff-leaves/{id}:
 *   get:
 *     summary: Get Leave By ID
 *     tags: [Staff Leave]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Leave fetched successfully
 *       404:
 *         description: Leave not found
 */
router.get("/:id", controller.getById);

//////////////////////////////////////////////////////
// 📌 UPDATE LEAVE
//////////////////////////////////////////////////////

/**
 * @swagger
 * /api/staff-leaves/{id}:
 *   put:
 *     summary: Update Leave
 *     tags: [Staff Leave]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leave_type:
 *                 type: integer
 *                 example: 2
 *               from_date:
 *                 type: string
 *                 example: 2026-06-15
 *               to_date:
 *                 type: string
 *                 example: 2026-06-17
 *               reason:
 *                 type: string
 *                 example: Updated reason
 *
 *     responses:
 *       200:
 *         description: Leave updated successfully
 */
router.put(
  "/:id",
  validate(updateStaffLeaveSchema),
  controller.update
);

//////////////////////////////////////////////////////
// 📌 APPROVE LEAVE
//////////////////////////////////////////////////////

/**
 * @swagger
 * /api/staff-leaves/{id}/approve:
 *   patch:
 *     summary: Approve Leave
 *     tags: [Staff Leave]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Leave approved successfully
 */
router.patch(
  "/:id/approve",
  validate(approveLeaveSchema),
  controller.approve
);

//////////////////////////////////////////////////////
// 📌 REJECT LEAVE
//////////////////////////////////////////////////////

/**
 * @swagger
 * /api/staff-leaves/{id}/reject:
 *   patch:
 *     summary: Reject Leave
 *     tags: [Staff Leave]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Leave rejected successfully
 */
router.patch(
  "/:id/reject",
  validate(rejectLeaveSchema),
  controller.reject
);

//////////////////////////////////////////////////////
// 📌 DELETE LEAVE
//////////////////////////////////////////////////////

/**
 * @swagger
 * /api/staff-leaves/{id}:
 *   delete:
 *     summary: Delete Leave
 *     tags: [Staff Leave]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Leave deleted successfully
 */
router.delete("/:id", controller.delete);

module.exports = router;