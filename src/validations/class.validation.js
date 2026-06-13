const Joi = require("joi");

/**
 * CREATE CLASS VALIDATION
 */
exports.createClassSchema = Joi.object({
  school_id: Joi.number()
    .required(),

  class_name: Joi.string()
    .required(),

  class_code: Joi.string()
    .allow("")
    .optional(),

  description: Joi.string()
    .allow("")
    .optional(),

  status: Joi.number()
    .valid(0, 1)
    .default(1)
});

/**
 * UPDATE CLASS VALIDATION
 */
exports.updateClassSchema = Joi.object({
  school_id: Joi.number()
    .optional(),

  class_name: Joi.string()
    .optional(),

  class_code: Joi.string()
    .allow("")
    .optional(),

  description: Joi.string()
    .allow("")
    .optional(),

  status: Joi.number()
    .valid(0, 1)
    .optional()
});