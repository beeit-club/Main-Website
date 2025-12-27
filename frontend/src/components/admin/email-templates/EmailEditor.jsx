// components/admin/email-templates/EmailEditor.jsx
"use client";

import React, { useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Code, Eye, Type } from "lucide-react";

export function EmailEditor({ 
  value, 
  onChange, 
  subject,
  onSubjectChange,
  label = "Nội dung Email",
  placeholder = "Nhập nội dung email HTML hoặc kéo thả biến từ danh sách bên cạnh..."
}) {
  const textareaRef = useRef(null);
  const previewRef = useRef(null);

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

  // Insert variable at cursor position
  const insertVariable = (variable) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value || "";
    const newText = text.substring(0, start) + variable + text.substring(end);
    
    onChange(newText);
    
    // Set cursor position after inserted variable
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + variable.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  // Preview HTML (simple preview, không render Handlebars)
  const renderPreview = () => {
    if (!value) return "<p class='text-muted-foreground'>Chưa có nội dung</p>";
    
    // Replace {{variable}} with example values for preview
    let preview = value
      .replace(/\{\{fullname\}\}/g, "<strong>Nguyễn Văn A</strong>")
      .replace(/\{\{email\}\}/g, "user@example.com")
      .replace(/\{\{phone\}\}/g, "0123456789")
      .replace(/\{\{role_name\}\}/g, "Thành viên")
      .replace(/\{\{student_id\}\}/g, "SV001")
      .replace(/\{\{academic_year\}\}/g, "2024")
      .replace(/\{\{course\}\}/g, "Công nghệ thông tin")
      .replace(/\{\{formatted_join_date\}\}/g, "Thứ Hai, 15 tháng 1, 2024")
      .replace(/\{\{years_as_member\}\}/g, "2")
      .replace(/\{\{(\w+)\}\}/g, "<span class='text-muted-foreground'>[{{$1}}]</span>");
    
    return preview;
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
        <Tabs defaultValue="editor" className="w-full">
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
              rows={20}
              className="font-mono text-sm"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              💡 Tip: Kéo thả biến từ danh sách bên cạnh hoặc click vào biến để chèn vào vị trí con trỏ
            </p>
          </TabsContent>
          
          <TabsContent value="preview" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <div
                  ref={previewRef}
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderPreview() }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

