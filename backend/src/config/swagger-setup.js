import swaggerAutogen from 'swagger-autogen';
import { config } from './index.js';

const { DB_HOST, PORT } = config;

// ✅ Tạo instance một lần duy nhất
const swaggerAutogenInstance = swaggerAutogen({ autoBody: true });

// ✅ Đường dẫn tới file JSON đầu ra và routes
const outputFile = './src/config/swagger-output.json';
const endpointsFiles = ['./src/routers/index.js'];

// ✅ Cấu hình thông tin hiển thị
const swaggerConfig = {
  info: {
    title: 'Backend API BEE IT',
    description: 'API WEB BEE IT',
    version: '1.0.0',
  },
  host: `${DB_HOST}:${PORT}`,
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Nhập token theo format: Bearer <token>',
    },
  },
};

// ✅ Gọi đúng cú pháp
swaggerAutogenInstance(outputFile, endpointsFiles, swaggerConfig).then(() => {
  console.log('✅ Swagger JSON file generated successfully!');
});
