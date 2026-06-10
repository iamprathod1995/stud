const { School } =
  require("../models");
const { Op } =
  require("sequelize");
const userService = require("./user.service");
const { hashPassword } = require("../utils/password");
exports.create = async (payload) => {
  const hashedPassword =
    await hashPassword(
      payload.password,
    );
  const user = await userService.create({
    name: payload.owner_name,
    email: payload.email,
    password: hashedPassword,
    role_id: 2,
  });




  const school = await School.create({
    school_name: payload.school_name,
    address: payload.address,
    school_logo: payload.school_logo,
    contact_number: payload.contact_number,
    email: payload.email,
    address: payload.address,
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

    await School.update(
      payload
    );

    return school;

  };

exports.delete =
  async (id) => {

    const school =
      await School.findByPk(id);

    if (!school) {
      throw new Error(
        "School not found"
      );
    }

    await School.destroy();

    return true;

  };