"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { postSchema } from "@/validation/postSchema";
import { postServices } from "@/services/admin/post";
import TinyEditor from "@/components/TinyEditor/TinyEditor";
import {
  Plus,
  X,
  UploadCloud,
  Link as LinkIcon,
  Eye,
  Calendar,
  Folder,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { revalidatePosts, revalidateHome } from "@/utils/revalidateCache";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/datetime";

function AddPost() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const editorRef = useRef(null);
  const [tags, setTags] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // States for Quick Create Dialogs
  const [isCatDialogOpen, setIsCatDialogOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [isCreatingQuick, setIsCreatingQuick] = useState(false);

  // State for Preview
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const form = useForm({
    resolver: yupResolver(postSchema),
    defaultValues: {
      title: "",
      meta_description: "",
      category_id: "",
      status: "0",
      tags: [],
      featured_image: undefined,
    },
  });

  const fetchData = async () => {
    try {
      const [catRes, tagRes] = await Promise.all([
        postServices.getAllcategory(),
        postServices.getAlltags(),
      ]);
      setCategories(catRes?.data?.data.categories.data || []);
      setTags(tagRes?.data?.data.data || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const editorContent = editorRef.current
      ? editorRef.current.getContent()
      : "";
    if (!editorContent || editorContent.trim() === "") {
      toast.error("Nội dung bài viết không được để trống.");
      setIsSubmitting(false);
      return;
    }
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", editorContent);
    formData.append("meta_description", data.meta_description || "");
    formData.append("category_id", data.category_id);
    formData.append("status", data.status);

    if (data.featured_image && data.featured_image.length > 0) {
      formData.append("featured_image", data.featured_image[0]);
    }

    data.tags.forEach((tagId) => {
      formData.append("tags[]", tagId);
    });

    try {
      const response = await postServices.createPost(formData);
      const slug = response?.data?.slug || response?.data?.data?.slug;
      await Promise.all([revalidatePosts(slug), revalidateHome()]);
      toast.success("Đã thêm bài viết mới!");
      router.push("/admin/posts");
      form.reset();
      setImagePreview(null);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(error.message || "Không thể tạo bài viết.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Handlers for Image Drag & Drop / Paste ---
  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file, field);
    } else {
      setImagePreview(null);
      field.onChange(undefined);
    }
  };

  const processFile = (file, field) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Chỉ chấp nhận file ảnh");
      return;
    }
    setImagePreview(URL.createObjectURL(file));
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    field.onChange(dataTransfer.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e, field) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0], field);
    }
  };

  const onPaste = (e, field) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        processFile(file, field);
        e.preventDefault(); // Prevent default paste behavior
        break;
      }
    }
  };

  // --- Handlers for Quick Create ---
  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;
    setIsCreatingQuick(true);
    try {
      const res = await postServices.createCategory({ name: newCatName });
      toast.success("Đã tạo danh mục mới");
      await fetchData(); // Refresh list
      setNewCatName("");
      setIsCatDialogOpen(false);
      if (res?.data?.id) {
        form.setValue("category_id", String(res.data.id));
      }
    } catch (error) {
      toast.error("Lỗi tạo danh mục: " + (error.message || "Unknown"));
    } finally {
      setIsCreatingQuick(false);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    setIsCreatingQuick(true);
    try {
      const res = await postServices.createTag({ name: newTagName });
      toast.success("Đã tạo thẻ mới");
      await fetchData(); // Refresh list
      setNewTagName("");
      setIsTagDialogOpen(false);
      if (res?.data?.id) {
        const currentTags = form.getValues("tags") || [];
        form.setValue("tags", [...currentTags, String(res.data.id)]);
      }
    } catch (error) {
      toast.error("Lỗi tạo thẻ: " + (error.message || "Unknown"));
    } finally {
      setIsCreatingQuick(false);
    }
  };

  // --- Handler for Preview ---
  const handlePreview = () => {
    const values = form.getValues();
    const content = editorRef.current ? editorRef.current.getContent() : "";

    // Validate basics
    if (!values.title) {
      toast.warning("Vui lòng nhập tiêu đề để xem trước");
      return;
    }

    // Prepare data
    const category = categories.find(
      (c) => String(c.id) === values.category_id
    );
    const selectedTags = tags.filter((t) =>
      values.tags?.includes(String(t.id))
    );

    setPreviewData({
      title: values.title,
      content: content,
      featured_image: imagePreview,
      category_name: category?.name,
      tags: selectedTags,
      meta_description: values.meta_description,
      published_at: new Date().toISOString(),
      view_count: 0,
      author_name: "Tác giả (Preview)",
    });
    setIsPreviewOpen(true);
  };

  return (
    <>
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
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề</FormLabel>
                      <FormControl>
                        <Input placeholder="Tiêu đề bài viết..." {...field} />
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
                        <Textarea placeholder="Mô tả ngắn gọn..." {...field} />
                      </FormControl>
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
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={handlePreview}
                  >
                    <Eye className="w-4 h-4 mr-2" /> Xem trước
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang lưu..." : "Lưu bài viết"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Danh mục</CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setIsCatDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
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
                        value={field.value}
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Thẻ (Tags)</CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setIsTagDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
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
                            render={({ field }) => (
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
                                <FormLabel className="font-normal cursor-pointer">
                                  {tag.name}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </ScrollArea>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ảnh đại diện</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="featured_image"
                  render={({ field: { onChange, value, ...fieldProps } }) => (
                    <FormItem>
                      <div
                        className={`
                                relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
                                ${
                                  isDragging
                                    ? "border-primary bg-primary/5"
                                    : "border-muted-foreground/25 hover:border-primary/50"
                                }
                            `}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={(e) => onDrop(e, { onChange })}
                        onPaste={(e) => onPaste(e, { onChange })}
                      >
                        <Input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          {...fieldProps}
                          onChange={(e) => handleImageChange(e, { onChange })}
                        />

                        {imagePreview ? (
                          <div className="relative w-full">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-auto rounded-md object-cover max-h-[300px]"
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                              Click hoặc kéo thả để thay đổi
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <UploadCloud className="h-10 w-10 mb-2" />
                            <p className="font-medium text-sm">
                              Kéo thả ảnh vào đây
                            </p>
                            <p className="text-xs">hoặc click để chọn file</p>
                            <p className="text-xs text-muted-foreground/50 mt-2">
                              Paste (Ctrl+V) cũng được hỗ trợ
                            </p>
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>

      {/* Quick Create Dialogs */}
      <Dialog open={isCatDialogOpen} onOpenChange={setIsCatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo danh mục mới</DialogTitle>
            <DialogDescription>
              Nhập tên danh mục muốn tạo nhanh.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Tên danh mục..."
            onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCatDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateCategory} disabled={isCreatingQuick}>
              {isCreatingQuick ? "Đang tạo..." : "Tạo danh mục"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo thẻ (Tag) mới</DialogTitle>
            <DialogDescription>Nhập tên thẻ muốn tạo nhanh.</DialogDescription>
          </DialogHeader>
          <Input
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Tên thẻ..."
            onKeyDown={(e) => e.key === "Enter" && handleCreateTag()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTagDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateTag} disabled={isCreatingQuick}>
              {isCreatingQuick ? "Đang tạo..." : "Tạo thẻ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="min-w-[100vw] w-screen h-screen m-0 flex flex-col p-0 gap-0 rounded-none border-none">
          <DialogHeader className="p-4 border-b shrink-0 bg-background">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Xem trước bài viết</DialogTitle>
                <DialogDescription>
                  Giao diện hiển thị thực tế trên trang chủ.
                </DialogDescription>
              </div>
            </div>
                       </DialogHeader>
                      
                      <div className="flex-1 overflow-y-auto p-6 md:p-16 lg:p-24 bg-background">
                          {previewData && (
                              <article className="w-full max-w-3xl mx-auto">                {/* Featured Image */}
                {previewData.featured_image && (
                  <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden shadow-lg bg-muted">
                    {/* Dùng thẻ img thường để support blob URL dễ dàng */}
                    <img
                      src={previewData.featured_image}
                      alt={previewData.title || "Bài viết"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Category Badge */}
                {previewData.category_name && (
                  <div className="mb-4">
                    <Badge variant="secondary" className="text-sm">
                      <Folder className="w-3 h-3 mr-1" />
                      {previewData.category_name}
                    </Badge>
                  </div>
                )}

                {/* Title */}
                <h1 className="text-4xl font-bold mb-4 text-pretty leading-tight">
                  {previewData.title || "Tiêu đề bài viết"}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap gap-6 mb-8 pb-6 border-b border-border">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {formatDate(previewData.published_at)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">0 lượt xem</span>
                  </div>

                  {previewData.author_name && (
                    <div className="text-sm text-muted-foreground">
                      Tác giả:{" "}
                      <span className="font-medium text-foreground">
                        {previewData.author_name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
                  {previewData.content ? (
                    <div
                      className="text-base leading-relaxed space-y-4"
                      dangerouslySetInnerHTML={{ __html: previewData.content }}
                    />
                  ) : (
                    <p className="text-muted-foreground italic text-center">
                      Chưa có nội dung...
                    </p>
                  )}
                </div>

                {/* Tags */}
                {previewData.tags && previewData.tags.length > 0 && (
                  <Card className="p-6 bg-muted/30">
                    <h3 className="font-semibold mb-3 text-foreground">
                      Thẻ liên quan
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {previewData.tags.map((tag) => (
                        <Badge
                          key={tag.id || tag.name}
                          variant="outline"
                          className="cursor-pointer hover:bg-muted"
                        >
                          #{tag.name}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Description (SEO Meta) */}
                {previewData.meta_description && (
                  <div className="mt-8 pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground italic">
                      {previewData.meta_description}
                    </p>
                  </div>
                )}
                                  </article>
                              )}
                          </div>
                      </DialogContent>
                    </Dialog>    </>
  );
}

export default AddPost;
