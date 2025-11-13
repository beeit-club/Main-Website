const ONE_DAY_IN_SECONDS = 86400;

export const fetchArticleDetail = async (slug) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BACKEND;
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
