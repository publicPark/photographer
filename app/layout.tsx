import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

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
      <body className="min-h-full bg-white text-black flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
