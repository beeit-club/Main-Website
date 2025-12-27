"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Eye, Clock } from "lucide-react";
import { ClientTimeAgo } from "@/components/common/ClientTimeAgo";

export function QuestionCard({ question }) {
  const {
    slug,
    title,
    author_name,
    author_avatar,
    created_at,
    view_count,
    answer_count,
  } = question;

  return (
    <Card className="w-full hover:border-primary/50 transition-colors overflow-hidden">
      <CardHeader className="overflow-hidden">
        <CardTitle className="text-lg md:text-xl line-clamp-2">
          <Link
            href={`/questions/${slug}`}
            className="hover:text-primary hover:underline transition-colors break-words"
          >
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-2 overflow-hidden">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={author_avatar || undefined} alt={author_name || "Ẩn danh"} />
          <AvatarFallback className="bg-muted">
            {author_name?.[0]?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="text-sm text-muted-foreground truncate min-w-0 flex-1">
          <span className="truncate">{author_name || "Người dùng ẩn danh"}</span>
          <span className="mx-1">•</span>
          <ClientTimeAgo date={created_at} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground overflow-hidden">
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          <Badge
            variant="outline"
            className="flex items-center space-x-1 px-2 py-1 flex-shrink-0"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{answer_count} trả lời</span>
          </Badge>
          <div className="flex items-center space-x-1 flex-shrink-0">
            <Eye className="h-4 w-4" />
            <span>{view_count}</span>
          </div>
        </div>
        {/* (Bạn có thể thêm tags ở đây nếu BE trả về) */}
      </CardFooter>
    </Card>
  );
}
