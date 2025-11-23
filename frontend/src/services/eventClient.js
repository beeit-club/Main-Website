"use client";
import axiosClient from "./api";

/**
 * Service cho client-side operations (cần authentication)
 */
export const eventService = {
  /**
   * Đăng ký tham gia sự kiện
   * @param {string|number} eventId - ID của event
   * @param {Object} data - { registration_type, notes?, guest_name?, guest_email?, guest_phone? }
   */
  registerEvent: async (eventId, data) => {
    try {
      const response = await axiosClient.post(`/admin/events/${eventId}/registrations`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error registering event:", error.response?.data || error.message);
      throw error?.response?.data || new Error("Không thể đăng ký tham gia sự kiện");
    }
  },

  /**
   * Kiểm tra xem user đã đăng ký chưa
   * @param {string|number} eventId - ID của event
   */
  checkRegistration: async (eventId) => {
    try {
      const response = await axiosClient.get(`/admin/events/${eventId}/registrations`);
      return response.data;
    } catch (error) {
      console.error("Error checking registration:", error.response?.data || error.message);
      throw error?.response?.data || new Error("Không thể kiểm tra đăng ký");
    }
  },
};

