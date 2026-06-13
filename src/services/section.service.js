const { Section } = require("../models");
const { Op } = require("sequelize");

/**
 * CREATE SECTION
 */
exports.create = async (payload) => {
  const section = await Section.create({
    school_id: payload.school_id,
    class_id: payload.class_id,
    section_name: payload.section_name,
    status: payload.status
  });

  return section;
};

/**
 * GET ALL SECTIONS
 */
exports.getAll = async (
  page,
  limit,
  search,
  sortBy,
  order,
  school_id,
  class_id
) => {
  const offset = (page - 1) * limit;

  const where = {};

  if (school_id) {
    where.school_id = school_id;
  }

  if (class_id) {
    where.class_id = class_id;
  }

  if (search) {
    where[Op.or] = [
      {
        section_name: {
          [Op.like]: `%${search}%`
        }
      }
    ];
  }

  const allowedSortFields = [
    "id",
    "section_name",
    "status",
    "createdAt",
    "updatedAt"
  ];

  const sortField = allowedSortFields.includes(sortBy)
    ? sortBy
    : "id";

  const sortOrder =
    order?.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const { count, rows } = await Section.findAndCountAll({
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
 * GET SECTION BY ID
 */
exports.getById = async (id) => {
  const section = await Section.findByPk(id);

  if (!section) {
    throw new Error("Section not found");
  }

  return section;
};

/**
 * UPDATE SECTION
 */
exports.update = async (id, payload) => {
  const section = await Section.findByPk(id);

  if (!section) {
    throw new Error("Section not found");
  }

  await Section.update(payload, {
    where: { id }
  });

  return await Section.findByPk(id);
};

/**
 * DELETE SECTION
 */
exports.delete = async (id) => {
  const section = await Section.findByPk(id);

  if (!section) {
    throw new Error("Section not found");
  }

  await Section.destroy({
    where: { id }
  });

  return true;
};