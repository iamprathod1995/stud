const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role_id: user.role_id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d"
    }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken
};