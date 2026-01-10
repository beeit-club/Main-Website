import { notFound } from "next/navigation";
import { getQuestionDetail } from "@/services/home";
import QuestionDetailClient from "./QuestionDetailClient";
import { getFullUrl, cleanHtmlForMeta } from "@/lib/seo";

export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    // using clean fetch service
    const res = await getQuestionDetail(slug);

    if (!res || !res.data) {
      return {
        title: "Không tìm thấy câu hỏi",
      };
    }

    const question = res.data.question || res.data;
    const url = getFullUrl(`/questions/${slug}`);
    const description = cleanHtmlForMeta(question.content || "");

    return {
      title: question.title,
      description: description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: question.title,
        description: description,
        url,
        type: "website",
        siteName: "Bee IT Club",
      },
      twitter: {
        card: "summary",
        title: question.title,
        description: description,
      },
    };
  } catch (error) {
    console.error("Failed to generate metadata for question:", error);
    return {
      title: "Câu hỏi - Bee IT Club",
    };
  }
}

export default async function QuestionDetailPage({ params }) {
  const { slug } = await params;
  let questionData = null;

  try {
    const res = await getQuestionDetail(slug);
    if (res && res.data) {
      questionData = res.data.question || res.data;
    }
  } catch (error) {
    console.error("Error fetching question:", error);
  }

  if (!questionData) {
    notFound();
  }

  // Schema.org JSON-LD for Q&A
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "mainEntity": {
      "@type": "Question",
      "name": questionData.title,
      "text": cleanHtmlForMeta(questionData.content || ""),
      "answerCount": questionData.answers ? questionData.answers.length : 0,
      "upvoteCount": questionData.votes || 0,
      "dateCreated": questionData.created_at,
      "author": {
        "@type": "Person",
        "name": questionData.author_name || "Anonymous"
      },
      "acceptedAnswer": questionData.answers?.find(a => a.is_accepted) ? {
        "@type": "Answer",
        "text": cleanHtmlForMeta(questionData.answers.find(a => a.is_accepted).content),
        "dateCreated": questionData.answers.find(a => a.is_accepted).created_at,
        "upvoteCount": questionData.answers.find(a => a.is_accepted).vote_score || 0,
        "url": getFullUrl(`/questions/${slug}#answer-${questionData.answers.find(a => a.is_accepted).id}`),
        "author": {
          "@type": "Person",
          "name": questionData.answers.find(a => a.is_accepted).author_name || "Anonymous"
        }
      } : undefined,
      "suggestedAnswer": questionData.answers?.filter(a => !a.is_accepted).map(a => ({
        "@type": "Answer",
        "text": cleanHtmlForMeta(a.content),
        "dateCreated": a.created_at,
        "upvoteCount": a.vote_score || 0,
        "author": {
          "@type": "Person",
          "name": a.author_name || "Anonymous"
        }
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <QuestionDetailClient initialQuestion={questionData} />
    </>
  );
}