const { Module } = require("../models");

class ModuleService {

  async create(data) {
    return await Module.create(data);
  }

  async getAll() {
    return await Module.findAll({
      order: [["id", "DESC"]]
    });
  }

  async getById(id) {

    const moduleData =
      await Module.findByPk(id);

    if (!moduleData) {
      throw new Error("Module not found");
    }

    return moduleData;
  }

  async update(id, data) {

    const moduleData =
      await Module.findByPk(id);

    if (!moduleData) {
      throw new Error("Module not found");
    }

    await moduleData.update(data);

    return moduleData;
  }

  async delete(id) {

    const moduleData =
      await Module.findByPk(id);

    if (!moduleData) {
      throw new Error("Module not found");
    }

    await moduleData.destroy();

    return true;
  }

}

module.exports = new ModuleService();