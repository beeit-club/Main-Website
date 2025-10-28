// src/services/admin/application.js
import axiosClient from "../api";

export const applicationServices = {
  // GET /admin/applications
  getAllApplications: async (params) => {
    try {
      const res = await axiosClient.get("admin/applications", { params });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // GET /admin/applications/:id
  getOneApplication: async (id) => {
    try {
      const res = await axiosClient.get(`admin/applications/${id}`);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // === CÁC API WORKFLOW MỚI ===

  // PATCH /admin/applications/:id/review (Status 0 -> 1)
  reviewApplication: async (id) => {
    try {
      const res = await axiosClient.patch(`admin/applications/${id}/review`);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // PATCH /admin/applications/:id/schedule (Status 1 -> 2)
  scheduleApplication: async (id, data) => {
    try {
      // data = { schedule_id: 123 }
      const res = await axiosClient.patch(
        `admin/applications/${id}/schedule`,
        data
      );
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // PATCH /admin/applications/:id/approve (Status 2 -> 3)
  approveApplication: async (id, data) => {
    try {
      // data = { interview_notes: "..." }
      const res = await axiosClient.patch(
        `admin/applications/${id}/approve`,
        data
      );
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // PATCH /admin/applications/:id/reject (Status 0/2 -> 4)
  rejectApplication: async (id, data) => {
    try {
      // data = { interview_notes: "..." }
      const res = await axiosClient.patch(
        `admin/applications/${id}/reject`,
        data
      );
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};
