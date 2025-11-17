const ONE_DAY_IN_SECONDS = 86400;
const ONE_HOUR_IN_SECONDS = 3600;

const baseUrl = process.env.NEXT_PUBLIC_API_BACKEND;

/**
 * Lấy chi tiết bài viết theo slug
 */
export const fetchArticleDetail = async (slug) => {
  const res = await fetch(`${baseUrl}/client/posts/${slug}`, {
    method: "GET",
    next: {
      revalidate: ONE_DAY_IN_SECONDS,
      tags: ["posts", `post-${slug}`],
    },
  });
  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch article. Status: ${res.status}`);
  }

  return res.json();
};

/**
 * Lấy danh sách bài viết với pagination và filters
 * @param {Object} params - { page, limit, category_id, title }
 */
export const fetchAllPosts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${baseUrl}/client/posts${query ? `?${query}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    next: {
      revalidate: ONE_HOUR_IN_SECONDS,
      tags: ["posts-list"],
    },
  });

  if (!res.ok) {
    console.error(`Error fetching posts from ${url}. Status: ${res.status}`);
    throw new Error(`Failed to fetch posts. Status: ${res.status}`);
  }

  return res.json();
};

/**
 * Lấy danh sách categories
 */
export const fetchCategories = async () => {
  const res = await fetch(`${baseUrl}/client/category`, {
    method: "GET",
    next: {
      revalidate: ONE_DAY_IN_SECONDS,
      tags: ["categories"],
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch categories. Status: ${res.status}`);
  }

  return res.json();
};

/**
 * Lấy danh sách tags
 */
export const fetchTags = async () => {
  const res = await fetch(`${baseUrl}/client/tags`, {
    method: "GET",
    next: {
      revalidate: ONE_DAY_IN_SECONDS,
      tags: ["tags"],
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch tags. Status: ${res.status}`);
  }

  return res.json();
};
