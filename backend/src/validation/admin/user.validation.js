import * as yup from 'yup';

const Schema = {
  // /users/:id
  param: yup.object({
    id: yup
      .number()
      .typeError('Id phải là số')
      .integer('Id phải là số nguyên')
      .min(1, 'Id phải >= 1')
      .required('Thiếu id'),
  }),

  // POST /users
  createUser: yup.object({
    fullname: yup
      .string()
      .required('Tên là bắt buộc')
      .min(4, 'Tên tối thiểu 4 ký tự')
      .max(25, 'Tên tối đa 25 ký tự'),
    email: yup
      .string()
      .email('Email không hợp lệ')
      .required('Email là bắt buộc'),
    phone: yup.string().optional(),
    avatar_url: yup.string().optional(),
    role_id: yup.number().integer().optional(),
  }),

  // PUT /users/:id
  updateUser: yup.object({
    fullname: yup
      .string()
      .optional()
      .min(4, 'Tên tối thiểu 4 ký tự')
      .max(25, 'Tên tối đa 25 ký tự'),
    email: yup.string().email('Email không hợp lệ').optional(),
    phone: yup.string().optional(),
    avatar_url: yup.string().optional(),
    role_id: yup.number().integer().optional(),
  }),
};

export default Schema;
