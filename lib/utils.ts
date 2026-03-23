import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind 클래스 이름 병합 유틸리티
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 날짜 포맷팅
 */
export function formatDate(date: string): string {
  return new Date(date).getFullYear().toString();
}

/**
 * 스크롤을 부드럽게 맨 위로
 */
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
