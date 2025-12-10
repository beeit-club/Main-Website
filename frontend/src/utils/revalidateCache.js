/**
 * Utility functions để revalidate cache sau admin actions
 */

// Get revalidate secret from environment (client-side safe)
const getRevalidateSecret = () => {
  // Try to get from environment variable (only available server-side)
  // For client-side, we'll use a different approach
  if (typeof window === "undefined") {
    return process.env.REVALIDATE_SECRET || process.env.NEXT_PUBLIC_REVALIDATE_SECRET;
  }
  // Client-side: use public env var or skip auth if not set
  return process.env.NEXT_PUBLIC_REVALIDATE_SECRET;
};

/**
 * Helper function to call revalidate API with authentication
 */
async function callRevalidateAPI(tag) {
  const secret = getRevalidateSecret();
  const url = `/api/revalidate?tag=${tag}${secret ? `&secret=${secret}` : ""}`;
  
  const headers = {};
  if (secret && typeof window === "undefined") {
    // Server-side: use Authorization header
    headers["Authorization"] = `Bearer ${secret}`;
  }
  
  return fetch(url, {
    method: "POST",
    headers,
  });
}

/**
 * Revalidate cache cho posts
 * @param {string} slug - Slug của post (optional, nếu có sẽ revalidate cả detail page)
 */
export async function revalidatePosts(slug = null) {
  try {
    const tags = ["posts-list", "posts"];
    if (slug) {
      tags.push(`post-${slug}`);
    }

    await Promise.all(
      tags.map((tag) => callRevalidateAPI(tag))
    );

    console.log(`✅ Cache revalidated for posts${slug ? ` and post-${slug}` : ""}`);
  } catch (error) {
    console.error("⚠️ Failed to revalidate posts cache:", error);
    // Không throw error để không block flow
  }
}

/**
 * Revalidate cache cho events
 * @param {string} slug - Slug của event (optional)
 */
export async function revalidateEvents(slug = null) {
  try {
    const tags = ["events-list", "event"];
    if (slug) {
      tags.push(`event-${slug}`);
    }

    await Promise.all(
      tags.map((tag) => callRevalidateAPI(tag))
    );

    console.log(`✅ Cache revalidated for events${slug ? ` and event-${slug}` : ""}`);
  } catch (error) {
    console.error("⚠️ Failed to revalidate events cache:", error);
  }
}

/**
 * Revalidate cache cho documents
 */
export async function revalidateDocuments() {
  try {
    await callRevalidateAPI("documents-list");
    console.log("✅ Cache revalidated for documents-list");
  } catch (error) {
    console.error("⚠️ Failed to revalidate documents cache:", error);
  }
}

/**
 * Revalidate cache cho questions
 * @param {string} slug - Slug của question (optional)
 */
export async function revalidateQuestions(slug = null) {
  try {
    const tags = ["questions-list", "question"];
    if (slug) {
      tags.push(slug);
    }

    await Promise.all(
      tags.map((tag) => callRevalidateAPI(tag))
    );

    console.log(`✅ Cache revalidated for questions${slug ? ` and ${slug}` : ""}`);
  } catch (error) {
    console.error("⚠️ Failed to revalidate questions cache:", error);
  }
}

/**
 * Revalidate cache cho home page
 */
export async function revalidateHome() {
  try {
    await callRevalidateAPI("home");
    console.log("✅ Cache revalidated for home");
  } catch (error) {
    console.error("⚠️ Failed to revalidate home cache:", error);
  }
}

/**
 * Revalidate cache cho categories
 */
export async function revalidateCategories() {
  try {
    await callRevalidateAPI("categories");
    console.log("✅ Cache revalidated for categories");
  } catch (error) {
    console.error("⚠️ Failed to revalidate categories cache:", error);
  }
}

/**
 * Revalidate cache cho tags
 */
export async function revalidateTags() {
  try {
    await callRevalidateAPI("tags");
    console.log("✅ Cache revalidated for tags");
  } catch (error) {
    console.error("⚠️ Failed to revalidate tags cache:", error);
  }
}
