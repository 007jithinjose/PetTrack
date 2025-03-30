//File: src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PetTrack API Documentation',
      version,
      description: 'API documentation for PetTrack backend services',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Local server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts', './src/schemas/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: any, port: number) {
  // Swagger page
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get('/api/v1/docs.json', (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`Docs available at http://localhost:${port}/api/v1/docs`);
}

export default swaggerDocs;