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
// Giả sử bạn có hàm format ngày trong lib/datetime.js
import { formatDistanceToNow } from "date-fns"; // Hoặc dùng thư viện bạn thích
import { vi } from "date-fns/locale";

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

  const timeAgo = formatDistanceToNow(new Date(created_at), {
    addSuffix: true,
    locale: vi,
  });

  return (
    <Card className="w-full hover:border-primary/50 transition-colors">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">
          <Link
            href={`/questions/${slug}`}
            className="hover:text-primary hover:underline transition-colors"
          >
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={author_avatar} alt={author_name} />
          <AvatarFallback>{author_name?.[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="text-sm text-muted-foreground">
          <span>{author_name}</span>
          <span className="mx-1">•</span>
          <span title={new Date(created_at).toLocaleString()}>{timeAgo}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center space-x-4">
          <Badge
            variant="outline"
            className="flex items-center space-x-1 px-2 py-1"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{answer_count} trả lời</span>
          </Badge>
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>{view_count}</span>
          </div>
        </div>
        {/* (Bạn có thể thêm tags ở đây nếu BE trả về) */}
      </CardFooter>
    </Card>
  );
}
