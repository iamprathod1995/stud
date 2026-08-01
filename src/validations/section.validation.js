const Joi = require("joi");

/**
 * CREATE SECTION VALIDATION
 */
exports.createSectionSchema = Joi.object({
  school_id: Joi.number()
    .required(),

  class_id: Joi.number()
    .required(),

  section_name: Joi.string()
    .required(),

  status: Joi.number()
    .valid(0, 1)
    .default(1)
});

/**
 * UPDATE SECTION VALIDATION
 */
exports.updateSectionSchema = Joi.object({
  school_id: Joi.number()
    .optional(),

  class_id: Joi.number()
    .optional(),

  section_name: Joi.string()
    .optional(),

  status: Joi.number()
    .valid(0, 1)
    .optional()
});