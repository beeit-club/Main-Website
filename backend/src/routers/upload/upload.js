import express from 'express';
import multer from 'multer';
import path from 'path';
import { API_BACKEND } from '../../config/server.config.js';
import fs from 'fs';

const Router = express.Router();

const uploadPath = path.join('src', 'uploads', 'posts');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log('Đã tạo thư mục upload:', uploadPath);
}

// 1. Cấu hình nơi lưu trữ và tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
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

export const upload = multer({
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

// 'photos' là name của input, 12 là số lượng file tối đa
// Router.post(
//   '/',
//   upload.array('file', 20),
//   (req, res) => {
//     // Nếu không có file nào được upload
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).send('Vui lòng chọn ít nhất một file để upload.');
//     }

//     // Nếu mọi thứ thành công
//     console.log('Các file đã được upload:', req.files);
//     const fileNames = req.files.map((file) => file.filename);
//     res
//       .status(200)
//       .send(
//         `Đã upload thành công ${req.files.length} file: ${fileNames.join(
//           ', ',
//         )}`,
//       );
//   },
//   (error, req, res, next) => {
//     // Middleware bắt lỗi từ Multer (ví dụ: file quá lớn, sai định dạng)
//     res.status(400).send({ error: error.message });
//   },
// );
Router.post('/', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'Không có file' });
  }

  // Trả về URL để TinyMCE hiển thị
  const fileUrl = `${API_BACKEND}/uploads/posts/${file.filename}`;
  res.json({ location: fileUrl });
});
export const handleDeleteImage = (fileUrl) => {
  if (!fileUrl) {
    console.error('Lỗi: Cần cung cấp fileUrl để xóa.');
    return false; // Trả về false nếu không có URL
  }

  try {
    // 1. Cắt lấy tên file từ URL
    const filename = path.basename(fileUrl);

    // 2. Nối tên file với đường dẫn upload trên server
    const filePath = path.join(uploadPath, filename);

    // 3. Kiểm tra xem file có tồn tại không
    if (fs.existsSync(filePath)) {
      // 4. Nếu có, thực hiện xóa file
      fs.unlinkSync(filePath);
      console.log('Đã xóa file:', filePath);
      return true; // Trả về true khi xóa thành công
    } else {
      // 5. Nếu file không tồn tại, coi như đã "xóa" thành công
      console.warn(
        'Yêu cầu xóa file không tồn tại (coi như thành công):',
        filePath,
      );
      return true; // Vẫn trả về true vì file không còn
    }
  } catch (error) {
    // 6. Xử lý nếu có lỗi (vd: không có quyền xóa)
    console.error('Lỗi khi xóa file:', error);
    return false; // Trả về false khi có lỗi
  }
};
export default Router;
