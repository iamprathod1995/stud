const Joi = require("joi");

exports.createRoleSchema =
Joi.object({

  name: Joi.string()
    .required(),

  description:
    Joi.string()
    .allow("")
});