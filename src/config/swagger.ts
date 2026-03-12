import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book Catalog Service',
      version: '1.0.0',
      description: 'API documentation for the Bookstore Book Catalog microservice',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local development',
      },
      /* {
        url: 'https://your-service.onrender.com', // update when deployed
        description: 'Production',
      }, */
    ],
  },
  apis: ['./src/routes/*.ts'], // swagger reads comments from your route files
};

export const swaggerSpec = swaggerJsdoc(options);