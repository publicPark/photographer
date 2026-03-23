import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// Sanity 이미지 타입
type SanityImageSource = any;

// Sanity 클라이언트 설정
// TODO: 실제 프로젝트 ID와 데이터셋으로 교체 필요
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-20",
  useCdn: true, // 프로덕션에서 빠른 로딩
});

// 이미지 URL 빌더
const builder = imageUrlBuilder(client);

/**
 * Sanity 이미지 URL 생성 헬퍼
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// 타입 정의
export interface ProjectImage {
  _type: "image";
  _key: string;
  asset: {
    _ref: string;
    url: string;
    metadata?: {
      dimensions?: {
        width: number;
        height: number;
        aspectRatio: number;
      };
    };
  };
  alt?: string;
  caption?: string;
  isFeatured?: boolean;
  isCover?: boolean;
}

export interface ProjectVideo {
  _type: "video";
  _key: string;
  videoType: "file" | "youtube";
  videoFile?: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  url?: string;
  thumbnail?: {
    asset: {
      _ref: string;
      url: string;
      metadata?: {
        dimensions?: {
          width: number;
          height: number;
          aspectRatio: number;
        };
      };
    };
  };
  caption?: string;
  isFeatured?: boolean;
  isCover?: boolean;
}

export type ProjectMedia = ProjectImage | ProjectVideo;

export interface Project {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  images: ProjectMedia[]; // 모든 미디어 (이미지 + 동영상)
  coverMedia?: ProjectMedia; // 커버 미디어 (isCover로 선택)
  featuredMedia?: ProjectMedia[]; // 대표 미디어 4개 (필터링된 결과)
  description?: string;
  date: string;
  orderRank?: string;
  prevProject?: {
    title: string;
    slug: { current: string };
    images: ProjectMedia[];
  };
  nextProject?: {
    title: string;
    slug: { current: string };
    images: ProjectMedia[];
  };
}


/**
 * 모든 프로젝트 가져오기 (홈페이지용)
 */
export async function getAllProjects(): Promise<Project[]> {
  try {
    const projects = await client.fetch(`
      *[_type == "project"]
      | order(orderRank) {
        _id,
        title,
        slug,
        images[] {
          ...,
          asset-> {
            _ref,
            url,
            metadata {
              dimensions
            }
          }
        },
        description,
        date
      }
    `);

    // 대표 미디어와 커버 미디어 필터링 (이미지 + 동영상)
    return projects.map((project: Project) => {
      return {
        ...project,
        featuredMedia: project.images?.filter((item) => {
          if (item._type === "image") {
            return item.isFeatured;
          } else if (item._type === "video") {
            return item.isFeatured;
          }
          return false;
        }) || [],
        coverMedia: project.images?.find((item) => {
          if (item._type === "image") {
            return item.isCover;
          } else if (item._type === "video") {
            return item.isCover;
          }
          return false;
        }),
      };
    });
  } catch (error) {
    console.error("Failed to fetch all projects:", error);
    return [];
  }
}

/**
 * Slug로 특정 프로젝트 가져오기 (상세 페이지용)
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const project = await client.fetch(
      `
      *[_type == "project" && slug.current == $slug][0] {
        _id,
        title,
        description,
        date,
        images,
        "nextProject": *[_type == "project" && orderRank > ^.orderRank] | order(orderRank asc)[0] {
          title,
          slug,
          images
        },
        "prevProject": *[_type == "project" && orderRank < ^.orderRank] | order(orderRank desc)[0] {
          title,
          slug,
          images
        }
      }
    `,
      { slug }
    );

    if (!project) return null;

    // 대표 미디어와 커버 미디어 필터링 (이미지 + 동영상)
    return {
      ...project,
      featuredMedia: project.images?.filter((item: ProjectMedia) => {
        if (item._type === "image") {
          return item.isFeatured;
        } else if (item._type === "video") {
          return item.isFeatured;
        }
        return false;
      }) || [],
      coverMedia: project.images?.find((item: ProjectMedia) => {
        if (item._type === "image") {
          return item.isCover;
        } else if (item._type === "video") {
          return item.isCover;
        }
        return false;
      }),
    };
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return null;
  }
}
