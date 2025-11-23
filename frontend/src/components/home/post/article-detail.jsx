"use client";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Eye, Calendar, Folder } from "lucide-react";
import { formatDate } from "@/lib/datetime";
import { CommentSection } from "./CommentSection";

export function ArticleDetail({ article }) {
  if (!article) return null;
  const formattedDate = formatDate(article?.published_at);

  return (
    <article className="w-full max-w-3xl mx-auto">
      {/* Featured Image */}
      <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
        <Image
          src={article.featured_image || "/placeholder.svg"}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Category Badge */}
      <div className="mb-4">
        <Badge variant="secondary" className="text-sm">
          <Folder className="w-3 h-3 mr-1" />
          {article.category_name}
        </Badge>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-4 text-pretty leading-tight">
        {article.title}
      </h1>

      {/* Meta Information */}
      <div className="flex flex-wrap gap-6 mb-8 pb-6 border-b border-border">
        {/* Published Date */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{formattedDate}</span>
        </div>

        {/* View Count */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Eye className="w-4 h-4" />
          <span className="text-sm">
            {article.view_count.toLocaleString("vi-VN")} lượt xem
          </span>
        </div>

        {/* Author */}
        {article.author_name && (
          <div className="text-sm text-muted-foreground">
            Tác giả:{" "}
            <span className="font-medium text-foreground">
              {article.author_name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
        <div
          className="text-base leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <Card className="p-6 bg-muted/30">
          <h3 className="font-semibold mb-3 text-foreground">Thẻ liên quan</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="cursor-pointer hover:bg-muted"
              >
                #{tag.name}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Description (SEO Meta) */}
      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground italic">
          {article.meta_description}
        </p>
      </div>

      {/* Comments Section */}
      {article?.id && <CommentSection postId={article.id} />}
    </article>
  );
}
