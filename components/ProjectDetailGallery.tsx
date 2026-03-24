"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { urlFor, client } from "@/lib/sanity";
import type { ProjectMedia } from "@/lib/sanity";

interface ProjectDetailGalleryProps {
  images: ProjectMedia[];
  title: string;
  description?: string;
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

// 애니메이션이 적용된 갤러리 아이템
function GalleryItem({
  media,
  index,
  title,
  onImageClick,
}: {
  media: ProjectMedia;
  index: number;
  title: string;
  onImageClick: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

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

  const handleClick = () => {
    // 데스크톱(768px 이상)에서만 확대 기능 활성화
    if (media._type === "image" && window.innerWidth >= 768) {
      onImageClick();
    }
  };

  return (
    <div
      ref={itemRef}
      className={`break-inside-avoid mb-[2.2vw] md:cursor-pointer md:hover:opacity-90 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      onClick={handleClick}
    >
      {media._type === "image" ? (
        <Image
          src={urlFor(media).width(800).quality(90).url()}
          alt={media.alt || `${title} - Image ${index + 2}`}
          width={800}
          height={800}
          className="w-full h-auto"
          loading={index < 8 ? "eager" : "lazy"}
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      ) : media.videoType === "youtube" && media.url ? (
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          {media.thumbnail && (
            <Image
              src={urlFor(media.thumbnail).width(800).quality(90).url()}
              alt={`${title} - Video ${index + 2}`}
              fill
              className="object-cover"
            />
          )}
          <iframe
            src={`https://www.youtube.com/embed/${getYouTubeId(media.url)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeId(media.url)}&controls=0&showinfo=0&rel=0&modestbranding=1`}
            className="absolute inset-0 w-full h-full z-10"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{ pointerEvents: "none" }}
          />
        </div>
      ) : media.videoType === "file" && media.videoFile ? (
        <div className="relative w-full">
          {media.thumbnail && (
            <Image
              src={urlFor(media.thumbnail).width(800).quality(90).url()}
              alt={`${title} - Video ${index + 2}`}
              width={800}
              height={450}
              className="w-full h-auto"
            />
          )}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 z-10 w-full h-full object-cover"
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
        </div>
      ) : null}
    </div>
  );
}

export default function ProjectDetailGallery({
  images,
  title,
  description,
}: ProjectDetailGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (lightboxIndex === null) return;

    // 이미지 변경 시 로딩 상태 리셋
    setImageLoaded(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : images.length - 1));
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev! < images.length - 1 ? prev! + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    // 다음/이전 이미지 미리 로드
    if (
      images[lightboxIndex]._type === "image" &&
      images[lightboxIndex].asset
    ) {
      const preloadNext = new window.Image();
      const preloadPrev = new window.Image();
      const nextIndex =
        lightboxIndex < images.length - 1 ? lightboxIndex + 1 : 0;
      const prevIndex =
        lightboxIndex > 0 ? lightboxIndex - 1 : images.length - 1;

      if (images[nextIndex]._type === "image" && images[nextIndex].asset) {
        preloadNext.src = urlFor(images[nextIndex])
          .width(1200)
          .quality(85)
          .url();
      }
      if (images[prevIndex]._type === "image" && images[prevIndex].asset) {
        preloadPrev.src = urlFor(images[prevIndex])
          .width(1200)
          .quality(85)
          .url();
      }
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, images]);

  if (!images || images.length === 0) {
    return null;
  }

  const heroImage = images[0];
  const galleryImages = images.slice(1);

  // Hero 이미지가 없으면 렌더링 안함
  if (!heroImage || (heroImage._type === "image" && !heroImage.asset)) {
    return null;
  }

  return (
    <>
      {/* Hero Section - 배경 이미지 + 텍스트 오버레이 */}
      <div className="relative w-full min-h-[60vh] md:min-h-[70vh] mb-12 md:mb-20">
        {/* 배경 이미지 */}
        {heroImage._type === "image" ? (
          <Image
            src={urlFor(heroImage).width(2400).quality(90).url()}
            alt={heroImage.alt || title}
            fill
            className="object-cover"
            loading="eager"
            priority
            sizes="100vw"
          />
        ) : heroImage.videoType === "youtube" && heroImage.url ? (
          <>
            {heroImage.thumbnail && (
              <Image
                src={urlFor(heroImage.thumbnail).width(2400).quality(90).url()}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            )}
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeId(heroImage.url)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeId(heroImage.url)}&controls=0&showinfo=0&rel=0&modestbranding=1`}
              className="absolute inset-0 w-full h-full z-10 object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              style={{ pointerEvents: "none", objectFit: "cover" }}
            />
          </>
        ) : heroImage.videoType === "file" && heroImage.videoFile ? (
          <>
            {heroImage.thumbnail && (
              <Image
                src={urlFor(heroImage.thumbnail).width(2400).quality(90).url()}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            )}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 z-10 w-full h-full object-cover"
              style={{ pointerEvents: "none" }}
            >
              <source
                src={getSanityVideoUrl(
                  client.config().projectId,
                  client.config().dataset,
                  heroImage.videoFile.asset._ref
                )}
              />
            </video>
          </>
        ) : null}

        {/* 텍스트 오버레이 */}
        <div className="absolute inset-0 flex items-center z-20 pointer-events-none py-12 md:py-16">
          <div className="responsive-container">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold tracking-tight mb-6">
                {title}
              </h1>
              {description && (
                <h3 className="text-xl md:text-2xl lg:text-3xl text-white font-normal leading-relaxed whitespace-pre-wrap">
                  {description}
                </h3>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 갤러리 - CSS Columns (Masonry) */}
      {galleryImages.length > 0 && (
        <div className="responsive-container">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-[2.2vw]">
            {galleryImages.map((media, index) => {
              // asset이 없는 미디어는 스킵
              if (media._type === "image" && !media.asset) return null;
              if (
                media._type === "video" &&
                !media.thumbnail?.asset &&
                !media.videoFile?.asset
              )
                return null;

              return (
                <GalleryItem
                  key={media._key}
                  media={media}
                  index={index}
                  title={title}
                  onImageClick={() => setLightboxIndex(index + 1)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div
          className="fixed inset-0 bg-white/70 backdrop-blur-sm z-[100] flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-4 right-4 text-black text-4xl hover:opacity-70 transition-opacity z-10"
            onClick={() => setLightboxIndex(null)}
          >
            ×
          </button>

          {/* 이전 버튼 */}
          <button
            className="absolute left-4 text-black text-4xl hover:opacity-70 transition-opacity z-10"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) =>
                prev! > 0 ? prev! - 1 : images.length - 1
              );
            }}
          >
            ‹
          </button>

          {/* 다음 버튼 */}
          <button
            className="absolute right-4 text-black text-4xl hover:opacity-70 transition-opacity z-10"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) =>
                prev! < images.length - 1 ? prev! + 1 : 0
              );
            }}
          >
            ›
          </button>

          {/* 이미지 */}
          <div
            className="relative min-w-[200px] min-h-[200px]"
            onClick={(e) => e.stopPropagation()}
          >
            {images[lightboxIndex]._type === "image" &&
              images[lightboxIndex].asset && (
                <>
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img
                    src={urlFor(images[lightboxIndex])
                      .width(1200)
                      .quality(85)
                      .url()}
                    alt={
                      images[lightboxIndex].alt ||
                      `${title} - Image ${lightboxIndex + 1}`
                    }
                    className={`max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain transition-opacity duration-200 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => setImageLoaded(true)}
                  />
                </>
              )}
          </div>
        </div>
      )}
    </>
  );
}
