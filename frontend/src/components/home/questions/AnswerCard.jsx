"use client";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, MessageSquare, ChevronUp, ChevronDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { AnswerReplyForm } from "./AnswerReplyForm";
import { voteAnswer } from "@/services/home";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AnswerCard({ answer, questionId, onReplySuccess, depth = 0 }) {
  const { id, content, author_name, author_avatar, created_at, is_accepted, vote_score = 0, children = [] } =
    answer;
  const { user, isLogin } = useAuthStore();
  const router = useRouter();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [currentVoteScore, setCurrentVoteScore] = useState(vote_score || 0);
  const [userVote, setUserVote] = useState(null); // 'upvote', 'downvote', null
  const [isVoting, setIsVoting] = useState(false);

  const timeAgo = formatDistanceToNow(new Date(created_at), {
    addSuffix: true,
    locale: vi,
  });

  const maxDepth = 3; // Giới hạn độ sâu để tránh UI quá phức tạp
  const isNested = depth > 0;
  const canReply = depth < maxDepth;

  const handleVote = async (voteType) => {
    if (!isLogin || !user) {
      toast.error("Vui lòng đăng nhập để vote");
      router.push("/login");
      return;
    }

    if (isVoting) return;

    setIsVoting(true);
    try {
      const response = await voteAnswer(id, voteType);
      
      if (response.status === "success" && response.data) {
        setCurrentVoteScore(response.data.vote_score || 0);
        
        // Update user vote state
        if (userVote === voteType) {
          // Nếu click lại cùng vote type, có thể là unvote (tùy backend)
          setUserVote(null);
        } else {
          setUserVote(voteType);
        }
        
        toast.success("Đã vote thành công");
        
        // Refresh answers nếu có callback
        if (onReplySuccess) {
          onReplySuccess();
        }
      }
    } catch (error) {
      console.error("Error voting answer:", error);
      toast.error(error?.message || "Không thể vote câu trả lời");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className={`${isNested ? "ml-8 mt-4" : ""} ${depth > 0 ? "border-l-2 border-muted pl-4" : ""}`}>
      <div className="flex space-x-4 py-4">
        {/* Vote Buttons (chỉ hiển thị cho root answers) */}
        {depth === 0 && (
          <div className="flex flex-col items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${
                userVote === "upvote" ? "text-green-600" : ""
              }`}
              onClick={() => handleVote("upvote")}
              disabled={isVoting}
            >
              <ChevronUp className="h-5 w-5" />
            </Button>
            <span className="text-sm font-semibold min-w-[2rem] text-center">
              {currentVoteScore}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${
                userVote === "downvote" ? "text-red-600" : ""
              }`}
              onClick={() => handleVote("downvote")}
              disabled={isVoting}
            >
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>
        )}

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
