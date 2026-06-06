require("dotenv").config();

const app = require("./src/app");

const sequelize = require(
  "./src/config/database"
);

const logger = require(
  "./src/config/logger"
);

const PORT =
  process.env.PORT || 3000;

(async () => {
  try {

    await sequelize.authenticate();

    logger.info(
      "Database Connected Successfully"
    );

    app.listen(PORT, () => {
      logger.info(
        `Server running on port ${PORT}`
      );
    });

  } catch (error) {

   console.error("DATABASE ERROR:", error);
  logger.error(error);
  process.exit(1);
  }
})();