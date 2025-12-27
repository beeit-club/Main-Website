// components/admin/email-templates/EmailVariableList.jsx
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Mail, Phone, Image, FileText, Calendar, Award, GraduationCap, Sparkles } from "lucide-react";
import { emailCustomVariableServices } from "@/services/admin/emailCustomVariableServices";

// Danh sách các biến có sẵn từ UserDataMapper
const AVAILABLE_VARIABLES = [
  {
    category: "Thông tin cơ bản",
    icon: User,
    variables: [
      { name: "fullname", type: "string", description: "Họ và tên đầy đủ", example: "Nguyễn Văn A" },
      { name: "email", type: "string", description: "Email", example: "user@example.com" },
      { name: "phone", type: "string", description: "Số điện thoại", example: "0123456789" },
      { name: "avatar_url", type: "string", description: "URL ảnh đại diện", example: "https://..." },
      { name: "bio", type: "string", description: "Tiểu sử", example: "Sinh viên CNTT" },
    ],
  },
  {
    category: "Vai trò",
    icon: Award,
    variables: [
      { name: "role_name", type: "string", description: "Tên vai trò", example: "Thành viên" },
      { name: "role_description", type: "string", description: "Mô tả vai trò", example: "Thành viên chính thức" },
    ],
  },
  {
    category: "Thông tin thành viên",
    icon: GraduationCap,
    variables: [
      { name: "student_id", type: "string", description: "Mã sinh viên", example: "SV001" },
      { name: "academic_year", type: "string", description: "Khóa học", example: "2024" },
      { name: "course", type: "string", description: "Ngành học", example: "Công nghệ thông tin" },
      { name: "join_date", type: "date", description: "Ngày tham gia (raw)", example: "2024-01-15" },
      { name: "formatted_join_date", type: "string", description: "Ngày tham gia (đã format)", example: "Thứ Hai, 15 tháng 1, 2024" },
      { name: "years_as_member", type: "number", description: "Số năm là thành viên", example: "2" },
    ],
  },
];

export function EmailVariableList({ onInsertVariable, templateId = null }) {
  const [customVariables, setCustomVariables] = useState([]);
  const [isLoadingCustom, setIsLoadingCustom] = useState(false);

  // Load custom variables
  useEffect(() => {
    async function loadCustomVariables() {
      setIsLoadingCustom(true);
      try {
        const res = await emailCustomVariableServices.getAllVariables({
          template_id: templateId,
        });
        setCustomVariables(res?.data?.data || []);
      } catch (error) {
        console.error("Error loading custom variables:", error);
      } finally {
        setIsLoadingCustom(false);
      }
    }
    loadCustomVariables();
  }, [templateId]);

  const handleDragStart = (e, variableName) => {
    e.dataTransfer.setData("text/plain", `{{${variableName}}}`);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleClick = (variableName) => {
    if (onInsertVariable) {
      onInsertVariable(`{{${variableName}}}`);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Biến có sẵn</CardTitle>
        <CardDescription>
          Kéo thả hoặc click để chèn biến vào nội dung email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {/* Custom Variables */}
            {customVariables.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                  <span>Biến tùy biến</span>
                </div>
                <div className="space-y-1 pl-6">
                  {customVariables.map((variable) => (
                    <div
                      key={variable.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, variable.name)}
                      onClick={() => handleClick(variable.name)}
                      className="group cursor-pointer rounded-md border p-2 transition-colors hover:bg-accent hover:border-primary border-primary/20"
                      title={variable.description || `Biến tùy biến: ${variable.name}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono text-primary">
                            {`{{${variable.name}}}`}
                          </code>
                          <Badge variant="outline" className="text-xs bg-primary/10">
                            {variable.return_type || "string"}
                          </Badge>
                          {variable.template_id && (
                            <Badge variant="secondary" className="text-xs">
                              Template
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {variable.description || "Biến tùy biến"}
                      </p>
                      {variable.expression && (
                        <p className="mt-1 text-xs font-mono text-muted-foreground/70">
                          {variable.expression.length > 50
                            ? `${variable.expression.substring(0, 50)}...`
                            : variable.expression}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Built-in Variables */}
            {AVAILABLE_VARIABLES.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Icon className="h-4 w-4" />
                    <span>{category.category}</span>
                  </div>
                  <div className="space-y-1 pl-6">
                    {category.variables.map((variable) => (
                      <div
                        key={variable.name}
                        draggable
                        onDragStart={(e) => handleDragStart(e, variable.name)}
                        onClick={() => handleClick(variable.name)}
                        className="group cursor-pointer rounded-md border p-2 transition-colors hover:bg-accent hover:border-primary"
                        title={`${variable.description} - Ví dụ: ${variable.example}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono text-primary">
                              {`{{${variable.name}}}`}
                            </code>
                            <Badge variant="outline" className="text-xs">
                              {variable.type}
                            </Badge>
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {variable.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

