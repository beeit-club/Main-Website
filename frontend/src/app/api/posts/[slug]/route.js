// Proxy API - cache tại FE (ISR)
import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache toàn route này 1h
export const runtime = "nodejs";
export async function GET(req, { params }) {
  const { slug } = params;

  try {
    // Gọi đến backend Laravel thật
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/client/posts/${slug}`,
      {
        method: "GET",
        // Revalidate dữ liệu JSON riêng
        next: {
          revalidate: 600, // cache data 10 phút
          tags: ["posts", `post-${slug}`],
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { message: "Không tìm thấy bài viết" },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Trả về dữ liệu kèm header cache để Next xử lý ISR đúng cách
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
      },
    });
  } catch (err) {
    console.error("❌ Proxy API Error:", err);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
