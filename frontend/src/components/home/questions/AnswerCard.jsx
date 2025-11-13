"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
// Giả sử bạn có hàm format ngày trong lib/datetime.js
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export function AnswerCard({ answer }) {
  const { content, author_name, author_avatar, created_at, is_accepted } =
    answer;

  const timeAgo = formatDistanceToNow(new Date(created_at), {
    addSuffix: true,
    locale: vi,
  });

  return (
    <div className="flex space-x-4 py-6 border-b">
      {/* Avatar */}
      <Avatar className="h-10 w-10">
        <AvatarImage src={author_avatar} alt={author_name} />
        <AvatarFallback>{author_name?.[0].toUpperCase()}</AvatarFallback>
      </Avatar>

      {/* Nội dung trả lời */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-foreground">{author_name}</span>
            <span
              className="text-xs text-muted-foreground"
              title={new Date(created_at).toLocaleString()}
            >
              • {timeAgo}
            </span>
          </div>
          {is_accepted ? (
            <Badge variant="success" className="bg-green-600 text-white">
              <Check className="h-4 w-4 mr-1" />
              Đã chấp nhận
            </Badge>
          ) : null}
        </div>

        {/* Nội dung HTML */}
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* (Phần nút trả lời cho comment lồng nhau có thể thêm ở đây sau) */}
      </div>
    </div>
  );
}
