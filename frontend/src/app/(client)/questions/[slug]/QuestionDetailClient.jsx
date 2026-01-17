"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Send, X } from "lucide-react";
import Link from "next/link";
import { ClientTimeAgo } from "@/components/common/ClientTimeAgo";
import DOMPurify from "isomorphic-dompurify";
import TinyEditor from "@/components/TinyEditor/TinyEditor";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { getQuestionAnswers, getQuestionStats } from "@/services/home";
import AnswerItem from "./_components/AnswerItem";
import axiosClient from "@/services/api";

export default function QuestionDetailClient({ initialQuestion }) {
    const router = useRouter();
    const { user } = useAuthStore();

    // Use initialQuestion for initial state to avoid hydration mismatch if possible,
    // but since we want to support updates (like new answers), we keep it in state.
    const [question, setQuestion] = useState(initialQuestion);
    const [loading, setLoading] = useState(false); // No loading initially as we have data
    const [submitting, setSubmitting] = useState(false);
    const [replyTo, setReplyTo] = useState(null); // Parent answer object

    const editorRef = useRef(null);
    // Ref để cuộn xuống form khi bấm Reply
    const formRef = useRef(null);

    // We can re-fetch question to update answers and stats if needed
    const fetchAnswersAndStats = async () => {
        try {
            // Fetch answers
            const ansRes = await getQuestionAnswers(initialQuestion.slug);
            if (ansRes.data?.answers) {
                setQuestion(prev => ({ ...prev, answers: ansRes.data.answers }));
            }

            // Fetch stats (view count)
            const statsRes = await getQuestionStats(initialQuestion.slug);
            if (statsRes.data?.stats) {
                setQuestion(prev => ({ ...prev, view_count: statsRes.data.stats.view_count }));
            }
        } catch (error) {
            console.error("Failed to refresh data:", error);
        }
    };

    useEffect(() => {
        fetchAnswersAndStats();
    }, [initialQuestion.slug]);

    const handleReply = (answer) => {
        setReplyTo(answer);
        // Cuộn xuống form
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            // Optional: Focus editor
        }, 100);
    };

    const handleCancelReply = () => {
        setReplyTo(null);
    };

    const handleSubmitAnswer = async () => {
        if (!user) {
            toast.error("Vui lòng đăng nhập để trả lời");
            router.push("/login");
            return;
        }

        const replyContent = editorRef.current ? editorRef.current.getContent() : "";

        if (!replyContent || replyContent.length < 10) {
            toast.error("Nội dung câu trả lời quá ngắn (tối thiểu 10 ký tự)");
            return;
        }

        try {
            setSubmitting(true);
            await axiosClient.post("/client/answers", {
                content: replyContent,
                question_id: question.id,
                parent_id: replyTo ? replyTo.id : null, // Gửi parent_id nếu đang reply
            });

            toast.success("Đã gửi câu trả lời");
            if (editorRef.current) {
                editorRef.current.setContent(""); // Clear content
            }
            setReplyTo(null); // Reset reply state
            fetchAnswersAndStats(); // Reload answers
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi gửi câu trả lời");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!question) return null;

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <Button variant="ghost" className="mb-4 pl-0" asChild>
                <Link href="/questions">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
                </Link>
            </Button>

            {/* Question Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-3 text-primary">{question.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border">
                            <AvatarImage src={question.author_avatar} />
                            <AvatarFallback>{question.author_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">
                            {question.author_name || "Ẩn danh"}
                        </span>
                    </div>
                    <span>•</span>
                    <ClientTimeAgo date={question.created_at} />
                    <span>•</span>
                    <span>{question.view_count || 0} lượt xem</span>
                </div>
            </div>

            <Separator className="my-6" />

            {/* Question Content */}
            <div
                className="prose dark:prose-invert max-w-none mb-10"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.content) }}
            />

            <Separator className="my-8" />

            {/* Answers Section */}
            <div className="space-y-8">
                <h3 className="text-xl font-semibold">
                    {question.answers?.length || 0} Câu trả lời
                </h3>

                {question.answers?.length > 0 ? (
                    <div className="space-y-6">
                        {question.answers.map((ans) => (
                            <AnswerItem
                                key={ans.id}
                                answer={ans}
                                onReply={handleReply}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">
                        Chưa có câu trả lời nào. Hãy là người đầu tiên!
                    </div>
                )}

                {/* Answer Form */}
                <div className="mt-10" ref={formRef}>
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold">
                            {replyTo ? `Đang trả lời ${replyTo.author_name}` : "Viết câu trả lời của bạn"}
                        </h4>
                        {replyTo && (
                            <Button variant="ghost" size="sm" onClick={handleCancelReply} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                <X className="mr-1 h-4 w-4" /> Hủy trả lời
                            </Button>
                        )}
                    </div>

                    {!user ? (
                        <div className="bg-muted p-6 rounded-lg text-center border border-dashed">
                            <p className="mb-3 text-muted-foreground">Bạn cần đăng nhập để tham gia thảo luận.</p>
                            <Button asChild>
                                <Link href={`/login?redirect=/questions/${question.slug}`}>Đăng nhập ngay</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Hiển thị context khi đang reply */}
                            {replyTo && (
                                <div className="bg-muted/50 p-3 rounded-l border-l-4 border-primary text-sm text-muted-foreground mb-2">
                                    <div className="font-semibold mb-1">Reply to:</div>
                                    <div
                                        className="line-clamp-2 italic"
                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(replyTo.content) }}
                                    />
                                </div>
                            )}

                            <div className="min-h-[250px] border rounded-md bg-background">
                                <TinyEditor
                                    editorRef={editorRef}
                                    initialValue=""
                                    heightMin={250}
                                    hideMenubar={true}
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={handleSubmitAnswer} disabled={submitting}>
                                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    <Send className="mr-2 h-4 w-4" />
                                    {replyTo ? "Gửi phản hồi" : "Gửi câu trả lời"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
