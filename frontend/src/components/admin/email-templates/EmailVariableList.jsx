// components/admin/email-templates/EmailVariableList.jsx
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Sparkles, Loader2, Database } from "lucide-react";
import { emailCustomVariableServices } from "@/services/admin/emailCustomVariableServices";
import { emailVariableServices } from "@/services/admin/emailVariableServices";

export function EmailVariableList({ onInsertVariable, templateId = null }) {
  const [systemVariables, setSystemVariables] = useState([]);
  const [customVariables, setCustomVariables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load All Variables
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [sysRes, custRes] = await Promise.all([
          emailVariableServices.getAllVariables(),
          emailCustomVariableServices.getAllVariables({ template_id: templateId })
        ]);
        
        setSystemVariables(sysRes?.data?.variables || []);
        setCustomVariables(custRes?.data?.data || []);
      } catch (error) {
        console.error("Error loading variables:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
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
    <Card className="h-full border-l-0 rounded-none shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Danh sách Biến
        </CardTitle>
        <CardDescription>
          Kéo thả hoặc click để chèn biến vào nội dung email
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            <div className="space-y-6">
              
              {/* System Variables */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  <span>Biến Hệ Thống</span>
                </div>
                <div className="grid gap-2">
                  {systemVariables.map((variable) => (
                    <div
                      key={variable.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, variable.name)}
                      onClick={() => handleClick(variable.name)}
                      className="group cursor-pointer rounded-lg border bg-card p-3 transition-all hover:border-primary hover:shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <code className="text-sm font-mono font-bold text-primary">
                          {`{{${variable.name}}}`}
                        </code>
                        {variable.mapping_key && (
                          <Badge variant="outline" className="text-[10px] px-1 h-4 bg-green-50 text-green-700 border-green-200">
                            Auto
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {variable.description || "Biến chuẩn"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Variables (Expression based) */}
              {customVariables.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Biến Tùy Biến (Logic)</span>
                  </div>
                  <div className="grid gap-2">
                    {customVariables.map((variable) => (
                      <div
                        key={variable.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, variable.name)}
                        onClick={() => handleClick(variable.name)}
                        className="group cursor-pointer rounded-lg border bg-blue-50/30 p-3 transition-all hover:border-blue-400 hover:shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <code className="text-sm font-mono font-bold text-blue-600">
                            {`{{${variable.name}}}`}
                          </code>
                          <Badge variant="secondary" className="text-[10px] px-1 h-4">
                            {variable.return_type || "any"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {variable.description || "Biến tính toán"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {systemVariables.length === 0 && customVariables.length === 0 && (
                <div className="text-center py-10 text-muted-foreground text-sm italic">
                  Không tìm thấy biến nào.
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}