"use client";
import React from "react";
import dynamic from "next/dynamic";
import { uploadImage } from "@/services/admin/post";

const EditorDynamic = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false, loading: () => <p>Loading editor...</p> }
);

export default function TinyEditor({ editorRef }) {
  return (
    <>
      <EditorDynamic
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        onInit={(_, editor) => (editorRef.current = editor)}
        initialValue=""
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "preview",
            "help",
            "wordcount",
            // "paste",
          ],
          toolbar:
            "undo redo | blocks | bold italic forecolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | removeformat | image | help",

          automatic_uploads: true,
          file_picker_types: "image",
          // paste_data_images: true, // 👈 THÊM CẤU HÌNH NÀY

          // ✅ TinyMCE gọi hàm uploadImage mỗi khi cần upload
          // ... (các cấu hình init khác)

          // ✅ Cập nhật handler để xử lý lỗi rõ ràng hơn
          images_upload_handler: async (blobInfo) => {
            // Kiểm tra xem blobInfo có hợp lệ không
            if (!blobInfo || typeof blobInfo.blob !== "function") {
              const errorMsg =
                "Dữ liệu ảnh dán vào không hợp lệ. (blobInfo rỗng hoặc sai)";
              console.error(errorMsg, blobInfo);
              return Promise.reject(errorMsg);
            }

            try {
              // Gọi hàm upload của bạn
              const location = await uploadImage(blobInfo);

              // Kiểm tra xem hàm upload có trả về URL không
              if (typeof location !== "string" || !location) {
                const errorMsg = "Server không trả về URL ảnh hợp lệ.";
                console.error(errorMsg, location);
                return Promise.reject(errorMsg);
              }

              console.log("✅ Upload thành công. Location:", location);
              return location; // Trả về URL thành công
            } catch (error) {
              // Bắt lỗi nếu hàm uploadImage bị throw
              console.error("Lỗi khi gọi uploadImage:", error);

              // Trả về một Promise bị reject với thông báo lỗi
              // TinyMCE sẽ tự động hiển thị thông báo này cho người dùng
              return Promise.reject(
                "Upload ảnh thất bại: " +
                  (error.message || "Lỗi không xác định")
              );
            }
          },

          // ... (phần content_style)
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
    </>
  );
}
