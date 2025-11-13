import { notFound } from "next/navigation";
import { getQuestionDetail } from "@/services/home";
import { AnswerCard } from "@/components/home/questions/AnswerCard";
import { QuestionDetail } from "@/components/home/questions/QuestionDetail";

export const revalidate = 60; // Revalidate mỗi 60s

async function getQuestion(slug) {
  try {
    const res = await getQuestionDetail(slug);
    if (res.status === "success") {
      return res.data; // { ...question, answers: [] }
    }
  } catch (error) {
    // Nếu lỗi 404
    if (error.response && error.response.status === 404) {
      return null;
    }
    console.error("Failed to fetch question:", error);
  }
  return null;
}

export default async function QuestionDetailPage({ params }) {
  const { slug } = params;
  const question = await getQuestion(slug);

  if (!question) {
    notFound(); // Kích hoạt trang not-found.js
  }

  const { answers } = question;

  return (
    <div className="container max-w-4xl mx-auto py-8 md:py-12">
      {/* Component chi tiết câu hỏi */}
      <QuestionDetail question={question} />

      {/* Đường gạch ngang */}
      <hr className="my-8" />

      {/* Phần câu trả lời */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">{answers.length} Trả lời</h2>
        {/* (Bạn có thể thêm 1 component Editor để trả lời ở đây) */}
      </div>

      {/* Danh sách các câu trả lời */}
      <div className="flex flex-col">
        {answers.length > 0 ? (
          answers.map((answer) => (
            <AnswerCard key={answer.id} answer={answer} />
          ))
        ) : (
          <p className="text-muted-foreground text-center py-6">
            Hãy là người đầu tiên trả lời câu hỏi này!
          </p>
        )}
      </div>
    </div>
  );
}
