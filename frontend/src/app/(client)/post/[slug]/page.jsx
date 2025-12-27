import { ArticleDetail } from "@/components/home/post/article-detail";
import { fetchArticleDetail } from "@/services/post";
import { notFound } from "next/navigation";
import { getFullUrl, getOgImageUrl } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const response = await fetchArticleDetail(slug);

    if (!response || response.status !== "success" || !response.data) {
      return {
        title: "Không tìm thấy bài viết",
      };
    }

    const post = response.data;
    const url = getFullUrl(`/post/${slug}`);
    const ogImage = post.featured_image 
      ? getOgImageUrl(post.featured_image, "/logo.jpg")
      : getOgImageUrl("/logo.jpg");
    
    return {
      title: post.title || "Bài viết",
      description: post.meta_description || "Bài viết từ Bee IT Club",
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: post.title || "Bài viết",
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
            alt: post.title || "Bee IT Club",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title || "Bài viết",
        description: post.meta_description || "Bài viết từ Bee IT Club",
        images: [ogImage],
      },
    };
  } catch (error) {
    console.error("Failed to generate metadata:", error);
    return {
      title: "Lỗi",
      description: "Đã xảy ra lỗi khi tải thông tin bài viết.",
    };
  }
}

export default async function PostDetail({ params }) {
  const { slug } = await params;
  let response;

  try {
    response = await fetchArticleDetail(slug);
  } catch (error) {
    console.error("Error fetching post:", error);
    notFound();
  }

  // Kiểm tra response hợp lệ
  if (!response || response.status !== "success" || !response.data) {
    notFound();
  }

  const article = response.data;

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <ArticleDetail article={article} />
      </div>
    </main>
  );
}
