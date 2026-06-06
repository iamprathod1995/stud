const {
  Permission,
  Role,
  Module
} = require("../models");

class PermissionService {

  async assign(data) {

    const existing =
      await Permission.findOne({
        where: {
          role_id: data.role_id,
          module_id: data.module_id
        }
      });

    if (existing) {

      await existing.update(data);

      return existing;
    }

    return await Permission.create(data);
  }

  async getAll() {

    return await Permission.findAll({

      include: [
        {
          model: Role,
          as: "role"
        },
        {
          model: Module,
          as: "module"
        }
      ]

    });

  }

  async getByRole(roleId) {

    return await Permission.findAll({

      where: {
        role_id: roleId
      },

      include: [
        {
          model: Module,
          as: "module"
        }
      ]

    });

  }

}

module.exports =
new PermissionService();