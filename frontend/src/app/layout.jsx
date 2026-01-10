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

import { getDefaultMetadata } from "@/lib/seo";

export const metadata = getDefaultMetadata();
export default function RootLayout({ children }) {
  return (
    <>
      <html lang="vi" suppressHydrationWarning>
        <head />
        <body
          className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        >
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
