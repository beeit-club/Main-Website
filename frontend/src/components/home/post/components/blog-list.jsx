import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { formatDate } from "@/lib/datetime";

export function BlogList({ posts }) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card
          key={post.id}
          className="group overflow-hidden transition-all hover:shadow-lg"
        >
          <CardContent className="p-0">
            <div className="flex flex-col gap-3 md:flex-row">
              <Link href={`/post/${post.slug}`} className="relative md:w-64">
                <div className="relative aspect-video md:aspect-square overflow-hidden">
                  <Image
                    src={
                      post.featured_image ||
                      "https://picsum.photos/seed/su-kien-khai-giang-nam-hoc-moi-2025/800/600"
                    }
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
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
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <time dateTime={post.published_at}>
                      {formatDate(post.published_at)}
                    </time>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{post.view_count} lượt xem</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
