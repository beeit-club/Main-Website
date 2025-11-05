import { ArticleDetail } from "@/components/home/post/article-detail";
import { fetchArticleDetail } from "@/services/post";

export const revalidate = 3600; // ISR toàn trang 1h

// ✅ SEO động cho từng bài
export async function generateMetadata({ params }) {
  const { slug } = await params; // 👈 thêm await
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BACKEND}/client/posts/${slug}`
  );
  const post = await res.json();

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
}

// ✅ Trang chi tiết
export default async function PostDetail({ params }) {
  const { slug } = await params; // 👈 thêm await
  const article = await fetchArticleDetail(slug);

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <ArticleDetail article={article?.data} />
      </div>
    </main>
  );
}
