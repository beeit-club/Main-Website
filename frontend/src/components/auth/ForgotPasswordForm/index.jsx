"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { useState } from "react";
import Loading from "@/app/(private)/loading";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/layout/Header/logo";
import * as yup from "yup";

const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
});

export default function ForgotPasswordForm({ className, ...props }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // TODO: Implement forgot password API call
      // const res = await forgotPassword(data);
      toast.info("Tính năng quên mật khẩu đang được phát triển");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const { error, message } = err ?? {};
      const { code, fields } = error ?? {};
      if (code === "VALIDATION_ERROR" && fields) {
        Object.entries(fields).forEach(([field, messages]) => {
          setError(field, { type: "server", message: messages[0] });
        });
      } else {
        toast.error(message || "Có lỗi xảy ra, vui lòng thử lại");
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Logo />
            <h1 className="text-xl font-bold">Quên mật khẩu</h1>
            <div className="text-center text-sm mt-5">
              Nhập email của bạn để nhận link đặt lại mật khẩu
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input {...register("email")} placeholder="m@example.com" />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Gửi link đặt lại mật khẩu
            </Button>
            <div className="text-center text-sm">
              <Link href="/login" className="underline underline-offset-4">
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

