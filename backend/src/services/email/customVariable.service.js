// services/email/customVariable.service.js
// Service tính toán custom variables từ expressions

import { Parser } from 'expr-eval';
import EmailCustomVariableModel from '../../models/admin/emailCustomVariable.model.js';
import ServiceError from '../../error/service.error.js';

class CustomVariableService {
  constructor() {
    // Tạo parser với các operators tùy biến
    this.parser = new Parser({
      operators: {
        // Toán học
        add: true,
        subtract: true,
        multiply: true,
        divide: true,
        power: true,
        mod: true,
        // So sánh
        equal: true,
        notEqual: true,
        greaterThan: true,
        lessThan: true,
        greaterThanEqual: true,
        lessThanEqual: true,
        // Logic
        and: true,
        or: true,
        not: true,
      },
    });

    // Đăng ký custom functions
    this.registerCustomFunctions();
  }

  /**
   * Đăng ký các custom functions cho expression engine
   */
  registerCustomFunctions() {
    // IF function - Điều kiện
    this.parser.functions.IF = (condition, trueValue, falseValue) => {
      return condition ? trueValue : falseValue;
    };

    // CONCAT function - Nối chuỗi
    this.parser.functions.CONCAT = (...args) => {
      return args.map((arg) => String(arg || '')).join('');
    };

    // String functions - Xử lý chuỗi
    this.parser.functions.UPPER = (str) => {
      return String(str || '').toUpperCase();
    };

    this.parser.functions.LOWER = (str) => {
      return String(str || '').toLowerCase();
    };

    this.parser.functions.CAPITALIZE = (str) => {
      const s = String(str || '');
      return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    };

    this.parser.functions.LENGTH = (str) => {
      return String(str || '').length;
    };

    this.parser.functions.SUBSTRING = (str, start, length) => {
      const s = String(str || '');
      const startIdx = parseInt(start) || 0;
      const len = parseInt(length);
      if (len) {
        return s.substring(startIdx, startIdx + len);
      }
      return s.substring(startIdx);
    };

    // Format functions - Định dạng dữ liệu
    this.parser.functions.FORMAT_PHONE = (phone) => {
      if (!phone) return '';
      const cleaned = String(phone).replace(/\D/g, '');
      if (cleaned.length === 10) {
        return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
      }
      return phone;
    };

    this.parser.functions.FORMAT_DATE = (date, format = 'DD/MM/YYYY') => {
      if (!date) return '';
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';

      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();

      return format
        .replace('DD', day)
        .replace('MM', month)
        .replace('YYYY', year)
        .replace('YY', String(year).substring(2));
    };

    // Math functions - Toán học
    this.parser.functions.ROUND = (num, decimals = 0) => {
      return (
        Math.round(Number(num) * Math.pow(10, decimals)) /
        Math.pow(10, decimals)
      );
    };

    this.parser.functions.FLOOR = (num) => {
      return Math.floor(Number(num));
    };

    this.parser.functions.CEIL = (num) => {
      return Math.ceil(Number(num));
    };

    // Date functions - Xử lý ngày tháng
    this.parser.functions.NOW = () => {
      return new Date();
    };

    this.parser.functions.TODAY = () => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    };

    this.parser.functions.YEAR = (date) => {
      if (!date) return null;
      const d = new Date(date);
      return isNaN(d.getTime()) ? null : d.getFullYear();
    };

    this.parser.functions.MONTH = (date) => {
      if (!date) return null;
      const d = new Date(date);
      return isNaN(d.getTime()) ? null : d.getMonth() + 1;
    };

    this.parser.functions.DAY = (date) => {
      if (!date) return null;
      const d = new Date(date);
      return isNaN(d.getTime()) ? null : d.getDate();
    };

    // Hours function - Lấy giờ hiện tại (dùng cho greeting)
    this.parser.functions.HOURS = () => {
      return new Date().getHours();
    };
  }

  /**
   * Evaluate một expression với variables
   * @param {string} expression - Expression string
   * @param {Object} variables - Variables object
   * @returns {*} Kết quả evaluate
   */
  evaluateExpression(expression, variables = {}) {
    try {
      const expr = this.parser.parse(expression);
      return expr.evaluate(variables);
    } catch (error) {
      throw new ServiceError(
        `Lỗi khi evaluate expression "${expression}"`,
        'EXPRESSION_EVALUATE_FAILED',
        error.message,
        400,
      );
    }
  }

  /**
   * Lấy tất cả custom variables cho một template
   * @param {number|null} templateId - Template ID hoặc null cho global
   * @returns {Promise<Array>} Danh sách custom variables
   */
  async getVariablesForTemplate(templateId = null) {
    try {
      return await EmailCustomVariableModel.getVariablesForTemplate(templateId);
    } catch (error) {
      throw new ServiceError(
        'Lấy custom variables thất bại',
        'GET_CUSTOM_VARIABLES_FAILED',
        error.message,
        500,
      );
    }
  }

  /**
   * Tính toán và merge custom variables vào variables object
   * @param {Object} baseVariables - Base variables từ user data
   * @param {number|null} templateId - Template ID
   * @returns {Promise<Object>} Variables đã merge với custom variables
   */
  async computeCustomVariables(baseVariables, templateId = null) {
    try {
      // 1. Lấy custom variables (global + template-specific)
      const customVars = await this.getVariablesForTemplate(templateId);

      if (customVars.length === 0) {
        return baseVariables;
      }

      // 2. Tạo map để resolve dependencies
      const varMap = new Map();
      const computed = { ...baseVariables };

      // 3. Parse dependencies và tạo dependency graph
      const dependencies = {};
      customVars.forEach((cv) => {
        const deps = cv.dependencies
          ? typeof cv.dependencies === 'string'
            ? JSON.parse(cv.dependencies)
            : cv.dependencies
          : [];
        dependencies[cv.name] = deps;
        varMap.set(cv.name, cv);
      });

      // 4. Topological sort để tính toán theo thứ tự dependencies
      const sorted = this.topologicalSort(dependencies);

      // 5. Evaluate từng variable theo thứ tự
      for (const varName of sorted) {
        const customVar = varMap.get(varName);
        if (!customVar) continue;

        try {
          // Validate dependencies trước khi evaluate
          if (customVar.type === 'expression' && customVar.expression) {
            const deps = customVar.dependencies
              ? typeof customVar.dependencies === 'string'
                ? JSON.parse(customVar.dependencies)
                : customVar.dependencies
              : [];

            // Kiểm tra xem tất cả dependencies có sẵn không
            const missingDeps = deps.filter((dep) => !(dep in computed));
            if (missingDeps.length > 0) {
              console.warn(
                `Custom variable "${varName}" bị bỏ qua: thiếu dependencies: ${missingDeps.join(', ')}`,
              );
              continue; // Skip variable nếu thiếu dependencies
            }
          }

          let value;

          if (customVar.type === 'expression' && customVar.expression) {
            // Evaluate expression
            value = this.evaluateExpression(customVar.expression, computed);
          } else if (customVar.type === 'helper' && customVar.helper_name) {
            // Helper-based (sẽ implement sau)
            value = this.evaluateHelper(
              customVar.helper_name,
              customVar.helper_params,
              computed,
            );
          } else {
            continue; // Skip invalid variables
          }

          // Convert type nếu cần
          value = this.convertType(value, customVar.return_type);

          // Thêm vào computed (có thể override base variables)
          computed[varName] = value;
        } catch (error) {
          // Chỉ log warning, không throw error để không làm gián đoạn quá trình render
          console.warn(
            `Lỗi khi tính toán custom variable "${varName}": ${error.message}. Variable sẽ bị bỏ qua.`,
          );
          // Skip variable nếu có lỗi
        }
      }

      return computed;
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Tính toán custom variables thất bại',
        'COMPUTE_CUSTOM_VARIABLES_FAILED',
        error.message,
        500,
      );
    }
  }

  /**
   * Evaluate helper function (placeholder for future)
   * @param {string} helperName - Tên helper
   * @param {Object} helperParams - Tham số helper
   * @param {Object} variables - Variables
   * @returns {*} Giá trị helper
   */
  evaluateHelper(helperName, helperParams, variables) {
    // TODO: Implement helper evaluation
    // Hiện tại, return null
    return null;
  }

  /**
   * Convert value to specified type
   * @param {*} value - Giá trị cần convert
   * @param {string} returnType - Kiểu dữ liệu mong muốn
   * @returns {*} Giá trị đã convert
   */
  convertType(value, returnType) {
    if (value === null || value === undefined) {
      return null;
    }

    switch (returnType) {
      case 'string':
        return String(value);
      case 'number':
        return Number(value) || 0;
      case 'boolean':
        return Boolean(value);
      case 'date':
        return value instanceof Date ? value : new Date(value);
      default:
        return value;
    }
  }

  /**
   * Topological sort để resolve dependencies
   * @param {Object} dependencies - Dependency graph: { varName: [deps] }
   * @returns {Array<string>} Danh sách variables đã sắp xếp theo thứ tự dependencies
   */
  topologicalSort(dependencies) {
    const sorted = [];
    const visited = new Set();
    const visiting = new Set();

    const visit = (node) => {
      if (visiting.has(node)) {
        throw new ServiceError(
          `Phát hiện circular dependency liên quan đến "${node}"`,
          'CIRCULAR_DEPENDENCY',
          null,
          400,
        );
      }
      if (visited.has(node)) {
        return;
      }

      visiting.add(node);
      const deps = dependencies[node] || [];
      for (const dep of deps) {
        if (dependencies[dep]) {
          visit(dep);
        }
      }
      visiting.delete(node);
      visited.add(node);
      sorted.push(node);
    };

    for (const node of Object.keys(dependencies)) {
      if (!visited.has(node)) {
        visit(node);
      }
    }

    return sorted;
  }

  /**
   * Validate expression syntax
   * @param {string} expression - Expression string
   * @returns {Object} { valid: boolean, error?: string }
   */
  validateExpression(expression) {
    try {
      this.parser.parse(expression);
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error.message,
      };
    }
  }

  /**
   * Extract dependencies từ expression
   * @param {string} expression - Expression string
   * @returns {Array<string>} Danh sách dependencies
   */
  extractDependencies(expression) {
    try {
      const expr = this.parser.parse(expression);
      const variables = expr.variables();
      return Array.from(variables);
    } catch (error) {
      return [];
    }
  }
}

export default new CustomVariableService();
