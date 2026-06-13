const schoolService = require("../services/school.service");

exports.create = async (req, res, next) => {
  try {

    const payload = {
      ...req.body,
      role_id: Number(req.body.role_id),
      status: Number(req.body.status),
      school_logo: req.file
        ? req.file.path.split(path.sep).join("/")
        : null
    };

    const data = await schoolService.create(payload);

    res.status(201).json({
      success: true,
      data
    });

  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const {
      search,
      sortBy = "id",
      order = "DESC"
    } = req.query;

    const result = await schoolService.getAll(
      page,
      limit,
      search,
      sortBy,
      order
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

exports.getById = async (req, res, next) => {
  try {
    const data = await schoolService.getById(req.params.id);

    res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await schoolService.update(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await schoolService.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: "School deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};