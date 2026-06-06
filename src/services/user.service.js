const { Op } = require("sequelize");

const {
  User,
  Role
} = require("../models");

const {
  hashPassword
} = require("../utils/password");

class UserService {

  async create(data) {

    const existingUser =
      await User.findOne({
        where: {
          email: data.email
        }
      });

    if (existingUser) {
      throw new Error(
        "Email already exists"
      );
    }

    const hashedPassword =
      await hashPassword(
        data.password
      );

    const user =
      await User.create({

        name: data.name,
        email: data.email,
        password:
          hashedPassword,
        role_id:
          data.role_id,
        status:
          data.status ?? true

      });

    return user;
  }

  async getAll(
    page,
    limit,
    search
  ) {

    const offset =
      (page - 1) * limit;

    const where = {};

    if (search) {

      where[Op.or] = [

        {
          name: {
            [Op.like]:
            `%${search}%`
          }
        },

        {
          email: {
            [Op.like]:
            `%${search}%`
          }
        }

      ];

    }

    const {
      count,
      rows
    } =
      await User.findAndCountAll({

        where,

        offset,

        limit,

        attributes: {
          exclude: [
            "password"
          ]
        },

        include: [
          {
            model: Role,
            as: "role"
          }
        ],

        order: [
          ["id", "DESC"]
        ]

      });

    return {

      total: count,
      page,
      limit,
      totalPages:
        Math.ceil(
          count / limit
        ),
      data: rows

    };

  }

}

module.exports =
new UserService();