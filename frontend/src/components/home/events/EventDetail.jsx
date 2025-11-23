"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, Clock, Globe, Lock } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { EventRegistrationForm } from "./EventRegistrationForm";
import { useAuthStore } from "@/stores/authStore";
import { useState, useEffect } from "react";
import { eventService } from "@/services/eventClient";
import { toast } from "sonner";

export function EventDetail({ event }) {
  const { user, isLogin } = useAuthStore();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkRegistration = async () => {
      if (!isLogin || !user) {
        setIsChecking(false);
        return;
      }

      try {
        const response = await eventService.checkRegistration(event.id);
        if (response.status === "success" && response.data?.registration) {
          setIsRegistered(true);
        }
      } catch (error) {
        // User chưa đăng ký hoặc lỗi
        setIsRegistered(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkRegistration();
  }, [event.id, isLogin, user]);

  if (!event) return null;

  const {
    id,
    title,
    content,
    featured_image,
    start_time,
    end_time,
    location,
    max_participants,
    registration_deadline,
    status,
    is_public,
  } = event;

  const startDate = new Date(start_time);
  const endDate = new Date(end_time);
  const deadlineDate = registration_deadline ? new Date(registration_deadline) : null;
  const now = new Date();
  const isUpcoming = startDate > now;
  const isPast = endDate < now;
  const isOngoing = startDate <= now && endDate >= now;
  const canRegister = isUpcoming && status === 1 && (!deadlineDate || deadlineDate > now);

  // Status badge
  const getStatusBadge = () => {
    if (status === 0) return <Badge variant="secondary">Bản nháp</Badge>;
    if (status === 2) return <Badge variant="destructive">Đã hủy</Badge>;
    if (status === 3) return <Badge variant="outline">Đã kết thúc</Badge>;
    if (isPast) return <Badge variant="outline">Đã kết thúc</Badge>;
    if (isOngoing) return <Badge className="bg-green-600">Đang diễn ra</Badge>;
    if (isUpcoming) return <Badge className="bg-blue-600">Sắp diễn ra</Badge>;
    return <Badge variant="secondary">Đã lên lịch</Badge>;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Featured Image */}
      {featured_image && (
        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={featured_image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Title & Status */}
      <div className="flex items-start justify-between mb-6">
        <h1 className="text-4xl font-bold flex-1">{title}</h1>
        <div className="ml-4">{getStatusBadge()}</div>
      </div>

      {/* Event Info Cards */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        {/* Date & Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Thời gian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Bắt đầu</p>
              <p className="font-semibold">
                {format(startDate, "dd MMMM yyyy 'lúc' HH:mm", { locale: vi })}
              </p>
            </div>
            {endDate && (
              <div>
                <p className="text-sm text-muted-foreground">Kết thúc</p>
                <p className="font-semibold">
                  {format(endDate, "dd MMMM yyyy 'lúc' HH:mm", { locale: vi })}
                </p>
              </div>
            )}
            {deadlineDate && (
              <div>
                <p className="text-sm text-muted-foreground">Hạn đăng ký</p>
                <p className="font-semibold text-orange-600">
                  {format(deadlineDate, "dd MMMM yyyy 'lúc' HH:mm", { locale: vi })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location & Participants */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Thông tin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {location && (
              <div>
                <p className="text-sm text-muted-foreground">Địa điểm</p>
                <p className="font-semibold">{location}</p>
              </div>
            )}
            {max_participants && (
              <div>
                <p className="text-sm text-muted-foreground">Số lượng tham gia</p>
                <p className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Tối đa {max_participants} người
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Loại sự kiện</p>
              <p className="font-semibold flex items-center gap-2">
                {is_public ? (
                  <>
                    <Globe className="h-4 w-4" />
                    Công khai
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Nội bộ
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Mô tả sự kiện</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </CardContent>
      </Card>

      {/* Registration Form */}
      {canRegister && (
        <Card>
          <CardHeader>
            <CardTitle>Đăng ký tham gia</CardTitle>
          </CardHeader>
          <CardContent>
            {isChecking ? (
              <p className="text-muted-foreground">Đang kiểm tra...</p>
            ) : isRegistered ? (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-green-800 dark:text-green-200 font-semibold">
                  ✓ Bạn đã đăng ký tham gia sự kiện này!
                </p>
              </div>
            ) : (
              <EventRegistrationForm
                event={event}
                onSuccess={() => {
                  setIsRegistered(true);
                  toast.success("Đăng ký tham gia sự kiện thành công!");
                }}
              />
            )}
          </CardContent>
        </Card>
      )}

      {!canRegister && status === 1 && (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">
              {isPast
                ? "Sự kiện này đã kết thúc."
                : deadlineDate && deadlineDate <= now
                ? "Đã hết hạn đăng ký."
                : "Sự kiện này không cho phép đăng ký."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

