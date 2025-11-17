import { Suspense } from "react";
import { fetchAllPosts } from "@/services/post";
import { BlogGrid } from "@/components/home/post/components/blog-grid";
import { BlogList } from "@/components/home/post/components/blog-list";
import { PostFilters } from "@/components/home/post/components/post-filters";
import { PostPagination } from "@/components/home/post/components/post-pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutGrid, List } from "lucide-react";

// Revalidate every hour
export const revalidate = 3600;

export const metadata = {
  title: "Danh sách Bài viết | Bee IT Club",
  description:
    "Khám phá các bài viết, hướng dẫn và chia sẻ kiến thức về công nghệ từ cộng đồng Bee IT",
  openGraph: {
    title: "Danh sách Bài viết | Bee IT Club",
    description:
      "Khám phá các bài viết, hướng dẫn và chia sẻ kiến thức về công nghệ",
    type: "website",
  },
};

// Loading skeleton component
function PostsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-video w-full" />
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function getData(searchParams) {
  try {
    const params = {
      page: searchParams.page || 1,
      limit: searchParams.limit || 12,
      ...(searchParams.category && {
        category: searchParams.category,
      }),
      ...(searchParams.title && { title: searchParams.title }),
    };

    // Chỉ fetch posts, categories đã có trong Zustand store
    const postsResponse = await fetchAllPosts(params);

    return {
      posts: postsResponse.data?.data || [],
      pagination: postsResponse.data?.pagination || {},
    };
  } catch (error) {
    console.error("Failed to fetch posts data:", error);
    return {
      posts: [],
      pagination: {},
    };
  }
}

export default async function PostsPage({ searchParams }) {
  const { posts, pagination } = await getData(searchParams);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Danh sách Bài viết
          </h1>
          <p className="text-muted-foreground">
            Khám phá các bài viết, hướng dẫn và chia sẻ từ cộng đồng
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Posts List */}
          <div className="space-y-6">
            {/* View Toggle Tabs */}
            <Tabs defaultValue="grid" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">
                    {pagination.total
                      ? `${pagination.total} bài viết`
                      : "Bài viết"}
                  </h2>
                </div>
                <TabsList>
                  <TabsTrigger value="grid" className="gap-2">
                    <LayoutGrid className="h-4 w-4" />
                    <span className="hidden sm:inline">Lưới</span>
                  </TabsTrigger>
                  <TabsTrigger value="list" className="gap-2">
                    <List className="h-4 w-4" />
                    <span className="hidden sm:inline">Danh sách</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Grid View */}
              <TabsContent value="grid" className="mt-0">
                <Suspense fallback={<PostsSkeleton />}>
                  {posts.length > 0 ? (
                    <BlogGrid posts={posts} />
                  ) : (
                    <Card className="p-12">
                      <div className="text-center text-muted-foreground">
                        <p className="text-lg font-medium mb-2">
                          Không tìm thấy bài viết nào
                        </p>
                        <p className="text-sm">
                          Thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác
                        </p>
                      </div>
                    </Card>
                  )}
                </Suspense>
              </TabsContent>

              {/* List View */}
              <TabsContent value="list" className="mt-0">
                <Suspense fallback={<PostsSkeleton />}>
                  {posts.length > 0 ? (
                    <BlogList posts={posts} />
                  ) : (
                    <Card className="p-12">
                      <div className="text-center text-muted-foreground">
                        <p className="text-lg font-medium mb-2">
                          Không tìm thấy bài viết nào
                        </p>
                        <p className="text-sm">
                          Thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác
                        </p>
                      </div>
                    </Card>
                  )}
                </Suspense>
              </TabsContent>
            </Tabs>

            {/* Pagination */}
            {posts.length > 0 && <PostPagination pagination={pagination} />}
          </div>

          {/* Sidebar Filters */}
          <aside className="hidden lg:block">
            <PostFilters />
          </aside>
        </div>

        {/* Mobile Filters (Bottom Sheet or Modal can be added later) */}
        <div className="lg:hidden mt-6">
          <PostFilters />
        </div>
      </div>
    </main>
  );
}
