import { Suspense } from "react";
import { fetchAllEvents } from "@/services/event";
import { EventCard } from "@/components/home/events/EventCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostPagination } from "@/components/home/post/components/post-pagination";

// Revalidate every hour
export const revalidate = 3600;

export const metadata = {
  title: "Danh sách Sự kiện | Bee IT Club",
  description: "Khám phá các sự kiện, workshop và hoạt động từ câu lạc bộ Bee IT",
  openGraph: {
    title: "Danh sách Sự kiện | Bee IT Club",
    description: "Khám phá các sự kiện, workshop và hoạt động từ câu lạc bộ",
    type: "website",
  },
};

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

async function getData(searchParams) {
  try {
    const params = {
      page: searchParams.page || 1,
      limit: searchParams.limit || 12,
      status: 1, // Chỉ lấy published events
      ...(searchParams.upcoming === "true" && { upcoming: true }),
      ...(searchParams.past === "true" && { past: true }),
    };

    const eventsResponse = await fetchAllEvents(params);

    // Backend trả về: { status: 'success', data: { data: [], pagination: {} } }
    return {
      events: eventsResponse.data?.data || [],
      pagination: eventsResponse.data?.pagination || {},
    };
  } catch (error) {
    console.error("Failed to fetch events data:", error);
    return {
      events: [],
      pagination: {},
    };
  }
}

export default async function EventsPage({ searchParams }) {
  const { events, pagination } = await getData(searchParams);

  // Filter events by status
  const upcomingEvents = events.filter((event) => {
    const startDate = new Date(event.start_time);
    return startDate > new Date() && event.status === 1;
  });

  const pastEvents = events.filter((event) => {
    const endDate = new Date(event.end_time);
    return endDate < new Date() || event.status === 3;
  });

  const ongoingEvents = events.filter((event) => {
    const startDate = new Date(event.start_time);
    const endDate = new Date(event.end_time);
    const now = new Date();
    return startDate <= now && endDate >= now && event.status === 1;
  });

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Danh sách Sự kiện
          </h1>
          <p className="text-muted-foreground">
            Khám phá các sự kiện, workshop và hoạt động từ câu lạc bộ
          </p>
        </div>

        {/* Main Content */}
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
      </div>
    </main>
  );
}

