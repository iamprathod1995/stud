const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");

const securityMiddleware = (app) => {
  app.use(helmet());

  app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }));
  app.use(compression());

  app.use(hpp());

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: "Too many requests"
      }
    })
  );
};

module.exports = securityMiddleware;