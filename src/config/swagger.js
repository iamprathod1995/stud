const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RBAC API",
      version: "1.0.2",
      description: "Role Permission Management API"
    },
    servers: [
      {
        url: "https://stud-tnyk.onrender.com/"
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },

  apis: [
    "./src/routes/*.js"
  ]
};

module.exports = swaggerJsdoc(options);