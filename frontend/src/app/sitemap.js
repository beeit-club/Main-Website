import { getSiteUrl } from "@/lib/seo";
import { fetchAllPosts } from "@/services/post";
import { fetchAllEvents } from "@/services/event";
import { getAllQuestions } from "@/services/home";

const baseUrl = getSiteUrl();

/**
 * Generate sitemap for Next.js
 * Next.js sẽ tự động tạo /sitemap.xml từ file này
 */
export default async function sitemap() {
  const routes = [];
  const now = new Date();

  // Static routes
  routes.push({
    url: baseUrl,
    lastModified: now,
    changeFrequency: "daily",
    priority: 1.0,
  });

  routes.push({
    url: `${baseUrl}/post`,
    lastModified: now,
    changeFrequency: "hourly",
    priority: 0.9,
  });

  routes.push({
    url: `${baseUrl}/events`,
    lastModified: now,
    changeFrequency: "hourly",
    priority: 0.9,
  });

  routes.push({
    url: `${baseUrl}/documents`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  });

  routes.push({
    url: `${baseUrl}/questions`,
    lastModified: now,
    changeFrequency: "hourly",
    priority: 0.9,
  });

  routes.push({
    url: `${baseUrl}/members`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  });

  routes.push({
    url: `${baseUrl}/search`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.5,
  });

  // Dynamic routes - Posts
  // Gracefully handle API failures during build (API may not be available)
  try {
    const postsResponse = await fetchAllPosts({ limit: 1000 }); // Lấy tối đa 1000 posts
    const posts = postsResponse?.data?.data || [];

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
  } catch (error) {
    // Silently fail - static routes are already added, build can continue
    // Only log in non-build environments to reduce build noise
    if (
      process.env.NODE_ENV !== "production" ||
      process.env.NEXT_PHASE !== "phase-production-build"
    ) {
      console.error("Error fetching posts for sitemap:", error);
    }
  }

  // Dynamic routes - Events
  try {
    const eventsResponse = await fetchAllEvents({ limit: 1000 });
    const events = eventsResponse?.data?.data || [];

    events.forEach((event) => {
      // Events có thể dùng id hoặc slug
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
  } catch (error) {
    // Silently fail - static routes are already added, build can continue
    if (
      process.env.NODE_ENV !== "production" ||
      process.env.NEXT_PHASE !== "phase-production-build"
    ) {
      console.error("Error fetching events for sitemap:", error);
    }
  }

  // Dynamic routes - Questions
  try {
    const questionsResponse = await getAllQuestions({ limit: 1000 });
    const questions = questionsResponse?.data?.data || [];

    questions.forEach((question) => {
      if (question.slug) {
        routes.push({
          url: `${baseUrl}/questions/${question.slug}`,
          lastModified: question.updated_at
            ? new Date(question.updated_at)
            : now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    });
  } catch (error) {
    // Silently fail - static routes are already added, build can continue
    if (
      process.env.NODE_ENV !== "production" ||
      process.env.NEXT_PHASE !== "phase-production-build"
    ) {
      console.error("Error fetching questions for sitemap:", error);
    }
  }

  return routes;
}
