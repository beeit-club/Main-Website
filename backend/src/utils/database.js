import pool from '../db.js';

function validateInput(table, data, where) {
  if (!table || typeof table !== 'string')
    throw new Error('Tên bảng (table) không hợp lệ');

  if (data && typeof data !== 'object')
    throw new Error('Dữ liệu (data) phải là object');

  if (where && typeof where !== 'object')
    throw new Error('Điều kiện (where) phải là object');
}
/**
 * Thêm một bản ghi mới vào bảng
 * @param {string} table - Tên bảng cần thêm dữ liệu
 * @param {Object} data - Dữ liệu cần thêm, dạng { cột: giá trị }
 * @returns {Promise<number>} - ID của bản ghi vừa được thêm
 */
export async function insert(table, data) {
  validateInput(table, data);

  const fields = Object.keys(data);
  if (fields.length === 0) throw new Error('Không có dữ liệu để insert');

  const values = Object.values(data);
  const placeholders = fields.map(() => '?').join(', ');

  const sql = `INSERT INTO \`${table}\` (${fields
    .map((f) => `\`${f}\``)
    .join(', ')}) VALUES (${placeholders})`;

  const [result] = await pool.query(sql, values);
  return result;
}
/**
 * Cập nhật bản ghi trong bảng theo điều kiện
 * @param {string} table - Tên bảng cần cập nhật
 * @param {Object} data - Dữ liệu cần cập nhật, dạng { cột: giá trị }
 * @param {Object} where - Điều kiện cập nhật, dạng { cột: giá trị }
 * @returns {Promise<number>} - Số bản ghi bị ảnh hưởng (affectedRows)
 */
export async function update(table, data, where) {
  validateInput(table, data, where);

  const fields = Object.keys(data);
  const whereKeys = Object.keys(where);

  if (fields.length === 0) throw new Error('Không có dữ liệu để update');
  if (whereKeys.length === 0) throw new Error('Update phải có điều kiện WHERE');

  const setClause = fields.map((f) => `\`${f}\` = ?`).join(', ');
  const whereClause = whereKeys.map((f) => `\`${f}\` = ?`).join(' AND ');

  const sql = `UPDATE \`${table}\` SET ${setClause} WHERE ${whereClause}`;
  const values = [...Object.values(data), ...Object.values(where)];

  const [result] = await pool.query(sql, values);
  return result.affectedRows;
}
/**
 * Xóa bản ghi trong bảng theo điều kiện
 * @param {string} table - Tên bảng cần xóa
 * @param {Object} where - Điều kiện xóa, dạng { cột: giá trị }
 * @returns {Promise<number>} - Số bản ghi bị xóa (affectedRows)
 */
export async function remove(table, where) {
  validateInput(table, null, where);

  const whereKeys = Object.keys(where);
  if (whereKeys.length === 0) throw new Error('DELETE phải có điều kiện WHERE');

  const whereClause = whereKeys.map((f) => `\`${f}\` = ?`).join(' AND ');
  const sql = `DELETE FROM \`${table}\` WHERE ${whereClause}`;

  const [result] = await pool.query(sql, Object.values(where));
  return result.affectedRows;
}

/**
 * Truy vấn dữ liệu có phân trang
 * @param {string} baseSql - Câu SQL gốc (SELECT ... FROM ...)
 * @param {Array} [params=[]] - Mảng giá trị truyền vào cho dấu ?
 * @param {Object} [options={}] - Các tùy chọn phân trang
 * @param {number} [options.page=1] - Trang hiện tại
 * @param {number} [options.limit=10] - Số bản ghi mỗi trang
 * @param {Object} [options.orderBy] - Tùy chọn sắp xếp
 * @param {string} [options.orderBy.field] - Tên cột để sắp xếp
 * @param {'ASC'|'DESC'} [options.orderBy.direction='ASC'] - Chiều sắp xếp (tăng/giảm)
 * @returns {Promise<{ data: Array, pagination: { page: number, limit: number, total: number, totalPages: number } }>}
 * - Kết quả truy vấn và thông tin phân trang
 */
export async function selectWithPagination(baseSql, params = [], options = {}) {
  if (!baseSql || typeof baseSql !== 'string') {
    throw new Error('Phải truyền vào câu SQL dạng chuỗi');
  }

  const { page = 1, limit = 10, orderBy = null } = options;

  // --- Tính toán trang và offset ---
  const currentPage = Number.isInteger(page) && page > 0 ? page : 1;
  const perPage = Number.isInteger(limit) && limit > 0 ? limit : 10;
  const offset = (currentPage - 1) * perPage;

  // --- Câu lệnh SELECT chính ---
  let dataSql = baseSql.trim();

  // Nếu có orderBy
  if (orderBy && typeof orderBy === 'object') {
    const { field, direction = 'ASC' } = orderBy;
    if (!field || typeof field !== 'string') {
      throw new Error('orderBy.field phải là chuỗi hợp lệ');
    }
    const dir = direction.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    dataSql += ` ORDER BY \`${field}\` ${dir}`;
  }

  dataSql += ` LIMIT ${perPage} OFFSET ${offset}`;

  // --- Câu lệnh đếm tổng số bản ghi ---
  // Bỏ ORDER BY nếu có (vì không cần thiết trong COUNT)
  const countSql = `SELECT COUNT(*) as total FROM (${baseSql}) AS subquery`;

  // --- Chạy truy vấn ---
  const [[{ total }]] = await pool.query(countSql, params);
  const [rows] = await pool.query(dataSql, params);

  // --- Tính toán thông tin phân trang ---
  const totalPages = Math.ceil(total / perPage);

  return {
    data: rows,
    pagination: {
      page: currentPage,
      limit: perPage,
      total,
      totalPages,
    },
  };
}
/**
 * Lấy ra 1 bản ghi duy nhất từ câu truy vấn
 * @param {string} sql - Câu lệnh SQL (SELECT ...)
 * @param {Array} [params=[]] - Mảng giá trị truyền vào cho dấu ?
 * @returns {Promise<Object|boolean>} - Trả về bản ghi đầu tiên nếu có, ngược lại trả về false
 */
export async function findOne(sql, params = []) {
  if (!sql || typeof sql !== 'string') {
    throw new Error('Phải truyền vào câu SQL dạng chuỗi');
  }

  // Giới hạn chỉ lấy 1 bản ghi
  let finalSql = sql.trim();
  if (!/limit\s+\d+/i.test(finalSql)) {
    finalSql += ' LIMIT 1';
  }

  const [rows] = await pool.query(finalSql, params);

  // Nếu có ít nhất 1 dòng thì trả dòng đầu tiên, ngược lại trả false
  return rows.length > 0 ? rows[0] : false;
}
