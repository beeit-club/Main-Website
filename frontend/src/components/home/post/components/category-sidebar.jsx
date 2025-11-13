"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Folder, TrendingUp, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/datetime";

export function CategorySidebar({ posts }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4" />
            Xu hướng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="group overflow-hidden transition-all border-none shadow-none py-2"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col gap-3 md:flex-row">
                    <div className="flex flex-1 flex-col justify-between ">
                      <div className="space-y-2">
                        <Link href={`/blog/${post.slug}`}>
                          <h3 className="text-lg font-semibold leading-snug text-balance transition-colors hover:text-primary line-clamp-2">
                            {post.title}
                          </h3>
                        </Link>

                        <p className="text-xs text-muted-foreground line-clamp-2 text-pretty">
                          {post.meta_description}
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{post.author_name || "admin"}</span>
                        </div>{" "}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <time dateTime={post.published_at}>
                            {formatDate(post.published_at)}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
