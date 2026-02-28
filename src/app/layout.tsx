import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ThemeProvider from "@/components/ThemeProvider";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "감사일기 - 매일 세 줄의 감사",
  description: "매일 세 가지 감사한 것을 기록하는 감사일기 앱",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "감사일기",
  },
};

export const viewport: Viewport = {
  themeColor: "#8b7355",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.svg" />
      </head>
      <body className={`${notoSansKR.className} antialiased`}>
        <ThemeProvider>
          <div className="max-w-lg mx-auto min-h-screen border-x-[1.5px] border-[#d4cdc4] dark:border-[#2e2a26] shadow-[0_0_24px_rgba(0,0,0,0.06)] dark:shadow-[0_0_24px_rgba(0,0,0,0.5)] bg-white/50 dark:bg-[#181614]/60">
            <Header />
            <main className="px-5 py-10">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
