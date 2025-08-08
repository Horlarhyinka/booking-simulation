
import swaggerJSDoc from 'swagger-jsdoc';
import { envVars } from './envvars';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Booking Simulation API',
    version: '1.0.0',
    description: 'API documentation for Booking Simulation API',
  },
  servers: [
    {
      url: `${envVars.HOST}/api`,
      description: 'Local server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
