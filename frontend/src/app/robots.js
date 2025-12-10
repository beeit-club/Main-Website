import { getSiteUrl } from "@/lib/seo";

/**
 * Generate robots.txt for Next.js
 * Next.js sẽ tự động tạo /robots.txt từ file này
 */
export default function robots() {
  const baseUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/profile/",
          "/apply/",
          "/login",
          "/register",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

