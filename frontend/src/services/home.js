import axiosClient from "./api";

const ONE_DAY_IN_SECONDS = 86400;
const ONE_HOUR_IN_SECONDS = 3600; // Revalidate mỗi giờ
const baseUrl = process.env.NEXT_PUBLIC_API_BACKEND;

/**
 * Lấy dữ liệu trang chủ (Hàm gốc của bạn)
 */
export const getHome = async () => {
  const res = await fetch(`${baseUrl}/client/`, {
    method: "GET",
    next: {
      revalidate: ONE_DAY_IN_SECONDS,
      tags: ["home"],
    },
  });
  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch home data. Status: ${res.status}`);
  }

  return res.json();
};

/**
 * Lấy danh sách câu hỏi (đã sửa dùng fetch)
 * @param {Object} params - Tùy chọn phân trang (ví dụ: { page: 1, limit: 10 })
 */
export const getAllQuestions = async (params) => {
  // Chuyển đổi object params thành query string (ví dụ: { page: 1 } -> 'page=1')
  const query = new URLSearchParams(params).toString();

  // Đảm bảo có dấu ? nếu query tồn tại
  const url = `${baseUrl}/client/questions${query ? `?${query}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    next: {
      revalidate: ONE_HOUR_IN_SECONDS, // Danh sách revalidate mỗi giờ
      tags: ["questions-list"], // Tag để revalidate thủ công (kebab-case)
    },
  });

  if (!res.ok) {
    console.error(
      `Error fetching all questions from ${url}. Status: ${res.status}`
    );
    throw new Error(`Failed to fetch questions. Status: ${res.status}`);
  }

  // res.json() sẽ trả về { status: 'success', message: '...', data: { ... } }
  return res.json();
};

/**
 * Lấy chi tiết câu hỏi (đã sửa dùng fetch)
 * @param {string} slug - Slug của câu hỏi
 */
export const getQuestionDetail = async (slug) => {
  if (!slug) throw new Error("Slug là bắt buộc để lấy chi tiết câu hỏi");

  const url = `${baseUrl}/client/questions/${slug}`;

  const res = await fetch(url, {
    method: "GET",
    next: {
      revalidate: ONE_DAY_IN_SECONDS, // Chi tiết câu hỏi revalidate mỗi ngày
      tags: ["question", slug], // Tag động theo slug để revalidate
    },
  });

  if (res.status === 404) {
    return null; // Trả về null nếu BE báo 404 (giống hàm getHome)
  }

  if (!res.ok) {
    console.error(
      `Error fetching question detail from ${url}. Status: ${res.status}`
    );
    throw new Error(`Failed to fetch question detail. Status: ${res.status}`);
  }

  // res.json() sẽ trả về { status: 'success', message: '...', data: { ... } }
  const data = await res.json();
  
  // Log dữ liệu nhận được từ API
  console.log('=== DEBUG: Question data from API ===');
  console.log('Full response:', JSON.stringify(data, null, 2));
  if (data?.data) {
    console.log('author_name:', data.data.author_name);
    console.log('author_avatar:', data.data.author_avatar);
    console.log('author_id:', data.data.author_id);
    console.log('All keys:', Object.keys(data.data));
  }
  console.log('=====================================');
  
  return data;
};

/**
 * Tạo câu hỏi mới (Client-side, dùng axiosClient để gửi JWT token)
 * @param {Object} data - Dữ liệu câu hỏi { title, content, meta_description }
 */
export const createQuestion = async (data) => {
  try {
    // Log để debug
    const token = localStorage.getItem("accessToken");
    console.log('=== DEBUG: Frontend createQuestion ===');
    console.log('Has token in localStorage:', !!token);
    console.log('Token value:', token ? token.substring(0, 20) + '...' : 'No token');
    console.log('======================================');
    
    const response = await axiosClient.post("/client/questions", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // { status: 'success', message: '...', data: { id: ... } }
  } catch (error) {
    
    // Throw error object để component có thể xử lý
    // Đảm bảo error object luôn có property message
    if (error.response?.data) {
      // Nếu có response từ server
      const serverError = error.response.data;
      const errorObj = {
        ...serverError,
        message: serverError.message || serverError.error || "Không thể tạo câu hỏi",
      };
      throw errorObj;
    } else {
      // Nếu không có response (network error, etc.)
      throw {
        message: error.message || "Không thể tạo câu hỏi. Vui lòng kiểm tra kết nối mạng.",
        error: "NETWORK_ERROR",
      };
    }
  }
};

/**
 * Tạo câu trả lời mới (Client-side, dùng axiosClient để gửi JWT token)
 * @param {Object} data - Dữ liệu câu trả lời { question_id, content }
 */
export const createAnswer = async (data) => {
  try {
    const response = await axiosClient.post("/client/answers", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // { status: 'success', message: '...', data: { id: ... } }
  } catch (error) {
    
    // Throw error object để component có thể xử lý
    // Đảm bảo error object luôn có property message
    if (error.response?.data) {
      // Nếu có response từ server
      const serverError = error.response.data;
      const errorObj = {
        ...serverError,
        message: serverError.message || serverError.error || "Không thể tạo câu trả lời",
      };
      throw errorObj;
    } else {
      // Nếu không có response (network error, etc.)
      throw {
        message: error.message || "Không thể tạo câu trả lời. Vui lòng kiểm tra kết nối mạng.",
        error: "NETWORK_ERROR",
      };
    }
  }
};

/**
 * Vote câu trả lời (Client-side, dùng axiosClient để gửi JWT token)
 * @param {string|number} answerId - ID của câu trả lời
 * @param {string} voteType - 'upvote' hoặc 'downvote'
 */
export const voteAnswer = async (answerId, voteType) => {
  try {
    const response = await axiosClient.post(`/admin/answers/${answerId}/vote`, {
      vote_type: voteType,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // { status: 'success', data: { id, vote_score } }
  } catch (error) {
    if (error.response?.data) {
      const serverError = error.response.data;
      const errorObj = {
        ...serverError,
        message: serverError.message || serverError.error || "Không thể vote câu trả lời",
      };
      throw errorObj;
    } else {
      throw {
        message: error.message || "Không thể vote câu trả lời. Vui lòng kiểm tra kết nối mạng.",
        error: "NETWORK_ERROR",
      };
    }
  }
};