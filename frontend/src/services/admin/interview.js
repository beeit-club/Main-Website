// src/services/admin/interview.js
import axiosClient from "../api";

export const interviewServices = {
  // GET /admin/interviews
  getAllInterviews: async (params) => {
    try {
      const res = await axiosClient.get("admin/interviews", { params });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // GET /admin/interviews/:id
  getOneInterview: async (id) => {
    try {
      const res = await axiosClient.get(`admin/interviews/${id}`);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // POST /admin/interviews
  createInterview: async (data) => {
    try {
      const res = await axiosClient.post("admin/interviews", data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // PUT /admin/interviews/:id
  updateInterview: async (id, data) => {
    try {
      const res = await axiosClient.put(`admin/interviews/${id}`, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // DELETE /admin/interviews/:id
  deleteInterview: async (id) => {
    try {
      const res = await axiosClient.delete(`admin/interviews/${id}`);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};
