const ONE_HOUR_IN_SECONDS = 3600;
const baseUrl = process.env.NEXT_PUBLIC_API_BACKEND;

/**
 * Lấy danh sách documents (Server-side, dùng fetch cho SSR)
 * @param {Object} params - { page, limit, category_id, search }
 */
export const fetchAllDocuments = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${baseUrl}/client/documents${query ? `?${query}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    next: {
      revalidate: ONE_HOUR_IN_SECONDS, // Revalidate mỗi giờ
      tags: ["documents-list"],
    },
  });

  if (!res.ok) {
    console.error(`Error fetching documents from ${url}. Status: ${res.status}`);
    throw new Error(`Failed to fetch documents. Status: ${res.status}`);
  }

  return res.json();
};



