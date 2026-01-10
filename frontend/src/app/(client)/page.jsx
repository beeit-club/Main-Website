import Banner from "@/components/home/Banner/Banner";
import ClientHome from "@/components/home/post/ClientHome";
import { getHome } from "@/services/home";
import { notFound } from "next/navigation";
import { getSiteUrl, getFullUrl, getOgImageUrl } from "@/lib/seo";
import Header from "@/components/layout/Header";

// Revalidate every hour
export const revalidate = 3600;

export const metadata = {
  title: "Trang chủ",
  description:
    "Bee IT là câu lạc bộ công nghệ thông tin trực thuộc FPT Polytechnic, nơi chia sẻ kiến thức và kết nối cộng đồng sinh viên yêu thích CNTT.",
  alternates: {
    canonical: getFullUrl("/"),
  },
  openGraph: {
    title: "Bee IT Club - Câu lạc bộ Công nghệ Thông tin",
    description:
      "Bee IT là câu lạc bộ công nghệ thông tin trực thuộc FPT Polytechnic, nơi chia sẻ kiến thức và kết nối cộng đồng sinh viên yêu thích CNTT.",
    url: getFullUrl("/"),
    type: "website",
    siteName: "Bee IT Club",
    images: [
      {
        url: getOgImageUrl("/og-image-homepage.png"),
        width: 1200,
        height: 630,
        alt: "Bee IT Club - Trang chủ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bee IT Club - Câu lạc bộ Công nghệ Thông tin",
    description:
      "Bee IT là câu lạc bộ công nghệ thông tin trực thuộc FPT Polytechnic, nơi chia sẻ kiến thức và kết nối cộng đồng sinh viên yêu thích CNTT.",
    images: [getOgImageUrl("/og-image-homepage.png")],
  },
};

export default async function Page() {
  let apiResponse;
  try {
    apiResponse = await getHome();
  } catch (error) {
    // Log error but don't crash the build
    // Return empty data structure to allow build to complete
    // At runtime, the page will show empty state or can be revalidated
    console.error("Error fetching home data:", error.message || error);
    apiResponse = {
      data: {
        home: {
          latestEvent: null,
          latestPosts: [],
          mostViewedPosts: [],
        },
      },
    };
  }

  // Ensure we have valid data structure
  const homeData = apiResponse?.data?.home || {
    latestEvent: null,
    latestPosts: [],
    mostViewedPosts: [],
  };

  const { latestEvent, latestPosts, mostViewedPosts } = homeData;
  return (
    <main className="">

      <Banner />
      <div className="max-w-7xl mx-auto">
        <ClientHome
          latestEvent={latestEvent}
          latestPosts={latestPosts}
          mostViewedPosts={mostViewedPosts}
        />
      </div>
    </main>
  );
}
