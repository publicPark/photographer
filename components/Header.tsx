"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 h-20 md:h-24 flex items-center justify-between">
        {/* 로고 */}
        <Link
          href="/"
          className="text-lg md:text-xl font-semibold tracking-tight hover:opacity-60 transition-opacity"
        >
          Jiyun
        </Link>

        {/* 데스크톱 메뉴 */}
        <div className="hidden md:flex items-center gap-10 lg:gap-12">
          <Link
            href="/about"
            className={cn(
              "text-sm md:text-base font-medium transition-opacity hover:opacity-60",
              pathname === "/about" && "opacity-100"
            )}
          >
            About
          </Link>
          <a
            href="mailto:hello@jiyun.com"
            className="text-sm md:text-base font-medium transition-opacity hover:opacity-60"
          >
            Contact
          </a>
        </div>

        {/* 모바일 햄버거 버튼 */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2"
          aria-label="메뉴 토글"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span
              className={cn(
                "block h-0.5 w-full bg-black transition-transform",
                isMobileMenuOpen && "rotate-45 translate-y-2"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-full bg-black transition-opacity",
                isMobileMenuOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-full bg-black transition-transform",
                isMobileMenuOpen && "-rotate-45 -translate-y-2"
              )}
            />
          </div>
        </button>
      </nav>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-6 py-4 space-y-4">
            <Link
              href="/about"
              className="block py-2 text-lg font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <a
              href="mailto:hello@jiyun.com"
              className="block py-2 text-lg font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
