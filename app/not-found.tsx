import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <h1 className="text-6xl md:text-8xl font-bold mb-4">404</h1>
      <p className="text-xl md:text-2xl text-gray-600 mb-8">
        페이지를 찾을 수 없습니다
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
