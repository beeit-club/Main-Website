import { notFound } from "next/navigation";
import { fetchEventDetail } from "@/services/event";
import { EventDetail } from "@/components/home/events/EventDetail";
import { getFullUrl, getOgImageUrl, cleanHtmlForMeta } from "@/lib/seo";

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
    const url = getFullUrl(`/events/${slug}`);
    const description = cleanHtmlForMeta(event.content || event.description || "");
    const ogImage = event.featured_image
      ? getOgImageUrl(event.featured_image, "/logo.jpg")
      : getOgImageUrl("/logo.jpg");

    return {
      title: event.title,
      description: description || "Sự kiện từ Bee IT Club",
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: event.title,
        description: description || "Sự kiện từ Bee IT Club",
        url,
        type: "website",
        siteName: "Bee IT Club",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: event.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: event.title,
        description: description || "Sự kiện từ Bee IT Club",
        images: [ogImage],
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

  // JSON-LD for Event
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": cleanHtmlForMeta(event.content || event.description || ""),
    "startDate": event.start_date || event.created_at,
    "endDate": event.end_date, // Optional
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": event.location || "Bee IT Club",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Hanoi",
        "addressCountry": "VN"
      }
    },
    "image": [
      event.featured_image ? getOgImageUrl(event.featured_image, "/logo.jpg") : getOgImageUrl("/logo.jpg")
    ],
    "organizer": {
      "@type": "Organization",
      "name": "Bee IT Club",
      "url": getFullUrl("/")
    }
  };

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto">
        <EventDetail event={event} />
      </div>
    </main>
  );
}

