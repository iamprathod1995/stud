const { Permission, Role, Module } = require("../models");

class PermissionService {

  // single assign (old working method)
  async assign(data) {

    const existing = await Permission.findOne({
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

  // 🔥 BULK ASSIGN (NEW)
  async assignBulk(data) {

    const results = [];

    for (const item of data.permissions) {

      const existing = await Permission.findOne({
        where: {
          role_id: data.role_id,
          module_id: item.module_id
        }
      });

      if (existing) {
        await existing.update({
          ...item,
          role_id: data.role_id
        });

        results.push(existing);
      } else {
        const created = await Permission.create({
          ...item,
          role_id: data.role_id
        });

        results.push(created);
      }
    }

    return results;
  }

  async getAll() {
    return await Permission.findAll({
      include: [
        { model: Role, as: "role" },
        { model: Module, as: "module" }
      ]
    });
  }

  async getByRole(roleId) {
    return await Permission.findAll({
      where: { role_id: roleId },
      include: [
        { model: Module, as: "module" }
      ]
    });
  }
}

module.exports = new PermissionService();