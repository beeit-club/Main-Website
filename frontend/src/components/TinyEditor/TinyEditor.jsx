"use client";
import React from "react";
import dynamic from "next/dynamic";
import { uploadImage } from "@/services/admin/post"; // Import service upload của bạn

// Sử dụng dynamic import để TẮT Server-Side Rendering (SSR)
// TinyMCE là một thư viện "client-side" (chỉ chạy trên trình duyệt)
// nên chúng ta không muốn Next.js cố gắng render nó trên server.
const EditorDynamic = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  {
    ssr: false, // <-- Tắt SSR
    loading: () => <p>Đang tải trình soạn thảo...</p>, // <-- Hiển thị khi đang load
  }
);

// Component TinyEditor nhận 2 props:
// 1. editorRef: Để component cha (EditPost) có thể lấy nội dung
// 2. initialValue: Để gán nội dung ban đầu (rỗng cho trang "Thêm", có dữ liệu cho trang "Sửa")
export default function TinyEditor({ editorRef, initialValue }) {
  return (
    <>
      <EditorDynamic
        // Đường dẫn tới file tinymce.min.js bạn tự host
        // (Nếu bạn dùng cloud thì dùng apiKey="YOUR_KEY" thay thế)
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        // "gpl" là giấy phép mã nguồn mở (nếu bạn tự host)
        licenseKey="gpl"
        // onInit: Được gọi khi editor đã khởi tạo xong
        // Chúng ta dùng nó để gán `editor` vào `editorRef`
        // để component cha (EditPost) có thể gọi `editorRef.current.getContent()`
        onInit={(_, editor) => (editorRef.current = editor)}
        // ✅ SỬA LỖI Ở ĐÂY:
        // Dùng `initialValue` được truyền từ props.
        // - Trang "Thêm": initialValue là "" (rỗng)
        // - Trang "Sửa": initialValue là `postContent` (nội dung bài viết)
        initialValue={initialValue || ""}
        // `init`: Đây là đối tượng chứa toàn bộ cấu hình của TinyMCE
        init={{
          height: 700, // Chiều cao của editor
          menubar: false, // Ẩn thanh menu (File, Edit, View...)

          // `plugins`: Danh sách các tính năng bạn muốn thêm vào editor
          plugins: [
            "advlist", // Thêm danh sách nâng cao (bullet, number)
            "autolink", // Tự động nhận diện link
            "lists", // Danh sách
            "link", // Thêm/sửa link
            "image", // Thêm/sửa ảnh
            "charmap", // Ký tự đặc biệt
            "anchor", // Thêm "anchor" (neo)
            "searchreplace", // Tìm kiếm và thay thế
            "visualblocks", // Hiển thị các block (như <p>)
            "code", // Xem/sửa code HTML
            "fullscreen", // Nút toàn màn hình
            "insertdatetime", // Thêm ngày giờ
            "media", // Thêm video, audio
            "table", // Thêm bảng
            "preview", // Xem trước
            "help", // Nút trợ giúp
            "wordcount", // Đếm từ
          ],

          // `toolbar`: Cấu hình các nút bấm hiển thị trên thanh công cụ
          // Dấu "|" là để ngăn cách các nhóm nút
          toolbar:
            "undo redo | blocks | bold italic forecolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | removeformat | image | help",

          // --- Cấu hình Upload ảnh ---

          // Tự động upload ảnh ngay khi chọn (hoặc kéo/thả)
          automatic_uploads: true,

          // Chỉ cho phép chọn file ảnh khi bấm nút
          file_picker_types: "image",

          // (Không bắt buộc) Cho phép dán ảnh trực tiếp từ clipboard (Ctrl+V)
          // Đòi hỏi plugin "paste". Đã comment vì bạn chưa bật plugin "paste".
          // paste_data_images: true,

          /**
           * Đây là hàm QUAN TRỌNG NHẤT
           * TinyMCE sẽ gọi hàm này mỗi khi có 1 ảnh cần upload.
           * `blobInfo` là đối tượng chứa file ảnh (blobInfo.blob()).
           * Hàm này BẮT BUỘC phải trả về một Promise.
           */
          images_upload_handler: async (blobInfo) => {
            try {
              // 1. Gọi service `uploadImage` của bạn
              //    (Hàm này bạn đã import ở trên)
              const location = await uploadImage(blobInfo);

              // 2. Kiểm tra kết quả trả về
              if (typeof location !== "string" || !location) {
                const errorMsg = "Server không trả về URL ảnh hợp lệ.";
                return Promise.reject(errorMsg);
              }

              // 3. Trả về URL của ảnh đã upload
              //    TinyMCE sẽ tự động chèn URL này vào thẻ <img>
              return location;
            } catch (error) {
              // 4. Nếu có lỗi (mạng, server...),
              //    Trả về một Promise.reject với thông báo lỗi.
              //    TinyMCE sẽ tự động hiển thị lỗi này cho người dùng.
              return Promise.reject(
                "Upload ảnh thất bại: " +
                  (error.message || "Lỗi không xác định")
              );
            }
          },

          // --- Cấu hình Style ---

          // Style CSS trực tiếp cho nội dung bên trong editor
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
    </>
  );
}
