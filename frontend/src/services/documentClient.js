"use client";
import axiosClient from "./api";

/**
 * Service cho client-side operations (cần authentication cho download)
 */
export const documentService = {
  /**
   * Tải xuống document
   * @param {string|number} id - ID của document
   */
  downloadDocument: async (id) => {
    try {
      const response = await axiosClient.get(`/admin/documents/${id}/download`);
      return response.data; // { status: 'success', data: { download_url, expires_at } }
    } catch (error) {
      console.error("Error downloading document:", error.response?.data || error.message);
      throw error?.response?.data || new Error("Không thể tải xuống tài liệu");
    }
  },
};

