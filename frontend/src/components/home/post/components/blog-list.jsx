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
    <div className="relative aspect-video md:aspect-square overflow-hidden">
      <Image
        src={imageSrc}
        alt={post.title || "Bài viết"}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        unoptimized={
          imageSrc.startsWith("http://") || imageSrc.startsWith("https://")
        }
        onError={handleImageError}
      />
      <div className="absolute left-3 top-3">
        <Badge
          variant="secondary"
          className="bg-background/90 backdrop-blur-sm text-xs"
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
    <div className="space-y-4">
      {posts.map((post) => {
        return (
          <Card
            key={post.id}
            className="group overflow-hidden transition-all hover:shadow-lg"
          >
            <CardContent className="p-0">
              <div className="flex flex-col gap-3 md:flex-row">
                <Link href={`/post/${post.slug}`} className="relative md:w-64">
                  <PostImage post={post} />
                </Link>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div className="space-y-2">
                    <Link href={`/post/${post.slug}`}>
                      <h3 className="text-lg font-semibold leading-snug text-balance transition-colors hover:text-primary line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-muted-foreground line-clamp-2 text-pretty">
                      {post.meta_description}
                    </p>

                    {post.tags &&
                      Array.isArray(post.tags) &&
                      post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag.slug}
                              variant="outline"
                              className="text-[10px] px-1.5 py-0"
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{post.author_name || "admin"}</span>
                    </div>
                    {(post.published_at || post.created_at) && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <time dateTime={post.published_at || post.created_at}>
                          {formatDate(post.published_at || post.created_at)}
                        </time>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{post.view_count || 0} lượt xem</span>
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
