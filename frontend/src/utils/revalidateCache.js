/**
 * Utility functions để revalidate cache sau admin actions
 */

// Get revalidate secret from environment (client-side safe)
const getRevalidateSecret = () => {
  // Try to get from environment variable (only available server-side)
  // For client-side, we'll use a different approach
  if (typeof window === "undefined") {
    return (
      process.env.REVALIDATE_SECRET || process.env.NEXT_PUBLIC_REVALIDATE_SECRET
    );
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

    await Promise.all(tags.map((tag) => callRevalidateAPI(tag)));
  } catch (error) {
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

    await Promise.all(tags.map((tag) => callRevalidateAPI(tag)));
  } catch (error) {}
}

/**
 * Revalidate cache cho documents
 * @param {string} slug - Slug của document (optional, nếu có sẽ revalidate cả detail page)
 */
export async function revalidateDocuments(slug = null) {
  try {
    const tags = ["documents-list", "documents"];
    if (slug) {
      tags.push(`document-${slug}`);
    }

    await Promise.all(tags.map((tag) => callRevalidateAPI(tag)));
  } catch (error) {
    // Không throw error để không block flow
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

    await Promise.all(tags.map((tag) => callRevalidateAPI(tag)));
  } catch (error) {}
}

/**
 * Revalidate cache cho home page
 */
export async function revalidateHome() {
  try {
    await callRevalidateAPI("home");
  } catch (error) {}
}

/**
 * Revalidate cache cho categories
 */
export async function revalidateCategories() {
  try {
    await callRevalidateAPI("categories");
  } catch (error) {}
}

/**
 * Revalidate cache cho tags
 */
export async function revalidateTags() {
  try {
    await callRevalidateAPI("tags");
  } catch (error) {}
}

/**
 * Revalidate cache cho landing page content
 */
export async function revalidateLanding() {
  try {
    await Promise.all([
      callRevalidateAPI("landing-memory-flow"),
      callRevalidateAPI("landing-founders"),
      callRevalidateAPI("landing"),
    ]);
  } catch (error) {
    // Không throw error để không block flow
  }
}

/**
 * Revalidate cache cho BeeIT landing page
 * Gọi sau khi admin update Hero, Stats, Footer, Leaders
 */
export async function revalidateBeeit() {
  try {
    await Promise.all([
      callRevalidateAPI("beeit"),
      callRevalidateAPI("beeit-hero"),
      callRevalidateAPI("beeit-stats"),
      callRevalidateAPI("beeit-footer"),
      callRevalidateAPI("beeit-leaders"),
    ]);
  } catch (error) {
    // Không throw error để không block flow
    console.error("Error revalidating BeeIT cache:", error);
  }
}
