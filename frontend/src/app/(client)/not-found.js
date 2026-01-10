import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex items-center justify-center">
        <Card className="w-full max-w-lg text-center shadow-lg">
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-4">
              <SearchX className="w-20 h-20 text-primary" />
              <span className="text-4xl font-bold">404</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-semibold mb-3">
              Không tìm thấy trang
            </h2>
            <p className="text-muted-foreground">
              Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/">Về trang chủ</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
