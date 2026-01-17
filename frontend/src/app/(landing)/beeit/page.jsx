import BeeITPageClient from "./BeeITPageClient";
import { mockLandingData } from "@/mock/landingData";
import { getFullUrl, getOgImageUrl } from "@/lib/seo";

const API_BACKEND = process.env.NEXT_PUBLIC_API_BACKEND || "http://localhost:8000";

async function getData() {
  try {
    console.log(`[BeeIT] Fetching data from: ${API_BACKEND}/client/landing`);
    const res = await fetch(`${API_BACKEND}/client/landing`, {
      next: { tags: ['landing'] },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch landing data: ${res.status}`);
    }

    const data = await res.json();
    console.log("[BeeIT] Fetch Success. Hero Title:", data?.hero?.title_line1);
    return data;
  } catch (error) {
    console.error("Error fetching landing data:", error);
    return mockLandingData; // Fallback to mock data
  }
}

// Generate metadata với dynamic data
export async function generateMetadata() {
  const beeitData = await getData();
  const hero = beeitData?.hero;
  const stats = beeitData?.stats || [];

  // Tạo description từ hero subtitle hoặc default
  const description = hero?.subtitle
    ? hero.subtitle.substring(0, 160)
    : "BeeIT Club - Cộng đồng lập trình viên đam mê công nghệ. Nơi kết nối tri thức, chia sẻ kinh nghiệm và kiến tạo những sản phẩm đột phá.";

  // Tạo title từ hero hoặc default
  const title = hero
    ? `${hero.title_line1 || "BUILDING THE"} ${hero.title_line2 || "DIGITAL HIVE"} | BeeIT Club`
    : "Giới thiệu BeeIT Club - Câu lạc bộ Công nghệ Thông tin";

  // Tạo keywords từ stats
  const keywords = [
    "BeeIT Club",
    "FPT Polytechnic",
    "Câu lạc bộ CNTT",
    "Công nghệ thông tin",
    "Lập trình viên",
    "Cộng đồng IT",
  ];

  // Thêm stats vào keywords
  stats.forEach(stat => {
    if (stat.label) {
      keywords.push(stat.label.toLowerCase());
    }
  });

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: getFullUrl("/beeit"),
    },
    openGraph: {
      title: title,
      description: description,
      url: getFullUrl("/beeit"),
      type: "website",
      siteName: "BeeIT Club",
      images: [
        {
          url: hero?.background_image_url
            ? getOgImageUrl(hero.background_image_url)
            : getOgImageUrl("/og-image-beeit.png"),
          width: 1200,
          height: 630,
          alt: hero?.background_image_alt || "BeeIT Club - Giới thiệu",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [
        hero?.background_image_url
          ? getOgImageUrl(hero.background_image_url)
          : getOgImageUrl("/og-image-beeit.png")
      ],
    },
    metadataBase: new URL(getFullUrl("")),
  };
}

export default async function BeeITLandingPage() {
  const beeitData = await getData();

  return <BeeITPageClient initialData={beeitData} />;
}
