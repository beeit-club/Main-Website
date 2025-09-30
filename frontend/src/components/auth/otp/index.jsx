"use client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { otpSchema } from "@/validation/authSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "@/lib/utils";
import Logo from "@/components/layout/Header/logo";
import Loading from "@/app/(client)/loading";
import { useEffect, useState } from "react";
import { useAuthHook } from "@/hooks/useAuth";
import { decodeJWT } from "@/lib/jwt";
import { useRouter } from "next/navigation";

export default function InputOTPForm({ token }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: yupResolver(otpSchema),
    defaultValues: {
      pin: "",
    },
  });
  const { setError } = form;
  const { email } = decodeJWT(token) ?? {};
  useEffect(() => {
    if (!email) {
      toast.info("lỗi vui lòng thử lại");
      router.push("/");
      return;
    }
  }, [token]);
  const { sendOtp } = useAuthHook();
  async function onSubmit(data) {
    data.email = email;
    try {
      setLoading(true);
      const res = await sendOtp(data);
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
        toast.error(message);
      }
    }
  }
  if (loading) return <Loading />;
  return (
    <div className={cn("flex flex-col gap-6 items-center justify-center")}>
      <Logo />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" space-y-6 flex flex-col "
        >
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>OTP</FormLabel> */}
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className={"mx-auto"}>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Vui lòng nhập mã otp đã được gửi đên email của bạn
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Gửi</Button>
        </form>
      </Form>
    </div>
  );
}
