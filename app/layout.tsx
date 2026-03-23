import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jiyun - Photographer",
  description: "포토그래퍼 지윤의 포트폴리오",
  keywords: ["photographer", "portfolio", "photography", "사진작가"],
  authors: [{ name: "Jiyun" }],
  openGraph: {
    title: "Jiyun - Photographer",
    description: "포토그래퍼 지윤의 포트폴리오",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className={`${notoSansKR.variable} min-h-full bg-white text-black flex flex-col font-sans`}>
        <HeaderWrapper />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
