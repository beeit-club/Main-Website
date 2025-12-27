// components/admin/email-templates/AdditionalDataForm.jsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Info } from "lucide-react";

/**
 * Component: Form nhập additional data cho email
 * 
 * Props:
 * - value: Object - Giá trị hiện tại
 * - onChange: (data: Object) => void - Callback khi data thay đổi
 * - templateVariables?: Array - Danh sách variables từ template (optional)
 */
export function AdditionalDataForm({ value = {}, onChange, templateVariables = [] }) {
  const [customFields, setCustomFields] = useState([
    { key: "", value: "" }
  ]);

  // Tìm các variables từ template (nếu có)
  const templateVarNames = templateVariables
    .filter((v) => v.name && !["fullname", "email", "phone", "student_id", "course", "join_date", "formatted_join_date", "years_as_member", "role_name"].includes(v.name))
    .map((v) => v.name);

  // Handle change cho predefined fields
  const handlePredefinedChange = (field, fieldValue) => {
    const newData = { ...value, [field]: fieldValue };
    onChange(newData);
  };

  // Handle change cho custom fields
  const handleCustomFieldChange = (index, field, fieldValue) => {
    const newFields = [...customFields];
    newFields[index] = { ...newFields[index], [field]: fieldValue };
    setCustomFields(newFields);

    // Update value
    const newData = { ...value };
    if (field === "key" && fieldValue) {
      // Nếu đổi key, xóa key cũ và thêm key mới
      const oldKey = newFields[index].key;
      if (oldKey && oldKey !== fieldValue) {
        delete newData[oldKey];
      }
    } else if (field === "value") {
      // Update value cho key hiện tại
      const currentKey = newFields[index].key;
      if (currentKey) {
        newData[currentKey] = fieldValue;
      }
    }
    onChange(newData);
  };

  // Add custom field
  const handleAddCustomField = () => {
    setCustomFields([...customFields, { key: "", value: "" }]);
  };

  // Remove custom field
  const handleRemoveCustomField = (index) => {
    const newFields = customFields.filter((_, i) => i !== index);
    setCustomFields(newFields);

    // Remove từ value
    const removedKey = customFields[index].key;
    if (removedKey) {
      const newData = { ...value };
      delete newData[removedKey];
      onChange(newData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông Tin Bổ Sung (Optional)</CardTitle>
        <CardDescription>
          Thêm dữ liệu bổ sung sẽ được merge vào variables của email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Predefined common fields */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Event Title
            </label>
            <Input
              placeholder="VD: Workshop ReactJS"
              value={value.event_title || ""}
              onChange={(e) => handlePredefinedChange("event_title", e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Tên sự kiện (nếu có)
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Message
            </label>
            <Textarea
              rows={3}
              placeholder="VD: Thông báo quan trọng về sự kiện sắp tới..."
              value={value.message || ""}
              onChange={(e) => handlePredefinedChange("message", e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Nội dung thông báo tùy biến
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Document Title
            </label>
            <Input
              placeholder="VD: Tài liệu hướng dẫn"
              value={value.document_title || ""}
              onChange={(e) => handlePredefinedChange("document_title", e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Tên tài liệu (nếu có)
            </p>
          </div>
        </div>

        {/* Custom fields */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Custom Variables</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddCustomField}
            >
              <Plus className="h-4 w-4 mr-1" />
              Thêm Field
            </Button>
          </div>

          {customFields.map((field, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Tên biến (VD: custom_field)"
                value={field.key}
                onChange={(e) =>
                  handleCustomFieldChange(index, "key", e.target.value)
                }
                className="flex-1"
              />
              <Input
                placeholder="Giá trị"
                value={field.value}
                onChange={(e) =>
                  handleCustomFieldChange(index, "value", e.target.value)
                }
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveCustomField(index)}
                disabled={customFields.length === 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Info: Variables có sẵn */}
        <div className="rounded-md bg-muted p-3">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Variables tự động có sẵn:</p>
              <p>
                fullname, email, phone, student_id, course, join_date,
                formatted_join_date, years_as_member, role_name
              </p>
              {templateVarNames.length > 0 && (
                <p className="mt-1">
                  <span className="font-medium">Variables từ template:</span>{" "}
                  {templateVarNames.join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

