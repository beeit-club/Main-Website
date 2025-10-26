import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { formatDate } from "@/lib/datetime";

export function BlogCard({ post }) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg pt-0">
      <Link href={`/blog/${post.slug}`}>
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={post.featured_image || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3">
            <Badge
              variant="secondary"
              className="bg-background/90 backdrop-blur-sm text-xs"
            >
              {post.category.name}
            </Badge>
          </div>
        </div>
      </Link>

      <CardHeader className="space-y-2 p-4 pb-3">
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-base font-semibold leading-snug text-balance transition-colors hover:text-primary line-clamp-2">
            {post.title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className="px-4 pb-3">
        <p className="text-xs text-muted-foreground line-clamp-2 text-pretty">
          {post.excerpt}
        </p>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 border-t px-4 py-3">
        <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="text-xs">{post.created_by.fullname}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span className="text-xs">{post.view_count}</span>
          </div>
        </div>

        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <time dateTime={post.published_at} className="text-xs">
              {formatDate(post.published_at)}
            </time>
          </div>

          {post.tags.length > 0 && (
            <div className="flex gap-1">
              {post.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-[10px] px-1.5 py-0"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
