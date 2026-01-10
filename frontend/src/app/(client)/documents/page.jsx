import { Suspense } from "react";
import { fetchAllDocuments } from "@/services/document";
import { DocumentsWithFilter } from "@/components/home/documents/DocumentsWithFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { getFullUrl, getOgImageUrl } from "@/lib/seo";

// Revalidate every hour
export const revalidate = 3600;

export const metadata = {
  title: "Thư viện Tài liệu",
  description:
    "Khám phá các tài liệu học tập, tài liệu tham khảo từ câu lạc bộ Bee IT",
  alternates: {
    canonical: getFullUrl("/documents"),
  },
  openGraph: {
    title: "Thư viện Tài liệu | Bee IT Club",
    description:
      "Khám phá các tài liệu học tập, tài liệu tham khảo từ câu lạc bộ Bee IT",
    url: getFullUrl("/documents"),
    type: "website",
    siteName: "Bee IT Club",
    images: [
      {
        url: getOgImageUrl("/og-image-documents.png"),
        width: 1200,
        height: 630,
        alt: "Thư viện Tài liệu - Bee IT Club",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thư viện Tài liệu | Bee IT Club",
    description: "Khám phá các tài liệu học tập và tài liệu tham khảo",
    images: [getOgImageUrl("/og-image-documents.png")],
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

async function getData() {
  try {
    // Fetch một số lượng lớn documents để client-side có đủ data để filter
    // Component DocumentsWithFilter sẽ fetch lại tất cả với limit lớn hơn
    const params = {
      page: 1,
      limit: 50, // Fetch 50 documents đầu tiên để hiển thị ngay
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

export default async function DocumentsPage() {
  // Fetch initial data (component sẽ fetch tất cả sau)
  const { documents, pagination } = await getData();

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Thư viện Tài liệu
          </h1>
          <p className="text-muted-foreground">
            Khám phá các tài liệu học tập, tài liệu tham khảo từ câu lạc bộ
          </p>
        </div>

        {/* Documents List with Filter */}
        <Suspense fallback={<DocumentsSkeleton />}>
          <DocumentsWithFilter
            initialDocuments={documents}
            initialPagination={pagination}
          />
        </Suspense>
      </div>
    </main>
  );
}
