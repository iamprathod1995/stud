const express = require("express");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const securityMiddleware =
require("./middlewares/security.middleware");

const errorMiddleware =
require("./middlewares/error.middleware");

// Optional Step 7 additions
const requestLogger =
require("./middlewares/request-logger.middleware");

const rateLimit =
require("./middlewares/rate-limit.middleware");

const app = express();

/**
 * =========================
 * SECURITY MIDDLEWARE
 * =========================
 */
securityMiddleware(app);

/**
 * =========================
 * BASIC MIDDLEWARES
 * =========================
 */
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

/**
 * =========================
 * REQUEST LOGGING (AUDIT BASE)
 * =========================
 */
app.use(requestLogger);

/**
 * =========================
 * RATE LIMITING
 * =========================
 */
app.use(rateLimit);

/**
 * =========================
 * LOGGER
 * =========================
 */
app.use(morgan("dev"));

/**
 * =========================
 * HEALTH CHECK
 * =========================
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Enterprise RBAC API Running"
  });
});

/**
 * =========================
 * ROUTES
 * =========================
 */
const authRoutes =
require("./routes/auth.routes");

const roleRoutes =
require("./routes/role.routes");

const moduleRoutes =
require("./routes/module.routes");

const permissionRoutes =
require("./routes/permission.routes");

const userRoutes =
require("./routes/user.routes");

app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/users", userRoutes);

/**
 * =========================
 * SWAGGER
 * =========================
 */
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

/**
 * =========================
 * ERROR HANDLER (LAST)
 * =========================
 */
app.use(errorMiddleware);

module.exports = app;