import { notFound } from "next/navigation";
import { getQuestionDetail } from "@/services/home";
import { QuestionDetail } from "@/components/home/questions/QuestionDetail";
import { QuestionDetailPageClient } from "@/components/home/questions/QuestionDetailPageClient";

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

      {/* Client component để xử lý form trả lời và revalidate */}
      <QuestionDetailPageClient question={question} initialAnswers={answers} />
    </div>
  );
}
