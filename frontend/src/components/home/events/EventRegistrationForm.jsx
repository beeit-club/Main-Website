"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { eventService } from "@/services/eventClient";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2, User, Mail, Phone } from "lucide-react";
import * as yup from "yup";
import { useRouter } from "next/navigation";

// Validation schema
const registrationSchema = yup.object({
  registration_type: yup
    .string()
    .oneOf(["private", "public"], "Loại đăng ký không hợp lệ")
    .required("Vui lòng chọn loại đăng ký"),
  notes: yup.string().max(500, "Ghi chú không được quá 500 ký tự"),
  // Guest fields (required if registration_type is "public")
  guest_name: yup.string().when("registration_type", {
    is: "public",
    then: (schema) => schema.required("Họ tên là bắt buộc").min(5, "Họ tên tối thiểu 5 ký tự"),
    otherwise: (schema) => schema.notRequired(),
  }),
  guest_email: yup.string().when("registration_type", {
    is: "public",
    then: (schema) => schema.email("Email không hợp lệ").required("Email là bắt buộc"),
    otherwise: (schema) => schema.notRequired(),
  }),
  guest_phone: yup.string().when("registration_type", {
    is: "public",
    then: (schema) =>
      schema
        .required("Số điện thoại là bắt buộc")
        .matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export function EventRegistrationForm({ event, onSuccess }) {
  const router = useRouter();
  const { user, isLogin } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: yupResolver(registrationSchema),
    defaultValues: {
      registration_type: isLogin && user ? "private" : "public",
      notes: "",
      guest_name: "",
      guest_email: "",
      guest_phone: "",
    },
  });

  const registrationType = form.watch("registration_type");

  const onSubmit = async (data) => {
    if (!isLogin && data.registration_type === "private") {
      toast.error("Vui lòng đăng nhập để đăng ký với tư cách thành viên");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        registration_type: data.registration_type,
        ...(data.notes && { notes: data.notes }),
        ...(data.registration_type === "public" && {
          guest_name: data.guest_name,
          guest_email: data.guest_email,
          guest_phone: data.guest_phone,
        }),
      };

      await eventService.registerEvent(event.id, payload);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error registering event:", error);
      const errorMessage =
        error?.message || error?.response?.data?.message || "Không thể đăng ký tham gia sự kiện";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Nếu user chưa đăng nhập và event không public, chỉ cho phép đăng ký public
  const canRegisterPrivate = isLogin && user;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Registration Type */}
        <FormField
          control={form.control}
          name="registration_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại đăng ký</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col space-y-1"
                >
                  {canRegisterPrivate && (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="private" id="private" />
                      <Label htmlFor="private" className="font-normal cursor-pointer">
                        Đăng ký với tư cách thành viên
                      </Label>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public" className="font-normal cursor-pointer">
                      Đăng ký với tư cách khách mời
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Guest Information (only if public) */}
        {registrationType === "public" && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <h4 className="font-semibold">Thông tin khách mời</h4>

            <FormField
              control={form.control}
              name="guest_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <User className="inline h-4 w-4 mr-2" />
                    Họ và tên <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ và tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guest_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Mail className="inline h-4 w-4 mr-2" />
                    Email <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="example@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guest_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Phone className="inline h-4 w-4 mr-2" />
                    Số điện thoại <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="0912345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú (tùy chọn)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập ghi chú nếu có..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>Tối đa 500 ký tự</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Đăng ký tham gia"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

