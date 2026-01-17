"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Loader2 } from "lucide-react";
import { emailTemplateServices } from "@/services/admin/emailTemplateServices";
import { toast } from "sonner";

export function TestSendDialog({ isOpen, onOpenChange, templateId, mockVariables }) {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!email) {
      toast.error("Vui lòng nhập email người nhận");
      return;
    }

    setIsSending(true);
    try {
      const res = await emailTemplateServices.testSendTemplate(
        templateId, 
        email, 
        mockVariables
      );
      
      if (res.status === "success") {
        toast.success("Đã gửi email thử nghiệm! Vui lòng kiểm tra hộp thư.");
        onOpenChange(false);
      } else {
        toast.error(res.message || "Gửi thử thất bại");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi gửi");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-orange-600" />
            Gửi email thử nghiệm
          </DialogTitle>
          <DialogDescription>
            Hệ thống sẽ gửi email này bằng dữ liệu bạn đang nhập trong khung soạn thảo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email người nhận</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="p-3 bg-gray-50 rounded-md border border-dashed">
            <p className="text-[11px] text-gray-500 font-medium uppercase mb-2">Dữ liệu sẽ gửi:</p>
            <div className="max-h-[100px] overflow-y-auto">
                <pre className="text-[10px] text-gray-700">
                    {JSON.stringify(mockVariables, null, 2)}
                </pre>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button 
            className="bg-orange-600 hover:bg-orange-700 text-white" 
            onClick={handleSend}
            disabled={isSending}
          >
            {isSending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi...
                </>
            ) : "Gửi ngay"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
