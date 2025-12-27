"use client";

import { IconTrendingDown, IconTrendingUp, IconUsers, IconFileText, IconCalendarEvent, IconClipboardCheck } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards({ stats, isLoading }) {
  // Format số với dấu phẩy
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return parseInt(num).toLocaleString('vi-VN');
  };

  // Format tiền tệ
  const formatCurrency = (num) => {
    if (num === null || num === undefined) return '0';
    return parseInt(num).toLocaleString('vi-VN') + ' đ';
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <CardDescription className="h-4 bg-muted animate-pulse rounded" />
              <CardTitle className="h-8 bg-muted animate-pulse rounded mt-2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Tổng số người dùng",
      value: formatNumber(stats?.users?.total || 0),
      description: `${formatNumber(stats?.users?.active || 0)} đang hoạt động`,
      icon: IconUsers,
      trend: stats?.users?.active > 0 ? 'up' : 'neutral',
      footer: `${formatNumber(stats?.users?.inactive || 0)} không hoạt động`,
    },
    {
      title: "Tổng số bài viết",
      value: formatNumber(stats?.posts?.total || 0),
      description: `${formatNumber(stats?.posts?.published || 0)} đã xuất bản`,
      icon: IconFileText,
      trend: stats?.posts?.published > 0 ? 'up' : 'neutral',
      footer: `${formatNumber(stats?.posts?.total_views || 0)} lượt xem`,
    },
    {
      title: "Sự kiện",
      value: formatNumber(stats?.events?.total || 0),
      description: `${formatNumber(stats?.events?.upcoming || 0)} sắp tới`,
      icon: IconCalendarEvent,
      trend: stats?.events?.upcoming > 0 ? 'up' : 'neutral',
      footer: `${formatNumber(stats?.events?.past || 0)} đã qua`,
    },
    {
      title: "Đơn đăng ký",
      value: formatNumber(stats?.applications?.total || 0),
      description: `${formatNumber(stats?.applications?.pending || 0)} đang chờ`,
      icon: IconClipboardCheck,
      trend: stats?.applications?.pending > 0 ? 'down' : 'neutral',
      footer: `${formatNumber(stats?.applications?.approved || 0)} đã duyệt`,
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="@container/card">
            <CardHeader>
              <CardDescription className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {card.title}
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {card.value}
              </CardTitle>
              <CardAction>
                {card.trend === 'up' && (
                  <Badge variant="outline" className="text-green-600">
                    <IconTrendingUp className="h-3 w-3" />
                    Tăng trưởng
                  </Badge>
                )}
                {card.trend === 'down' && (
                  <Badge variant="outline" className="text-orange-600">
                    <IconTrendingDown className="h-3 w-3" />
                    Cần xử lý
                  </Badge>
                )}
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.description}
              </div>
              <div className="text-muted-foreground">
                {card.footer}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
