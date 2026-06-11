const studentService = require("../services/student.service");

/**
 * CREATE STUDENT
 */
exports.create = async (req, res, next) => {
  try {
    const data = await studentService.create(req.body);

    res.status(201).json({
      success: true,
      data: data
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET ALL STUDENTS
 */
exports.getAll = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const {
      search,
      sortBy = "id",
      order = "DESC",
      school_id
    } = req.query;

    const result = await studentService.getAll(
      page,
      limit,
      search,
      sortBy,
      order,
      school_id
    );

    res.status(200).json({
      success: true,
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET STUDENT BY ID
 */
exports.getById = async (req, res, next) => {
  try {
    const data = await studentService.getById(req.params.id);

    res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE STUDENT
 */
exports.update = async (req, res, next) => {
  try {
    const data = await studentService.update(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    next(error);
  }
};

/**
 * DELETE STUDENT
 */
exports.delete = async (req, res, next) => {
  try {
    await studentService.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Student deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};