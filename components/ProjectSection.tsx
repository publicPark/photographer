"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { urlFor, client } from "@/lib/sanity";
import { formatDate } from "@/lib/utils";
import type { Project, ProjectMedia } from "@/lib/sanity";

interface ProjectSectionProps {
  project: Project;
  index: number;
}

// YouTube URL에서 비디오 ID 추출
function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Vimeo URL에서 비디오 ID 추출
function getVimeoId(url: string): string | null {
  const regExp = /vimeo.*\/(\d+)/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

// 미디어 아이템 렌더링 컴포넌트
function MediaItem({
  media,
  projectSlug,
  alt,
  loading,
  className,
  containerClassName = "",
}: {
  media: ProjectMedia;
  projectSlug: string;
  alt: string;
  loading?: "eager" | "lazy";
  className?: string;
  containerClassName?: string;
}) {
  const isVideo = media._type === "video";

  const content =
    media._type === "image" ? (
      // 이미지 렌더링
      containerClassName.includes("flex-1") ? (
        <Image
          src={urlFor(media).width(800).quality(90).url()}
          alt={alt}
          fill
          className={className}
          loading={loading}
          sizes="(max-width: 768px) 50vw, 50vw"
        />
      ) : (
        <Image
          src={urlFor(media).width(800).quality(90).url()}
          alt={alt}
          width={800}
          height={800}
          className={className}
          loading={loading}
          sizes="(max-width: 768px) 50vw, 50vw"
        />
      )
    ) : media.videoType === "youtube" && media.url ? (
      // YouTube 동영상
      <div className="absolute inset-0">
        <iframe
          src={`https://www.youtube.com/embed/${getYouTubeId(media.url)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeId(media.url)}&controls=0&showinfo=0&rel=0&modestbranding=1`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{ pointerEvents: "none" }}
        />
      </div>
    ) : media.videoType === "vimeo" && media.url ? (
      // Vimeo 동영상
      <div className="absolute inset-0">
        <iframe
          src={`https://player.vimeo.com/video/${getVimeoId(media.url)}?autoplay=1&muted=1&loop=1&background=1`}
          className="w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          style={{ pointerEvents: "none" }}
        />
      </div>
    ) : media.videoType === "file" && media.videoFile ? (
      // 업로드된 비디오 파일
      <video
        autoPlay
        muted
        loop
        playsInline
        className={`${className} ${containerClassName.includes("flex-1") ? "absolute inset-0 w-full h-full" : ""}`}
        style={{ pointerEvents: "none" }}
      >
        <source
          src={`${client.config().projectId ? `https://cdn.sanity.io/files/${client.config().projectId}/${client.config().dataset}/` : ""}${media.videoFile.asset._ref.replace("file-", "").replace("-", ".")}`}
        />
      </video>
    ) : null;

  return (
    <Link href={`/projects/${projectSlug}`} className={`group relative overflow-hidden bg-gray-100 ${containerClassName}`}>
      {content}
    </Link>
  );
}

export default function ProjectSection({ project, index }: ProjectSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const featuredMedia = project.featuredMedia || [];

  if (featuredMedia.length < 4) {
    return null;
  }

  const getMediaAlt = (media: ProjectMedia, idx: number) => {
    if (media._type === "image") {
      return media.alt || `${project.title} - Image ${idx + 1}`;
    } else {
      return `${project.title} - Video ${idx + 1}`;
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`mb-24 md:mb-32 lg:mb-40 transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* 메이슨리 레이아웃 (마지막 줄만 크롭) */}
      <div className="flex gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
        {/* 왼쪽 컬럼 */}
        <div className="flex-1 flex flex-col gap-3 md:gap-4 lg:gap-6">
          {/* 첫 번째 미디어 - 원본 비율 */}
          <MediaItem
            media={featuredMedia[0]}
            projectSlug={project.slug.current}
            alt={getMediaAlt(featuredMedia[0], 0)}
            loading={index === 0 ? "eager" : "lazy"}
            className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
            containerClassName="w-full"
          />

          {/* 세 번째 미디어 - 남은 공간 채우기 (크롭) */}
          <MediaItem
            media={featuredMedia[2]}
            projectSlug={project.slug.current}
            alt={getMediaAlt(featuredMedia[2], 2)}
            loading="lazy"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            containerClassName="flex-1 min-h-[300px]"
          />
        </div>

        {/* 오른쪽 컬럼 */}
        <div className="flex-1 flex flex-col gap-3 md:gap-4 lg:gap-6">
          {/* 두 번째 미디어 - 원본 비율 */}
          <MediaItem
            media={featuredMedia[1]}
            projectSlug={project.slug.current}
            alt={getMediaAlt(featuredMedia[1], 1)}
            loading={index === 0 ? "eager" : "lazy"}
            className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
            containerClassName="w-full"
          />

          {/* 네 번째 미디어 - 남은 공간 채우기 (크롭) */}
          <MediaItem
            media={featuredMedia[3]}
            projectSlug={project.slug.current}
            alt={getMediaAlt(featuredMedia[3], 3)}
            loading="lazy"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            containerClassName="flex-1 min-h-[300px]"
          />
        </div>
      </div>

      {/* 텍스트 영역 */}
      <div className="max-w-3xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 leading-tight">
          {project.title}
        </h2>

        {project.description && (
          <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4 md:mb-6">
            {project.description}
          </p>
        )}

        <div className="flex items-center gap-6 text-sm md:text-base">
          <Link
            href={`/projects/${project.slug.current}`}
            className="text-black hover:opacity-60 transition-opacity font-medium inline-flex items-center gap-2"
          >
            View Project
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <span className="text-gray-400">{formatDate(project.date)}</span>
        </div>
      </div>
    </section>
  );
}
