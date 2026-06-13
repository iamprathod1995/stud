const {
  User,
  RefreshToken
} = require("../models");

const {
  hashPassword,
  comparePassword
} = require("../utils/password");

const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/jwt");

class AuthService {

  async register(data) {

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
        password: hashedPassword,
        role_id: data.role_id
      });

    return user;
  }

  async login(email, password) {
  
    const user =
      await User.findOne({
        where: { email }
      });

    if (!user) {
      throw new Error(
        "Invalid credentials"
      );
    }


    const isMatch =
      await comparePassword(
        password,
        user.password
      );

  
    console.log("DB PASSWORD:", user.password);
    console.log("MATCH:", isMatch);
    if (!isMatch) {
      throw new Error(
        "Invalid credentials"
      );
    }

    const accessToken =
      generateAccessToken(user);

    const refreshToken =
      generateRefreshToken(user);

    await RefreshToken.create({
      user_id: user.id,
      token: refreshToken,
      expires_at:
        new Date(
          Date.now() +
          30 * 24 * 60 * 60 * 1000
        )
    });

    // const hashedPassword =
    // await hashPassword("School@123");

    return {
      user,
      accessToken,
      refreshToken
    };
  }

  async logout(token) {

    await RefreshToken.destroy({
      where: { token }
    });

    return true;
  }

}

module.exports =
  new AuthService();