"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock } from "lucide-react";
import { ClientTimeAgo } from "@/components/common/ClientTimeAgo";

export function QuestionDetail({ question }) {
  const { title, content, author_name, author_avatar, created_at, view_count } =
    question;

  // Log dữ liệu trong component
  console.log('=== DEBUG: QuestionDetail Component ===');
  console.log('Full question prop:', JSON.stringify(question, null, 2));
  console.log('author_name:', author_name);
  console.log('author_avatar:', author_avatar);
  console.log('Type of author_avatar:', typeof author_avatar);
  console.log('Is author_avatar null?', author_avatar === null);
  console.log('Is author_avatar undefined?', author_avatar === undefined);
  console.log('author_name?.[0]:', author_name?.[0]);
  console.log('========================================');

  return (
    <div className="w-full">
      {/* Tiêu đề */}
      <h1 className="text-2xl md:text-3xl font-bold mb-4">{title}</h1>

      {/* Thông tin meta */}
      <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={author_avatar || undefined} alt={author_name || "Ẩn danh"} />
            <AvatarFallback className="bg-muted">
              {author_name?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground">
            {author_name || "Người dùng ẩn danh"}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>Đã hỏi <ClientTimeAgo date={created_at} /></span>
        </div>
        <div className="flex items-center space-x-1">
          <Eye className="h-4 w-4" />
          <span>{view_count} lượt xem</span>
        </div>
      </div>

      {/* Đường gạch ngang */}
      <hr className="my-6" />

      {/* Nội dung câu hỏi */}
      <div
        className="prose dark:prose-invert max-w-none overflow-hidden break-words break-all"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
