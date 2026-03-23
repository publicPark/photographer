import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";

import type { ProjectMedia } from "@/lib/sanity";

interface ProjectNavProps {
  prev?: {
    title: string;
    slug: { current: string };
    images: ProjectMedia[];
  };
  next?: {
    title: string;
    slug: { current: string };
    images: ProjectMedia[];
  };
}

// 미디어에서 썸네일 이미지 가져오기
function getMediaThumbnail(media: ProjectMedia) {
  if (media._type === "image") {
    return media;
  } else if (media._type === "video" && media.thumbnail) {
    return media.thumbnail;
  }
  return null;
}

export default function ProjectNav({ prev, next }: ProjectNavProps) {
  if (!prev && !next) {
    return null;
  }

  const prevThumbnail = prev?.images[0] ? getMediaThumbnail(prev.images[0]) : null;
  const nextThumbnail = next?.images[0] ? getMediaThumbnail(next.images[0]) : null;

  return (
    <nav className="border-t border-gray-200 mt-16 md:mt-24">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 이전 프로젝트 */}
          {prev && prevThumbnail ? (
            <Link
              href={`/projects/${prev.slug.current}`}
              className="group flex items-center gap-4 hover:opacity-70 transition-opacity"
            >
              <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden bg-gray-100">
                <Image
                  src={urlFor(prevThumbnail).width(256).height(256).url()}
                  alt={prev.title}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">← Previous</p>
                <h3 className="text-lg md:text-xl font-medium">{prev.title}</h3>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {/* 다음 프로젝트 */}
          {next && nextThumbnail && (
            <Link
              href={`/projects/${next.slug.current}`}
              className="group flex items-center justify-end gap-4 hover:opacity-70 transition-opacity"
            >
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Next →</p>
                <h3 className="text-lg md:text-xl font-medium">{next.title}</h3>
              </div>
              <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden bg-gray-100">
                <Image
                  src={urlFor(nextThumbnail).width(256).height(256).url()}
                  alt={next.title}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
