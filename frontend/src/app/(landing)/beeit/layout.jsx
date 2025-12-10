import { getFullUrl, getOgImageUrl } from "@/lib/seo";

export const metadata = {
  title: "Giới thiệu BeeIT Club - Câu lạc bộ Công nghệ Thông tin",
  description:
    "BeeIT Club - Cộng đồng năng động nơi các bạn có thể giao lưu, học hỏi và chia sẻ kiến thức trong lĩnh vực CNTT. Thành lập 01/07/2023 tại FPT Polytechnic.",
  alternates: {
    canonical: getFullUrl("/beeit"),
  },
  openGraph: {
    title: "BeeIT Club - Câu lạc bộ Công nghệ Thông tin",
    description:
      "BeeIT Club - Cộng đồng năng động nơi các bạn có thể giao lưu, học hỏi và chia sẻ kiến thức trong lĩnh vực CNTT.",
    url: getFullUrl("/beeit"),
    type: "website",
    siteName: "BeeIT Club",
    images: [
      {
        url: getOgImageUrl("/og-image-beeit.png"),
        width: 1200,
        height: 630,
        alt: "BeeIT Club - Giới thiệu",
      },
    ],
  },
};

export default function BeeITLayout({ children }) {
  return <>{children}</>;
}

