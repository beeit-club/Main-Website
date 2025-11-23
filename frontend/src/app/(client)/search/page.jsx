import { Suspense } from "react";
import { searchPostsAndQuestions } from "@/services/search";
import { BlogCard } from "@/components/home/post/components/blog-card";
import { BlogList } from "@/components/home/post/components/blog-list";
import { QuestionCard } from "@/components/home/questions/QuestionCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, MessageSquare } from "lucide-react";
import { SearchInput } from "@/components/search/SearchInput";

// Revalidate every hour
export const revalidate = 3600;

export const metadata = {
  title: "Tìm kiếm | Bee IT Club",
  description: "Tìm kiếm bài viết và câu hỏi trong cộng đồng Bee IT",
};

// Loading skeleton component
function SearchSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function getSearchResults(searchParams) {
  try {
    const { q, page = 1, limit = 20 } = searchParams;

    if (!q || q.trim() === "") {
      return {
        data: [],
        pagination: {
          page: 1,
          limit: parseInt(limit),
          total: 0,
          totalPages: 0,
        },
      };
    }

    const params = {
      q: q.trim(),
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const response = await searchPostsAndQuestions(params);

    return {
      data: response.data?.data || [],
      pagination: response.data?.pagination || {},
    };
  } catch (error) {
    console.error("Failed to fetch search results:", error);
    return {
      data: [],
      pagination: {},
    };
  }
}

export default async function SearchPage({ searchParams }) {
  const { data: results, pagination } = await getSearchResults(searchParams);
  const searchQuery = searchParams.q || "";

  // Phân loại kết quả
  const posts = results.filter((item) => item.type === "post");
  const questions = results.filter((item) => item.type === "question");

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Tìm kiếm
            </h1>
            <p className="text-muted-foreground">
              Tìm kiếm bài viết và câu hỏi trong cộng đồng
            </p>
          </div>

          {/* Search Input */}
          <div className="max-w-2xl mx-auto">
            <SearchInput defaultValue={searchQuery} />
          </div>
        </div>

        {/* Results */}
        {searchQuery ? (
          <div className="space-y-8">
            {/* Summary */}
            {results.length > 0 && (
              <div className="text-center text-muted-foreground">
                <p>
                  Tìm thấy <strong>{pagination.total}</strong> kết quả cho "
                  <strong>{searchQuery}</strong>"
                </p>
              </div>
            )}

            {/* Tabs for Posts and Questions */}
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                <TabsTrigger value="all">
                  Tất cả ({results.length})
                </TabsTrigger>
                <TabsTrigger value="posts">
                  <FileText className="h-4 w-4 mr-2" />
                  Bài viết ({posts.length})
                </TabsTrigger>
                <TabsTrigger value="questions">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Câu hỏi ({questions.length})
                </TabsTrigger>
              </TabsList>

              {/* All Results */}
              <TabsContent value="all" className="mt-0">
                <Suspense fallback={<SearchSkeleton />}>
                  {results.length > 0 ? (
                    <div className="space-y-4">
                      {/* Hiển thị posts dạng list (nằm ngang, nhỏ) */}
                      {posts.length > 0 && (
                        <div className="space-y-4">
                          <BlogList posts={posts} />
                        </div>
                      )}
                      {/* Hiển thị questions */}
                      {questions.length > 0 && (
                        <div className="space-y-4">
                          {questions.map((question) => (
                            <QuestionCard
                              key={`question-${question.id}`}
                              question={question}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Card className="p-12">
                      <div className="text-center text-muted-foreground">
                        <p className="text-lg font-medium mb-2">
                          Không tìm thấy kết quả nào
                        </p>
                        <p className="text-sm">
                          Thử tìm kiếm với từ khóa khác
                        </p>
                      </div>
                    </Card>
                  )}
                </Suspense>
              </TabsContent>

              {/* Posts Only */}
              <TabsContent value="posts" className="mt-0">
                <Suspense fallback={<SearchSkeleton />}>
                  {posts.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {posts.map((post) => (
                        <BlogCard key={`post-${post.id}`} post={post} />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12">
                      <div className="text-center text-muted-foreground">
                        <p className="text-lg font-medium mb-2">
                          Không tìm thấy bài viết nào
                        </p>
                        <p className="text-sm">
                          Thử tìm kiếm với từ khóa khác
                        </p>
                      </div>
                    </Card>
                  )}
                </Suspense>
              </TabsContent>

              {/* Questions Only */}
              <TabsContent value="questions" className="mt-0">
                <Suspense fallback={<SearchSkeleton />}>
                  {questions.length > 0 ? (
                    <div className="space-y-4">
                      {questions.map((question) => (
                        <QuestionCard
                          key={`question-${question.id}`}
                          question={question}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12">
                      <div className="text-center text-muted-foreground">
                        <p className="text-lg font-medium mb-2">
                          Không tìm thấy câu hỏi nào
                        </p>
                        <p className="text-sm">
                          Thử tìm kiếm với từ khóa khác
                        </p>
                      </div>
                    </Card>
                  )}
                </Suspense>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <Card className="p-12">
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-medium mb-2">
                Nhập từ khóa để tìm kiếm
              </p>
              <p className="text-sm">
                Tìm kiếm trong bài viết và câu hỏi của cộng đồng
              </p>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}

