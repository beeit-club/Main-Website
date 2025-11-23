import { Suspense } from "react";
import { fetchAllDocuments } from "@/services/document";
import { DocumentCard } from "@/components/home/documents/DocumentCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PostPagination } from "@/components/home/post/components/post-pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

// Revalidate every hour
export const revalidate = 3600;

export const metadata = {
  title: "Thư viện Tài liệu | Bee IT Club",
  description: "Khám phá các tài liệu học tập, tài liệu tham khảo từ câu lạc bộ Bee IT",
  openGraph: {
    title: "Thư viện Tài liệu | Bee IT Club",
    description: "Khám phá các tài liệu học tập và tài liệu tham khảo",
    type: "website",
  },
};

// Loading skeleton component
function DocumentsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-video w-full" />
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-2">
              <Skeleton className="h-5 w-5 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-4 w-1/3" />
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
      // Filter: chỉ lấy public documents hoặc member_only (nếu user đã login)
      // Backend sẽ xử lý access control
      ...(searchParams.category_id && { category_id: searchParams.category_id }),
      ...(searchParams.search && { search: searchParams.search }),
    };

    const documentsResponse = await fetchAllDocuments(params);

    // Backend trả về: { status: 'success', data: { data: [], pagination: {} } }
    return {
      documents: documentsResponse.data?.data || [],
      pagination: documentsResponse.data?.pagination || {},
    };
  } catch (error) {
    console.error("Failed to fetch documents data:", error);
    return {
      documents: [],
      pagination: {},
    };
  }
}

export default async function DocumentsPage({ searchParams }) {
  const { documents, pagination } = await getData(searchParams);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Thư viện Tài liệu
          </h1>
          <p className="text-muted-foreground">
            Khám phá các tài liệu học tập, tài liệu tham khảo từ câu lạc bộ
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <form action="/documents" method="get" className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                name="search"
                placeholder="Tìm kiếm tài liệu..."
                defaultValue={searchParams.search || ""}
                className="pl-10"
              />
            </div>
            <Button type="submit">Tìm kiếm</Button>
          </form>
        </div>

        {/* Documents List */}
        <Suspense fallback={<DocumentsSkeleton />}>
          {documents.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {documents.map((document) => (
                  <DocumentCard key={document.id} document={document} />
                ))}
              </div>
              {pagination.totalPages > 1 && (
                <PostPagination pagination={pagination} baseUrl="/documents" />
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  {searchParams.search
                    ? "Không tìm thấy tài liệu nào phù hợp với từ khóa tìm kiếm."
                    : "Chưa có tài liệu nào trong hệ thống."}
                </p>
              </CardContent>
            </Card>
          )}
        </Suspense>
      </div>
    </main>
  );
}

