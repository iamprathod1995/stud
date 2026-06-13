const { Class } = require("../models");
const { Op } = require("sequelize");

/**
 * CREATE CLASS
 */
exports.create = async (payload) => {
  const classData = await Class.create({
    school_id: payload.school_id,
    class_name: payload.class_name,
    class_code: payload.class_code,
    description: payload.description,
    status: payload.status
  });

  return classData;
};

/**
 * GET ALL CLASSES
 */
exports.getAll = async (
  page,
  limit,
  search,
  sortBy,
  order,
  school_id
) => {
  const offset = (page - 1) * limit;

  const where = {};

  if (school_id) {
    where.school_id = school_id;
  }

  if (search) {
    where[Op.or] = [
      {
        class_name: {
          [Op.like]: `%${search}%`
        }
      },
      {
        class_code: {
          [Op.like]: `%${search}%`
        }
      }
    ];
  }

  const allowedSortFields = [
    "id",
    "class_name",
    "class_code",
    "status",
    "createdAt",
    "updatedAt"
  ];

  const sortField = allowedSortFields.includes(sortBy)
    ? sortBy
    : "id";

  const sortOrder =
    order?.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const { count, rows } = await Class.findAndCountAll({
    where,
    limit,
    offset,
    order: [[sortField, sortOrder]]
  });

  return {
    data: rows,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit)
  };
};

/**
 * GET CLASS BY ID
 */
exports.getById = async (id) => {
  const classData = await Class.findByPk(id);

  if (!classData) {
    throw new Error("Class not found");
  }

  return classData;
};

/**
 * UPDATE CLASS
 */
exports.update = async (id, payload) => {
  const classData = await Class.findByPk(id);

  if (!classData) {
    throw new Error("Class not found");
  }

  await Class.update(payload, {
    where: { id }
  });

  return await Class.findByPk(id);
};

/**
 * DELETE CLASS
 */
exports.delete = async (id) => {
  const classData = await Class.findByPk(id);

  if (!classData) {
    throw new Error("Class not found");
  }

  await Class.destroy({
    where: { id }
  });

  return true;
};