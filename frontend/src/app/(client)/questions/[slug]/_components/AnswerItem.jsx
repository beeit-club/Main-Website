"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, CornerDownRight } from "lucide-react";
import { ClientTimeAgo } from "@/components/common/ClientTimeAgo";
import DOMPurify from "isomorphic-dompurify";
import { cn } from "@/lib/utils";

export default function AnswerItem({ answer, onReply, depth = 0 }) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Giới hạn độ sâu hiển thị để tránh quá nhỏ (max 3 cấp)
  const isNested = depth > 0;
  const maxDepth = 3;
  const nextDepth = depth < maxDepth ? depth + 1 : maxDepth;

  return (
    <div className={cn("flex gap-3", isNested && "mt-4")}>
      <div className="flex flex-col items-center">
        <Avatar className={cn("border-2 border-background", isNested ? "h-8 w-8" : "h-10 w-10")}>
          <AvatarImage src={answer.author_avatar} />
          <AvatarFallback>{answer.author_name?.[0] || "U"}</AvatarFallback>
        </Avatar>
        {/* Đường kẻ nối cha con (chỉ hiển thị nếu có con và đang mở) */}
        {answer.children?.length > 0 && isExpanded && (
          <div className="w-px h-full bg-border my-2" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="font-semibold text-sm mr-2">
                {answer.author_name || "Thành viên"}
              </span>
              <span className="text-xs text-muted-foreground">
                <ClientTimeAgo date={answer.created_at} />
              </span>
            </div>
            {answer.is_accepted === 1 && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                Đã chấp nhận
              </Badge>
            )}
          </div>

          <div
            className="prose dark:prose-invert max-w-none text-sm break-words"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(answer.content) }}
          />
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-4 mt-1 ml-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-muted-foreground hover:text-primary"
            onClick={() => onReply(answer)}
          >
            <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs">Trả lời</span>
          </Button>
        </div>

        {/* Render Children (Recursive) */}
        {answer.children?.length > 0 && isExpanded && (
          <div className="mt-2">
            {answer.children.map((child) => (
              <AnswerItem 
                key={child.id} 
                answer={child} 
                onReply={onReply} 
                depth={nextDepth} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
