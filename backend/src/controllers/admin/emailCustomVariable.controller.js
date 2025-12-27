// controllers/admin/emailCustomVariable.controller.js

import asyncWrapper from '../../middlewares/error.handler.js';
import { utils } from '../../utils/index.js';
import EmailCustomVariableModel from '../../models/admin/emailCustomVariable.model.js';
import customVariableService from '../../services/email/customVariable.service.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';

const emailCustomVariableController = {
  // Lấy danh sách custom variables
  getAllVariables: asyncWrapper(async (req, res) => {
    try {
      console.log('🔍 [getAllVariables] Request received:', {
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
        body: req.body,
      });

      const { template_id, type, q, page, limit } = req.query;
      
      console.log('🔍 [getAllVariables] Parsed query params:', {
        template_id,
        type,
        q,
        page,
        limit,
      });

      // Build options - không validate, chỉ parse trực tiếp
      const options = {};

      // Xử lý template_id: nếu có giá trị thì parse, nếu là "null" string thì set null, nếu không có thì undefined
      if (template_id !== undefined && template_id !== null && template_id !== '') {
        if (template_id === 'null') {
          options.template_id = null; // Global variables
        } else {
          const parsed = parseInt(template_id);
          options.template_id = isNaN(parsed) ? undefined : parsed;
        }
      }

      if (type) options.type = type;
      if (q) options.q = q;

      // Parse pagination nếu có (không validate)
      if (page !== undefined && page !== null && page !== '') {
        const pageNum = parseInt(page);
        options.page = isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
      }
      if (limit !== undefined && limit !== null && limit !== '') {
        const limitNum = parseInt(limit);
        options.limit =
          isNaN(limitNum) || limitNum < 1 || limitNum > 100 ? 10 : limitNum;
      }

      console.log('🔍 [getAllVariables] Options built:', options);

      let variables;
      try {
        console.log('🔍 [getAllVariables] Calling model.getAllVariables...');
        variables = await EmailCustomVariableModel.getAllVariables(options);
        console.log('🔍 [getAllVariables] Model returned:', {
          count: variables?.length || 0,
          sample: variables?.slice(0, 2),
        });
      } catch (dbError) {
        console.error('Database error in getAllVariables:', dbError);
        // Nếu bảng chưa tồn tại, trả về mảng rỗng
        if (dbError.code === 'ER_NO_SUCH_TABLE') {
          console.warn('Table email_custom_variables does not exist yet. Returning empty array.');
          variables = [];
        } else {
          throw dbError;
        }
      }

      // Parse JSON fields với error handling
      const parsedVariables = variables.map((v) => {
        let dependencies = null;
        let helper_params = null;

        // Parse dependencies
        if (v.dependencies) {
          try {
            dependencies =
              typeof v.dependencies === 'string'
                ? JSON.parse(v.dependencies)
                : v.dependencies;
          } catch (error) {
            console.warn(
              `Error parsing dependencies for variable ${v.id}:`,
              error,
            );
            dependencies = null;
          }
        }

        // Parse helper_params
        if (v.helper_params) {
          try {
            helper_params =
              typeof v.helper_params === 'string'
                ? JSON.parse(v.helper_params)
                : v.helper_params;
          } catch (error) {
            console.warn(
              `Error parsing helper_params for variable ${v.id}:`,
              error,
            );
            helper_params = null;
          }
        }

        return {
          ...v,
          dependencies,
          helper_params,
        };
      });

      console.log('🔍 [getAllVariables] Parsed variables:', {
        count: parsedVariables?.length || 0,
      });

      return utils.success(res, 'Lấy danh sách custom variables thành công', {
        data: parsedVariables,
      });
    } catch (error) {
      console.error('❌ [getAllVariables] Error:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        error: error,
      });
      return utils.error(
        res,
        `Lỗi khi lấy danh sách custom variables: ${error.message}`,
        500,
      );
    }
  }),

  // Lấy custom variable theo ID
  getVariableById: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    const { id } = req.params;

    const variable = await EmailCustomVariableModel.getVariableById(id);
    if (!variable) {
      return utils.error(res, 'Custom variable không tồn tại', 404);
    }

    // Parse JSON fields
    const parsed = {
      ...variable,
      dependencies: variable.dependencies
        ? typeof variable.dependencies === 'string'
          ? JSON.parse(variable.dependencies)
          : variable.dependencies
        : null,
      helper_params: variable.helper_params
        ? typeof variable.helper_params === 'string'
          ? JSON.parse(variable.helper_params)
          : variable.helper_params
        : null,
    };

    return utils.success(res, 'Lấy custom variable thành công', {
      variable: parsed,
    });
  }),

  // Tạo custom variable mới
  createVariable: asyncWrapper(async (req, res) => {
    const {
      template_id,
      name,
      type = 'expression',
      description,
      expression,
      dependencies,
      helper_name,
      helper_params,
      return_type = 'string',
      is_active = true,
    } = req.body;

    // Validate required fields
    if (!name) {
      return utils.error(res, 'Tên biến là bắt buộc', 400);
    }

    if (type === 'expression' && !expression) {
      return utils.error(
        res,
        'Expression là bắt buộc khi type = expression',
        400,
      );
    }

    // Check duplicate name
    const existing = await EmailCustomVariableModel.getVariableByName(
      name,
      template_id || null,
    );
    if (existing) {
      return utils.error(
        res,
        `Biến "${name}" đã tồn tại cho template này`,
        400,
      );
    }

    // Validate expression nếu có
    if (expression) {
      const validation = customVariableService.validateExpression(expression);
      if (!validation.valid) {
        return utils.error(
          res,
          `Expression không hợp lệ: ${validation.error}`,
          400,
        );
      }

      // Auto-extract dependencies nếu không có
      if (!dependencies) {
        const autoDeps = customVariableService.extractDependencies(expression);
        req.body.dependencies = autoDeps;
      }
    }

    const userId = req.user?.id;
    const result = await EmailCustomVariableModel.createVariable({
      template_id: template_id || null,
      name,
      type,
      description,
      expression,
      dependencies:
        dependencies ||
        (expression
          ? customVariableService.extractDependencies(expression)
          : null),
      helper_name,
      helper_params,
      return_type,
      is_active,
      created_by: userId,
    });

    const newVariable = await EmailCustomVariableModel.getVariableById(
      result.insertId,
    );

    return utils.success(res, 'Tạo custom variable thành công', {
      variable: {
        ...newVariable,
        dependencies: newVariable.dependencies
          ? typeof newVariable.dependencies === 'string'
            ? JSON.parse(newVariable.dependencies)
            : newVariable.dependencies
          : null,
        helper_params: newVariable.helper_params
          ? typeof newVariable.helper_params === 'string'
            ? JSON.parse(newVariable.helper_params)
            : newVariable.helper_params
          : null,
      },
    });
  }),

  // Cập nhật custom variable
  updateVariable: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    const { id } = req.params;

    const variable = await EmailCustomVariableModel.getVariableById(id);
    if (!variable) {
      return utils.error(res, 'Custom variable không tồn tại', 404);
    }

    const {
      name,
      type,
      description,
      expression,
      dependencies,
      helper_name,
      helper_params,
      return_type,
      is_active,
    } = req.body;

    // Validate expression nếu có
    if (expression) {
      const validation = customVariableService.validateExpression(expression);
      if (!validation.valid) {
        return utils.error(
          res,
          `Expression không hợp lệ: ${validation.error}`,
          400,
        );
      }
    }

    // Check duplicate name nếu đổi tên
    if (name && name !== variable.name) {
      const existing = await EmailCustomVariableModel.getVariableByName(
        name,
        variable.template_id,
      );
      if (existing && existing.id !== parseInt(id)) {
        return utils.error(res, `Biến "${name}" đã tồn tại`, 400);
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (description !== undefined) updateData.description = description;
    if (expression !== undefined) {
      updateData.expression = expression;
      // Auto-extract dependencies nếu không có
      if (!dependencies && expression) {
        updateData.dependencies =
          customVariableService.extractDependencies(expression);
      }
    }
    if (dependencies !== undefined) updateData.dependencies = dependencies;
    if (helper_name !== undefined) updateData.helper_name = helper_name;
    if (helper_params !== undefined) updateData.helper_params = helper_params;
    if (return_type !== undefined) updateData.return_type = return_type;
    if (is_active !== undefined) updateData.is_active = is_active;

    await EmailCustomVariableModel.updateVariable(id, updateData);

    const updated = await EmailCustomVariableModel.getVariableById(id);

    return utils.success(res, 'Cập nhật custom variable thành công', {
      variable: {
        ...updated,
        dependencies: updated.dependencies
          ? typeof updated.dependencies === 'string'
            ? JSON.parse(updated.dependencies)
            : updated.dependencies
          : null,
        helper_params: updated.helper_params
          ? typeof updated.helper_params === 'string'
            ? JSON.parse(updated.helper_params)
            : updated.helper_params
          : null,
      },
    });
  }),

  // Xóa custom variable
  deleteVariable: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    const { id } = req.params;

    const variable = await EmailCustomVariableModel.getVariableById(id);
    if (!variable) {
      return utils.error(res, 'Custom variable không tồn tại', 404);
    }

    await EmailCustomVariableModel.deleteVariable(id);

    return utils.success(res, 'Xóa custom variable thành công');
  }),

  // Validate expression
  validateExpression: asyncWrapper(async (req, res) => {
    const { expression, sample_variables = {} } = req.body;

    if (!expression) {
      return utils.error(res, 'Expression là bắt buộc', 400);
    }

    // Validate syntax
    const validation = customVariableService.validateExpression(expression);
    if (!validation.valid) {
      return utils.success(res, 'Expression không hợp lệ', {
        valid: false,
        error: validation.error,
      });
    }

    // Extract dependencies
    const dependencies = customVariableService.extractDependencies(expression);

    // Test với sample variables nếu có
    let testResult = null;
    let testError = null;
    if (Object.keys(sample_variables).length > 0) {
      try {
        testResult = customVariableService.evaluateExpression(
          expression,
          sample_variables,
        );
      } catch (error) {
        testError = error.message;
      }
    }

    return utils.success(res, 'Validation thành công', {
      valid: true,
      dependencies,
      test_result: testResult,
      test_error: testError,
    });
  }),

  // Preview custom variable với sample data
  previewVariable: asyncWrapper(async (req, res) => {
    const { expression, sample_variables = {} } = req.body;

    if (!expression) {
      return utils.error(res, 'Expression là bắt buộc', 400);
    }

    try {
      const result = customVariableService.evaluateExpression(
        expression,
        sample_variables,
      );
      return utils.success(res, 'Preview thành công', {
        result,
        type: typeof result,
      });
    } catch (error) {
      return utils.error(res, `Lỗi khi preview: ${error.message}`, 400);
    }
  }),
};

export default emailCustomVariableController;
