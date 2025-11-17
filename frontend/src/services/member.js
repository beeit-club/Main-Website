"use client";
import axiosClient from "./api";

export const memberService = {
  // GET /client/members - Lấy danh sách thành viên CLB (PUBLIC)
  getAllMembers: async (params) => {
    try {
      const res = await axiosClient.get("/client/members", { params });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};

