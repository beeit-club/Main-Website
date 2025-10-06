"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Folder, TrendingUp } from "lucide-react";

export function CategorySidebar({
  categories,
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Folder className="h-4 w-4" />
            Danh mục
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <Button
            variant={selectedCategory === null ? "default" : "ghost"}
            className="w-full justify-start text-sm h-9"
            onClick={() => onSelectCategory(null)}
          >
            Tất cả bài viết
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              className="w-full justify-between text-sm h-9"
              onClick={() => onSelectCategory(category.id)}
            >
              <span>{category.name}</span>
              <Badge variant="secondary" className="ml-auto text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4" />
            Xu hướng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Các bài viết phổ biến nhất trong tuần
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
