"use client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { dashboardServices } from "@/services/admin/dashboard";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  IconUsers, 
  IconFileText, 
  IconCalendarEvent, 
  IconClipboardCheck,
  IconFile,
  IconHelpCircle,
  IconMail,
  IconCurrencyDollar,
  IconCheck,
  IconX
} from "@tabler/icons-react";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState('30d');

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await dashboardServices.getDashboardStats();
        if (response?.data?.stats) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch time series data
  useEffect(() => {
    const fetchTimeSeries = async () => {
      try {
        const response = await dashboardServices.getTimeSeriesData(timePeriod);
        if (response?.data?.data) {
          setTimeSeriesData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching time series data:', error);
      }
    };

    fetchTimeSeries();
  }, [timePeriod]);

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return parseInt(num).toLocaleString('vi-VN');
  };

  const formatCurrency = (num) => {
    if (num === null || num === undefined) return '0';
    return parseInt(num).toLocaleString('vi-VN') + ' đ';
  };

  // Additional stats cards
  const additionalStats = [
    {
      title: "Tài liệu",
      value: formatNumber(stats?.documents?.total || 0),
      description: `${formatNumber(stats?.documents?.active || 0)} đang hoạt động`,
      icon: IconFile,
      footer: `${formatNumber(stats?.documents?.total_downloads || 0)} lượt tải`,
    },
    {
      title: "Câu hỏi",
      value: formatNumber(stats?.questions?.total || 0),
      description: `${formatNumber(stats?.questions?.published || 0)} đã xuất bản`,
      icon: IconHelpCircle,
      footer: `${formatNumber(stats?.questions?.total_views || 0)} lượt xem`,
    },
    {
      title: "Email đã gửi",
      value: formatNumber(stats?.email_logs?.total || 0),
      description: `${formatNumber(stats?.email_logs?.sent || 0)} thành công`,
      icon: IconMail,
      footer: `${formatNumber(stats?.email_logs?.failed || 0)} thất bại`,
    },
    {
      title: "Tài chính",
      value: formatCurrency((stats?.transactions?.total_income || 0) - (stats?.transactions?.total_expense || 0)),
      description: `Thu: ${formatCurrency(stats?.transactions?.total_income || 0)}`,
      icon: IconCurrencyDollar,
      footer: `Chi: ${formatCurrency(stats?.transactions?.total_expense || 0)}`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <SectionCards stats={stats} isLoading={isLoading} />

      {/* Chart */}
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive 
          data={timeSeriesData} 
          isLoading={isLoading}
          onPeriodChange={setTimePeriod}
        />
      </div>

      {/* Additional Stats Grid */}
      <div className="px-4 lg:px-6">
        <h2 className="text-xl font-semibold mb-4">Thống kê chi tiết</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {additionalStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <CardDescription className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {stat.title}
                  </CardDescription>
                  <CardTitle className="text-2xl font-semibold">
                    {stat.value}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <div>{stat.description}</div>
                    <div className="mt-1">{stat.footer}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Tổng quan nhanh</CardTitle>
            <CardDescription>Một số thống kê quan trọng khác</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Đăng ký sự kiện</p>
                    <p className="text-2xl font-semibold">{formatNumber(stats?.event_registrations?.total || 0)}</p>
                  </div>
                  <IconCalendarEvent className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Đã check-in</p>
                    <p className="text-2xl font-semibold">{formatNumber(stats?.event_attendances?.checked_in || 0)}</p>
                  </div>
                  <IconCheck className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Câu trả lời</p>
                    <p className="text-2xl font-semibold">{formatNumber(stats?.answers?.total || 0)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatNumber(stats?.answers?.accepted || 0)} đã chấp nhận
                    </p>
                  </div>
                  <IconHelpCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Đơn đã duyệt</p>
                    <p className="text-2xl font-semibold">{formatNumber(stats?.applications?.approved || 0)}</p>
                  </div>
                  <IconCheck className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Đơn từ chối</p>
                    <p className="text-2xl font-semibold">{formatNumber(stats?.applications?.rejected || 0)}</p>
                  </div>
                  <IconX className="h-8 w-8 text-red-600" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Sự kiện đang diễn ra</p>
                    <p className="text-2xl font-semibold">{formatNumber(stats?.events?.ongoing || 0)}</p>
                  </div>
                  <IconCalendarEvent className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
