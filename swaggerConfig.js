// swaggerConfig.js
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'API for NTC Bus Seat Reservation System. (WEB API 23.2) Created By H.G.D.N.S.Ariyarathna',
    },
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsDoc(options);
