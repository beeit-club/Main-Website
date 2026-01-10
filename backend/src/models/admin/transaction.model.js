import {
  findOne,
  insert,
  selectWithPagination,
  update,
} from '../../utils/database.js';

const TABLE = 'transactions';
class transactionModel {
  // Lấy tất cả giao dịch với lọc và phân trang và tìm kiếm
  static async getAll(options = {}) {
    let sql = `SELECT 
    t.id,
    t.amount,
    t.type,
    t.description,
    t.attachment_url,
    t.created_by,
    t.updated_by,
    t.created_at,
    t.updated_at,
    u1.fullname AS created_by_name,
    u2.fullname AS updated_by_name
FROM 
    ${TABLE} t
LEFT JOIN 
    users u1 ON t.created_by = u1.id
LEFT JOIN 
    users u2 ON t.updated_by = u2.id 
WHERE 1=1`;
    let params = [];
    if (options?.filters?.search) {
      sql += ` AND ( t.description LIKE ? OR u1.fullname LIKE ? OR u2.fullname LIKE ?)`;
      params.push(`%${options?.filters?.search}%`);
      params.push(`%${options?.filters?.search}%`);
      params.push(`%${options?.filters?.search}%`);
    }
    if (options?.filters?.type) {
      sql += ` AND t.type = ?`;
      params.push(options?.filters?.type);
    }
    if (options?.filters?.sortBy && options?.filters?.sortDirection) {
      options.orderBy = {
        field: options?.filters?.sortBy,
        direction: options?.filters?.sortDirection || 'DESC',
      };
    }

    return await selectWithPagination(sql, params, options);
  }
  // tìm chi tiết các giao dịch theo id
  static async getById(id) {
    const sql = `SELECT 
    t.id,
    t.amount,
    t.type,
    t.description,
    t.attachment_url,
    t.created_by,
    t.updated_by,
    t.created_at,
    t.updated_at,
    u1.fullname AS created_by_name,
    u2.fullname AS updated_by_name
FROM 
    ${TABLE} t
LEFT JOIN 
    users u1 ON t.created_by = u1.id
LEFT JOIN 
    users u2 ON t.updated_by = u2.id
    WHERE t.id = ?`;
    return await findOne(sql, [id]);
  }
  // tạo giao dịch
  static async create(data) {
    return insert(TABLE, data);
  }
  // cập nhật giao dịch
  static async update(id, data) {
    return update(TABLE, data, { id });
  }
  // tính toán tổng số dư từ các giao dịch
  static async caculateBalance() {
    const sql = `SELECT 
        COALESCE(SUM(CASE WHEN type = 1 THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type = 2 THEN amount ELSE 0 END), 0) as total_expense,
        COALESCE(SUM(CASE WHEN type = 1 THEN amount ELSE 0 END), 0) - 
        COALESCE(SUM(CASE WHEN type = 2 THEN amount ELSE 0 END), 0) as balance,
        COUNT(*) as total_transactions
      FROM transactions`;
    const result = await findOne(sql, []);

    return result;
  }
}
export default transactionModel;
