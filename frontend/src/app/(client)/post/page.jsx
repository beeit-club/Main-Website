import { Suspense } from "react";
import { fetchAllPosts } from "@/services/post";
import { BlogGrid } from "@/components/home/post/components/blog-grid";
import { BlogList } from "@/components/home/post/components/blog-list";
import { PostFilters } from "@/components/home/post/components/post-filters";
import { PostCategoryFilter } from "@/components/home/post/components/PostCategoryFilter";
import { PostPagination } from "@/components/home/post/components/post-pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutGrid, List } from "lucide-react";
import { getFullUrl, getOgImageUrl } from "@/lib/seo";

// Revalidate every hour
export const revalidate = 3600;

export const metadata = {
  title: "Danh sách Bài viết",
  description:
    "Khám phá các bài viết, hướng dẫn và chia sẻ kiến thức về công nghệ từ cộng đồng Bee IT",
  alternates: {
    canonical: getFullUrl("/post"),
  },
  openGraph: {
    title: "Danh sách Bài viết | Bee IT Club",
    description:
      "Khám phá các bài viết, hướng dẫn và chia sẻ kiến thức về công nghệ từ cộng đồng Bee IT",
    url: getFullUrl("/post"),
    type: "website",
    siteName: "Bee IT Club",
    images: [
      {
        url: getOgImageUrl("/og-image-posts.png"),
        width: 1200,
        height: 630,
        alt: "Danh sách Bài viết - Bee IT Club",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Danh sách Bài viết | Bee IT Club",
    description:
      "Khám phá các bài viết, hướng dẫn và chia sẻ kiến thức về công nghệ",
    images: [getOgImageUrl("/og-image-posts.png")],
  },
};

// Loading skeleton component
function PostsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden border-border/50">
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
    // Xử lý searchParams an toàn - có thể là undefined hoặc object
    const safeSearchParams = searchParams || {};

    // Parse page và limit, đảm bảo là number
    const page = safeSearchParams.page
      ? parseInt(
          Array.isArray(safeSearchParams.page)
            ? safeSearchParams.page[0]
            : safeSearchParams.page,
          10
        ) || 1
      : 1;

    const limit = safeSearchParams.limit
      ? parseInt(
          Array.isArray(safeSearchParams.limit)
            ? safeSearchParams.limit[0]
            : safeSearchParams.limit,
          10
        ) || 12
      : 12;

    const params = {
      page,
      limit,
      ...(safeSearchParams.category && {
        category: Array.isArray(safeSearchParams.category)
          ? safeSearchParams.category[0]
          : safeSearchParams.category,
      }),
      ...(safeSearchParams.tag && {
        tag: Array.isArray(safeSearchParams.tag)
          ? safeSearchParams.tag[0]
          : safeSearchParams.tag,
      }),
      ...(safeSearchParams.title && {
        title: Array.isArray(safeSearchParams.title)
          ? safeSearchParams.title[0]
          : safeSearchParams.title,
      }),
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
  // Next.js 15: searchParams is a Promise, need to await it
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const { posts, pagination } = await getData(resolvedSearchParams);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
            Danh sách Bài viết
          </h1>
          <p className="text-sm text-muted-foreground">
            Khám phá các bài viết, hướng dẫn và chia sẻ từ cộng đồng
          </p>
        </div>

        {/* Category Filter */}
        <PostCategoryFilter />

        {/* Main Content */}
        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
          {/* Posts List */}
          <div className="space-y-4">
            {/* View Toggle Tabs */}
            <Tabs defaultValue="grid" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold">
                    {pagination.total
                      ? `${pagination.total} bài viết`
                      : "Bài viết"}
                  </h2>
                </div>
                <TabsList className="h-8">
                  <TabsTrigger value="grid" className="gap-1.5 h-7 text-xs px-2">
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Lưới</span>
                  </TabsTrigger>
                  <TabsTrigger value="list" className="gap-1.5 h-7 text-xs px-2">
                    <List className="h-3.5 w-3.5" />
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
