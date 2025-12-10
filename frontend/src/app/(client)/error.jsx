"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log lỗi ra console hoặc một dịch vụ theo dõi lỗi (Sentry, v.v.)
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex items-center justify-center">
        <Card className="w-full max-w-lg text-center shadow-lg">
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-4">
              <AlertTriangle className="w-20 h-20 text-destructive" />
              <span className="text-3xl font-bold">Đã xảy ra lỗi!</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-semibold mb-3">
              Không thể tải nội dung
            </h2>
            <p className="text-muted-foreground mb-4">
              {error.message || "Đã có sự cố xảy ra. Vui lòng thử lại."}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button onClick={() => reset()}>Thử lại</Button>
            <Button variant="outline" asChild>
              <Link href="/">Về trang chủ</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
