"use client";

import { useState, useEffect, useMemo } from "react";
import { DocumentCard } from "./DocumentCard";
import { DocumentCategoryFilter } from "./DocumentCategoryFilter";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserCheck, LayoutGrid } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

const ITEMS_PER_PAGE = 12;

export function DocumentsWithFilter({ initialDocuments, initialPagination }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const { isLogin, user, isLoading: authLoading } = useAuthStore();

  // State
  const [allDocuments, setAllDocuments] = useState(initialDocuments || []);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchText, setSearchText] = useState(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("all"); // "all" hoặc "private"

  // Fetch tất cả documents (limit lớn để có đủ data cho client-side filtering)
  const fetchDocs = async (mode = "all") => {
    setIsLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BACKEND;
      const token = localStorage.getItem("accessToken");
      
      const headers = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Nếu mode là private, ta gọi API mới dành riêng cho tài liệu cá nhân
      const url = mode === "private" 
        ? `${baseUrl}/client/documents/my-documents?limit=1000` 
        : `${baseUrl}/client/documents?limit=1000`;

      const res = await fetch(url, {
        cache: "no-store",
        headers
      });

      if (res.ok) {
        const data = await res.json();
        // Backend đã lọc sẵn theo scope, nên ta lấy thẳng data.data
        const docs = data.data?.data || [];
        
        setAllDocuments(docs);
        setViewMode(mode);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchDocs("all");
    }
  }, [authLoading]);

  const handleShowPrivate = () => {
    fetchDocs("private");
  };

  const handleShowAll = () => {
    fetchDocs("all");
  };

  // Filter documents theo category và search
  const filteredDocuments = useMemo(() => {
    let filtered = allDocuments;

    // Filter theo category
    if (selectedCategoryId) {
      filtered = filtered.filter(
        (doc) => doc.category_id === selectedCategoryId
      );
    }

    // Filter theo search text
    if (searchText && searchText.trim()) {
      const query = searchText.toLowerCase().trim();
      filtered = filtered.filter(
        (doc) =>
          doc.title?.toLowerCase().includes(query) ||
          doc.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allDocuments, selectedCategoryId, searchText]);

  // Pagination cho filtered documents
  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredDocuments.slice(startIndex, endIndex);
  }, [filteredDocuments, currentPage]);

  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);

  // Reset page khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryId, searchText]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Update URL với search query
    const params = new URLSearchParams();
    if (searchText.trim()) {
      params.set("search", searchText.trim());
    }
    router.push(
      `/documents${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top khi đổi trang
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Category Filter */}
      <DocumentCategoryFilter
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={handleCategoryChange}
        documents={allDocuments}
      />

      {/* View Mode Toggles & Search Bar */}
      <div className="mb-8 max-w-4xl mx-auto space-y-4">
        {isLogin && (
          <div className="flex justify-center gap-2">
            <Button
              variant={viewMode === "all" ? "default" : "outline"}
              onClick={handleShowAll}
              className="rounded-full"
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Tất cả tài liệu
            </Button>
            <Button
              variant={viewMode === "private" ? "default" : "outline"}
              onClick={handleShowPrivate}
              className="rounded-full"
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Dành cho tôi
            </Button>
          </div>
        )}

        <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>
          <Button type="submit" className="rounded-full">Tìm kiếm</Button>
        </form>
      </div>

      {/* Documents List */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Đang tải tài liệu...</p>
        </div>
      ) : paginatedDocuments.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {paginatedDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {/* Page Numbers */}
                  {(() => {
                    const pages = [];
                    const maxPagesToShow = 5;

                    if (totalPages <= maxPagesToShow) {
                      // Show all pages if total is small
                      for (let i = 1; i <= totalPages; i++) {
                        pages.push(i);
                      }
                    } else {
                      // Always show first page
                      pages.push(1);

                      if (currentPage > 3) {
                        pages.push("ellipsis-start");
                      }

                      // Show pages around current page
                      const start = Math.max(2, currentPage - 1);
                      const end = Math.min(totalPages - 1, currentPage + 1);

                      for (let i = start; i <= end; i++) {
                        pages.push(i);
                      }

                      if (currentPage < totalPages - 2) {
                        pages.push("ellipsis-end");
                      }

                      // Always show last page
                      pages.push(totalPages);
                    }

                    return pages.map((page, index) => {
                      if (typeof page === "string") {
                        return (
                          <PaginationItem key={`${page}-${index}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    });
                  })()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {searchText || selectedCategoryId
                ? "Không tìm thấy tài liệu nào phù hợp."
                : "Chưa có tài liệu nào trong hệ thống."}
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
