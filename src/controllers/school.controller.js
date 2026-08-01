  const schoolService = require("../services/school.service");
  const path = require("path");
  const fs = require("fs");


exports.create = async (req, res, next) => {
  try {
    const file = req.file;

    const payload = {
      ...req.body,
      role_id: Number(req.body.role_id),
      status: Number(req.body.status),
      school_logo: null
    };

    // 1. create school
    const school = await schoolService.create(payload);

    // 2. folder create (ONLY HERE)
    const finalDir = path.join(
      process.cwd(),
      "uploads",
      "schools",
      `school_${school.id}`
    );

    const studentDir = path.join(finalDir, "Students");

    fs.mkdirSync(studentDir, { recursive: true });

    // 3. move file
    if (file) {
      const newPath = path.join(finalDir, file.filename);

      fs.renameSync(file.path, newPath);

      school.school_logo = newPath.replace(/\\/g, "/");

      await school.save();
    }

    res.status(201).json({
      success: true,
      data: school
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
    const file = req.file;

    const school = await schoolService.getById(req.params.id);

    const folderPath = path.join(
      process.cwd(),
      "uploads",
      "schools",
      `school_${school.id}`
    );

    // 🔥 remove email from update payload
    const { email, ...safeBody } = req.body;

    // old image delete
    if (file && school.school_logo) {
      const oldFilePath = path.join(process.cwd(), school.school_logo);

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // move new file
    if (file) {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      const newPath = path.join(folderPath, file.filename);
      fs.renameSync(file.path, newPath);
    }

    // update DB (email excluded)
    const data = await schoolService.update(req.params.id, {
      ...safeBody,
      school_logo: file
        ? path
            .join("uploads", "schools", `school_${school.id}`, file.filename)
            .replace(/\\/g, "/")
        : school.school_logo
    });

    res.status(200).json({
      success: true,
      data
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