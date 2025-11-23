"use client";

import { useState, useEffect } from "react";
import { CommentCard } from "./CommentCard";
import { CommentForm } from "./CommentForm";
import { commentService } from "@/services/comment";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";

export function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchComments = async () => {
    try {
      setIsRefreshing(true);
      const response = await commentService.getCommentsByPostId(postId);
      
      if (response.status === "success") {
        // Backend trả về: { comments: { data: [], pagination: {} } }
        // Hoặc có thể là: { comments: [] } nếu không dùng pagination
        let commentsData = [];
        
        if (response.data?.comments) {
          // Nếu comments là object có data property (từ selectWithPagination)
          if (Array.isArray(response.data.comments.data)) {
            commentsData = response.data.comments.data;
          } 
          // Nếu comments là array trực tiếp
          else if (Array.isArray(response.data.comments)) {
            commentsData = response.data.comments;
          }
        }
        
        // Transform flat list to nested structure
        const nestedComments = buildNestedComments(commentsData);
        setComments(nestedComments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      // Nếu lỗi 404 (không có comments), không hiển thị error
      if (error?.response?.status !== 404) {
        toast.error("Không thể tải bình luận");
      }
      setComments([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Build nested structure from flat list
  const buildNestedComments = (flatComments) => {
    // Đảm bảo flatComments là array
    if (!Array.isArray(flatComments)) {
      console.warn("flatComments is not an array:", flatComments);
      return [];
    }

    const commentMap = new Map();
    const rootComments = [];

    // First pass: create map of all comments
    flatComments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, children: [] });
    });

    // Second pass: build tree structure
    flatComments.forEach((comment) => {
      const commentNode = commentMap.get(comment.id);
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.children.push(commentNode);
        } else {
          // Parent not found, treat as root
          rootComments.push(commentNode);
        }
      } else {
        rootComments.push(commentNode);
      }
    });

    return rootComments;
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleCommentSuccess = () => {
    fetchComments();
  };

  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardContent className="py-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-8">
      {/* Comment Form */}
      <CommentForm postId={postId} onSuccess={handleCommentSuccess} />

      {/* Comments List */}
      <Card className="mt-6">
        <CardContent className="py-6">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="h-5 w-5" />
            <h3 className="text-lg font-semibold">
              Bình luận ({comments.length})
            </h3>
          </div>

          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  postId={postId}
                  onUpdate={handleCommentSuccess}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

