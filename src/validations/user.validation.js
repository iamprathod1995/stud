const Joi = require("joi");

exports.createUserSchema =
Joi.object({

  name: Joi.string()
    .required()
    .max(150),

  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .required(),

  role_id: Joi.number()
    .required(),

  status: Joi.boolean()
    .optional()

});

exports.updateUserSchema =
Joi.object({

  name: Joi.string()
    .max(150),

  email: Joi.string()
    .email(),

  role_id: Joi.number(),

  status: Joi.boolean()

});