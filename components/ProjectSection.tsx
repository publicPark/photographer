"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { urlFor, client } from "@/lib/sanity";
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

// Sanity 비디오 파일 URL 생성
function getSanityVideoUrl(
  projectId: string | undefined,
  dataset: string | undefined,
  assetRef: string
): string {
  if (!projectId) return "";
  const cleanRef = assetRef.replace("file-", "").replace("-", ".");
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${cleanRef}`;
}

// 미디어 아이템 렌더링 컴포넌트
function MediaItem({
  media,
  alt,
  loading,
  className,
  containerClassName = "",
  delay = 0,
}: {
  media: ProjectMedia;
  alt: string;
  loading?: "eager" | "lazy";
  className?: string;
  containerClassName?: string;
  delay?: number;
}) {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (media._type !== "video") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, [media._type]);

  useEffect(() => {
    if (!itemRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    observer.observe(itemRef.current);

    return () => observer.disconnect();
  }, []);

  const useFill = containerClassName.includes("h-full");

  // 동영상 ID 미리 계산 (중복 호출 방지)
  const youtubeId =
    media._type === "video" && media.videoType === "youtube" && media.url
      ? getYouTubeId(media.url)
      : null;

  const content =
    media._type === "image" ? (
      // 이미지 렌더링
      useFill ? (
        <Image
          src={urlFor(media).width(800).quality(90).url()}
          alt={alt}
          fill
          className={className}
          loading={loading}
          sizes="(max-width: 768px) 50vw, 50vw"
          style={{ pointerEvents: "none" }}
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
          style={{ pointerEvents: "none" }}
        />
      )
    ) : media.videoType === "youtube" && media.url ? (
      // YouTube 동영상
      <div ref={videoRef} className={useFill ? "absolute inset-0" : "relative"}>
        {/* 썸네일 배경 (항상 표시) */}
        {media.thumbnail && (
          <Image
            src={urlFor(media.thumbnail).width(800).quality(90).url()}
            alt={alt}
            fill
            className="object-cover"
            style={{ pointerEvents: "none" }}
          />
        )}
        {/* 동영상 오버레이 */}
        {shouldLoadVideo && youtubeId && (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1`}
            className="absolute inset-0 w-full h-full z-10 object-cover"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{ pointerEvents: "none", objectFit: "cover" }}
          />
        )}
      </div>
    ) : media.videoType === "file" && media.videoFile ? (
      // 업로드된 비디오 파일
      <div ref={videoRef} className={useFill ? "absolute inset-0" : "relative"}>
        {/* 썸네일 배경 (항상 표시) */}
        {media.thumbnail && (
          <Image
            src={urlFor(media.thumbnail).width(800).quality(90).url()}
            alt={alt}
            fill
            className="object-cover"
            style={{ pointerEvents: "none" }}
          />
        )}
        {/* 동영상 오버레이 */}
        {shouldLoadVideo && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 z-10 object-cover w-full h-full"
            style={{ pointerEvents: "none" }}
          >
            <source
              src={getSanityVideoUrl(
                client.config().projectId,
                client.config().dataset,
                media.videoFile.asset._ref
              )}
            />
          </video>
        )}
      </div>
    ) : null;

  const divClassName = [
    useFill ? "absolute inset-0" : "relative",
    "overflow-hidden",
    "bg-gray-100",
    "transition-all duration-700",
    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
    containerClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={itemRef}
      className={divClassName}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {content}
    </div>
  );
}

export default function ProjectSection({
  project,
  index,
}: ProjectSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [calculatedHeights, setCalculatedHeights] = useState<{
    left1: number;
    right1: number;
    left2: number;
    right2: number;
  } | null>(null);

  useEffect(() => {
    const calculateHeights = () => {
      if (!containerRef.current) return;

      const featuredMedia = project.featuredMedia || [];
      if (featuredMedia.length < 4) return;

      // 컨테이너 너비 가져오기
      const containerWidth = containerRef.current.clientWidth;
      // gap 고려 (2.2vw)
      const gap = containerWidth * 0.022;
      const columnWidth = (containerWidth - gap) / 2;

      // 각 이미지의 원본 비율 높이 계산
      const heights = featuredMedia.slice(0, 4).map((media) => {
        if (media._type === "image" && media.asset.metadata?.dimensions) {
          const { width, height } = media.asset.metadata.dimensions;
          return (columnWidth * height) / width;
        } else if (
          media._type === "video" &&
          media.thumbnail?.asset.metadata?.dimensions
        ) {
          const { width, height } = media.thumbnail.asset.metadata.dimensions;
          return (columnWidth * height) / width;
        }
        return columnWidth; // fallback
      });

      const [h1, h2, h3, h4] = heights;

      // 각 컬럼의 전체 높이 (원본 비율 기준)
      const leftColumnTotal = h1 + gap + h3;
      const rightColumnTotal = h2 + gap + h4;
      const maxColumnTotal = Math.max(leftColumnTotal, rightColumnTotal);

      // 최대 높이 제한
      // 모바일: 1.5배, 데스크톱: 1.0배
      const isMobile = window.innerWidth < 768;
      const maxHeight = containerWidth * (isMobile ? 1.5 : 1.0);

      // 최대 높이 제한이 걸렸는지 확인
      const needsScaling = maxColumnTotal > maxHeight;
      const scale = needsScaling ? maxHeight / maxColumnTotal : 1;

      // 스케일 적용된 전체 높이
      const totalHeight = maxColumnTotal * scale;

      // 첫 번째 행: 원본 비율 유지 + scale 적용
      const left1 = h1 * scale;
      const right1 = h2 * scale;

      // 두 번째 행: 남은 공간으로 맞춤 (양쪽 컬럼 높이 동일하게)
      const left2 = totalHeight - left1 - gap;
      const right2 = totalHeight - right1 - gap;

      setCalculatedHeights({
        left1,
        right1,
        left2: Math.max(left2, 50),
        right2: Math.max(right2, 50),
      });
    };

    // 초기 계산 (약간 지연시켜서 containerRef가 준비될 때까지 대기)
    const timer = setTimeout(calculateHeights, 0);

    // resize 시 재계산
    window.addEventListener("resize", calculateHeights);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateHeights);
    };
  }, [project.featuredMedia]);

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

  // aspect ratio 기반 임시 높이 계산
  const getAspectRatio = (media: ProjectMedia) => {
    if (media._type === "image" && media.asset.metadata?.dimensions) {
      return media.asset.metadata.dimensions.aspectRatio;
    } else if (media._type === "video" && media.thumbnail?.asset.metadata?.dimensions) {
      return media.thumbnail.asset.metadata.dimensions.aspectRatio;
    }
    return 1;
  };

  return (
    <section ref={sectionRef} className="mb-24 md:mb-32 lg:mb-40">
      {/* 메이슨리 레이아웃 (마지막 줄만 크롭) */}
      <div ref={containerRef} className="flex gap-[2.2vw] mb-6 md:mb-8">
        {/* 왼쪽 컬럼 */}
        <div className="flex-1 flex flex-col gap-[2.2vw]">
          {/* 첫 번째 미디어 */}
          <div
            style={{
              height: calculatedHeights
                ? `${calculatedHeights.left1}px`
                : undefined,
              aspectRatio: !calculatedHeights ? `${getAspectRatio(featuredMedia[0])}` : undefined,
            }}
            className="w-full overflow-hidden relative"
          >
            <MediaItem
              media={featuredMedia[0]}
              alt={getMediaAlt(featuredMedia[0], 0)}
              loading={index === 0 ? "eager" : "lazy"}
              className="object-cover"
              containerClassName="w-full h-full"
              delay={0}
            />
          </div>

          {/* 세 번째 미디어 */}
          <div
            style={{
              height: calculatedHeights
                ? `${calculatedHeights.left2}px`
                : undefined,
              aspectRatio: !calculatedHeights ? `${getAspectRatio(featuredMedia[2])}` : undefined,
            }}
            className="w-full overflow-hidden relative"
          >
            <MediaItem
              media={featuredMedia[2]}
              alt={getMediaAlt(featuredMedia[2], 2)}
              loading="lazy"
              className="object-cover"
              containerClassName="w-full h-full"
              delay={200}
            />
          </div>
        </div>

        {/* 오른쪽 컬럼 */}
        <div className="flex-1 flex flex-col gap-[2.2vw]">
          {/* 두 번째 미디어 */}
          <div
            style={{
              height: calculatedHeights
                ? `${calculatedHeights.right1}px`
                : undefined,
              aspectRatio: !calculatedHeights ? `${getAspectRatio(featuredMedia[1])}` : undefined,
            }}
            className="w-full overflow-hidden relative"
          >
            <MediaItem
              media={featuredMedia[1]}
              alt={getMediaAlt(featuredMedia[1], 1)}
              loading={index === 0 ? "eager" : "lazy"}
              className="object-cover"
              containerClassName="w-full h-full"
              delay={100}
            />
          </div>

          {/* 네 번째 미디어 */}
          <div
            style={{
              height: calculatedHeights
                ? `${calculatedHeights.right2}px`
                : undefined,
              aspectRatio: !calculatedHeights ? `${getAspectRatio(featuredMedia[3])}` : undefined,
            }}
            className="w-full overflow-hidden relative"
          >
            <MediaItem
              media={featuredMedia[3]}
              alt={getMediaAlt(featuredMedia[3], 3)}
              loading="lazy"
              className="object-cover"
              containerClassName="w-full h-full"
              delay={300}
            />
          </div>
        </div>
      </div>

      {/* 프로젝트 정보 */}
      <div className="whitespace-pre-line">
        {project.description && (
          <p className="text-lg md:text-2xl text-gray-900 font-normal leading-relaxed mb-6">
            {project.description}
          </p>
        )}
        <Link
          href={`/projects/${project.slug.current}`}
          className="inline-block text-lg md:text-2xl font-normal tracking-normal underline transition-all"
        >
          View Project →
        </Link>
      </div>
    </section>
  );
}
