import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import { documentServices } from "@/services/admin/documentServices";

export function DeletedRowActions({ row, refetchData }) {
  const [openRestore, setOpenRestore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const docId = row.original.id;
  const docTitle = row.original.title;

  async function onConfirmRestore() {
    setIsSubmitting(true);
    try {
      await documentServices.restoreDocument(docId);
      toast.success("Khôi phục tài liệu thành công!");
      setOpenRestore(false);
      refetchData(); // Gọi lại hàm loadData từ page
    } catch (error) {
      toast.error("Khôi phục thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpenRestore(true)}>
        <RotateCcw className="mr-2 h-4 w-4" />
        Khôi phục
      </Button>

      {/* --- Dialog Khôi phục --- */}
      <Dialog open={openRestore} onOpenChange={setOpenRestore}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận Khôi phục</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Bạn có chắc muốn khôi phục tài liệu <strong>{docTitle}</strong>?
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenRestore(false)}>
              Huỷ
            </Button>
            <Button onClick={onConfirmRestore} disabled={isSubmitting}>
              {isSubmitting ? "Đang khôi phục..." : "Khôi phục"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
