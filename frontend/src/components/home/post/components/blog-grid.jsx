import { BlogCard } from "./blog-card";

export function BlogGrid({ posts }) {
  // Kiểm tra empty array
  if (!posts || posts.length === 0) {
    return null; // Để parent component xử lý empty state
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
      {posts.map((post) => {
        return <BlogCard key={post.id} post={post} />;
      })}
    </div>
  );
}
