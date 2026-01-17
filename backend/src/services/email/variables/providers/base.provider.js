/**
 * Base class cho các Variable Provider
 * Mọi Provider cần kế thừa class này
 */
class BaseVariableProvider {
    constructor() {
        if (this.constructor === BaseVariableProvider) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    /**
     * Trả về namespace của provider (ví dụ: 'user', 'event')
     * Dùng để tránh xung đột biến nếu cần (optional)
     */
    getNamespace() {
        return 'common';
    }

    /**
     * Hàm chính để lấy biến
     * @param {Object} context - Context chứa dữ liệu đầu vào (user, event_id, etc.)
     * @returns {Promise<Object>} Object chứa các biến và giá trị
     */
    async getVariables(context) {
        throw new Error("Method 'getVariables()' must be implemented.");
    }
}

export default BaseVariableProvider;
