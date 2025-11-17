import { ArticleDetail } from "@/components/home/post/article-detail";
import { fetchArticleDetail } from "@/services/post";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const article = await fetchArticleDetail(slug);

    if (!article) {
      return {
        title: "Không tìm thấy bài viết",
      };
    }

    // Giả sử dữ liệu nằm trong article.data
    const post = article.data;
    const url = `https://yourdomain.com/blog/${slug}`;
    return {
      title: post.title,
      description: post.meta_description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: post.title,
        description: post.meta_description,
        url,
        type: "article",
        images: [post.featured_image],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.meta_description,
        images: [post.featured_image],
      },
    };
  } catch (error) {
    // Xử lý lỗi mạng
    console.error("Failed to generate metadata:", error);
    return {
      title: "Lỗi",
      description: "Đã xảy ra lỗi khi tải thông tin bài viết.",
    };
  }
}

export default async function PostDetail({ params }) {
  const { slug } = await params;
  let article;

  try {
    article = await fetchArticleDetail(slug);
  } catch (error) {
    console.error(error);
    throw new Error("Không thể tải bài viết. Vui lòng thử lại sau.");
  }
  if (!article) {
    notFound();
  }
  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <ArticleDetail article={article?.data} />
      </div>
    </main>
  );
}
