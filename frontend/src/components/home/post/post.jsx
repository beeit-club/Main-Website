"use client";

import { useState, useMemo } from "react";
import { BlogFeatured } from "./components/blog-featured";
import { BlogGrid } from "./components/blog-grid";
import { BlogList } from "./components/blog-list";
import { CategorySidebar } from "./components/category-sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/common/EmptyState";
import { FileText, TrendingUp, Star } from "lucide-react";
import mockPosts from "../../../mock/listPost";

export default function Home({ latestEvent, latestPosts, mostViewedPosts }) {
  return (
    <main className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 py-6 ">
        <div className="mb-6 space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-balance lg:text-3xl">
            Blog Câu lạc bộ
          </h1>
          <p className="text-sm text-muted-foreground text-pretty">
            Khám phá các bài viết, sự kiện và tin tức mới nhất từ câu lạc bộ
          </p>
        </div>

        <div className="space-y-6">
          {/* Featured Event Section */}
          {latestEvent ? (
            <div>
              <h2 className="mb-3 text-lg font-semibold">Bài viết nổi bật</h2>
              <BlogFeatured post={latestEvent} />
            </div>
          ) : (
            <div>
              <h2 className="mb-3 text-lg font-semibold">Bài viết nổi bật</h2>
              <EmptyState
                icon={<Star className="h-12 w-12 mx-auto mb-3 opacity-50 text-muted-foreground" />}
                title="Chưa có bài viết nổi bật"
                description="Sẽ có bài viết nổi bật sớm nhất"
              />
            </div>
          )}

          {/* Recent Posts Section */}
          <Tabs defaultValue="grid" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Bài viết gần đây</h2>
              <TabsList>
                <TabsTrigger value="grid" className="text-xs">
                  Lưới
                </TabsTrigger>
                <TabsTrigger value="list" className="text-xs">
                  Danh sách
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="lg:flex lg:gap-4 lg:justify-between">
              <div className="flex-1">
                <TabsContent value="grid" className="space-y-4">
                  {latestPosts && latestPosts.length > 0 ? (
                    <BlogGrid posts={latestPosts} />
                  ) : (
                    <EmptyState
                      icon={<FileText className="h-12 w-12 mx-auto mb-3 opacity-50 text-muted-foreground" />}
                      title="Chưa có bài viết nào"
                      description="Các bài viết mới sẽ được hiển thị ở đây"
                    />
                  )}
                </TabsContent>

                <TabsContent value="list" className="space-y-4">
                  {latestPosts && latestPosts.length > 0 ? (
                    <BlogList posts={latestPosts} />
                  ) : (
                    <EmptyState
                      icon={<FileText className="h-12 w-12 mx-auto mb-3 opacity-50 text-muted-foreground" />}
                      title="Chưa có bài viết nào"
                      description="Các bài viết mới sẽ được hiển thị ở đây"
                    />
                  )}
                </TabsContent>
              </div>
              <aside className="hidden lg:block w-full max-w-xs">
                {mostViewedPosts && mostViewedPosts.length > 0 ? (
                  <CategorySidebar posts={mostViewedPosts} />
                ) : (
                  <EmptyState
                    icon={<TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-50 text-muted-foreground" />}
                    title="Chưa có bài viết xem nhiều"
                    description="Các bài viết được xem nhiều sẽ hiển thị ở đây"
                    className="p-8"
                  />
                )}
              </aside>
            </div>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
