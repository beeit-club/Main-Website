/**
 * SEO Utility Functions
 */

/**
 * Get site URL from environment variable or default
 * Optimized for Production and SEO
 */
export function getSiteUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;
  const isProduction = process.env.NODE_ENV === "production";

  let url = "https://beeitclub.com"; // Default fallback

  if (envUrl && (!isProduction || !envUrl.includes("localhost"))) {
    url = envUrl;
  } else if (process.env.VERCEL_URL) {
    url = `https://${process.env.VERCEL_URL}`;
  }

  // Ensure protocol
  if (!url.startsWith("http")) {
    url = `https://${url}`;
  }

  // Remove trailing slash
  return url.replace(/\/$/, "");
}

/**
 * Generate full URL for a path
 */
export function getFullUrl(path) {
  const siteUrl = getSiteUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${cleanPath}`;
}

/**
 * Generate canonical URL
 */
export function getCanonicalUrl(path) {
  return getFullUrl(path);
}

/**
 * Generate OpenGraph image URL
 */
export function getOgImageUrl(imagePath, defaultImage = "/logo.jpg") {
  if (!imagePath) {
    return getFullUrl(defaultImage);
  }

  // If already full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If relative path, make it full URL
  return getFullUrl(imagePath);
}

/**
 * Clean HTML for meta description
 */
export function cleanHtmlForMeta(html, maxLength = 160) {
  if (!html) return "";

  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, "");

  // Remove extra whitespace
  const cleaned = text.replace(/\s+/g, " ").trim();

  // Trim and limit length
  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  // Truncate at word boundary
  return cleaned.substring(0, maxLength).replace(/\s+\S*$/, "") + "...";
}

/**
 * Generate default metadata
 */
export function getDefaultMetadata() {
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Bee IT Club - Câu lạc bộ Công nghệ Thông tin FPT Polytechnic",
      template: "%s | Bee IT Club",
    },
    description:
      "Bee IT là câu lạc bộ công nghệ thông tin trực thuộc FPT Polytechnic, nơi chia sẻ kiến thức và kết nối cộng đồng sinh viên yêu thích CNTT. Tham gia để học hỏi, chia sẻ và phát triển cùng cộng đồng.",
    keywords: [
      "Bee IT",
      "Bee IT Club",
      "FPT Polytechnic",
      "Câu lạc bộ CNTT",
      "Công nghệ thông tin",
      "IT Club",
      "Học lập trình",
      "Chia sẻ kiến thức",
      "Cộng đồng sinh viên",
      "FPT Poly",
    ],
    authors: [{ name: "Bee IT Club", url: siteUrl }],
    creator: "Bee IT Club",
    publisher: "Bee IT Club",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/logo.jpg", sizes: "192x192", type: "image/jpeg" },
      ],
      apple: [
        { url: "/logo.jpg", sizes: "180x180", type: "image/jpeg" },
      ],
      shortcut: "/favicon.ico",
    },
    manifest: "/manifest.json",
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: siteUrl,
      siteName: "Bee IT Club",
      title: "Bee IT Club - Câu lạc bộ Công nghệ Thông tin FPT Polytechnic",
      description:
        "Bee IT là câu lạc bộ công nghệ thông tin trực thuộc FPT Polytechnic, nơi chia sẻ kiến thức và kết nối cộng đồng sinh viên yêu thích CNTT.",
      images: [
        {
          url: getOgImageUrl("/logo.jpg"),
          width: 1200,
          height: 630,
          alt: "Bee IT Club",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@beeitclub",
      creator: "@beeitclub",
      title: "Bee IT Club - Câu lạc bộ Công nghệ Thông tin FPT Polytechnic",
      description:
        "Bee IT là câu lạc bộ công nghệ thông tin trực thuộc FPT Polytechnic, nơi chia sẻ kiến thức và kết nối cộng đồng sinh viên yêu thích CNTT.",
      images: [getOgImageUrl("/logo.jpg")],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      // Thêm Google Search Console verification nếu có
      // google: "your-verification-code",
    },
  };
}
