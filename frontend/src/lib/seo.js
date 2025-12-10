/**
 * SEO Utility Functions
 */

/**
 * Get site URL from environment variable or default
 */
export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://yourdomain.com"
  );
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
export function getOgImageUrl(imagePath, defaultImage = "/og-image-default.png") {
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
  
  // Trim and limit length
  return text.trim().substring(0, maxLength);
}

/**
 * Generate default metadata
 */
export function getDefaultMetadata() {
  const siteUrl = getSiteUrl();
  
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Bee IT Club",
      template: "%s | Bee IT Club",
    },
    description:
      "Bee IT là câu lạc bộ công nghệ thông tin trực thuộc FPT Polytechnic, nơi chia sẻ kiến thức và kết nối cộng đồng sinh viên yêu thích CNTT.",
    keywords: [
      "Bee IT",
      "FPT Polytechnic",
      "Câu lạc bộ CNTT",
      "Công nghệ thông tin",
      "IT Club",
      "Học lập trình",
      "Chia sẻ kiến thức",
    ],
    authors: [{ name: "Bee IT Club" }],
    creator: "Bee IT Club",
    publisher: "Bee IT Club",
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: siteUrl,
      siteName: "Bee IT Club",
      images: [
        {
          url: getOgImageUrl("/og-image-default.png"),
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
  };
}

