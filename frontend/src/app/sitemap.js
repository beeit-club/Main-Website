import { getSiteUrl } from "@/lib/seo";
import { fetchAllPosts } from "@/services/post";
import { fetchAllEvents } from "@/services/event";
import { getAllQuestions } from "@/services/home";

// Ensure baseUrl is absolute and valid
const getBaseUrl = () => {
  const url = getSiteUrl();
  return url.startsWith("http") ? url : `https://${url}`;
};

/**
 * Generate sitemap for Next.js
 * Next.js sẽ tự động tạo /sitemap.xml từ file này
 */
export default async function sitemap() {
  const baseUrl = getBaseUrl();
  const routes = [];
  const now = new Date();

  // Static routes
  const staticRoutes = [
    "",
    "/post",
    "/events",
    "/documents",
    "/questions",
    "/members",
    "/search",
  ];

  const priorities = {
    "": 1.0,
    "/post": 0.9,
    "/events": 0.9,
    "/documents": 0.8,
    "/questions": 0.9,
    "/members": 0.7,
    "/search": 0.5,
  };

  const frequencies = {
    "": "daily",
    "/post": "hourly",
    "/events": "hourly",
    "/documents": "daily",
    "/questions": "hourly",
    "/members": "daily",
    "/search": "daily",
  };

  staticRoutes.forEach((route) => {
    routes.push({
      url: `${baseUrl}${route}`,
      lastModified: now,
      changeFrequency: frequencies[route],
      priority: priorities[route],
    });
  });

  // Fetch data in parallel to reduce generation time (Critical for GSC timeout)
  const [postsResult, eventsResult, questionsResult] = await Promise.allSettled([
    fetchAllPosts({ limit: 1000 }),
    fetchAllEvents({ limit: 1000 }),
    getAllQuestions({ limit: 1000 }),
  ]);

  // Process Posts
  if (postsResult.status === "fulfilled") {
    const posts = postsResult.value?.data?.data || [];
    posts.forEach((post) => {
      if (post.slug && post.status === 1) {
        routes.push({
          url: `${baseUrl}/post/${post.slug}`,
          lastModified: post.updated_at ? new Date(post.updated_at) : now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    });
  } else {
    console.error("[Sitemap] Failed to fetch posts:", postsResult.reason);
  }

  // Process Events
  if (eventsResult.status === "fulfilled") {
    const events = eventsResult.value?.data?.data || [];
    events.forEach((event) => {
      const identifier = event.slug || event.id;
      if (identifier && event.status === 1) {
        routes.push({
          url: `${baseUrl}/events/${identifier}`,
          lastModified: event.updated_at ? new Date(event.updated_at) : now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    });
  } else {
    console.error("[Sitemap] Failed to fetch events:", eventsResult.reason);
  }

  // Process Questions
  if (questionsResult.status === "fulfilled") {
    const questions = questionsResult.value?.data?.data || [];
    questions.forEach((question) => {
      if (question.slug) {
        routes.push({
          url: `${baseUrl}/questions/${question.slug}`,
          lastModified: question.updated_at ? new Date(question.updated_at) : now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    });
  } else {
    console.error("[Sitemap] Failed to fetch questions:", questionsResult.reason);
  }

  return routes;
}
