const ONE_DAY_IN_SECONDS = 86400;
const ONE_HOUR_IN_SECONDS = 3600;
const baseUrl = process.env.NEXT_PUBLIC_API_BACKEND;

/**
 * Lấy Memory Flow items (active only)
 * @param {number|null} limit - Giới hạn số lượng items (optional)
 */
export const getMemoryFlowItems = async (limit = null) => {
  const url = limit
    ? `${baseUrl}/client/landing/memory-flow?limit=${limit}`
    : `${baseUrl}/client/landing/memory-flow`;

  const res = await fetch(url, {
    method: "GET",
    next: {
      revalidate: ONE_HOUR_IN_SECONDS, // Revalidate mỗi giờ
      tags: ["landing-memory-flow", "landing"], // Tags để revalidate thủ công
    },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    console.error(
      `Error fetching memory flow items from ${url}. Status: ${res.status}`
    );
    throw new Error(`Failed to fetch memory flow items. Status: ${res.status}`);
  }

  return res.json();
};

/**
 * Lấy Founders & Members (founder + core members)
 */
export const getFounders = async () => {
  const url = `${baseUrl}/client/landing/founders`;

  const res = await fetch(url, {
    method: "GET",
    next: {
      revalidate: ONE_HOUR_IN_SECONDS,
      tags: ["landing-founders", "landing"],
    },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    console.error(
      `Error fetching founders from ${url}. Status: ${res.status}`
    );
    throw new Error(`Failed to fetch founders. Status: ${res.status}`);
  }

  return res.json();
};

/**
 * Lấy tất cả landing content (founder + members + memory flow)
 * Sử dụng endpoint /content để lấy tất cả trong 1 request
 */
export const getLandingContent = async (memoryFlowLimit = null) => {
  const query = memoryFlowLimit ? `?memoryFlowLimit=${memoryFlowLimit}` : "";
  const url = `${baseUrl}/client/landing/content${query}`;

  const res = await fetch(url, {
    method: "GET",
    next: {
      revalidate: ONE_HOUR_IN_SECONDS,
      tags: ["landing-memory-flow", "landing-founders", "landing"],
    },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    console.error(
      `Error fetching landing content from ${url}. Status: ${res.status}`
    );
    throw new Error(`Failed to fetch landing content. Status: ${res.status}`);
  }

  return res.json();
};

