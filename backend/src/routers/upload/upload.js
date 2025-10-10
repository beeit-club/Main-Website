import express from 'express';
import multer from 'multer';
import path from 'path';

const Router = express.Router();

// --- CẤU HÌNH MULTER ---

// 1. Cấu hình nơi lưu trữ và tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/'); // Lưu file vào thư mục 'uploads'
  },
  filename: (req, file, cb) => {
    // Tạo tên file duy nhất: originalname-timestamp.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.originalname.split('.')[0] +
        '-' +
        uniqueSuffix +
        path.extname(file.originalname),
    );
  },
});

// 2. Khởi tạo middleware Multer với đầy đủ cấu hình
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2, // Giới hạn kích thước file: 2MB
  },
  fileFilter: (req, file, cb) => {
    // Kiểm tra loại file: chỉ chấp nhận file ảnh
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );

    if (mimetype && extname) {
      return cb(null, true); // Chấp nhận file
    }
    cb(
      new Error(
        'Lỗi: Chỉ được phép upload các file ảnh (jpeg, jpg, png, gif)!',
      ),
    ); // Từ chối file
  },
});

// --- ROUTE ĐỂ UPLOAD ---

// 'photos' là name của input, 12 là số lượng file tối đa
Router.post(
  '/',
  upload.array('images', 12),
  (req, res) => {
    // Nếu không có file nào được upload
    if (!req.files || req.files.length === 0) {
      return res.status(400).send('Vui lòng chọn ít nhất một file để upload.');
    }

    // Nếu mọi thứ thành công
    console.log('Các file đã được upload:', req.files);
    const fileNames = req.files.map((file) => file.filename);
    res
      .status(200)
      .send(
        `Đã upload thành công ${req.files.length} file: ${fileNames.join(
          ', ',
        )}`,
      );
  },
  (error, req, res, next) => {
    // Middleware bắt lỗi từ Multer (ví dụ: file quá lớn, sai định dạng)
    res.status(400).send({ error: error.message });
  },
);

export default Router;
