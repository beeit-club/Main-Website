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
      tags: ["questionsList"], // Tag để revalidate thủ công
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
  return res.json();
};
