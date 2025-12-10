import Banner from "@/components/home/Banner/Banner";
import Home from "@/components/home/post/post";
import { getHome } from "@/services/home";
import { notFound } from "next/navigation";
import { getSiteUrl, getFullUrl, getOgImageUrl } from "@/lib/seo";

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
    console.error(error);
    // In a real app, you might want a nicer error boundary
    throw new Error("Không thể tải dữ liệu trang chủ. Vui lòng thử lại sau.");
  }

  if (!apiResponse || !apiResponse.data || !apiResponse.data.home) {
    notFound();
  }

  const { latestEvent, latestPosts, mostViewedPosts } = apiResponse.data.home;
  return (
    <main className="">
      <Banner />
      <div className="max-w-7xl mx-auto">
        <Home
          latestEvent={latestEvent}
          latestPosts={latestPosts}
          mostViewedPosts={mostViewedPosts}
        />
      </div>
    </main>
  );
}
