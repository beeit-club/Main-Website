import * as dbConfig from './db.config.js';
import * as serverConfig from './db.config.js';
import * as jwt from './jwt.config.js';

// Gộp tất cả export từ các file con
export const config = {
  ...dbConfig,
  ...serverConfig,
  ...jwt,
};
