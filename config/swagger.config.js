import SwaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    info: {
      title: 'LOCAL MARK API',
      version: '1.0.0',
      description: 'LOCAL MARK API with express, API 설명',
    },
    host: 'umc.localmark.store',
    basePath: '/', // basePath는 '/'로 설정하는 것이 일반적입니다.
    securityDefinitions: {
      Authorization: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
      },
    },
  },
  apis: ['./src/routes/*.js', './swagger/*'],
};

const specs = SwaggerJsdoc(options);

export default specs;