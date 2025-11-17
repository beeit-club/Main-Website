import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./globals.css";
import "./custom.css";

import { Toaster } from "@/components/ui/sonner";
import ClientWrapper from "./ClientWrapper";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Bee IT",
    template: "%s | Tên Thương Hiệu Của Bạn",
  },
  description:
    "Bee IT là câu lạc bộ công nghệ thông tin trực thuộc FPT Polytechnic, nơi chia sẻ kiến thức và kết nối cộng đồng sinh viên yêu thích CNTT.",
  openGraph: {
    title: "Bee IT",
    description:
      "Bee IT là câu lạc bộ công nghệ thông tin trực thuộc FPT Polytechnic, nơi chia sẻ kiến thức và kết nối cộng đồng sinh viên yêu thích CNTT.",
    url: "https://yourdomain.com",
    type: "website",
    images: [
      {
        url: "https://yourdomain.com/og-image-homepage.png",
        width: 1200,
        height: 630,
        alt: "Ảnh đại diện trang chủ",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Bee IT",
    description:
      "Bee IT là câu lạc bộ công nghệ thông tin trực thuộc FPT Polytechnic, nơi chia sẻ kiến thức và kết nối cộng đồng sinh viên yêu thích CNTT.",
    images: ["https://yourdomain.com/twitter-image-homepage.png"],
  },
};
export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <GoogleOAuthProvider
              clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
            >
              <ClientWrapper>{children}</ClientWrapper>
            </GoogleOAuthProvider>
            <Toaster position="top-center" />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
