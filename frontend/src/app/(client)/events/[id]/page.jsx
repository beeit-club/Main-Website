import { notFound } from "next/navigation";
import { fetchEventDetail } from "@/services/event";
import { EventDetail } from "@/components/home/events/EventDetail";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { id: slug } = await params;
  try {
    const eventResponse = await fetchEventDetail(slug);

    if (!eventResponse || !eventResponse.data) {
      return {
        title: "Không tìm thấy sự kiện",
      };
    }

    const event = eventResponse.data.event;
    const url = `https://yourdomain.com/events/${slug}`;
    return {
      title: event.title,
      description: event.content?.replace(/<[^>]*>/g, "").substring(0, 160) || "",
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: event.title,
        description: event.content?.replace(/<[^>]*>/g, "").substring(0, 160) || "",
        url,
        type: "website",
        images: event.featured_image ? [event.featured_image] : [],
        siteName: "Bee IT Club",
      },
    };
  } catch (error) {
    console.error("Failed to generate metadata:", error);
    return {
      title: "Lỗi",
      description: "Đã xảy ra lỗi khi tải thông tin sự kiện.",
    };
  }
}

export default async function EventDetailPage({ params }) {
  const { id: slug } = await params;
  let eventResponse;

  try {
    eventResponse = await fetchEventDetail(slug);
  } catch (error) {
    console.error(error);
    throw new Error("Không thể tải sự kiện. Vui lòng thử lại sau.");
  }

  if (!eventResponse || !eventResponse.data || !eventResponse.data.event) {
    notFound();
  }

  const event = eventResponse.data.event;

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <EventDetail event={event} />
      </div>
    </main>
  );
}

