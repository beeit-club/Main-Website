import axios from "axios";
import axiosClient from "../api";

export const postServices = {
  getAllPost: async () => {
    try {
      const res = await axiosClient.get("admin/posts");
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
  getAllcategory: async () => {
    try {
      const res = await axiosClient.get("client/category");
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
  getAlltags: async () => {
    try {
      const res = await axiosClient.get("client/tags");
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
  // xóa mềm bài viết
  delete: async (id) => {
    try {
      const res = await axiosClient.delete(`/admin/posts/${id}`);
      console.log("🚀 ~ res:", res);
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
  createPost: async (formData) => {
    try {
      // --- BẮT ĐẦU: Mã để log nội dung FormData ---
      console.log("--- Bắt đầu duyệt FormData ---");

      // Dùng for...of với formData.entries() để lấy cả key và value
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      console.log("--- Kết thúc duyệt FormData ---");
      // Khi gửi FormData, Axios sẽ tự động đặt 'Content-Type': 'multipart/form-data'
      // và xử lý boundary.
      const res = await axiosClient.post("admin/posts", formData, {
        headers: {
          "Content-Type": undefined,
        },
      });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};
// Quay trở lại dùng hàm uploadImage gốc của bạn
export async function uploadImage(blobInfo) {
  const formData = new FormData();
  formData.append("file", blobInfo.blob(), blobInfo.filename());

  try {
    //
    // Gửi request với một config (tham số thứ 3) ĐỂ GHI ĐÈ
    //
    const response = await axiosClient.post(
      "/upload", // 1. URL
      formData, // 2. Dữ liệu (body)
      {
        headers: {
          "Content-Type": undefined,
        },
      }
    );

    const data = response;
    if (!data || !data.location) {
      throw new Error("Upload ảnh thất bại");
    }
    return data.location;
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    throw error;
  }
}
