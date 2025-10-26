// src/components/RowActions.jsx
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { postServices } from "@/services/admin/post";
import { toast } from "sonner";

export function RowActions({ row }) {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [formValue, setFormValue] = React.useState({
    title: row.original.title,
    category_name: row.original.category_name,
    published_at: row.original.published_at,
  });

  function onSaveEdit() {
    // TODO: replace with API call or callback props
    console.log("Save edit for row:", row.id, formValue);
    setOpenEdit(false);
    alert(`Saved: ${JSON.stringify(formValue)}`);
  }

  async function onConfirmDelete() {
    // TODO: API call or callback to parent to remove row
    await postServices.delete(row.id);
    toast.success("xóa mềm thành công");
    setOpenDelete(false);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onSaveEdit()}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirm Dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            Bạn có chắc muốn xóa <strong>{row.original.title}</strong> ?
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenDelete(false)}>
              Huỷ
            </Button>
            <Button variant="destructive" onClick={onConfirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
