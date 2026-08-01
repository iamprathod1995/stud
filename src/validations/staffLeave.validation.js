const Joi = require("joi");

/**
 * APPLY LEAVE VALIDATION
 */
exports.createStaffLeaveSchema = Joi.object({
  school_id: Joi.number()
    .required(),

  staff_id: Joi.number()
    .required(),

  leave_type: Joi.number()
    .valid(1, 2, 3, 4, 5)
    .default(1),

  from_date: Joi.date()
    .required(),

  to_date: Joi.date()
    .required(),

  total_days: Joi.number()
    .min(0.5)
    .optional(),

  reason: Joi.string()
    .required(),

  status: Joi.number()
    .valid(0, 1, 2)
    .default(0)
});

/**
 * UPDATE LEAVE VALIDATION
 */
exports.updateStaffLeaveSchema = Joi.object({
  leave_type: Joi.number()
    .valid(1, 2, 3, 4, 5)
    .optional(),

  from_date: Joi.date()
    .optional(),

  to_date: Joi.date()
    .optional(),

  total_days: Joi.number()
    .min(0.5)
    .optional(),

  reason: Joi.string()
    .optional()
});

/**
 * APPROVE LEAVE VALIDATION
 */
exports.approveLeaveSchema = Joi.object({
  approved_by: Joi.number()
    .required(),

  admin_remark: Joi.string()
    .allow("")
    .optional()
});

/**
 * REJECT LEAVE VALIDATION
 */
exports.rejectLeaveSchema = Joi.object({
  approved_by: Joi.number()
    .required(),

  admin_remark: Joi.string()
    .required()
});