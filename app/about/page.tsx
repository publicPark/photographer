import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About - Jiyun",
  description: "포토그래퍼 지윤 소개",
};

export default function AboutPage() {
  return (
    <div className="pt-24 md:pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        {/* 프로필 이미지 (선택사항) */}
        {/* <div className="mb-12 md:mb-16">
          <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto overflow-hidden rounded-full bg-gray-100">
            <Image
              src="/images/profile.jpg"
              alt="Jiyun"
              fill
              className="object-cover"
            />
          </div>
        </div> */}

        {/* 소개 텍스트 */}
        <div className="prose prose-lg md:prose-xl max-w-none">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8">
            About
          </h1>

          <div className="space-y-6 text-gray-700 leading-relaxed font-normal">
            <p>안녕하세요, 아마추어 사진 작가 지윤입니다.</p>

            <p>
              보통은 폰으로 사진을 찍습니다. 사진을 통해 세상을 다르게 보는
              방법을 탐구하며, 각 프로젝트마다 고유한 감성과 메시지를 담아내기
              위해 노력합니다.
            </p>

            <p>본업은 개발자입니다. 알바도 합니다.</p>
          </div>

          {/* 경력 */}
          <div className="mt-12 md:mt-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Experience</h2>
            <ul className="space-y-4 text-gray-700">
              <li>
                <strong>2026 - Present</strong>
                <br />
                Freelance amateur photographer
              </li>
              <li>
                <strong>2020 - 2026</strong>
                <br />
                Software engineer
              </li>
            </ul>
          </div>

          {/* 연락처 */}
          <div className="mt-12 md:mt-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Contact</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:jiyuniverse@gmail.com"
                  className="underline hover:text-black transition-colors"
                >
                  jiyuniverse@gmail.com
                </a>
              </p>
              {/* <p>
                <strong>Instagram:</strong> 없음
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
