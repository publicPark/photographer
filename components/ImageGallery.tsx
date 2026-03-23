import Image from "next/image";
import { urlFor, client } from "@/lib/sanity";
import type { ProjectMedia } from "@/lib/sanity";

interface ImageGalleryProps {
  images: ProjectMedia[];
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

export default function ImageGallery({ images }: ImageGalleryProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8 md:space-y-12 lg:space-y-16">
      {images.map((item, index) => (
        <div key={item._key} className="max-w-6xl mx-auto px-6 md:px-8">
          {item._type === "image" ? (
            // 이미지 렌더링
            <div className="relative w-full" style={{ aspectRatio: "auto" }}>
              <Image
                src={urlFor(item).width(2400).quality(90).url()}
                alt={item.alt || `Image ${index + 1}`}
                width={2400}
                height={1600}
                className="w-full h-auto"
                loading={index < 4 ? "eager" : "lazy"}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
              />
              {item.caption && (
                <p className="text-center text-gray-500 text-sm md:text-base mt-4">
                  {item.caption}
                </p>
              )}
            </div>
          ) : (
            // 동영상 렌더링
            <div className="relative w-full">
              {item.videoType === "youtube" && item.url && (
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(item.url)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeId(item.url)}`}
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              {item.videoType === "vimeo" && item.url && (
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src={`https://player.vimeo.com/video/${getVimeoId(item.url)}?autoplay=1&muted=1&loop=1`}
                    className="absolute top-0 left-0 w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              {item.videoType === "file" && item.videoFile && (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  className="w-full"
                  preload="auto"
                >
                  <source src={`${client.config().projectId ? `https://cdn.sanity.io/files/${client.config().projectId}/${client.config().dataset}/` : ""}${item.videoFile.asset._ref.replace("file-", "").replace("-", ".")}`} />
                  Your browser does not support the video tag.
                </video>
              )}
              {item.caption && (
                <p className="text-center text-gray-500 text-sm md:text-base mt-4">
                  {item.caption}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
