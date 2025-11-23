import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { formatDate } from "@/lib/datetime";

export function BlogFeatured({ post }) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-xl  p-0">
      <CardContent className="p-0">
        <div className="flex flex-col">
          {/* Featured Image */}
          <Link href={`/events/${post.slug}`} className="relative">
            <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
              <Image
                src={
                  post.featured_image ||
                  "https://picsum.photos/seed/su-kien-khai-giang-nam-hoc-moi-2025/800/600"
                }
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
              <Badge className="absolute left-4 top-4 bg-primary text-primary-foreground text-sm font-medium px-3 py-1.5">
                Nổi bật
              </Badge>
            </div>
          </Link>

          {/* Content */}
          <div className="p-6 flex flex-col gap-4">
            {/* Category and Title */}
            <div className="space-y-3">
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-bold leading-tight text-balance transition-colors hover:text-primary">
                  {post.title}
                </h2>
              </Link>
              <p className="text-base text-muted-foreground line-clamp-3 text-pretty">
                {post.excerpt}
              </p>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{post?.author_name || "admin"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.start_time}>
                  {formatDate(post.start_time)}
                </time>
              </div>
              <div className="flex items-center gap-1.5"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
