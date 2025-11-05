const ONE_DAY_IN_SECONDS = 86400;

export const fetchArticleDetail = async (slug) => {
  try {
    // ✅ Lấy domain của app để gọi tuyệt đối
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    console.log("📡 Gọi tới:", `${baseUrl}/api/posts/${slug}`);

    const res = await fetch(`${baseUrl}/api/posts/${slug}`, {
      method: "GET",
      next: {
        revalidate: ONE_DAY_IN_SECONDS, // ISR cache
        tags: ["posts", `post-${slug}`],
      },
    });
    console.log("🚀 ~ fetchArticleDetail ~ res:", res);

    if (!res.ok) {
      throw new Error(`Lỗi khi tải bài viết: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("🚀 ~ fetchArticleDetail ~ err:", err);
  }
};
