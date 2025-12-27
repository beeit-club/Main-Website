// components/admin/email-templates/HelperFunctionsReference.jsx
"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  Type,
  Calendar,
  Code,
  CheckCircle,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

const HELPER_FUNCTIONS = [
  {
    category: "Logic",
    icon: CheckCircle,
    functions: [
      {
        name: "IF",
        syntax: "IF(condition, trueValue, falseValue)",
        description: "Điều kiện if-else",
        example: 'IF(HOURS() < 12, "Chào buổi sáng", "Chào buổi chiều")',
        returnType: "any",
      },
      {
        name: "AND",
        syntax: "AND(condition1, condition2, ...)",
        description: "Logic AND",
        example: "AND(years_as_member > 1, is_active == true)",
        returnType: "boolean",
      },
      {
        name: "OR",
        syntax: "OR(condition1, condition2, ...)",
        description: "Logic OR",
        example: "OR(role_name == 'Admin', role_name == 'Moderator')",
        returnType: "boolean",
      },
      {
        name: "NOT",
        syntax: "NOT(condition)",
        description: "Logic NOT",
        example: "NOT(is_active)",
        returnType: "boolean",
      },
    ],
  },
  {
    category: "String",
    icon: Type,
    functions: [
      {
        name: "CONCAT",
        syntax: "CONCAT(str1, str2, ...)",
        description: "Nối các chuỗi",
        example: 'CONCAT("Xin chào ", fullname, "!")',
        returnType: "string",
      },
      {
        name: "UPPER",
        syntax: "UPPER(str)",
        description: "Chuyển thành chữ hoa",
        example: 'UPPER("hello")',
        returnType: "string",
      },
      {
        name: "LOWER",
        syntax: "LOWER(str)",
        description: "Chuyển thành chữ thường",
        example: 'LOWER("HELLO")',
        returnType: "string",
      },
      {
        name: "CAPITALIZE",
        syntax: "CAPITALIZE(str)",
        description: "Viết hoa chữ cái đầu",
        example: 'CAPITALIZE("hello")',
        returnType: "string",
      },
      {
        name: "LENGTH",
        syntax: "LENGTH(str)",
        description: "Độ dài chuỗi",
        example: 'LENGTH("hello")',
        returnType: "number",
      },
      {
        name: "SUBSTRING",
        syntax: "SUBSTRING(str, start, length)",
        description: "Cắt chuỗi",
        example: 'SUBSTRING("hello", 0, 3)',
        returnType: "string",
      },
    ],
  },
  {
    category: "Format",
    icon: Code,
    functions: [
      {
        name: "FORMAT_PHONE",
        syntax: "FORMAT_PHONE(phone)",
        description: "Format số điện thoại",
        example: 'FORMAT_PHONE("0123456789")',
        returnType: "string",
      },
      {
        name: "FORMAT_DATE",
        syntax: "FORMAT_DATE(date, format)",
        description: "Format ngày tháng",
        example: 'FORMAT_DATE(join_date, "DD/MM/YYYY")',
        returnType: "string",
      },
    ],
  },
  {
    category: "Math",
    icon: Calculator,
    functions: [
      {
        name: "ROUND",
        syntax: "ROUND(num, decimals)",
        description: "Làm tròn số",
        example: "ROUND(3.14159, 2)",
        returnType: "number",
      },
      {
        name: "FLOOR",
        syntax: "FLOOR(num)",
        description: "Làm tròn xuống",
        example: "FLOOR(3.7)",
        returnType: "number",
      },
      {
        name: "CEIL",
        syntax: "CEIL(num)",
        description: "Làm tròn lên",
        example: "CEIL(3.2)",
        returnType: "number",
      },
    ],
  },
  {
    category: "Date",
    icon: Calendar,
    functions: [
      {
        name: "NOW",
        syntax: "NOW()",
        description: "Thời gian hiện tại",
        example: "NOW()",
        returnType: "date",
      },
      {
        name: "TODAY",
        syntax: "TODAY()",
        description: "Ngày hôm nay",
        example: "TODAY()",
        returnType: "date",
      },
      {
        name: "HOURS",
        syntax: "HOURS()",
        description: "Giờ hiện tại (0-23)",
        example: "HOURS()",
        returnType: "number",
      },
      {
        name: "YEAR",
        syntax: "YEAR(date)",
        description: "Lấy năm từ date",
        example: "YEAR(join_date)",
        returnType: "number",
      },
      {
        name: "MONTH",
        syntax: "MONTH(date)",
        description: "Lấy tháng từ date (1-12)",
        example: "MONTH(join_date)",
        returnType: "number",
      },
      {
        name: "DAY",
        syntax: "DAY(date)",
        description: "Lấy ngày từ date",
        example: "DAY(join_date)",
        returnType: "number",
      },
    ],
  },
];

export function HelperFunctionsReference({ onInsertFunction }) {
  const [selectedCategory, setSelectedCategory] = useState("Logic");

  const handleCopyFunction = (func) => {
    if (onInsertFunction) {
      onInsertFunction(func.syntax);
      toast.success(`Đã chèn: ${func.name}`);
    } else {
      navigator.clipboard.writeText(func.syntax);
      toast.success(`Đã copy: ${func.syntax}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Helper Functions</CardTitle>
        <CardDescription>
          Click để copy hoặc chèn function vào expression
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-5">
            {HELPER_FUNCTIONS.map((cat) => {
              const Icon = cat.icon;
              return (
                <TabsTrigger key={cat.category} value={cat.category}>
                  <Icon className="h-4 w-4 mr-1" />
                  {cat.category}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {HELPER_FUNCTIONS.map((cat) => (
            <TabsContent key={cat.category} value={cat.category} className="mt-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {cat.functions.map((func) => (
                    <Card
                      key={func.name}
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleCopyFunction(func)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <code className="font-bold text-primary">
                                {func.name}
                              </code>
                              <Badge variant="outline" className="text-xs">
                                {func.returnType}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {func.description}
                            </p>
                            <div className="space-y-1">
                              <div className="text-xs font-mono bg-muted p-2 rounded">
                                {func.syntax}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Ví dụ: <code>{func.example}</code>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyFunction(func);
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

