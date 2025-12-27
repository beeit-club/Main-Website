import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/home/questions/QuestionCard";
import { getAllQuestions } from "@/services/home";
import { EmptyState } from "@/components/common/EmptyState";
import { PostPagination } from "@/components/home/post/components/post-pagination";
import { HelpCircle } from "lucide-react";
import Link from "next/link";
import { getFullUrl, getOgImageUrl } from "@/lib/seo";

// Bắt buộc revalidate để lấy dữ liệu mới
export const revalidate = 60; // Revalidate mỗi 60s

export const metadata = {
  title: "Câu hỏi & Thảo luận",
  description:
    "Khám phá các câu hỏi và thảo luận từ cộng đồng Bee IT. Đặt câu hỏi, chia sẻ kiến thức và học hỏi từ các thành viên.",
  alternates: {
    canonical: getFullUrl("/questions"),
  },
  openGraph: {
    title: "Câu hỏi & Thảo luận | Bee IT Club",
    description:
      "Khám phá các câu hỏi và thảo luận từ cộng đồng Bee IT. Đặt câu hỏi, chia sẻ kiến thức và học hỏi từ các thành viên.",
    url: getFullUrl("/questions"),
    type: "website",
    siteName: "Bee IT Club",
    images: [
      {
        url: getOgImageUrl("/og-image-questions.png"),
        width: 1200,
        height: 630,
        alt: "Câu hỏi & Thảo luận - Bee IT Club",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Câu hỏi & Thảo luận | Bee IT Club",
    description:
      "Khám phá các câu hỏi và thảo luận từ cộng đồng Bee IT.",
    images: [getOgImageUrl("/og-image-questions.png")],
  },
};

async function getQuestions(searchParams) {
  try {
    // Xử lý searchParams an toàn - có thể là undefined hoặc object
    const safeSearchParams = searchParams || {};
    
    // Parse page, đảm bảo là number
    const page = safeSearchParams.page 
      ? parseInt(Array.isArray(safeSearchParams.page) ? safeSearchParams.page[0] : safeSearchParams.page, 10) || 1
      : 1;

    const params = {
      page,
      limit: 10,
    };
    const res = await getAllQuestions(params);
    if (res.status === "success") {
      return res.data; // { data: [], pagination: {} }
    }
  } catch (error) {
    console.error("Failed to fetch questions:", error);
  }
  return { data: [], pagination: {} };
}

export default async function QuestionsPage({ searchParams }) {
  // Next.js 16: searchParams là Promise, cần await
  const resolvedSearchParams = await searchParams;
  const { data: questions, pagination } = await getQuestions(resolvedSearchParams);

  return (
    <div className="container max-w-4xl mx-auto py-8 md:py-12 px-4 overflow-hidden">
      <div className="flex items-center justify-between mb-6 gap-4 overflow-hidden">
        <h1 className="text-3xl md:text-4xl font-bold truncate flex-1 min-w-0">Tất cả câu hỏi</h1>
        <Button asChild className="flex-shrink-0">
          <a href="/questions/ask">Đặt câu hỏi mới</a>
        </Button>
      </div>

      <div className="flex flex-col space-y-4 overflow-hidden">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))
        ) : (
          <EmptyState
            icon={<HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-50 text-muted-foreground" />}
            title="Chưa có câu hỏi nào"
            description="Hãy đặt câu hỏi đầu tiên để bắt đầu thảo luận!"
            action={
              <Button asChild>
                <Link href="/questions/ask">Đặt câu hỏi mới</Link>
              </Button>
            }
          />
        )}
      </div>

      {/* Pagination */}
      {questions.length > 0 && pagination.totalPages > 1 && (
        <div className="mt-8">
          <PostPagination pagination={pagination} baseUrl="/questions" />
        </div>
      )}
    </div>
  );
}
