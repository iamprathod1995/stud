const Joi = require("joi");

exports.assignPermissionSchema =
Joi.object({

  role_id: Joi.number()
    .required(),

  module_id: Joi.number()
    .required(),

  can_add: Joi.boolean()
    .default(false),

  can_view: Joi.boolean()
    .default(false),

  can_update: Joi.boolean()
    .default(false),

  can_delete: Joi.boolean()
    .default(false)

});