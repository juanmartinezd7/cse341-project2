//src/config/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bookstore API",
      version: "1.0.0",
      description:
        "API for managing books, and authors in a simple bookstore."
    },
    servers: [
      {
        url: "http://localhost:{port}",
        description: "Local server",
        variables: {
          port: {
            default: "4000"
          }
        }
      },
      {
        url: "https://bookstore-api-qydz.onrender.com",
        description: "Production (Render)"
      }
    ],
    components: {
      schemas: {
        Book: {
          type: "object",
          required: ["title", "authorId", "price", "publishedYear"],
          properties: {
            _id: {
              type: "string",
              description: "MongoDB ObjectId"
            },
            title: {
              type: "string",
              example: "Node.js for Beginners"
            },
            authorId: {
              type: "string",
              description: "Author ObjectId",
              example: "6750000000000000000000a1"
            },
            price: {
              type: "number",
              example: 29.99
            },
            publishedYear: {
              type: "integer",
              example: 2023
            },
            genres: {
              type: "array",
              items: { type: "string" },
              example: ["Programming", "Web Development"]
            },
            inStock: {
              type: "boolean",
              example: true
            },
            rating: {
              type: "number",
              format: "float",
              example: 4.5
            }
          }
        },
        Author: {
          type: "object",
          required: ["name"],
          properties: {
            _id: {
              type: "string",
              description: "MongoDB ObjectId"
            },
            name: {
              type: "string",
              example: "Alice Johnson"
            },
            bio: {
              type: "string",
              example:
                "Alice is a software engineer specializing in Node.js and backend systems."
            },
            website: {
              type: "string",
              example: "https://alicejohnson.dev"
            },
            country: {
              type: "string",
              example: "USA"
            }
          }
        },
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string"
            },
            displayName: {
              type: "string",
              example: "Alice Johnson"
            },
            email: {
              type: "string",
              example: "alice@example.com"
            }
          }
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Something went wrong"
            },
            stack: {
              type: "string"
            }
          }
        }
      }
    }
  },
  // Where Swagger should look for JSDoc comments:
  apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
