import { ArticleDetail } from "@/components/home/post/article-detail";
import { fetchArticleDetail } from "@/services/post";
import { notFound } from "next/navigation";
import { getFullUrl, getOgImageUrl } from "@/lib/seo";

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
    const url = getFullUrl(`/post/${slug}`);
    const ogImage = post.featured_image 
      ? getOgImageUrl(post.featured_image, "/logo.jpg")
      : getOgImageUrl("/logo.jpg");
    
    return {
      title: post.title,
      description: post.meta_description || "Bài viết từ Bee IT Club",
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: post.title,
        description: post.meta_description || "Bài viết từ Bee IT Club",
        url,
        type: "article",
        siteName: "Bee IT Club",
        publishedTime: post.published_at,
        modifiedTime: post.updated_at,
        authors: [post.author_name || "Bee IT Club"],
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.meta_description || "Bài viết từ Bee IT Club",
        images: [ogImage],
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
