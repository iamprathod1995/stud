const Joi = require("joi");

/**
 * CREATE STAFF VALIDATION
 */
exports.createStaffSchema = Joi.object({
  school_id: Joi.number()
    .required(),

  staff_name: Joi.string()
    .required(),

  father_name: Joi.string()
    .allow("")
    .optional(),

  email: Joi.string()
    .email()
    .allow("")
    .optional(),

  contact_number: Joi.string()
    .required(),

  gender: Joi.string()
    .valid("M", "F", "O")
    .allow("")
    .optional(),

  date_of_birth: Joi.date()
    .optional(),

  role: Joi.number()
    .valid(1, 2, 3, 4, 5)
    .default(1),

  qualification: Joi.string()
    .allow("")
    .optional(),

  experience: Joi.number()
    .min(0)
    .optional(),

  joining_date: Joi.date()
    .required(),

  salary: Joi.number()
    .precision(2)
    .optional(),

  profile_image: Joi.string()
    .allow("")
    .optional(),

  address: Joi.string()
    .allow("")
    .optional(),

  status: Joi.number()
    .valid(0, 1)
    .default(1)
});