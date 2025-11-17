import Banner from "@/components/home/Banner/Banner";
import Home from "@/components/home/post/post";
import { getHome } from "@/services/home";
import { notFound } from "next/navigation";

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
