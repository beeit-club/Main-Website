import { notFound } from "next/navigation";
import { getQuestionDetail } from "@/services/home";
import { QuestionDetail } from "@/components/home/questions/QuestionDetail";
import { QuestionDetailPageClient } from "@/components/home/questions/QuestionDetailPageClient";
import { getFullUrl, getOgImageUrl, cleanHtmlForMeta } from "@/lib/seo";

export const revalidate = 60; // Revalidate mỗi 60s

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const res = await getQuestionDetail(slug);
    
    if (!res || res.status !== "success" || !res.data) {
      return {
        title: "Không tìm thấy câu hỏi",
      };
    }

    const question = res.data;
    const url = getFullUrl(`/questions/${slug}`);
    const description = cleanHtmlForMeta(question.content || question.meta_description || "");

    return {
      title: question.title || "Câu hỏi",
      description: description || "Câu hỏi từ cộng đồng Bee IT Club",
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: question.title || "Câu hỏi",
        description: description || "Câu hỏi từ cộng đồng Bee IT Club",
        url,
        type: "article",
        siteName: "Bee IT Club",
        images: [
          {
            url: getOgImageUrl("/logo.jpg"),
            width: 1200,
            height: 630,
            alt: question.title || "Bee IT Club",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: question.title || "Câu hỏi",
        description: description || "Câu hỏi từ cộng đồng Bee IT Club",
        images: [getOgImageUrl("/logo.jpg")],
      },
    };
  } catch (error) {
    console.error("Failed to generate metadata for question:", error);
    return {
      title: "Lỗi",
      description: "Đã xảy ra lỗi khi tải thông tin câu hỏi.",
    };
  }
}

async function getQuestion(slug) {
  try {
    const res = await getQuestionDetail(slug);
    if (res && res.status === "success" && res.data) {
      // Log dữ liệu sau khi parse
      console.log('=== DEBUG: Question data in getQuestion function ===');
      console.log('author_name:', res.data.author_name);
      console.log('author_avatar:', res.data.author_avatar);
      console.log('author_id:', res.data.author_id);
      console.log('Full question data:', JSON.stringify(res.data, null, 2));
      console.log('====================================================');
      
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
  const { slug } = await params;
  const question = await getQuestion(slug);

  if (!question) {
    notFound(); // Kích hoạt trang not-found.js
  }

  // Debug: Kiểm tra dữ liệu question
  if (process.env.NODE_ENV === 'development') {
    console.log('Question data:', {
      id: question.id,
      title: question.title,
      author_name: question.author_name,
      author_avatar: question.author_avatar,
      has_avatar: !!question.author_avatar
    });
  }

  const { answers } = question;

  return (
    <div className="container max-w-4xl mx-auto py-8 md:py-12">
      {/* Component chi tiết câu hỏi */}
      <QuestionDetail question={question} />

      {/* Đường gạch ngang */}
      <hr className="my-8" />

      {/* Client component để xử lý form trả lời và revalidate */}
      <QuestionDetailPageClient question={question} initialAnswers={answers || []} />
    </div>
  );
}
