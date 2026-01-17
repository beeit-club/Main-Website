import systemProvider from './providers/system.provider.js';
import userProvider from './providers/user.provider.js';

import pool from '../../../db.js';

class VariableManager {
    constructor() {
        this.providers = [
            systemProvider,
            userProvider
            // Sau này sẽ push thêm: eventProvider, orderProvider...
        ];
    }

    /**
     * Đăng ký thêm provider động (nếu cần)
     */
    registerProvider(provider) {
        this.providers.push(provider);
    }

    /**
     * Tổng hợp tất cả biến từ các providers dựa trên context
     * @param {Object} context - Dữ liệu ngữ cảnh (user, event, order...)
     * @returns {Promise<Object>} Tất cả biến đã được merge
     */
    async getVariables(context = {}) {
        let allVariables = {};

        // Chạy song song các provider để tối ưu hiệu năng
        const results = await Promise.all(
            this.providers.map(provider => provider.getVariables(context))
        );

        // Merge kết quả
        results.forEach(vars => {
            allVariables = { ...allVariables, ...vars };
        });

        // Merge thêm các biến custom truyền trực tiếp từ context (độ ưu tiên cao nhất)
        if (context.customVariables) {
            allVariables = { ...allVariables, ...context.customVariables };
        } else {
             // Fallback: merge flat properties từ context
             const { user, ...rest } = context;
             allVariables = { ...allVariables, ...rest };
        }

        return allVariables;
    }
    
    /**
     * Lấy danh sách định nghĩa biến từ Database
     * Dùng cho UI Variable Picker
     */
    async getVariableDefinitions() {
        try {
            const [rows] = await pool.query(
                "SELECT * FROM email_variable_definitions ORDER BY is_system DESC, `key` ASC"
            );
            return rows;
        } catch (error) {
            console.error('Error fetching variable definitions:', error);
            return [];
        }
    }
}

export default new VariableManager();
