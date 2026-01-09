"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { bulkEmailServices } from "@/services/admin/bulkEmailServices";
import { ArrowLeft, RefreshCcw, Plus } from "lucide-react";

export default function BulkJobsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load Data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await bulkEmailServices.getCampaigns({ limit: 20 });
      setCampaigns(res.data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto refresh every 5s
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Quản lý Chiến dịch</h1>
            <p className="text-muted-foreground">Theo dõi tiến độ gửi email</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData} disabled={isLoading}>
            <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Button onClick={() => router.push("/admin/email-templates/bulk-send")}>
            <Plus className="h-4 w-4 mr-2" /> Tạo mới
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tên Chiến dịch</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Tiến độ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Chưa có chiến dịch nào
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((camp) => {
                const percent = camp.total_recipients > 0 
                  ? Math.round(((camp.success_count + camp.fail_count) / camp.total_recipients) * 100) 
                  : 0;
                
                return (
                  <TableRow key={camp.id}>
                    <TableCell>{camp.id}</TableCell>
                    <TableCell className="font-medium">{camp.name}</TableCell>
                    <TableCell>{camp.template_name}</TableCell>
                    <TableCell className="w-[200px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{percent}%</span>
                          <span className="text-muted-foreground">
                            {camp.success_count}/{camp.total_recipients} (Lỗi: {camp.fail_count})
                          </span>
                        </div>
                        <Progress value={percent} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(camp.status)}>
                        {camp.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(camp.created_at).toLocaleString('vi-VN')}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}