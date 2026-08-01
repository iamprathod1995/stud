const { School } =
  require("../models");
const { Op } =
  require("sequelize");
const path = require("path");
const userService = require("./user.service");
const { hashPassword } = require("../utils/password");
const ALLOWED_ROLE_IDS = [2, 3, 4];
const fs = require("fs");

exports.create = async (payload) => {
  const roleId = Number(payload.role_id);

  if (!ALLOWED_ROLE_IDS.includes(roleId)) {
    throw new Error("Invalid role_id. Allowed roles are 2, 3, 4");
  }

  const user = await userService.create({
    name: payload.owner_name,
    email: payload.email,
    password: payload.password,
    role_id: roleId,
  });

  const school = await School.create({
    school_name: payload.school_name,
    address: payload.address,
    school_logo: payload.school_logo,
    contact_number: payload.contact_number,
    email: payload.email,
    status: payload.status,
    user_id: user.id,
    owner_name: payload.owner_name
  });

  return school;
};





exports.getAll = async (
  page,
  limit,
  search,
  sortBy,
  order
) => {
  const offset = (page - 1) * limit;

  const where = {};

  if (search) {
    where[Op.or] = [
      {
        school_name: {
          [Op.like]: `%${search}%`
        }
      },
      {
        owner_name: {
          [Op.like]: `%${search}%`
        }
      },
      {
        contact_number: {
          [Op.like]: `%${search}%`
        }
      }
    ];
  }

  // Allowed columns for sorting
  const allowedSortFields = [
    "id",
    "school_name",
    "owner_name",
    "contact_number",
    "createdAt",
    "updatedAt",
    "status"
  ];

  const sortField = allowedSortFields.includes(sortBy)
    ? sortBy
    : "id";

  const sortOrder =
    order?.toUpperCase() === "ASC"
      ? "ASC"
      : "DESC";

  const { count, rows } =
    await School.findAndCountAll({
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

exports.getById =
  async (id) => {

    const school =
      await School.findByPk(id);

    if (!school) {
      throw new Error(
        "School not found"
      );
    }

    return school;

  };

exports.update =
  async (id, payload) => {

    const school =
      await School.findByPk(id);

    if (!school) {
      throw new Error(
        "School not found"
      );
    }

    await School.update(payload, {
      where: { id }
    });
    return school;

  };

exports.delete = async (id) => {
  const school = await School.findByPk(id);

  if (!school) {
    throw new Error("School not found");
  }

  // 1. build folder path
  const folderPath = path.join(
    process.cwd(),
    "uploads",
    "schools",
    `school_${school.id}`
  );

  // 2. delete folder if exists
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
  }

  // 3. delete DB record
  await School.destroy({
    where: { id: school.id }
  });

  return true;
};