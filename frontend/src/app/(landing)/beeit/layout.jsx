import { getFullUrl, getOgImageUrl } from "@/lib/seo";
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./beeit.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata = {
  title: "Giới thiệu BeeIT Club - Câu lạc bộ Công nghệ Thông tin FPT Polytechnic",
  description:
    "BeeIT Club - Cộng đồng năng động nơi các bạn có thể giao lưu, học hỏi và chia sẻ kiến thức trong lĩnh vực CNTT. Thành lập 01/07/2023 tại FPT Polytechnic.",
  keywords: [
    "BeeIT Club",
    "FPT Polytechnic",
    "Câu lạc bộ CNTT",
    "Công nghệ thông tin",
    "Lập trình viên",
    "Cộng đồng IT",
    "Học lập trình",
    "Chia sẻ kiến thức",
  ],
  authors: [{ name: "BeeIT Club" }],
  creator: "BeeIT Club",
  publisher: "BeeIT Club",
  alternates: {
    canonical: getFullUrl("/beeit"),
  },
  openGraph: {
    title: "BeeIT Club - Câu lạc bộ Công nghệ Thông tin",
    description:
      "BeeIT Club - Cộng đồng năng động nơi các bạn có thể giao lưu, học hỏi và chia sẻ kiến thức trong lĩnh vực CNTT.",
    url: getFullUrl("/beeit"),
    type: "website",
    siteName: "BeeIT Club",
    locale: "vi_VN",
    images: [
      {
        url: getOgImageUrl("/og-image-beeit.png"),
        width: 1200,
        height: 630,
        alt: "BeeIT Club - Giới thiệu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BeeIT Club - Câu lạc bộ Công nghệ Thông tin",
    description:
      "BeeIT Club - Cộng đồng năng động nơi các bạn có thể giao lưu, học hỏi và chia sẻ kiến thức trong lĩnh vực CNTT.",
    images: [getOgImageUrl("/og-image-beeit.png")],
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

export default function BeeITLayout({ children }) {
  const siteUrl = getFullUrl("");
  
  // Structured Data cho Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BeeIT Club",
    url: getFullUrl("/beeit"),
    logo: getOgImageUrl("/logo.jpg"),
    description: "BeeIT Club - Cộng đồng lập trình viên đam mê công nghệ tại FPT Polytechnic",
    foundingDate: "2023-07-01",
    address: {
      "@type": "PostalAddress",
      addressLocality: "TP.HCM",
      addressRegion: "Ho Chi Minh",
      addressCountry: "VN",
    },
    sameAs: [
      // Social links sẽ được thêm từ footer data
    ],
  };

  // Structured Data cho WebPage
  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Giới thiệu BeeIT Club",
    description: "BeeIT Club - Cộng đồng năng động nơi các bạn có thể giao lưu, học hỏi và chia sẻ kiến thức trong lĩnh vực CNTT",
    url: getFullUrl("/beeit"),
    inLanguage: "vi-VN",
    isPartOf: {
      "@type": "WebSite",
      name: "BeeIT Club",
      url: siteUrl,
    },
  };

  return (
    <>
      {/* Structured Data */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webpageSchema),
        }}
      />
      
      {/* Load Lenis for smooth scrolling */}
      <Script
        src="https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js"
        strategy="beforeInteractive"
      />
      <div
        className={`beeit-landing ${syne.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
        style={{
          fontFamily: "var(--font-plus-jakarta-sans)",
        }}
      >
        {children}
      </div>
    </>
  );
}
