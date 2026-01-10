const ONE_HOUR_IN_SECONDS = 3600;

const baseUrl = process.env.NEXT_PUBLIC_API_BACKEND;

/**
 * Tìm kiếm posts và questions
 * @param {Object} params - { q: 'search term', page: 1, limit: 10 }
 */
export const searchPostsAndQuestions = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${baseUrl}/client/search${query ? `?${query}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    next: {
      revalidate: ONE_HOUR_IN_SECONDS,
      tags: ["search"],
    },
  });

  if (!res.ok) {
    console.error(`Error searching from ${url}. Status: ${res.status}`);
    throw new Error(`Failed to search. Status: ${res.status}`);
  }

  return res.json();
};

