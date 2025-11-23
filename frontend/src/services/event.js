const ONE_HOUR_IN_SECONDS = 3600;
const baseUrl = process.env.NEXT_PUBLIC_API_BACKEND;

/**
 * Lấy danh sách events (Server-side, dùng fetch cho SSR)
 * @param {Object} params - { page, limit, status, upcoming, past }
 */
export const fetchAllEvents = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${baseUrl}/client/events${query ? `?${query}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    next: {
      revalidate: ONE_HOUR_IN_SECONDS, // Revalidate mỗi giờ
      tags: ["events-list"],
    },
  });

  if (!res.ok) {
    console.error(`Error fetching events from ${url}. Status: ${res.status}`);
    throw new Error(`Failed to fetch events. Status: ${res.status}`);
  }

  return res.json();
};

/**
 * Lấy chi tiết event theo slug (Server-side, dùng fetch cho SSR)
 * @param {string} slug - Slug của event
 */
export const fetchEventDetail = async (slug) => {
  const url = `${baseUrl}/client/events/${slug}`;

  const res = await fetch(url, {
    method: "GET",
    next: {
      revalidate: ONE_HOUR_IN_SECONDS,
      tags: ["event", `event-${slug}`],
    },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    console.error(`Error fetching event detail from ${url}. Status: ${res.status}`);
    throw new Error(`Failed to fetch event detail. Status: ${res.status}`);
  }

  return res.json();
};


