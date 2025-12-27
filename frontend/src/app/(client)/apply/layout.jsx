import { getFullUrl, getOgImageUrl } from "@/lib/seo";

export const metadata = {
  title: "Đăng ký Thành viên",
  description:
    "Đăng ký trở thành thành viên của câu lạc bộ Bee IT. Tham gia cộng đồng, học hỏi và phát triển cùng chúng tôi.",
  alternates: {
    canonical: getFullUrl("/apply"),
  },
  openGraph: {
    title: "Đăng ký Thành viên | Bee IT Club",
    description:
      "Đăng ký trở thành thành viên của câu lạc bộ Bee IT. Tham gia cộng đồng, học hỏi và phát triển cùng chúng tôi.",
    url: getFullUrl("/apply"),
    type: "website",
    siteName: "Bee IT Club",
    images: [
      {
        url: getOgImageUrl("/og-image-apply.png"),
        width: 1200,
        height: 630,
        alt: "Đăng ký Thành viên - Bee IT Club",
      },
    ],
  },
  robots: {
    index: false, // Apply page không cần index
    follow: true,
  },
};

export default function ApplyLayout({ children }) {
  return <>{children}</>;
}

