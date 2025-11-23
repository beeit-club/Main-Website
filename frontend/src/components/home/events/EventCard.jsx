"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Image from "next/image";

export function EventCard({ event }) {
  const {
    id,
    title,
    slug,
    featured_image,
    start_time,
    end_time,
    location,
    max_participants,
    status,
    is_public,
  } = event;

  const startDate = new Date(start_time);
  const endDate = new Date(end_time);
  const now = new Date();
  const isUpcoming = startDate > now;
  const isPast = endDate < now;
  const isOngoing = startDate <= now && endDate >= now;

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
    <Link href={`/events/${slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
        {/* Featured Image */}
        {featured_image && (
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={featured_image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <CardContent className="p-6">
          {/* Title & Status */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold line-clamp-2 flex-1">{title}</h3>
            <div className="ml-2">{getStatusBadge()}</div>
          </div>

          {/* Event Details */}
          <div className="space-y-2 text-sm text-muted-foreground">
            {/* Date & Time */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <div>
                <div>
                  Bắt đầu: {format(startDate, "dd/MM/yyyy HH:mm", { locale: vi })}
                </div>
                {endDate && (
                  <div className="text-xs">
                    Kết thúc: {format(endDate, "dd/MM/yyyy HH:mm", { locale: vi })}
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            {location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="line-clamp-1">{location}</span>
              </div>
            )}

            {/* Max Participants */}
            {max_participants && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span>Tối đa {max_participants} người</span>
              </div>
            )}

            {/* Public/Private */}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>{is_public ? "Công khai" : "Nội bộ"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

