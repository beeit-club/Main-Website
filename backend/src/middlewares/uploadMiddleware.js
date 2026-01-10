import multer from 'multer';
import path from 'path';

// 1. Cấu hình nơi lưu trữ và tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/'); // Lưu file vào thư mục 'src/uploads'
  },
  filename: (req, file, cb) => {
    // Tạo tên file duy nhất để không bị ghi đè
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

// 2. Hàm kiểm tra loại file
const fileFilter = (req, file, cb) => {
  // Chỉ chấp nhận các file ảnh
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Lỗi: Chỉ được phép upload file ảnh!'), false);
  }
};

// 3. Khởi tạo và export middleware Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Giới hạn kích thước file: 5MB
  },
  fileFilter: fileFilter,
});

// Export middleware để các router khác có thể sử dụng
export default upload;
