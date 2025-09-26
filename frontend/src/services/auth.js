"use client";
import axiosClient from "@/services/api.js";

export const authServices = {
  login: async (data) => {
    try {
      const res = await axiosClient.post("/auth/login", data);
      return res.data;
    } catch (err) {
      // ném lỗi ra ngoài để hook bắt
      throw err?.response?.data || err;
    }
  },

  register: async (data) => {
    try {
      const res = await axiosClient.post("/auth/register", data);
      return res.data;
    } catch (err) {
      throw err?.response?.data || err;
    }
  },

  logout: async () => {
    try {
      const res = await axiosClient.post("/auth/logout");
      return res.data;
    } catch (err) {
      throw err?.response?.data || err;
    }
  },

  getPremiss: async () => {
    try {
      const res = await axiosClient.get("/auth/permissions");
      return res.data;
    } catch (err) {
      throw err?.response?.data || err;
    }
  },
};
