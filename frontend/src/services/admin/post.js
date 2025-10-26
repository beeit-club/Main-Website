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
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
  createPost: async (formData) => {
    try {
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
  getOne: async (id) => {
    try {
      const res = await axiosClient.get(`admin/posts/${id}`);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
  updatePost: async (id, formData) => {
    try {
      const res = await axiosClient.put(`admin/posts/${id}`, formData, {
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
