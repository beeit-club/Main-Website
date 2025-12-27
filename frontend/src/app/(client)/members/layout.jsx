import { getFullUrl, getOgImageUrl } from "@/lib/seo";

export const metadata = {
  title: "Danh sách Thành viên",
  description:
    "Khám phá các thành viên đang hoạt động trong câu lạc bộ Bee IT. Kết nối và học hỏi từ cộng đồng.",
  alternates: {
    canonical: getFullUrl("/members"),
  },
  openGraph: {
    title: "Danh sách Thành viên | Bee IT Club",
    description:
      "Khám phá các thành viên đang hoạt động trong câu lạc bộ Bee IT. Kết nối và học hỏi từ cộng đồng.",
    url: getFullUrl("/members"),
    type: "website",
    siteName: "Bee IT Club",
    images: [
      {
        url: getOgImageUrl("/og-image-members.png"),
        width: 1200,
        height: 630,
        alt: "Danh sách Thành viên - Bee IT Club",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Danh sách Thành viên | Bee IT Club",
    description: "Khám phá các thành viên đang hoạt động trong câu lạc bộ Bee IT",
    images: [getOgImageUrl("/og-image-members.png")],
  },
  robots: {
    index: false, // Members page thường không index
    follow: true,
  },
};

export default function MembersLayout({ children }) {
  return <>{children}</>;
}

