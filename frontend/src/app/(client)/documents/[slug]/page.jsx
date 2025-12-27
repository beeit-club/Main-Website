import { DocumentDetail } from "@/components/home/documents/DocumentDetail";
import { fetchDocumentBySlug } from "@/services/document";
import { getFullUrl, getOgImageUrl } from "@/lib/seo";
import { EmptyState } from "@/components/common/EmptyState";
import { FileX, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const response = await fetchDocumentBySlug(slug);

    if (
      !response ||
      response.status !== "success" ||
      !response.data?.document
    ) {
      return {
        title: "Không tìm thấy tài liệu",
      };
    }

    const document = response.data.document;
    const url = getFullUrl(`/documents/${slug}`);
    const ogImage = document.preview_url
      ? getOgImageUrl(document.preview_url, "/logo.jpg")
      : getOgImageUrl("/logo.jpg");

    return {
      title: document.title || "Tài liệu",
      description: document.description || "Tài liệu từ Bee IT Club",
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: document.title || "Tài liệu",
        description: document.description || "Tài liệu từ Bee IT Club",
        url,
        type: "article",
        siteName: "Bee IT Club",
        publishedTime: document.created_at,
        modifiedTime: document.updated_at,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: document.title || "Bee IT Club",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: document.title || "Tài liệu",
        description: document.description || "Tài liệu từ Bee IT Club",
        images: [ogImage],
      },
    };
  } catch (error) {
    console.error("Failed to generate metadata:", error);
    return {
      title: "Lỗi",
      description: "Đã xảy ra lỗi khi tải thông tin tài liệu.",
    };
  }
}

export default async function DocumentDetailPage({ params }) {
  const { slug } = await params;
  let response;

  try {
    response = await fetchDocumentBySlug(slug);
  } catch (error) {
    console.error("Error fetching document:", error);
    // Xử lý lỗi, hiển thị thông báo không tìm thấy
    response = null;
  }

  // Kiểm tra response hợp lệ
  if (!response || response.status !== "success" || !response.data?.document) {
    return (
      <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-2xl">
          <EmptyState
            icon={
              <FileX className="h-16 w-16 mx-auto opacity-50 text-muted-foreground" />
            }
            title="Không tìm thấy tài liệu"
            description={`Tài liệu với slug "${slug}" không tồn tại hoặc đã bị xóa.`}
            action={
              <Link href="/documents">
                <Button variant="default">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại danh sách tài liệu
                </Button>
              </Link>
            }
          />
        </div>
      </main>
    );
  }

  const document = response.data.document;

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <DocumentDetail document={document} />
      </div>
    </main>
  );
}
