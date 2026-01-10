"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { emailMappingServices } from "@/services/admin/emailMapping";
import { emailTemplateServices } from "@/services/admin/emailTemplateServices";
import { Loader2, Save } from "lucide-react";

export default function EmailMappingsPage() {
  const [mappings, setMappings] = useState([]);
  const [allTemplates, setAllTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(null); // Store the action_key of the saving row

  // Fetch all active templates for the dropdown
  useEffect(() => {
    async function loadAllTemplates() {
      try {
        const res = await emailTemplateServices.getAllTemplates(new URLSearchParams({ limit: 1000, is_active: true }));
        setAllTemplates(res.data?.data || []);
      } catch (error) {
        toast.error("Không thể tải danh sách email templates");
      }
    }
    loadAllTemplates();
  }, []);

  // Fetch mappings
  useEffect(() => {
    async function loadMappings() {
      setIsLoading(true);
      try {
        const res = await emailMappingServices.getAllMappings();
        setMappings(res.data?.data || []);
      } catch (error) {
        toast.error("Không thể tải danh sách ánh xạ email");
      } finally {
        setIsLoading(false);
      }
    }
    loadMappings();
  }, []);

  const handleTemplateChange = (actionKey, templateIdString) => {
    const templateId = templateIdString === "none" ? null : parseInt(templateIdString);
    setMappings((prevMappings) =>
      prevMappings.map((m) =>
        m.action_key === actionKey ? { ...m, template_id: templateId, template_name: allTemplates.find(t => t.id === templateId)?.name || 'Chưa gán' } : m
      )
    );
  };

  const handleSaveChanges = async (mapping) => {
    setIsSaving(mapping.action_key);
    try {
      await emailMappingServices.updateMapping(mapping.action_key, mapping.template_id);
      toast.success(`Đã cập nhật hành động: ${mapping.action_key}`);
    } catch (error) {
      toast.error(`Lỗi khi cập nhật: ${error.message}`);
    } finally {
      setIsSaving(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Ánh xạ Email Hệ thống</h1>
        <p className="text-muted-foreground">
          Chọn template email tương ứng cho từng hành động tự động của hệ thống.
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25%]">Hành động (Action Key)</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="w-[35%]">Template được gán</TableHead>
              <TableHead className="text-right w-[10%]">Lưu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                </TableCell>
              </TableRow>
            ) : mappings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Không có hành động nào.
                </TableCell>
              </TableRow>
            ) : (
              mappings.map((mapping) => (
                <TableRow key={mapping.action_key}>
                  <TableCell className="font-mono text-sm font-medium">{mapping.action_key}</TableCell>
                  <TableCell className="text-muted-foreground">{mapping.description}</TableCell>
                  <TableCell>
                    <Select
                      value={mapping.template_id?.toString() || "none"}
                      onValueChange={(value) => handleTemplateChange(mapping.action_key, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="-- Chọn template --">
                          {mapping.template_id ? `${mapping.template_name} (ID: ${mapping.template_id})` : '-- Chọn template --'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">-- Bỏ gán --</SelectItem>
                        {allTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => handleSaveChanges(mapping)}
                      disabled={isSaving === mapping.action_key}
                    >
                      {isSaving === mapping.action_key ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

