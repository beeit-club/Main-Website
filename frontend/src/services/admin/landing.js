
import axiosClient from "../api";

export const landingServices = {
    /**
     * 📋 Lấy dữ liệu của 1 section
     * GET /admin/landing/:section
     */
    getSectionData: async (section) => {
        try {
            const res = await axiosClient.get(`admin/landing/${section}`);
            return res.data;
        } catch (error) {
            throw error?.response?.data || error;
        }
    },

    /**
     * ➕ Tạo item mới cho section
     * POST /admin/landing/:section
     */
    createItem: async (section, data) => {
        try {
            const res = await axiosClient.post(`admin/landing/${section}`, data);
            return res.data;
        } catch (error) {
            throw error?.response?.data || error;
        }
    },

    /**
     * ✏️ Cập nhật item trong section
     * PUT /admin/landing/:section/:id
     */
    updateItem: async (section, id, data) => {
        try {
            const res = await axiosClient.put(`admin/landing/${section}/${id}`, data);
            return res.data;
        } catch (error) {
            throw error?.response?.data || error;
        }
    },

    /**
     * 🗑️ Xóa item khỏi section
     * DELETE /admin/landing/:section/:id
     */
    deleteItem: async (section, id) => {
        try {
            const res = await axiosClient.delete(`admin/landing/${section}/${id}`);
            return res.data;
        } catch (error) {
            throw error?.response?.data || error;
        }
    },

    /**
     * 🔄 Cập nhật thứ tự sắp xếp
     * PATCH /admin/landing/:section/reorder
     */
    reorderItems: async (section, items) => {
        try {
            const res = await axiosClient.patch(`admin/landing/${section}/reorder`, { items });
            return res.data;
        } catch (error) {
            throw error?.response?.data || error;
        }
    }
};
