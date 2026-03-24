"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Project {
  _id: string;
  title: string;
  slug: { current: string };
}

interface HeaderProps {
  projects: Project[];
}

export default function Header({ projects = [] }: HeaderProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isWorkHovered, setIsWorkHovered] = useState(false);
  const [isMobileWorkExpanded, setIsMobileWorkExpanded] = useState(false);

  // 프로젝트 상세 페이지 체크
  const isProjectDetailPage = pathname?.startsWith("/projects/");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 스크롤 방향 감지
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // 아래로 스크롤 중이고 100px 이상 스크롤했을 때 헤더 숨김
        setIsVisible(false);
      } else {
        // 위로 스크롤 중이거나 최상단 근처일 때 헤더 표시
        setIsVisible(true);
      }

      setIsScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isMobileMenuOpen
          ? "bg-white/50 backdrop-blur-sm"
          : isProjectDetailPage && !isScrolled
            ? "bg-transparent"
            : isScrolled
              ? "bg-white/50 backdrop-blur-sm"
              : "bg-white/50 backdrop-blur-sm",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <nav className="responsive-container flex flex-col">
        <div className="h-20 md:h-24 flex items-center justify-between">
          {/* 로고 */}
          <Link
            href="/"
            className={cn(
              "text-lg md:text-3xl font-medium tracking-tight hover:opacity-60 transition-opacity",
              isMobileMenuOpen
                ? "text-black"
                : isProjectDetailPage && !isScrolled
                  ? "text-white"
                  : "text-black"
            )}
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            Jiyun
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center gap-10 lg:gap-12">
            {/* Work 버튼 */}
            <button
              onMouseEnter={() => setIsWorkHovered(true)}
              className={cn(
                "text-sm md:text-base font-normal transition-opacity hover:opacity-60 cursor-default",
                isProjectDetailPage && !isScrolled ? "text-white" : "text-black"
              )}
            >
              Work
            </button>

            <Link
              href="/about"
              className={cn(
                "text-sm md:text-base font-normal transition-opacity hover:opacity-60",
                pathname === "/about" && "opacity-100",
                isProjectDetailPage && !isScrolled ? "text-white" : "text-black"
              )}
            >
              About
            </Link>
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
                "block h-0.5 w-full transition-transform",
                isMobileMenuOpen
                  ? "bg-black"
                  : isProjectDetailPage && !isScrolled
                    ? "bg-white"
                    : "bg-black",
                isMobileMenuOpen && "rotate-45 translate-y-[9px]"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-full transition-opacity",
                isMobileMenuOpen
                  ? "bg-black"
                  : isProjectDetailPage && !isScrolled
                    ? "bg-white"
                    : "bg-black",
                isMobileMenuOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-full transition-transform",
                isMobileMenuOpen
                  ? "bg-black"
                  : isProjectDetailPage && !isScrolled
                    ? "bg-white"
                    : "bg-black",
                isMobileMenuOpen && "-rotate-45 -translate-y-[9px]"
              )}
            />
          </div>
        </button>
        </div>

        {/* Work 드롭다운 확장 영역 */}
        {isWorkHovered && projects.length > 0 && (
          <div
            className="hidden md:block pb-6"
            onMouseLeave={() => setIsWorkHovered(false)}
          >
            <div className="flex justify-end gap-6">
              {projects.map((project) => (
                <Link
                  key={project._id}
                  href={`/projects/${project.slug.current}`}
                  className={cn(
                    "text-sm font-normal hover:underline transition-all",
                    isProjectDetailPage && !isScrolled
                      ? "text-white"
                      : "text-black"
                  )}
                >
                  {project.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-6 py-4 space-y-4">
            {/* Work 섹션 */}
            <div>
              <button
                onClick={() => setIsMobileWorkExpanded(!isMobileWorkExpanded)}
                className="block py-2 text-lg font-normal w-full text-left flex items-center justify-between text-black"
              >
                <span>Work</span>
                <span className="text-sm">
                  {isMobileWorkExpanded ? "−" : "+"}
                </span>
              </button>
              {isMobileWorkExpanded && projects.length > 0 && (
                <div className="pl-4 mt-1 space-y-1">
                  {projects.map((project) => (
                    <Link
                      key={project._id}
                      href={`/projects/${project.slug.current}`}
                      className="block py-2 text-base font-normal text-black"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsMobileWorkExpanded(false);
                      }}
                    >
                      {project.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="block py-2 text-lg font-normal text-black"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
