import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/home/questions/QuestionCard";
import { getAllQuestions } from "@/services/home";
// (Bạn có thể tạo component Pagination dựa trên shadcn/ui sau)
// import { Pagination } from '@/components/ui/pagination';

// Bắt buộc revalidate để lấy dữ liệu mới
export const revalidate = 60; // Revalidate mỗi 60s

async function getQuestions(searchParams) {
  try {
    const params = {
      page: searchParams.page || 1,
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
  const { data: questions, pagination } = await getQuestions(searchParams);

  return (
    <div className="container max-w-4xl mx-auto py-8 md:py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">Tất cả câu hỏi</h1>
        <Button>Đặt câu hỏi mới</Button>
      </div>

      <div className="flex flex-col space-y-4">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))
        ) : (
          <p className="text-muted-foreground text-center py-10">
            Chưa có câu hỏi nào.
          </p>
        )}
      </div>

      {/* TODO: Thêm component Pagination ở đây */}
      {/* <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
      /> */}
    </div>
  );
}
