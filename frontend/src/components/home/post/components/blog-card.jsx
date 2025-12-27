"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, User, Folder } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { formatDate } from "@/lib/datetime";

export function BlogCard({ post }) {
  // Xử lý featured_image - hỗ trợ cả URL tuyệt đối và tương đối
  const getImageSrc = () => {
    if (!post.featured_image) {
      return "/logo.jpg"; // Fallback image
    }
    // Nếu là URL đầy đủ (http/https), dùng trực tiếp
    if (
      post.featured_image.startsWith("http://") ||
      post.featured_image.startsWith("https://")
    ) {
      return post.featured_image;
    }
    // Nếu là đường dẫn tương đối, dùng trực tiếp
    if (post.featured_image.startsWith("/")) {
      return post.featured_image;
    }
    // Mặc định
    return post.featured_image;
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
    <Card className="group h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/50">
      {/* Image Section */}
      <Link href={`/post/${post.slug}`} className="relative block">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={imageSrc}
            alt={post.title || "Bài viết"}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            unoptimized={
              imageSrc.startsWith("http://") || imageSrc.startsWith("https://")
            }
            onError={handleImageError}
          />
          {/* Gradient Overlay for better badge visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category Badge */}
          {post.category_name && (
            <div className="absolute left-4 top-4">
              <Badge
                variant="secondary"
                className="bg-primary/90 text-primary-foreground backdrop-blur-sm shadow-lg hover:bg-primary transition-colors text-xs font-medium px-3 py-1"
              >
                <Folder className="h-3 w-3 mr-1.5" />
                {post.category_name}
              </Badge>
            </div>
          )}
        </div>
      </Link>

      {/* Content Section */}
      <CardHeader className="flex-1 p-5 pb-3 space-y-3">
        <Link href={`/post/${post.slug}`} className="block">
          <h3 className="text-lg font-bold leading-tight text-balance line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {post.title}
          </h3>
        </Link>

        {/* Description */}
        {post.meta_description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {post.meta_description}
          </p>
        )}
      </CardHeader>

      {/* Footer with Metadata and Tags */}
      <CardFooter className="flex flex-col gap-3 border-t bg-muted/30 p-5 pt-4">
        {/* Metadata */}
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Author */}
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span className="font-medium">{post.author_name || "admin"}</span>
            </div>

            {/* Date */}
            {(post.published_at || post.created_at) && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <time dateTime={post.published_at || post.created_at}>
                  {formatDate(post.published_at || post.created_at)}
                </time>
              </div>
            )}
          </div>

          {/* View Count */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Eye className="h-3.5 w-3.5" />
            <span>{post.view_count || 0}</span>
          </div>
        </div>

        {/* Tags */}
        {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1 justify-start">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.slug || tag.id}
                variant="outline"
                className="text-xs px-2 py-0.5 hover:bg-primary/10 hover:border-primary/50 transition-colors"
              >
                {tag.name}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
