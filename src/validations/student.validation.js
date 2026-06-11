const Joi = require("joi");

/**
 * CREATE STUDENT VALIDATION
 */
exports.createStudentSchema = Joi.object({
  school_id: Joi.number()
    .required(),

  student_name: Joi.string()
    .required(),

  father_name: Joi.string()
    .allow("")
    .optional(),

  mother_name: Joi.string()
    .allow("")
    .optional(),

  admission_no: Joi.string()
    .required(),

  roll_no: Joi.string()
    .allow("")
    .optional(),

  class_id: Joi.number()
    .optional(),

  section_id: Joi.number()
    .optional(),

  email: Joi.string()
    .email()
    .allow("")
    .optional(),

  contact_number: Joi.string()
    .allow("")
    .optional(),

  gender: Joi.string()
    .valid("M", "F", "O")
    .allow("")
    .optional(),

  date_of_birth: Joi.date()
    .optional(),

  admission_date: Joi.date()
    .required(),

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

/**
 * UPDATE STUDENT VALIDATION
 */
exports.updateStudentSchema = Joi.object({
  school_id: Joi.number()
    .optional(),

  student_name: Joi.string()
    .optional(),

  father_name: Joi.string()
    .allow("")
    .optional(),

  mother_name: Joi.string()
    .allow("")
    .optional(),

  admission_no: Joi.string()
    .optional(),

  roll_no: Joi.string()
    .allow("")
    .optional(),

  class_id: Joi.number()
    .optional(),

  section_id: Joi.number()
    .optional(),

  email: Joi.string()
    .email()
    .allow("")
    .optional(),

  contact_number: Joi.string()
    .allow("")
    .optional(),

  gender: Joi.string()
    .valid("M", "F", "O")
    .allow("")
    .optional(),

  date_of_birth: Joi.date()
    .optional(),

  admission_date: Joi.date()
    .optional(),

  profile_image: Joi.string()
    .allow("")
    .optional(),

  address: Joi.string()
    .allow("")
    .optional(),

  status: Joi.number()
    .valid(0, 1)
    .optional()
});