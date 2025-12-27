"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { applicationSchema } from "@/validation/applicationSchema";
import { applicationService } from "@/services/application";
import { toast } from "sonner";
import { useInView } from "react-intersection-observer";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  BookOpen,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Users,
  Rocket,
} from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Hero Section Component
const HeroSection = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
      ).fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.5"
      );

      // Scroll indicator animation
      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          y: 10,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-[#0b0b0f] to-[#0b0b0f]"
    >
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(255,193,7,0.12),transparent_25%)]" />
      <div className="absolute inset-0 opacity-[0.08]">
        <div
          className="grid-bg absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23FFC107' stroke-opacity='0.35' stroke-width='1'%3E%3Cpath d='M30 1.1547L52.5 14.4234v26.5386L30 54.2304 7.5 40.962V14.4234z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
        >
          <span className="text-[#FFC107]">Tham gia</span>{" "}
          <span className="text-white">BeeIT Club</span>
        </h1>
        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto"
        >
          Trở thành một phần của cộng đồng công nghệ năng động tại FPT
          Polytechnic. Cùng nhau học hỏi, phát triển và tạo nên những điều tuyệt
          vời.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#application-form">
            <Button
              size="lg"
              className="bg-[#FFC107] text-black hover:bg-[#FFC107]/90 text-lg px-8 py-6"
            >
              Đăng ký ngay <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
          <Link href="/beeit">
            <Button
              size="lg"
              variant="outline"
              className="border-white/50 bg-white/5 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/70 text-lg px-8 py-6 font-semibold"
            >
              Tìm hiểu thêm
            </Button>
          </Link>
        </div>
      </div>

      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="w-8 h-8 text-white/50" />
      </div>
    </section>
  );
};

// Process Timeline Section
const ProcessSection = () => {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  const sectionRef = useRef(null);
  const stepsRef = useRef([]);

  const steps = [
    {
      number: "01",
      title: "Điền form đăng ký",
      description: "Điền đầy đủ thông tin cá nhân và học tập của bạn",
      icon: User,
    },
    {
      number: "02",
      title: "Xem xét đơn",
      description: "Ban chủ nhiệm sẽ xem xét đơn đăng ký của bạn",
      icon: CheckCircle2,
    },
    {
      number: "03",
      title: "Phỏng vấn",
      description: "Tham gia buổi phỏng vấn với ban chủ nhiệm",
      icon: Users,
    },
    {
      number: "04",
      title: "Chào mừng",
      description: "Nhận email chúc mừng và trở thành thành viên chính thức",
      icon: Rocket,
    },
  ];

  useEffect(() => {
    if (!inView) return;

    const ctx = gsap.context(() => {
      stepsRef.current.forEach((step, index) => {
        if (step) {
          const icon = step.querySelector(".step-icon");
          const content = step.querySelector(".step-content");

          gsap.fromTo(
            step,
            { opacity: 0, x: -50, scale: 0.9 },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 0.8,
              delay: index * 0.2,
              ease: "back.out(1.2)",
            }
          );

          if (icon) {
            gsap.fromTo(
              icon,
              { rotation: -180, scale: 0 },
              {
                rotation: 0,
                scale: 1,
                duration: 0.6,
                delay: index * 0.2 + 0.3,
                ease: "back.out(2)",
              }
            );
          }

          if (content) {
            gsap.fromTo(
              content,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: index * 0.2 + 0.4,
                ease: "power2.out",
              }
            );
          }
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [inView]);

  return (
    <section
      ref={ref}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden"
    >
      <div ref={sectionRef} className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            Quy trình đăng ký
          </h2>
          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto">
            Chỉ với 4 bước đơn giản, bạn đã có thể trở thành thành viên của
            BeeIT Club
          </p>
        </div>

        <div className="relative">
          {/* Timeline line - positioned to go through the center of number badges */}
          <div className="hidden md:block absolute top-[2rem] left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  ref={(el) => (stepsRef.current[index] = el)}
                  className="relative z-10"
                >
                  <div className="flex flex-col items-center mb-6">
                    {/* Step Number Badge - with background to cover the line */}
                    <div className="mb-4 relative z-20">
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-lg font-bold shadow-lg">
                        {step.number}
                      </span>
                    </div>
                    {/* Icon Circle */}
                    <div className="step-icon flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-4 border-primary/30 relative z-10">
                      <Icon className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                  <div className="step-content text-center">
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-foreground/70">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// FAQ Section
const FAQSection = () => {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  const sectionRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);
  const itemsRef = useRef([]);

  const faqs = [
    {
      question: "Ai có thể đăng ký tham gia BeeIT Club?",
      answer:
        "Tất cả sinh viên đang học tại FPT Polytechnic, có đam mê với công nghệ thông tin đều có thể đăng ký tham gia.",
    },
    {
      question: "Quy trình đăng ký mất bao lâu?",
      answer:
        "Sau khi nộp đơn, ban chủ nhiệm sẽ xem xét trong vòng 3-5 ngày làm việc. Nếu đơn được duyệt, bạn sẽ được mời tham gia phỏng vấn.",
    },
    {
      question: "Có phí thành viên không?",
      answer:
        "Không, BeeIT Club hoàn toàn miễn phí. Chúng tôi tạo môi trường học tập và phát triển cho tất cả thành viên.",
    },
    {
      question: "Tôi sẽ được học những gì?",
      answer:
        "Bạn sẽ được tham gia các workshop về lập trình, công nghệ mới, kỹ năng mềm, và các dự án thực tế. Ngoài ra còn có các sự kiện networking và cơ hội thực tập.",
    },
    {
      question: "Có yêu cầu kỹ năng tối thiểu không?",
      answer:
        "Không có yêu cầu kỹ năng tối thiểu. Chúng tôi chào đón tất cả mọi người, từ người mới bắt đầu đến những người đã có kinh nghiệm.",
    },
  ];

  useEffect(() => {
    if (!inView) return;

    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item, index) => {
        if (item) {
          gsap.fromTo(
            item,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: index * 0.1,
              ease: "power2.out",
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [inView]);

  const toggleFAQ = (index) => {
    const item = itemsRef.current[index];
    if (!item) return;

    if (openIndex === index) {
      gsap.to(item.querySelector(".faq-answer"), {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
      setOpenIndex(null);
    } else {
      if (openIndex !== null) {
        const prevItem = itemsRef.current[openIndex];
        if (prevItem) {
          gsap.to(prevItem.querySelector(".faq-answer"), {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut",
          });
        }
      }

      setOpenIndex(index);
      const answer = item.querySelector(".faq-answer");
      gsap.fromTo(
        answer,
        { height: 0, opacity: 0 },
        {
          height: "auto",
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        }
      );
    }
  };

  return (
    <section
      ref={ref}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-foreground/5 relative overflow-hidden"
    >
      <div ref={sectionRef} className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            Câu hỏi thường gặp
          </h2>
          <p className="text-lg md:text-xl text-foreground/70">
            Những câu hỏi phổ biến về việc tham gia BeeIT Club
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              ref={(el) => (itemsRef.current[index] = el)}
              className="bg-card rounded-xl border border-border shadow-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-foreground/5 transition-colors"
              >
                <h3 className="text-lg font-bold pr-4">{faq.question}</h3>
                <ChevronDown
                  className={`w-6 h-6 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div className="faq-answer overflow-hidden" style={{ height: 0 }}>
                <div className="px-6 pb-6 text-foreground/70">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Application Form Section
const ApplicationFormSection = () => {
  const router = useRouter();
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  const sectionRef = useRef(null);
  const formCardRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: yupResolver(applicationSchema),
    defaultValues: {
      fullname: "",
      email: "",
      phone: "",
      student_id: "",
      student_year: "",
      major: "",
    },
  });

  useEffect(() => {
    if (!inView) return;

    const ctx = gsap.context(() => {
      if (formCardRef.current) {
        gsap.fromTo(
          formCardRef.current,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [inView]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await applicationService.createApplication(data);
      if (res.status === "success") {
        toast.success(
          res.message || "Nộp đơn thành công! Chúng tôi sẽ liên hệ với bạn sớm."
        );
        form.reset();
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        toast.error(res.message || "Nộp đơn thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      const errorMessage =
        error?.message ||
        error?.error ||
        "Có lỗi xảy ra khi nộp đơn. Vui lòng thử lại sau.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="application-form"
      ref={ref}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden"
    >
      <div ref={sectionRef} className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            Đăng ký ngay
          </h2>
          <p className="text-lg md:text-xl text-foreground/70">
            Điền thông tin bên dưới để trở thành thành viên của BeeIT Club
          </p>
        </div>

        <Card
          ref={formCardRef}
          className="shadow-2xl border-2 border-primary/20"
        >
          <CardHeader>
            <CardTitle className="text-2xl">Thông tin đăng ký</CardTitle>
            <CardDescription>
              Vui lòng điền đầy đủ và chính xác các thông tin bên dưới
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <User className="inline h-4 w-4 mr-2" />
                        Họ và tên <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập họ và tên đầy đủ (tối thiểu 5 ký tự)"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Nhập họ và tên đầy đủ của bạn (tối thiểu 5 ký tự)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Mail className="inline h-4 w-4 mr-2" />
                        Email <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@email.com"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Email của bạn sẽ được dùng để liên hệ và tạo tài khoản
                        sau khi được duyệt
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Phone className="inline h-4 w-4 mr-2" />
                        Số điện thoại{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="0912345678"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Số điện thoại hợp lệ (VD: 0912345678, 0987654321)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="student_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <GraduationCap className="inline h-4 w-4 mr-2" />
                        Mã số sinh viên{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập mã số sinh viên"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Mã số sinh viên của bạn (tối đa 20 ký tự)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="student_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Calendar className="inline h-4 w-4 mr-2" />
                          Năm học <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="VD: 2024-2025, K20, 2024"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormDescription>
                          Năm học hoặc khóa học của bạn (VD: 2024-2025, K20)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="major"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <BookOpen className="inline h-4 w-4 mr-2" />
                          Chuyên ngành{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="VD: Công nghệ thông tin, Kỹ thuật phần mềm"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormDescription>
                          Chuyên ngành bạn đang học (tối đa 100 ký tự)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      "Gửi đơn đăng ký"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Additional info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Lưu ý</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              • Sau khi nộp đơn, chúng tôi sẽ xem xét và liên hệ với bạn trong
              thời gian sớm nhất.
            </p>
            <p>• Email và Mã số sinh viên phải là duy nhất trong hệ thống.</p>
            <p>
              • Nếu đơn đăng ký được duyệt, bạn sẽ nhận được email thông báo và
              được tạo tài khoản tự động.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

// Main Page Component
export default function ApplyPage() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      <HeroSection />
      <ProcessSection />
      <FAQSection />
      <ApplicationFormSection />
    </main>
  );
}
