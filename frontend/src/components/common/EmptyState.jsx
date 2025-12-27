import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Component EmptyState tái sử dụng
 * Hiển thị thông báo khi không có dữ liệu
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon component (optional)
 * @param {string} props.title - Tiêu đề (required)
 * @param {string} props.description - Mô tả (optional)
 * @param {React.ReactNode} props.action - Button/Link action (optional)
 * @param {string} props.className - Custom className (optional)
 */
export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  className 
}) {
  return (
    <Card className={cn("p-12", className)}>
      <CardContent className="text-center">
        {icon && (
          <div className="mb-4 flex justify-center">
            {icon}
          </div>
        )}
        <p className="text-lg font-medium mb-2 text-foreground">
          {title}
        </p>
        {description && (
          <p className="text-sm text-muted-foreground mb-4">
            {description}
          </p>
        )}
        {action && (
          <div className="mt-4">
            {action}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

