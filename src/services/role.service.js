const { Role } = require("../models");
const { Op } = require("sequelize");

class RoleService {

  // CREATE
  async create(data) {
    return await Role.create(data);
  }

  // GET ALL (PAGINATION + SEARCH + SORT)
  async getAll(page, limit, search, sortBy, order) {

    const offset = (page - 1) * limit;

    // SEARCH
    const where = search
      ? {
          name: {
            [Op.like]: `%${search}%`
          }
        }
      : {};

    // DEFAULT SORT
    const validSortFields = ["id", "name", "createdAt"];
    const sortField = validSortFields.includes(sortBy)
      ? sortBy
      : "id";

    const sortOrder =
      order && order.toUpperCase() === "ASC"
        ? "ASC"
        : "DESC";

    const result = await Role.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortField, sortOrder]],
    });

    return {
      total: result.count,
      page,
      limit,
      sortBy: sortField,
      order: sortOrder,
      rows: result.rows,
    };
  }

  // GET BY ID
  async getById(id) {
    return await Role.findByPk(id);
  }

  // UPDATE
  async update(id, data) {
    const role = await Role.findByPk(id);

    if (!role) throw new Error("Role not found");

    await role.update(data);
    return role;
  }

  // DELETE
  async delete(id) {
    const role = await Role.findByPk(id);

    if (!role) throw new Error("Role not found");

    await role.destroy();
    return true;
  }
}

module.exports = new RoleService();