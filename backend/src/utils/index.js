// Chứa các hàm tiện ích nhỏ, dùng chung
import * as date from './datetime.js';
import * as validate from './validate.js';

export const utils = {
  ...date,
  ...validate,
};
