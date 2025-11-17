"use client";
import axiosClient from "./api";

export const applicationService = {
  // POST /client/applications - Nộp đơn đăng ký thành viên (PUBLIC)
  createApplication: async (data) => {
    try {
      const res = await axiosClient.post("/client/applications", data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};

