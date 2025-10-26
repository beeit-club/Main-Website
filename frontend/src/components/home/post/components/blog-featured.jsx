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
          <Link href={`/post/${post.slug}`} className="relative">
            <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
              <Image
                src={post.featured_image || "/placeholder.svg"}
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
              <Badge
                variant="secondary"
                className="text-sm font-medium px-3 py-1 w-fit"
              >
                {post.category.name}
              </Badge>
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-bold leading-tight text-balance transition-colors hover:text-primary">
                  {post.title}
                </h2>
              </Link>
              <p className="text-base text-muted-foreground line-clamp-3 text-pretty">
                {post.excerpt}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-sm px-3 py-1 transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{post.created_by.fullname}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.published_at}>
                  {formatDate(post.published_at)}
                </time>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span>{post.view_count} lượt xem</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
