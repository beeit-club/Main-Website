"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock } from "lucide-react";
// Giả sử bạn có hàm format ngày trong lib/datetime.js
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export function QuestionDetail({ question }) {
  const { title, content, author_name, author_avatar, created_at, view_count } =
    question;

  const timeAgo = formatDistanceToNow(new Date(created_at), {
    addSuffix: true,
    locale: vi,
  });

  return (
    <div className="w-full">
      {/* Tiêu đề */}
      <h1 className="text-2xl md:text-3xl font-bold mb-4">{title}</h1>

      {/* Thông tin meta */}
      <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={author_avatar} alt={author_name} />
            <AvatarFallback>{author_name?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground">{author_name}</span>
        </div>
        <div className="flex items-center space-x-1" title={timeAgo}>
          <Clock className="h-4 w-4" />
          <span>Đã hỏi {timeAgo}</span>
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
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
