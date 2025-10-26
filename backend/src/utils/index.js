// Chứa các hàm tiện ích nhỏ, dùng chung
import * as date from './datetime.js';
import * as validate from './validate.js';
import * as res from './response.js';
import * as func from './function.js';
import * as db from './database.js';

export const utils = {
  ...date,
  ...validate,
  ...res,
  ...func,
  ...db,
};
