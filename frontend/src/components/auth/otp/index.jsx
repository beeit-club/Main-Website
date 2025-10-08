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
import { getOtpLockStatus, setOtpLock } from "@/lib/datetime";

export default function InputOTPForm({ token }) {
  const [loading, setLoading] = useState(false);
  const { locked } = getOtpLockStatus();
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
    if (locked) {
      const { locked, remaining } = getOtpLockStatus();
      toast.error(
        `Bạn đã nhập sai quá 5 lần. Thử lại sau ${Math.ceil(
          remaining / 1000
        )} giây`
      );
      return;
    }
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
        if (code == "OTP_ATTEMPTS_EXCEEDED") {
          toast.error(message);
          setOtpLock();
        }
      }
    }
  }
  if (loading) return <Loading />;
  return (
    <div className={cn("")}>
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
                    <InputOTPGroup className={"mx-auto mt-5"}>
                      <InputOTPSlot className={"border"} index={0} />
                      <InputOTPSlot
                        className={"border rounded-none"}
                        index={1}
                      />
                      <InputOTPSlot
                        className={"border rounded-none"}
                        index={2}
                      />
                      <InputOTPSlot
                        className={"border rounded-none"}
                        index={3}
                      />
                      <InputOTPSlot
                        className={"border rounded-none"}
                        index={4}
                      />
                      <InputOTPSlot
                        className={"border rounded-none"}
                        index={5}
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription className={"text-center"}>
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
