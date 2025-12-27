import { fetchAllEvents } from "@/services/event";
import { EventsTabs } from "@/components/home/events/EventsTabs";
import { getFullUrl, getOgImageUrl } from "@/lib/seo";

// Revalidate every hour
export const revalidate = 3600;

export const metadata = {
  title: "Danh sách Sự kiện",
  description: "Khám phá các sự kiện, workshop và hoạt động từ câu lạc bộ Bee IT",
  alternates: {
    canonical: getFullUrl("/events"),
  },
  openGraph: {
    title: "Danh sách Sự kiện | Bee IT Club",
    description: "Khám phá các sự kiện, workshop và hoạt động từ câu lạc bộ Bee IT",
    url: getFullUrl("/events"),
    type: "website",
    siteName: "Bee IT Club",
    images: [
      {
        url: getOgImageUrl("/og-image-events.png"),
        width: 1200,
        height: 630,
        alt: "Danh sách Sự kiện - Bee IT Club",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Danh sách Sự kiện | Bee IT Club",
    description: "Khám phá các sự kiện, workshop và hoạt động từ câu lạc bộ",
    images: [getOgImageUrl("/og-image-events.png")],
  },
};


async function getData(searchParams) {
  try {
    // Xử lý searchParams an toàn - có thể là undefined hoặc object
    // searchParams đã được resolve ở component chính
    const safeSearchParams = searchParams || {};
    
    // Parse page và limit, đảm bảo là number với optional chaining
    const pageValue = safeSearchParams?.page;
    const page = pageValue 
      ? parseInt(Array.isArray(pageValue) ? pageValue[0] : pageValue, 10) || 1
      : 1;
    
    const limitValue = safeSearchParams?.limit;
    const limit = limitValue
      ? parseInt(Array.isArray(limitValue) ? limitValue[0] : limitValue, 10) || 12
      : 12;

    const upcomingValue = safeSearchParams?.upcoming
      ? (Array.isArray(safeSearchParams.upcoming) 
          ? safeSearchParams.upcoming[0] 
          : safeSearchParams.upcoming)
      : undefined;
    
    const pastValue = safeSearchParams?.past
      ? (Array.isArray(safeSearchParams.past) 
          ? safeSearchParams.past[0] 
          : safeSearchParams.past)
      : undefined;

    const params = {
      page,
      limit,
      status: 1, // Chỉ lấy published events
      ...(upcomingValue === "true" && { upcoming: true }),
      ...(pastValue === "true" && { past: true }),
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
  // Xử lý searchParams có thể là Promise trong Next.js 16
  const resolvedSearchParams = searchParams instanceof Promise 
    ? await searchParams 
    : searchParams;
  
  const { events, pagination } = await getData(resolvedSearchParams);

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
        <EventsTabs
          events={events}
          upcomingEvents={upcomingEvents}
          ongoingEvents={ongoingEvents}
          pastEvents={pastEvents}
          pagination={pagination}
        />
      </div>
    </main>
  );
}

