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

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>안녕하세요, 포토그래퍼 지윤입니다.</p>

            <p>
              빛과 그림자, 순간과 영원 사이에서 이야기를 포착하는 작업을 하고
              있습니다. 상업 사진부터 개인 작업까지, 다양한 프로젝트를 통해
              시각적 내러티브를 만들어갑니다.
            </p>

            <p>
              사진을 통해 세상을 다르게 보는 방법을 탐구하며, 각 프로젝트마다
              고유한 감성과 메시지를 담아내기 위해 노력합니다.
            </p>
          </div>

          {/* 경력 */}
          <div className="mt-12 md:mt-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Experience</h2>
            <ul className="space-y-4 text-gray-700">
              <li>
                <strong>2023 - Present</strong>
                <br />
                Freelance amateur photographer
              </li>
              <li>
                <strong>2021 - 2023</strong>
                <br />
                Senior amateur photographer, ASDF Studio
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
                  hello@jiyun.com
                </a>
              </p>
              <p>
                <strong>Instagram:</strong>{" "}
                <a
                  href="https://instagram.com/jiyun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-black transition-colors"
                >
                  @jiyun
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
