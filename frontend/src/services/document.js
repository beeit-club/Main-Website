const ONE_HOUR_IN_SECONDS = 3600;
const ONE_DAY_IN_SECONDS = 86400;
const baseUrl = process.env.NEXT_PUBLIC_API_BACKEND;

/**
 * Lấy chi tiết document theo slug
 * @param {string} slug - Slug của document
 */
export const fetchDocumentBySlug = async (slug) => {
  const headers = {};
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${baseUrl}/client/documents/${slug}`, {
    method: "GET",
    headers,
    next: {
      revalidate: ONE_DAY_IN_SECONDS,
      tags: ["documents", `document-${slug}`],
    },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch document. Status: ${res.status}`);
  }

  return res.json();
};

/**
 * Lấy danh sách documents (Server-side, dùng fetch cho SSR)
 * @param {Object} params - { page, limit, category_id, search }
 */
export const fetchAllDocuments = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${baseUrl}/client/documents${query ? `?${query}` : ""}`;
  
  const headers = {};
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(url, {
    method: "GET",
    headers,
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



