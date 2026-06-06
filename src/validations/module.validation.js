const Joi = require("joi");

exports.createModuleSchema =
Joi.object({

  name: Joi.string()
    .required()
    .max(150),

  parent_module_id:
    Joi.number()
      .allow(null),

  status:
    Joi.boolean()
      .optional()

});

exports.updateModuleSchema =
Joi.object({

  name: Joi.string()
    .max(150),

  parent_module_id:
    Joi.number()
      .allow(null),

  status:
    Joi.boolean()

});