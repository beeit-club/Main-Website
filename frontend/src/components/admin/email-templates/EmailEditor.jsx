"use client";

import React, { useRef, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Eye, Loader2 } from "lucide-react";

export function EmailEditor({ 
  value, 
  onChange, 
  subject,
  onSubjectChange,
  onPreview, // Hàm async trả về HTML preview từ server
  label = "Nội dung Email",
  placeholder = "Nhập nội dung email HTML hoặc kéo thả biến từ danh sách bên cạnh...",
  rows = 20
}) {
  const textareaRef = useRef(null);
  const [activeTab, setActiveTab] = useState("editor");
  const [previewHtml, setPreviewHtml] = useState("");
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Handle drag and drop
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    };

    const handleDrop = (e) => {
      e.preventDefault();
      const variable = e.dataTransfer.getData("text/plain");
      
      if (variable) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const newText = text.substring(0, start) + variable + text.substring(end);
        
        onChange(newText);
        
        // Set cursor position after inserted variable
        setTimeout(() => {
          textarea.focus();
          const newPosition = start + variable.length;
          textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
      }
    };

    textarea.addEventListener("dragover", handleDragOver);
    textarea.addEventListener("drop", handleDrop);

    return () => {
      textarea.removeEventListener("dragover", handleDragOver);
      textarea.removeEventListener("drop", handleDrop);
    };
  }, [onChange]);

  // Handle Tab Change
  const handleTabChange = async (value) => {
    setActiveTab(value);
    if (value === "preview" && onPreview) {
      setIsLoadingPreview(true);
      try {
        const html = await onPreview();
        setPreviewHtml(html);
      } catch (error) {
        setPreviewHtml(`<p class="text-red-500">Lỗi tải preview: ${error.message}</p>`);
      } finally {
        setIsLoadingPreview(false);
      }
    } else if (value === "preview" && !onPreview) {
      // Fallback local preview nếu không có API
      setPreviewHtml(renderLocalPreview());
    }
  };

  // Fallback local preview
  const renderLocalPreview = () => {
    if (!value) return "<p class='text-muted-foreground'>Chưa có nội dung</p>";
    return value
      .replace(/\{\{fullname\}\}/g, "<strong>Nguyễn Văn A</strong>")
      .replace(/\{\{(\w+)\}\}/g, "<span class='text-muted-foreground'>[{{$1}}]</span>");
  };

  return (
    <div className="space-y-4">
      {/* Subject Editor */}
      {subject !== undefined && (
        <div className="space-y-2">
          <Label htmlFor="email-subject">Tiêu đề Email</Label>
          <Textarea
            id="email-subject"
            placeholder="Nhập tiêu đề email (có thể dùng biến như {{fullname}})"
            value={subject || ""}
            onChange={(e) => onSubjectChange?.(e.target.value)}
            rows={2}
            className="font-mono text-sm"
          />
        </div>
      )}

      {/* Content Editor */}
      <div className="space-y-2">
        <Label>{label}</Label>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList>
            <TabsTrigger value="editor">
              <Code className="h-4 w-4 mr-2" />
              Soạn thảo
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Xem trước
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="mt-4">
            <Textarea
              ref={textareaRef}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              rows={rows}
              className="font-mono text-sm"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              💡 Tip: Kéo thả biến từ danh sách bên cạnh hoặc click vào biến để chèn vào vị trí con trỏ
            </p>
          </TabsContent>
          
          <TabsContent value="preview" className="mt-4">
            <Card>
              <CardContent className="p-4 bg-white rounded-md min-h-[400px] border shadow-inner overflow-auto">
                {isLoadingPreview ? (
                  <div className="flex items-center justify-center h-full py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Đang tạo bản xem trước...</span>
                  </div>
                ) : (
                  <div
                    className="reset-style" // Class để tránh style của admin ảnh hưởng vào email
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}