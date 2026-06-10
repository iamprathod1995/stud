const roleService = require("../services/role.service");

// CREATE
exports.create = async (req, res, next) => {
  try {
    const data = await roleService.create(req.body);

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL (FULL FILTER SYSTEM)
exports.getAll = async (req, res, next) => {
  try {

    const { page, limit } = req.pagination;

    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "id";
    const order = req.query.order || "DESC";

    const data = await roleService.getAll(
      page,
      limit,
      search,
      sortBy,
      order
    );

    res.status(200).json({
      success: true,
      ...data
    });

  } catch (error) {
    next(error);
  }
};

// GET BY ID
exports.getById = async (req, res, next) => {
  try {
    const data = await roleService.getById(req.params.id);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
exports.update = async (req, res, next) => {
  try {
    const data = await roleService.update(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
exports.delete = async (req, res, next) => {
  try {
    await roleService.delete(req.params.id);

    res.json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};