// common/: Components chung, không thuộc module cụ thể.
"use client";
import Link from "next/link";
import { useAuthHook } from "@/hooks/useAuth";
import { registerSchema } from "@/validation/authSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loading from "@/app/(private)/loading";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/layout/Header/logo";

export default function RegisterForm({ className, ...props }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { registerF } = useAuthHook();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await registerF(data);
      setLoading(false);
      router.push("/login");
    } catch (err) {
      setLoading(false);
      const { error, message } = err ?? {};
      const { code, fields } = error ?? {};
      if (code === "VALIDATION_ERROR" && fields) {
        Object.entries(fields).forEach(([field, messages]) => {
          setError(field, { type: "server", message: messages[0] });
        });
      } else {
        toast.error(message);
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
            {/* <h1 className="text-xl font-bold">Chào mừng đến với Bee IT.</h1> */}
            <div className="text-center text-sm mt-5">
              Bạn đã có tài khoản ?
              <Link href="/login" className="underline underline-offset-4 ml-1">
                Đăng nhập.
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="fullname">Name</Label>
              <Input {...register("fullname")} placeholder="Nguyễn Văn A" />
              {errors.fullname && (
                <p className="text-red-500 text-sm">
                  {errors.fullname.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input {...register("email")} placeholder="m@example.com" />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Đăng Ký
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
