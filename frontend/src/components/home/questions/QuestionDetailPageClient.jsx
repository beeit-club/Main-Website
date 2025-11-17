"use client";

import { useRouter } from "next/navigation";
import { AnswerCard } from "@/components/home/questions/AnswerCard";
import { AnswerForm } from "@/components/home/questions/AnswerForm";

export function QuestionDetailPageClient({ question, initialAnswers }) {
  const router = useRouter();

  const handleAnswerSuccess = async () => {
    // Revalidate cache để cập nhật danh sách câu trả lời
    // Tag phải khớp với tag trong getQuestionDetail (services/home.js)
    try {
      // Revalidate tag "question" và tag động theo slug
      await Promise.all([
        fetch(`/api/revalidate?tag=question`, {
          method: "POST",
        }),
        fetch(`/api/revalidate?tag=${question.slug}`, {
          method: "POST",
        }),
      ]);
      console.log(`✅ Cache revalidated for question and ${question.slug}`);
    } catch (revalidateError) {
      console.error("⚠️ Failed to revalidate cache:", revalidateError);
    }

    // Refresh page để lấy dữ liệu mới
    router.refresh();
  };

  // Tính tổng số answers (bao gồm cả nested)
  const countAllAnswers = (answers) => {
    if (!answers || answers.length === 0) return 0;
    let count = 0;
    answers.forEach((answer) => {
      count += 1; // Count chính answer này
      if (answer.children && answer.children.length > 0) {
        count += countAllAnswers(answer.children); // Count children
      }
    });
    return count;
  };

  const { answers = initialAnswers || [] } = question || {};
  const totalAnswers = countAllAnswers(answers);

  return (
    <>
      {/* Phần câu trả lời */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">
          {totalAnswers} {totalAnswers === 1 ? "Trả lời" : "Trả lời"}
        </h2>
      </div>

      {/* Form trả lời */}
      <AnswerForm questionId={question.id} onSuccess={handleAnswerSuccess} />

      {/* Danh sách các câu trả lời (tree structure) */}
      <div className="flex flex-col mt-6">
        {answers.length > 0 ? (
          answers.map((answer) => (
            <AnswerCard
              key={answer.id}
              answer={answer}
              questionId={question.id}
              onReplySuccess={handleAnswerSuccess}
              depth={0}
            />
          ))
        ) : (
          <p className="text-muted-foreground text-center py-6">
            Hãy là người đầu tiên trả lời câu hỏi này!
          </p>
        )}
      </div>
    </>
  );
}

