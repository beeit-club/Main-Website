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
    <Card className="group h-full flex flex-col overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 border-border/40 bg-card !py-0">
      {/* Image Section */}
      <Link href={`/post/${post.slug}`} className="relative block">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={imageSrc}
            alt={post.title || "Bài viết"}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            unoptimized={
              imageSrc.startsWith("http://") || imageSrc.startsWith("https://")
            }
            onError={handleImageError}
          />

          {/* Category Badge - More Minimal */}
          {post.category_name && (
            <div className="absolute left-3 top-3">
              <Badge
                variant="secondary"
                className="bg-white/80 dark:bg-black/60 text-foreground backdrop-blur-md border-none shadow-sm text-[10px] font-bold px-2 py-0.5"
              >
                {post.category_name}
              </Badge>
            </div>
          )}
        </div>
      </Link>

      {/* Content Section */}
      <CardHeader className="flex-1 p-4 pb-0 space-y-2">
        <Link href={`/post/${post.slug}`} className="block">
          <h3 className="text-base font-bold leading-tight text-balance line-clamp-2 group-hover:text-primary transition-colors duration-200 pr-2 break-words break-all">
            {post.title}
          </h3>
        </Link>

        {/* Description */}
        {post.meta_description && (
          <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed opacity-80 break-words break-all">
            {post.meta_description}
          </p>
        )}
      </CardHeader>

      {/* Footer with Metadata - Clean & Integrated */}
      <CardFooter className="flex flex-col p-4 pt-2 mt-auto">
        <div className="w-full h-[1px] bg-border/40 mb-3" />
        <div className="flex items-center justify-between w-full text-[11px] text-muted-foreground/80 font-medium">
          <div className="flex items-center gap-4">
            {/* Author */}
            <div className="flex items-center gap-1.5">
              <User className="h-3 w-3 text-primary/70" />
              <span className="truncate max-w-[80px]">{post.author_name || "admin"}</span>
            </div>

            {/* Date */}
            {(post.published_at || post.created_at) && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                <span>
                  {formatDate(post.published_at || post.created_at)}
                </span>
              </div>
            )}
          </div>

          {/* View Count */}
          <div className="flex items-center gap-1 bg-muted/50 px-1.5 py-0.5 rounded-sm">
            <Eye className="h-3 w-3" />
            <span>{post.view_count || 0}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
