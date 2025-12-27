import axiosClient from "../api";

const BASE_PATH = "admin/beeit";

export const beeitServices = {
  // ========== HERO ==========
  hero: {
    get: async () => {
      try {
        const res = await axiosClient.get(`${BASE_PATH}/hero`);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    update: async (id, data) => {
      try {
        const res = await axiosClient.put(`${BASE_PATH}/hero/${id}`, data);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
  },

  // ========== STATS ==========
  stats: {
    getAll: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.page) params.append("page", options.page);
        if (options.limit) params.append("limit", options.limit);
        if (options.stat_key) params.append("stat_key", options.stat_key);

        const res = await axiosClient.get(`${BASE_PATH}/stats`, { params });
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    getById: async (id) => {
      try {
        const res = await axiosClient.get(`${BASE_PATH}/stats/${id}`);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    create: async (data) => {
      try {
        const res = await axiosClient.post(`${BASE_PATH}/stats`, data);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    update: async (id, data) => {
      try {
        const res = await axiosClient.put(`${BASE_PATH}/stats/${id}`, data);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    delete: async (id) => {
      try {
        const res = await axiosClient.delete(`${BASE_PATH}/stats/${id}`);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
  },

  // ========== FOOTER ==========
  footer: {
    get: async () => {
      try {
        const res = await axiosClient.get(`${BASE_PATH}/footer`);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    update: async (id, data) => {
      try {
        const res = await axiosClient.put(`${BASE_PATH}/footer/${id}`, data);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
  },

  // ========== EMAIL SUBMISSIONS ==========
  emailSubmissions: {
    getAll: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.page) params.append("page", options.page);
        if (options.limit) params.append("limit", options.limit);
        if (options.email) params.append("email", options.email);
        if (options.status) params.append("status", options.status);

        const res = await axiosClient.get(`${BASE_PATH}/email-submissions`, { params });
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    getById: async (id) => {
      try {
        const res = await axiosClient.get(`${BASE_PATH}/email-submissions/${id}`);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    create: async (email) => {
      try {
        const res = await axiosClient.post(`${BASE_PATH}/email-submissions`, { email });
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    update: async (id, data) => {
      try {
        const res = await axiosClient.put(`${BASE_PATH}/email-submissions/${id}`, data);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    markAsProcessed: async (id, notes = null) => {
      try {
        const res = await axiosClient.patch(`${BASE_PATH}/email-submissions/${id}/processed`, { notes });
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    markAsArchived: async (id) => {
      try {
        const res = await axiosClient.patch(`${BASE_PATH}/email-submissions/${id}/archived`);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    getStatistics: async () => {
      try {
        const res = await axiosClient.get(`${BASE_PATH}/email-submissions/statistics`);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
  },

  // ========== LEADERS ==========
  leaders: {
    getAll: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.page) params.append("page", options.page);
        if (options.limit) params.append("limit", options.limit);
        if (options.status) params.append("status", options.status);
        if (options.role) params.append("role", options.role);

        const res = await axiosClient.get(`${BASE_PATH}/leaders`, { params });
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    getById: async (id) => {
      try {
        const res = await axiosClient.get(`${BASE_PATH}/leaders/${id}`);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    create: async (data) => {
      try {
        const res = await axiosClient.post(`${BASE_PATH}/leaders`, data);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    update: async (id, data) => {
      try {
        const res = await axiosClient.put(`${BASE_PATH}/leaders/${id}`, data);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    delete: async (id) => {
      try {
        const res = await axiosClient.delete(`${BASE_PATH}/leaders/${id}`);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    updateOrder: async (leaders) => {
      try {
        const res = await axiosClient.patch(`${BASE_PATH}/leaders/order`, { leaders });
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
  },

  // ========== ACHIEVEMENTS ==========
  achievements: {
    getAll: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.page) params.append("page", options.page);
        if (options.limit) params.append("limit", options.limit);
        if (options.status) params.append("status", options.status);
        if (options.row_number) params.append("row_number", options.row_number);
        if (options.year) params.append("year", options.year);

        const res = await axiosClient.get(`${BASE_PATH}/achievements`, { params });
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    getById: async (id) => {
      try {
        const res = await axiosClient.get(`${BASE_PATH}/achievements/${id}`);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    create: async (data) => {
      try {
        const res = await axiosClient.post(`${BASE_PATH}/achievements`, data);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    update: async (id, data) => {
      try {
        const res = await axiosClient.put(`${BASE_PATH}/achievements/${id}`, data);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    delete: async (id) => {
      try {
        const res = await axiosClient.delete(`${BASE_PATH}/achievements/${id}`);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    updateOrder: async (achievements) => {
      try {
        const res = await axiosClient.put(`${BASE_PATH}/achievements/order/update`, { achievements });
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
  },

  // ========== PHOTOS (BEHIND SCENES) ==========
  photos: {
    getAll: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.page) params.append("page", options.page);
        if (options.limit) params.append("limit", options.limit);
        if (options.status) params.append("status", options.status);

        const res = await axiosClient.get(`${BASE_PATH}/photos`, { params });
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    getById: async (id) => {
      try {
        const res = await axiosClient.get(`${BASE_PATH}/photos/${id}`);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    create: async (data) => {
      try {
        const res = await axiosClient.post(`${BASE_PATH}/photos`, data);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    update: async (id, data) => {
      try {
        const res = await axiosClient.put(`${BASE_PATH}/photos/${id}`, data);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    delete: async (id) => {
      try {
        const res = await axiosClient.delete(`${BASE_PATH}/photos/${id}`);
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
    updateOrder: async (photos) => {
      try {
        const res = await axiosClient.put(`${BASE_PATH}/photos/order/update`, { photos });
        return res;
      } catch (error) {
        throw error?.response?.data || error;
      }
    },
  },
};

