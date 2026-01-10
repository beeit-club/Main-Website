"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { questionServices } from "@/services/questionServices";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, MessageSquare, Eye, Clock, User } from "lucide-react";
import { ClientTimeAgo } from "@/components/common/ClientTimeAgo";
import { PaginationControls } from "@/components/common/Pagination";
import CreateQuestionDialog from "./_components/CreateQuestionDialog";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

export default function QuestionListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({ totalPages: 0, total: 0 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter state
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [pagination, setPagination] = useState({
    pageIndex: searchParams.get("page") ? parseInt(searchParams.get("page")) - 1 : 0,
    pageSize: 10,
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        q: debouncedSearch,
      };
      
      const res = await questionServices.getAllQuestions(params);
      if (res.status === "success") {
        setQuestions(res.data.data || []);
        setMeta({
          totalPages: res.data.pagination?.totalPages || 0,
          total: res.data.pagination?.total || 0,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Sync URL logic...
  }, [debouncedSearch, pagination.pageIndex]);

  const handleAskQuestion = () => {
    // Cho phép cả người dùng chưa đăng nhập (ẩn danh) đặt câu hỏi
    setIsDialogOpen(true);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-card p-6 rounded-lg border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary">Cộng đồng Hỏi & Đáp</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Nơi chia sẻ kiến thức và giải đáp thắc mắc dành cho thành viên Bee IT.
            </p>
          </div>
          <Button onClick={handleAskQuestion} size="lg" className="shadow-md">
            <Plus className="mr-2 h-5 w-5" /> Đặt câu hỏi
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Tìm kiếm nội dung câu hỏi..."
              className="pl-10 h-11 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Có thể thêm Select filter Category ở đây sau này */}
        </div>

        <div className="space-y-3">
          {isLoading ? (
            // Loading Skeletons Compact
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg bg-card animate-pulse">
                 <div className="h-10 w-10 bg-muted rounded-full" />
                 <div className="space-y-2 flex-1">
                   <div className="h-4 bg-muted rounded w-3/4" />
                   <div className="h-3 bg-muted rounded w-1/2" />
                 </div>
              </div>
            ))
          ) : questions.length > 0 ? (
            questions.map((q) => (
              <Card key={q.id} className="group hover:shadow-md transition-all border-l-4 border-l-transparent hover:border-l-primary cursor-pointer !py-0">
                <Link href={`/questions/${q.slug}`} className="block p-4 sm:p-5">
                  <div className="flex gap-4 items-start">
                    {/* Avatar / User Info Column */}
                    <div className="hidden sm:flex flex-col items-center gap-1 min-w-[60px]">
                      <Avatar className="h-10 w-10 border">
                          <AvatarImage src={q.author_avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                              {q.author_name?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                          <h3 className="text-lg font-bold text-foreground group-hover:text-primary line-clamp-1">
                              {q.title}
                          </h3>
                          {q.has_accepted_answer === 1 && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 shrink-0">
                                  Đã giải quyết
                              </Badge>
                          )}
                      </div>
                      
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3 leading-relaxed">
                        {q.content?.replace(/<[^>]+>/g, '')}
                      </p>

                      {/* Metadata Footer */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                          {/* Mobile Avatar (hiện khi màn hình nhỏ) */}
                          <div className="flex items-center gap-1 sm:hidden">
                              <User className="h-3 w-3" />
                              <span className="font-medium">{q.author_name || "Ẩn danh"}</span>
                          </div>

                          {/* Desktop Author Name */}
                          <div className="hidden sm:block font-medium text-foreground/80">
                              {q.author_name || "Ẩn danh"}
                          </div>

                          <div className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full">
                              <Clock className="h-3 w-3" />
                              <ClientTimeAgo date={q.created_at} />
                          </div>

                          <div className="flex items-center gap-1 ml-auto sm:ml-0">
                              <Eye className="h-3.5 w-3.5" />
                              <span>{q.view_count || 0}</span>
                          </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            ))
          ) : (
              <div className="text-center py-16 border-2 border-dashed rounded-xl bg-muted/5">
                  <MessageSquare className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-semibold">Chưa có thảo luận nào</h3>
                  <p className="text-muted-foreground mt-2 mb-6 max-w-sm mx-auto">
                      Hãy là người khởi tạo cuộc trò chuyện đầu tiên cho cộng đồng!
                  </p>
                  <Button onClick={handleAskQuestion}>
                      Đặt câu hỏi ngay
                  </Button>
              </div>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <PaginationControls
            pagination={pagination}
            setPagination={setPagination}
            meta={meta}
          />
        </div>
      </div>

      <CreateQuestionDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSuccess={fetchData}
      />
    </main>
  );
}