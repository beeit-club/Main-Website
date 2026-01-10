// Import env.config đầu tiên để đảm bảo dotenv được load trước
import './env.config.js';

// Sau đó import các config khác
import * as dbConfig from './db.config.js';
import * as serverConfig from './server.config.js';
import * as jwt from './jwt.config.js';
import { mailConfig } from './mail.config.js';
import { emailConfig } from './email.config.js';

// Gộp tất cả export từ các file con
export const config = {
  ...dbConfig,
  ...serverConfig,
  ...jwt,
  mailConfig,
  emailConfig,
};
