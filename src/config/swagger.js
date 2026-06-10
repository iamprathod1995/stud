const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RBAC API",
      version: "1.0.1",
      description: "Role Permission Management API"
    },
    // servers: [
    //   {
    //     url: process.env.BASE_URL || "http://localhost:5000"
    //   }
    // ],
    servers: [
      {
        url:"http://localhost:5000"
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