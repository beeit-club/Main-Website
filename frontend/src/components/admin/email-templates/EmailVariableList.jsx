// src/components/admin/email-templates/EmailVariableList.jsx
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, PlusCircle, Database, Calculator, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { emailVariableServices } from "@/services/admin/emailVariableServices";

const HELPER_FUNCTIONS = [
  { name: "formatDate created_at", desc: "Định dạng ngày (12/01/2024)" },
  { name: "formatTime created_at", desc: "Định dạng giờ (14:30)" },
  { name: "uppercase fullname", desc: "VIẾT HOA toàn bộ" },
  { name: "lowercase fullname", desc: "viết thường toàn bộ" },
  { name: "ifEq role 'admin'", desc: "Điều kiện: Nếu là Admin" },
  { name: "else", desc: "Điều kiện: Ngược lại" },
  { name: "/ifEq", desc: "Kết thúc điều kiện" }
];

export function EmailVariableList({ onInsertVariable }) {
  const [variables, setVariables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadVariables() {
        try {
            const res = await emailVariableServices.getAllVariables();
            if(res.status === 'success') {
                setVariables(res.data.variables || []);
            }
        } catch (error) {
            console.error("Failed to load variables", error);
            // Fallback empty or toast error (optional)
        } finally {
            setIsLoading(false);
        }
    }
    loadVariables();
  }, []);
  
  const handleCopy = (text) => {
    const variableTag = `{{${text}}}`;
    onInsertVariable(variableTag);
    toast.success(`Đã chèn biến: ${variableTag}`);
  };

  const VariableItem = ({ item }) => (
    <div 
        className="flex items-center justify-between p-2 rounded-md border mb-2 hover:bg-orange-50 bg-white shadow-sm transition-all cursor-pointer group"
        onClick={() => handleCopy(item.key)}
    >
      <div className="flex flex-col overflow-hidden">
        <div className="flex items-center gap-2">
            <code className="text-xs font-bold text-orange-600 truncate">
                {`{{${item.key}}}`}
            </code>
            {item.is_system && <Badge variant="secondary" className="text-[9px] h-4 px-1">System</Badge>}
        </div>
        <span className="text-[10px] text-gray-500 truncate" title={item.description}>{item.label || item.description}</span>
      </div>
      <Button 
        type="button"
        variant="ghost" 
        size="icon" 
        className="h-6 w-6 ml-2 text-gray-400 hover:text-orange-600 hover:bg-orange-100"
        onClick={(e) => {
            e.stopPropagation(); // Tránh duplicate event nếu click button
            handleCopy(item.key);
        }}
      >
        <PlusCircle className="h-4 w-4" />
      </Button>
    </div>
  );

  const HelperItem = ({ item }) => (
    <div 
        className="flex items-center justify-between p-2 rounded-md border mb-2 hover:bg-blue-50 bg-white shadow-sm transition-all cursor-pointer group"
        onClick={() => handleCopy(item.name)}
    >
      <div className="flex flex-col overflow-hidden">
        <code className="text-xs font-bold text-blue-600 truncate">
            {`{{${item.name}}}`}
        </code>
        <span className="text-[10px] text-gray-500 truncate">{item.desc}</span>
      </div>
      <Button 
        type="button"
        variant="ghost" 
        size="icon" 
        className="h-6 w-6 ml-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100"
        onClick={(e) => {
            e.stopPropagation();
            handleCopy(item.name);
        }}
      >
        <PlusCircle className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-50/50">
      <div className="p-3 border-b bg-white">
        <h3 className="font-semibold text-sm mb-1">Thư viện biến</h3>
        <p className="text-xs text-muted-foreground">Click dấu + để chèn vào vị trí con trỏ</p>
      </div>
      
      <Tabs defaultValue="system" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-3 pt-2">
            <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="system" className="text-xs">
                    <Database className="h-3 w-3 mr-1" /> Dữ liệu
                </TabsTrigger>
                <TabsTrigger value="helper" className="text-xs">
                    <Calculator className="h-3 w-3 mr-1" /> Logic
                </TabsTrigger>
            </TabsList>
        </div>

        <TabsContent value="system" className="flex-1 mt-0 overflow-hidden relative">
          <ScrollArea className="h-full p-3">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mb-2" />
                    <span className="text-xs">Đang tải biến...</span>
                </div>
            ) : (
                <>
                    {variables.map((v) => (
                    <VariableItem key={v.id || v.key} item={v} />
                    ))}
                    <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-100">
                        <p className="text-xs text-blue-700">
                            <strong>Mẹo:</strong> Bạn có thể tự tạo biến mới bằng cách gõ trực tiếp <code>&#123;&#123;ten_bien_moi&#125;&#125;</code>.
                        </p>
                    </div>
                </>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="helper" className="flex-1 mt-0 overflow-hidden">
          <ScrollArea className="h-full p-3">
            {HELPER_FUNCTIONS.map((v) => (
              <HelperItem key={v.name} item={v} />
            ))}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
