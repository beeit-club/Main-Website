"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { applicationSchema } from "@/validation/applicationSchema";
import { applicationService } from "@/services/application";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { User, Mail, Phone, GraduationCap, Calendar, BookOpen, Loader2 } from "lucide-react";

export default function ApplyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: yupResolver(applicationSchema),
    defaultValues: {
      fullname: "",
      email: "",
      phone: "",
      student_id: "",
      student_year: "",
      major: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await applicationService.createApplication(data);
      if (res.status === "success") {
        toast.success(res.message || "Nộp đơn thành công! Chúng tôi sẽ liên hệ với bạn sớm.");
        form.reset();
        // Có thể redirect hoặc hiển thị thông báo thành công
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        toast.error(res.message || "Nộp đơn thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      const errorMessage =
        error?.message ||
        error?.error ||
        "Có lỗi xảy ra khi nộp đơn. Vui lòng thử lại sau.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-8 md:py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Đăng ký làm thành viên CLB
        </h1>
        <p className="text-muted-foreground">
          Điền thông tin bên dưới để đăng ký trở thành thành viên của câu lạc bộ. Chúng tôi sẽ
          liên hệ với bạn sau khi xem xét đơn đăng ký.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin đăng ký</CardTitle>
          <CardDescription>
            Vui lòng điền đầy đủ và chính xác các thông tin bên dưới
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Họ và tên */}
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <User className="inline h-4 w-4 mr-2" />
                      Họ và tên <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập họ và tên đầy đủ (tối thiểu 5 ký tự)"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Nhập họ và tên đầy đủ của bạn (tối thiểu 5 ký tự)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Mail className="inline h-4 w-4 mr-2" />
                      Email <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Email của bạn sẽ được dùng để liên hệ và tạo tài khoản sau khi được duyệt
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Số điện thoại */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Phone className="inline h-4 w-4 mr-2" />
                      Số điện thoại <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="0912345678"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Số điện thoại hợp lệ (VD: 0912345678, 0987654321)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mã số sinh viên */}
              <FormField
                control={form.control}
                name="student_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <GraduationCap className="inline h-4 w-4 mr-2" />
                      Mã số sinh viên <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập mã số sinh viên"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Mã số sinh viên của bạn (tối đa 20 ký tự)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Năm học */}
              <FormField
                control={form.control}
                name="student_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Năm học <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: 2024-2025, K20, 2024"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Năm học hoặc khóa học của bạn (VD: 2024-2025, K20)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Chuyên ngành */}
              <FormField
                control={form.control}
                name="major"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <BookOpen className="inline h-4 w-4 mr-2" />
                      Chuyên ngành <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: Công nghệ thông tin, Kỹ thuật phần mềm"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Chuyên ngành bạn đang học (tối đa 100 ký tự)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    "Gửi đơn đăng ký"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Thông tin bổ sung */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Lưu ý</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            • Sau khi nộp đơn, chúng tôi sẽ xem xét và liên hệ với bạn trong thời gian sớm nhất.
          </p>
          <p>• Email và Mã số sinh viên phải là duy nhất trong hệ thống.</p>
          <p>
            • Nếu đơn đăng ký được duyệt, bạn sẽ nhận được email thông báo và được tạo tài khoản
            tự động.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

