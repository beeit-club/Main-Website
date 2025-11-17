"use client";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { AnswerReplyForm } from "./AnswerReplyForm";

export function AnswerCard({ answer, questionId, onReplySuccess, depth = 0 }) {
  const { id, content, author_name, author_avatar, created_at, is_accepted, children = [] } =
    answer;
  const [showReplyForm, setShowReplyForm] = useState(false);

  const timeAgo = formatDistanceToNow(new Date(created_at), {
    addSuffix: true,
    locale: vi,
  });

  const maxDepth = 3; // Giới hạn độ sâu để tránh UI quá phức tạp
  const isNested = depth > 0;
  const canReply = depth < maxDepth;

  return (
    <div className={`${isNested ? "ml-8 mt-4" : ""} ${depth > 0 ? "border-l-2 border-muted pl-4" : ""}`}>
      <div className="flex space-x-4 py-4">
        {/* Avatar */}
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={author_avatar} alt={author_name} />
          <AvatarFallback>{author_name?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>

        {/* Nội dung trả lời */}
        <div className="flex-1 min-w-0">
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
            className="prose dark:prose-invert max-w-none mb-3"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Nút Trả lời */}
          {canReply && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="h-8 text-sm"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Trả lời
            </Button>
          )}

          {/* Form trả lời nested */}
          {showReplyForm && canReply && (
            <AnswerReplyForm
              questionId={questionId}
              parentId={id}
              onSuccess={() => {
                setShowReplyForm(false);
                if (onReplySuccess) {
                  onReplySuccess();
                }
              }}
              onCancel={() => setShowReplyForm(false)}
            />
          )}
        </div>
      </div>

      {/* Hiển thị nested children */}
      {children && children.length > 0 && (
        <div className="mt-2">
          {children.map((child) => (
            <AnswerCard
              key={child.id}
              answer={child}
              questionId={questionId}
              onReplySuccess={onReplySuccess}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
