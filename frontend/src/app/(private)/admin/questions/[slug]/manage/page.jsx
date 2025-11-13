// src/app/admin/questions/[slug]/manage/page.jsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import DOMPurify from "isomorphic-dompurify";

// Services and Schemas
import { questionServices } from "@/services/admin/questionServices";
import { answerServices } from "@/services/admin/answerServices";

// Components
import TinyEditor from "@/components/TinyEditor/TinyEditor"; // Import TinyEditor
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Check, Edit, Trash, XCircle, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/datetime";

// ==================================================================
// == GIẢ ĐỊNH: Bạn cần lấy ID của Admin đang đăng nhập.
// == Thay thế `1` bằng logic lấy ID admin (ví dụ: từ context, session)
// ==================================================================
const ADMIN_ID = 1;
// ==================================================================

export default function ManageQuestionPage() {
  const params = useParams();
  const slug = params.slug;

  const [question, setQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- State cho các form (Thay thế react-hook-form) ---
  const [isCreateSubmitting, setIsCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);

  // Dialog States
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);

  // --- Refs cho TinyMCE ---
  const createEditorRef = useRef(null);
  const editEditorRef = useRef(null);

  // --- Lấy dữ liệu câu hỏi và câu trả lời ---
  async function getQuestionDetails() {
    if (!slug) return;
    try {
      setIsLoading(true);
      const res = await questionServices.getOneQuestion(slug);
      // Cập nhật dựa trên cấu trúc JSON bạn gửi
      setQuestion(res?.data.data.question);
    } catch (error) {
      toast.error("Lấy chi tiết câu hỏi thất bại");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getQuestionDetails();
  }, [slug]);

  // --- Form 1: Tạo câu trả lời mới (Đã bỏ useForm) ---
  async function onSubmitCreate(e) {
    e.preventDefault(); // Ngăn form submit
    setCreateError(null); // Xóa lỗi cũ
    setIsCreateSubmitting(true);

    const content = createEditorRef.current?.getContent();
    if (!content || content.trim() === "") {
      setCreateError("Nội dung trả lời là bắt buộc.");
      setIsCreateSubmitting(false);
      return;
    }

    try {
      await answerServices.createAnswer({
        content,
        question_id: question.id,
      });
      toast.success("Gửi câu trả lời thành công");
      createEditorRef.current?.setContent(""); // Xóa nội dung editor
      getQuestionDetails(); // Tải lại dữ liệu
    } catch (error) {
      toast.error("Gửi câu trả lời thất bại");
    } finally {
      setIsCreateSubmitting(false);
    }
  }

  // --- Form 2: Sửa câu trả lời (Đã bỏ useForm) ---
  function handleOpenEditDialog(answer) {
    setCurrentAnswer(answer);
    setEditError(null); // Xóa lỗi cũ khi mở dialog
    setOpenEditDialog(true);
    // initialValue của TinyEditor trong dialog sẽ tự động lấy từ currentAnswer
  }

  async function onSubmitEdit(e) {
    e.preventDefault(); // Ngăn form submit
    setEditError(null);
    setIsEditSubmitting(true);

    const content = editEditorRef.current?.getContent();
    if (!content || content.trim() === "") {
      setEditError("Nội dung trả lời là bắt buộc.");
      setIsEditSubmitting(false);
      return;
    }

    try {
      await answerServices.updateAnswer(currentAnswer.id, { content });
      toast.success("Cập nhật câu trả lời thành công");
      setOpenEditDialog(false);
      getQuestionDetails(); // Tải lại
    } catch (error) {
      toast.error("Cập nhật thất bại");
    } finally {
      setIsEditSubmitting(false);
    }
  }

  // --- Logic Kiểm duyệt (Moderation) ---
  function handleOpenDeleteDialog(answer) {
    setCurrentAnswer(answer);
    setOpenDeleteDialog(true);
  }

  async function onConfirmDelete() {
    setIsDeleteSubmitting(true);
    try {
      await answerServices.deleteAnswer(currentAnswer.id);
      toast.success("Xóa câu trả lời thành công");
      setOpenDeleteDialog(false);
      getQuestionDetails(); // Tải lại
    } catch (error) {
      toast.error("Xóa thất bại");
    } finally {
      setIsDeleteSubmitting(false);
    }
  }

  async function handleModerateAnswer(answerId, data) {
    try {
      await answerServices.updateAnswer(answerId, data);
      toast.success("Cập nhật trạng thái thành công");
      getQuestionDetails(); // Tải lại
    } catch (error) {
      toast.error("Cập nhật thất bại");
    }
  }

  // --- Render ---
  if (isLoading) return <p>Đang tải...</p>;
  if (!question) return <p>Không tìm thấy câu hỏi.</p>;

  // Lọc ra câu trả lời gốc (parent_id = null)
  const rootAnswers =
    question.answers?.filter((ans) => ans.parent_id === null) || [];

  // (Optional) Tạo một map để tìm bình luận con
  const repliesMap = new Map();
  question.answers?.forEach((ans) => {
    if (ans.parent_id !== null) {
      const replies = repliesMap.get(ans.parent_id) || [];
      replies.push(ans);
      repliesMap.set(ans.parent_id, replies);
    }
  });

  return (
    <div className="space-y-6">
      {/* ========================================= */}
      {/* PHẦN 1: CHI TIẾT CÂU HỎI (READ-ONLY)       */}
      {/* ========================================= */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{question.title}</CardTitle>
          <CardDescription className="flex gap-4 pt-2">
            {/* Sửa lại để hiển thị ID người dùng, vì BE không trả về `author` */}
            <span>
              Người đăng:{" "}
              {question.created_by ? `ID ${question.created_by}` : "Ẩn danh"}
            </span>
            <span>Ngày đăng: {formatDate(question.created_at)}</span>
            <Badge variant={question.status === 1 ? "default" : "secondary"}>
              {question.status === 1 ? "Đã đăng" : "Đã ẩn"}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(question.content || ""),
            }}
          />
        </CardContent>
      </Card>

      {/* ========================================= */}
      {/* PHẦN 2: FORM TRẢ LỜI CỦA ADMIN            */}
      {/* ========================================= */}
      <Card>
        <CardHeader>
          <CardTitle>Gửi câu trả lời của bạn</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Bỏ <Form> và <FormField> */}
          <form onSubmit={onSubmitCreate}>
            <TinyEditor editorRef={createEditorRef} initialValue="" />
            {/* Hiển thị lỗi thủ công */}
            {createError && (
              <p className="text-sm text-red-600 mt-2">{createError}</p>
            )}
            <Button
              type="submit"
              className="mt-4"
              disabled={isCreateSubmitting}
            >
              {isCreateSubmitting ? "Đang gửi..." : "Gửi trả lời"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ========================================= */}
      {/* PHẦN 3: DANH SÁCH CÂU TRẢ LỜI              */}
      {/* ========================================= */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          {rootAnswers.length || 0} Câu trả lời
        </h2>
        {rootAnswers.length > 0 ? (
          rootAnswers.map((answer) => {
            const isAuthor = answer.created_by === ADMIN_ID;
            const replies = repliesMap.get(answer.id) || [];

            return (
              <Card
                key={answer.id}
                className={answer.is_accepted ? "border-green-500" : ""}
              >
                <CardHeader className="flex flex-row justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {/* Sửa lại để hiển thị ID người dùng */}
                      {answer.created_by
                        ? `ID: ${answer.created_by}`
                        : "Ẩn danh"}
                      {isAuthor && (
                        <Badge variant="outline" className="ml-2">
                          Bạn (Admin)
                        </Badge>
                      )}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      • {formatDate(answer.created_at)}
                    </span>
                  </div>
                  {/* Chuyển is_accepted từ 1/0 sang boolean */}
                  {!!answer.is_accepted && (
                    <Badge variant="default" className="bg-green-600">
                      <Check className="mr-1 h-4 w-4" /> Đã chấp nhận
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(answer.content || ""),
                    }}
                  />
                  {answer.status === 0 && (
                    <p className="text-sm text-red-500 italic mt-2">
                      (Câu trả lời này đang bị ẩn)
                    </p>
                  )}

                  {/* Hiển thị bình luận con (replies) */}
                  {replies.length > 0 && (
                    <div className="ml-10 mt-4 pl-4 border-l-2 space-y-3">
                      <h4 className="text-sm font-semibold">
                        {replies.length} bình luận:
                      </h4>
                      {replies.map((reply) => (
                        <div key={reply.id} className="text-sm">
                          <p
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(reply.content || ""),
                            }}
                          />
                          <span className="text-xs text-muted-foreground">
                            bởi{" "}
                            {reply.created_by
                              ? `ID: ${reply.created_by}`
                              : "Ẩn danh"}{" "}
                            • {formatDate(reply.created_at)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  {/* (Các nút giữ nguyên logic) */}
                  {isAuthor && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditDialog(answer)}
                    >
                      <Edit className="mr-1 h-4 w-4" /> Sửa
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleOpenDeleteDialog(answer)}
                  >
                    <Trash className="mr-1 h-4 w-4" /> Xóa
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleModerateAnswer(answer.id, {
                        status: answer.status === 1 ? 0 : 1,
                      })
                    }
                  >
                    {answer.status === 1 ? (
                      <XCircle className="mr-1 h-4 w-4" />
                    ) : (
                      <CheckCircle className="mr-1 h-4 w-4" />
                    )}
                    {answer.status === 1 ? "Ẩn" : "Hiện"}
                  </Button>
                  {/* Chuyển is_accepted từ 1/0 sang boolean */}
                  {!answer.is_accepted && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleModerateAnswer(answer.id, {
                          is_accepted: true,
                        })
                      }
                    >
                      <Check className="mr-1 h-4 w-4" /> Đánh dấu đúng
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <p>Chưa có câu trả lời nào.</p>
        )}
      </div>

      {/* ========================================= */}
      {/* CÁC DIALOG QUẢN LÝ                       */}
      {/* ========================================= */}

      {/* --- Dialog Sửa Câu trả lời --- */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Sửa câu trả lời của bạn</DialogTitle>
          </DialogHeader>
          {/* Bỏ <Form> và <FormField> */}
          <form onSubmit={onSubmitEdit}>
            <TinyEditor
              editorRef={editEditorRef}
              initialValue={currentAnswer?.content || ""}
            />
            {/* Hiển thị lỗi thủ công */}
            {editError && (
              <p className="text-sm text-red-600 mt-2">{editError}</p>
            )}
            <DialogFooter className="mt-4">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setOpenEditDialog(false)}
                disabled={isEditSubmitting}
              >
                Huỷ
              </Button>
              <Button type="submit" disabled={isEditSubmitting}>
                {isEditSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- Dialog Xóa Câu trả lời --- */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận Xóa câu trả lời</DialogTitle>
          </DialogHeader>
          <div className="py-4">Bạn có chắc muốn xóa câu trả lời này?</div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setOpenDeleteDialog(false)}
              disabled={isDeleteSubmitting}
            >
              Huỷ
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirmDelete}
              disabled={isDeleteSubmitting}
            >
              {isDeleteSubmitting ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
