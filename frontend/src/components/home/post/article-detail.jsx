"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Eye, Calendar, Folder } from "lucide-react";
import { formatDate } from "@/lib/datetime";
import { CommentSection } from "./CommentSection";

export function ArticleDetail({ article }) {
  if (!article) return null;
  
  const formattedDate = formatDate(article?.published_at);
  
  // Xử lý featured_image - hỗ trợ cả URL tuyệt đối và tương đối
  const getImageSrc = () => {
    if (!article.featured_image) {
      return "/logo.jpg"; // Fallback image
    }
    // Nếu là URL đầy đủ (http/https), dùng trực tiếp
    if (article.featured_image.startsWith("http://") || article.featured_image.startsWith("https://")) {
      return article.featured_image;
    }
    // Nếu là đường dẫn tương đối, thêm base URL
    if (article.featured_image.startsWith("/")) {
      return article.featured_image;
    }
    // Mặc định
    return article.featured_image;
  };

  const initialImageSrc = getImageSrc();
  const [imageSrc, setImageSrc] = useState(initialImageSrc);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (!hasError && imageSrc !== "/logo.jpg") {
      setHasError(true);
      setImageSrc("/logo.jpg");
    }
  };

  return (
    <article className="w-full max-w-3xl mx-auto">
      {/* Featured Image */}
      {imageSrc && (
        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={imageSrc}
            alt={article.title || "Bài viết"}
            fill
            className="object-cover"
            priority
            unoptimized={imageSrc.startsWith("http://") || imageSrc.startsWith("https://")}
            onError={handleImageError}
          />
        </div>
      )}

      {/* Category Badge */}
      {article.category_name && (
        <div className="mb-4">
          <Link href={`/post?category=${article.category_slug}`}>
            <Badge variant="secondary" className="text-sm cursor-pointer hover:bg-primary hover:text-white transition-colors">
              <Folder className="w-3 h-3 mr-1" />
              {article.category_name}
            </Badge>
          </Link>
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl font-bold mb-4 text-pretty leading-tight">
        {article.title}
      </h1>

      {/* Meta Information */}
      <div className="flex flex-wrap gap-6 mb-8 pb-6 border-b border-border">
        {/* Published Date */}
        {formattedDate && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formattedDate}</span>
          </div>
        )}

        {/* View Count */}
        {article.view_count !== undefined && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span className="text-sm">
              {article.view_count.toLocaleString("vi-VN")} lượt xem
            </span>
          </div>
        )}

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
      {article.content && (
        <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
          <div
            className="text-base leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      )}

      {/* Tags */}
      {article.tags && Array.isArray(article.tags) && article.tags.length > 0 && (
        <Card className="p-6 bg-muted/30">
          <h3 className="font-semibold mb-3 text-foreground">Thẻ liên quan</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Link key={tag.id || tag.slug || tag.name} href={`/post?tag=${tag.slug}`}>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-white hover:border-primary transition-all"
                >
                  #{tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Description (SEO Meta) */}
      {article.meta_description && (
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground italic">
            {article.meta_description}
          </p>
        </div>
      )}

      {/* Comments Section */}
      {article?.id && <CommentSection postId={article.id} />}
    </article>
  );
}
