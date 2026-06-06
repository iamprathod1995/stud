const { Role } =
require("../models");

class RoleService {

  async create(data) {

    return await Role.create(
      data
    );

  }

  async getAll() {

    return await Role.findAll();

  }

  async getById(id) {

    return await Role.findByPk(
      id
    );

  }

  async update(id, data) {

    const role =
      await Role.findByPk(id);

    if (!role) {
      throw new Error(
        "Role not found"
      );
    }

    await role.update(data);

    return role;
  }

  async delete(id) {

    const role =
      await Role.findByPk(id);

    if (!role) {
      throw new Error(
        "Role not found"
      );
    }

    await role.destroy();

    return true;
  }

}

module.exports =
new RoleService();