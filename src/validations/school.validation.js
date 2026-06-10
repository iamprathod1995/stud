const Joi = require("joi");

exports.createSchoolSchema =
Joi.object({

  school_name: Joi.string()
    .required(),

  owner_name: Joi.string()
    .required(),

  school_logo: Joi.string()
    .allow("")
    .optional(),

  contact_number: Joi.string()
    .required(),

  email: Joi.string()
    .email()
    .allow("")
    .optional(),

  address: Joi.string()
    .required(),

  status: Joi.number()
    .valid(0, 1)
    .default(1),

  password: Joi.string()
    .required(),

});