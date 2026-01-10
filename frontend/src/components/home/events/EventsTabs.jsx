"use client";

import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EventCard } from "@/components/home/events/EventCard";
import { PostPagination } from "@/components/home/post/components/post-pagination";

// Loading skeleton component
function EventsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-video w-full" />
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function EventsTabs({ 
  events, 
  upcomingEvents, 
  ongoingEvents, 
  pastEvents, 
  pagination 
}) {
  return (
    <Tabs defaultValue="all" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all">Tất cả</TabsTrigger>
        <TabsTrigger value="upcoming">Sắp diễn ra</TabsTrigger>
        <TabsTrigger value="ongoing">Đang diễn ra</TabsTrigger>
        <TabsTrigger value="past">Đã kết thúc</TabsTrigger>
      </TabsList>

      {/* All Events */}
      <TabsContent value="all" className="mt-0">
        <Suspense fallback={<EventsSkeleton />}>
          {events.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              {pagination.totalPages > 1 && (
                <PostPagination pagination={pagination} baseUrl="/events" />
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Chưa có sự kiện nào trong hệ thống.
                </p>
              </CardContent>
            </Card>
          )}
        </Suspense>
      </TabsContent>

      {/* Upcoming Events */}
      <TabsContent value="upcoming" className="mt-0">
        <Suspense fallback={<EventsSkeleton />}>
          {upcomingEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Chưa có sự kiện sắp diễn ra.
                </p>
              </CardContent>
            </Card>
          )}
        </Suspense>
      </TabsContent>

      {/* Ongoing Events */}
      <TabsContent value="ongoing" className="mt-0">
        <Suspense fallback={<EventsSkeleton />}>
          {ongoingEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ongoingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Hiện tại không có sự kiện nào đang diễn ra.
                </p>
              </CardContent>
            </Card>
          )}
        </Suspense>
      </TabsContent>

      {/* Past Events */}
      <TabsContent value="past" className="mt-0">
        <Suspense fallback={<EventsSkeleton />}>
          {pastEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Chưa có sự kiện nào đã kết thúc.
                </p>
              </CardContent>
            </Card>
          )}
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}

