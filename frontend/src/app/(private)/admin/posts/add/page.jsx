"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { postSchema } from "@/validation/postSchema"; // Import schema validation
import { postServices } from "@/services/admin/post"; // Import service
import TinyEditor from "@/components/TinyEditor/TinyEditor"; // Editor của bạn

// --- Import các component của shadcn/ui ---
// (Giả sử bạn đã cài đặt các component này)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
// Giả sử bạn có component Toast
// import { useToast } from "@/components/ui/use-toast";

function AddPost() {
  const [categories, setCategories] = useState([]);
  const editorRef = useRef(null);
  const [tags, setTags] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 1. Khởi tạo react-hook-form
  const form = useForm({
    resolver: yupResolver(postSchema),
    defaultValues: {
      title: "",
      meta_description: "",
      category_id: "",
      status: "0", // Mặc định là bản nháp
      tags: [],
      featured_image: undefined,
    },
  });

  // 2. Fetch dữ liệu cho categories và tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          postServices.getAllcategory(),
          postServices.getAlltags(),
        ]);
        console.log("🚀 ~ fetchData ~ tagRes:", tagRes);
        console.log("🚀 ~ fetchData ~ catRes:", catRes);
        setCategories(catRes?.data?.data.categories.data || []);
        setTags(tagRes?.data?.data.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // toast({ title: "Lỗi", description: "Không thể tải danh mục hoặc thẻ." });
      }
    };
    fetchData();
  }, []);

  // 3. Hàm xử lý khi submit form
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    console.log("Form Data:", data);
    const editorContent = editorRef.current
      ? editorRef.current.getContent()
      : "";
    if (!editorContent || editorContent.trim() === "") {
      toast({
        title: "Lỗi",
        description: "Nội dung bài viết không được để trống.",
      });
      return;
    }
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", editorContent);
    formData.append("meta_description", data.meta_description || "");
    formData.append("category_id", data.category_id);
    formData.append("status", data.status);

    // Thêm ảnh đại diện (nếu có)
    if (data.featured_image && data.featured_image.length > 0) {
      formData.append("featured_image", data.featured_image[0]);
    }

    // Thêm các tag (backend có thể nhận dạng 'tags[]')
    data.tags.forEach((tagId) => {
      formData.append("tags[]", tagId);
    });

    // Bạn cũng có thể gửi tags dưới dạng JSON nếu BE hỗ trợ
    // formData.append("tags", JSON.stringify(data.tags));

    // --- Gửi lên server ---
    try {
      setIsSubmitting(true);
      await postServices.createPost(formData);
      // toast({ title: "Thành công", description: "Đã thêm bài viết mới." });
      alert("Đã thêm bài viết mới!"); // Dùng tạm alert
      form.reset(); // Reset form
      setImagePreview(null);
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error creating post:", error);
      // toast({ title: "Lỗi", description: error.message || "Không thể tạo bài viết." });
      alert("Lỗi: " + (error.message || "Không thể tạo bài viết."));
    }
  };

  // 4. Hàm xử lý preview ảnh
  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      field.onChange(e.target.files); // Cập nhật react-hook-form
    } else {
      setImagePreview(null);
      field.onChange(undefined);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6 p-4"
      >
        {/* Cột chính (Nội dung) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nội dung bài viết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tiêu đề */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tiêu đề bài viết của bạn..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="meta_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả Meta (SEO)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả ngắn gọn (tối đa 160 ký tự) cho SEO..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Mô tả này sẽ hiển thị trên kết quả tìm kiếm Google.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Nội dung</FormLabel>
                <FormControl>
                  <TinyEditor editorRef={editorRef} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </CardContent>
          </Card>
        </div>

        {/* Cột phụ (Thông tin) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Trạng thái & Đăng */}
          <Card>
            <CardHeader>
              <CardTitle>Đăng bài</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Bản nháp</SelectItem>
                        <SelectItem value="1">Công khai</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : "Lưu bài viết"}
              </Button>
            </CardContent>
          </Card>

          {/* Danh mục */}
          <Card>
            <CardHeader>
              <CardTitle>Danh mục</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Thẻ (Tags) */}
          <Card>
            <CardHeader>
              <CardTitle>Thẻ (Tags)</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <ScrollArea className="h-48 w-full rounded-md border p-4">
                      {tags.map((tag) => (
                        <FormField
                          key={tag.id}
                          control={form.control}
                          name="tags"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={tag.id}
                                className="flex flex-row items-start space-x-3 space-y-0 mb-2"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(
                                      String(tag.id)
                                    )}
                                    onCheckedChange={(checked) => {
                                      const tagIdStr = String(tag.id);
                                      return checked
                                        ? field.onChange([
                                            ...(field.value || []),
                                            tagIdStr,
                                          ])
                                        : field.onChange(
                                            (field.value || []).filter(
                                              (value) => value !== tagIdStr
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {tag.name}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </ScrollArea>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Ảnh đại diện */}
          <Card>
            <CardHeader>
              <CardTitle>Ảnh đại diện</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Xem trước ảnh"
                  className="w-full h-auto rounded-md object-cover"
                />
              )}
              <FormField
                control={form.control}
                name="featured_image"
                render={({ field: { onChange, value, ...fieldProps } }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        {...fieldProps}
                        onChange={(e) => handleImageChange(e, { onChange })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
}

export default AddPost;
