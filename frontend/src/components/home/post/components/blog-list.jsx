"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { formatDate } from "@/lib/datetime";

function PostImage({ post }) {
  // Helper function để xử lý featured_image
  const getImageSrc = (featuredImage) => {
    if (!featuredImage) {
      return "/logo.jpg"; // Fallback image
    }
    // Nếu là URL đầy đủ (http/https), dùng trực tiếp
    if (
      featuredImage.startsWith("http://") ||
      featuredImage.startsWith("https://")
    ) {
      return featuredImage;
    }
    // Nếu là đường dẫn tương đối, dùng trực tiếp
    if (featuredImage.startsWith("/")) {
      return featuredImage;
    }
    // Mặc định
    return featuredImage;
  };

  const initialImageSrc = getImageSrc(post.featured_image);
  const [imageSrc, setImageSrc] = useState(initialImageSrc);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (!hasError && imageSrc !== "/logo.jpg") {
      setHasError(true);
      setImageSrc("/logo.jpg");
    }
  };

  return (
    <div className="relative aspect-video md:aspect-[4/3] overflow-hidden">
      <Image
        src={imageSrc}
        alt={post.title || "Bài viết"}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        unoptimized={
          imageSrc.startsWith("http://") || imageSrc.startsWith("https://")
        }
        onError={handleImageError}
      />
      <div className="absolute left-2 top-2">
        <Badge
          variant="secondary"
          className="bg-white/80 dark:bg-black/60 text-foreground backdrop-blur-md border-none shadow-sm text-[9px] font-bold px-1.5 py-0"
        >
          {post.category_name}
        </Badge>
      </div>
    </div>
  );
}

export function BlogList({ posts }) {
  // Kiểm tra empty array
  if (!posts || posts.length === 0) {
    return null; // Để parent component xử lý empty state
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => {
        return (
          <Card
            key={post.id}
            className="group overflow-hidden transition-all duration-500 hover:shadow-lg border-border/40 bg-card !py-0"
          >
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <Link href={`/post/${post.slug}`} className="relative md:w-44 shrink-0">
                  <PostImage post={post} />
                </Link>

                <div className="flex flex-1 flex-col justify-between p-4 py-3">
                  <div className="space-y-1">
                    <Link href={`/post/${post.slug}`}>
                      <h3 className="text-base font-bold leading-tight text-balance transition-colors hover:text-primary line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-[13px] text-muted-foreground line-clamp-2 text-pretty leading-relaxed opacity-80">
                      {post.meta_description}
                    </p>
                  </div>

                  <div className="mt-auto pt-3 border-t border-border/40 flex flex-wrap items-center justify-between text-[11px] text-muted-foreground/80 font-medium">
                    <div className="flex items-center gap-4">
                      {/* Author */}
                      <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3 text-primary/70" />
                        <span className="truncate max-w-[100px]">{post.author_name || "admin"}</span>
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
                    
                    <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-0.5 rounded-sm">
                      <Eye className="h-3.5 w-3.5" />
                      <span>{post.view_count || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
