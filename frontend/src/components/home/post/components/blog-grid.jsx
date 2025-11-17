import { BlogCard } from "./blog-card";

export function BlogGrid({ posts }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
      {posts.map((post) => {
        return <BlogCard key={post.id} post={post} />;
      })}
    </div>
  );
}
