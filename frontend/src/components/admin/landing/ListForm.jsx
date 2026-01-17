"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Trash2, Plus, GripVertical } from "lucide-react";

import { landingServices } from "@/services/admin/landing";

export default function GenericListForm({
    data = [],
    onRefresh,
    section,
    fields = []
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, setValue } = useForm();

    const handleOpen = (item = null) => {
        setEditingItem(item);
        if (item) {
            fields.forEach(field => setValue(field.name, item[field.name]));
        } else {
            reset();
        }
        setIsOpen(true);
    };

    const onSubmit = async (formData) => {
        setLoading(true);
        try {
            if (editingItem) {
                await landingServices.updateItem(section, editingItem.id, formData);
            } else {
                await landingServices.createItem(section, formData);
            }

            setIsOpen(false);
            reset();
            setEditingItem(null);
            onRefresh();
        } catch (error) {
            console.error(error);
            alert(error.message || "Error saving data");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            await landingServices.deleteItem(section, id);
            onRefresh();
        } catch (error) {
            console.error(error);
            alert(error.message || "Error deleting data");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Danh sách ({data.length})</h3>
                <Button onClick={() => handleOpen(null)}>
                    <Plus className="mr-2 h-4 w-4" /> Thêm mới
                </Button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Sửa" : "Thêm mới"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {fields.map((field) => (
                            <div key={field.name} className="space-y-2">
                                <label className="text-sm font-medium">{field.label}</label>
                                {field.type === "textarea" ? (
                                    <Textarea {...register(field.name)} placeholder={field.placeholder} />
                                ) : field.type === "json" ? (
                                    <div className="text-xs text-muted-foreground">JSON Editor (Simple text for now)</div>
                                ) : (
                                    <Input
                                        type={field.type || "text"}
                                        {...register(field.name)}
                                        placeholder={field.placeholder}
                                    />
                                )}
                                {/* Temporary JSON support via text input for array strings */}
                                {field.type === 'json' && (
                                    <Textarea
                                        {...register(field.name)}
                                        placeholder='["Item 1", "Item 2"]'
                                    />
                                )}
                            </div>
                        ))}
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Hủy</Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Đang lưu..." : "Lưu"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {fields.slice(0, 3).map(f => ( // Check only first 3 cols to save space
                                <TableHead key={f.name}>{f.label}</TableHead>
                            ))}
                            <TableHead>Order</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                {fields.slice(0, 3).map(f => (
                                    <TableCell key={f.name} className="max-w-[200px] truncate">
                                        {f.type === 'image' || f.name.includes('image') || f.name.includes('url') ? (
                                            item[f.name] ? <img src={item[f.name]} alt="" className="h-8 w-8 object-cover rounded" /> : ''
                                        ) : (
                                            item[f.name] && typeof item[f.name] === 'object'
                                                ? JSON.stringify(item[f.name])
                                                : item[f.name]
                                        )}
                                    </TableCell>
                                ))}
                                <TableCell>{item.display_order}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpen(item)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={fields.length + 2} className="text-center py-8 text-muted-foreground">
                                    Chưa có dữ liệu
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
