import {
  findOne,
  insert,
  selectWithPagination,
  update,
} from '../../utils/database.js';

const TABLE = 'transactions';
class transactionModel {
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
    transactions t
LEFT JOIN 
    users u1 ON t.created_by = u1.id
LEFT JOIN 
    users u2 ON t.updated_by = u2.id`;
    let params = [];
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
    transactions t
LEFT JOIN 
    users u1 ON t.created_by = u1.id
LEFT JOIN 
    users u2 ON t.updated_by = u2.id`;
    return await findOne(sql, { id });
  }
  static async create(data) {
    return insert(TABLE, data);
  }
  static async update(id, data) {
    return update(TABLE, data, { id });
  }
}
export default transactionModel;
