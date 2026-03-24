import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjects, urlFor } from "@/lib/sanity";
import ProjectDetailGallery from "@/components/ProjectDetailGallery";
import ProjectNav from "@/components/ProjectNav";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  // 첫 번째 이미지를 OG 이미지로 사용
  const firstImage = project.images?.[0];
  const ogImageUrl =
    firstImage?._type === "image" && firstImage.asset
      ? urlFor(firstImage).width(1200).height(630).quality(90).url()
      : null;

  const description = project.description || project.title;

  return {
    title: `${project.title} - Jiyun`,
    description: description,
    openGraph: {
      title: project.title,
      description: description,
      type: "website",
      // url: `https://yourdomain.com/projects/${slug}`,
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: project.title,
            },
          ]
        : [],
    },
  };
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    slug: project.slug.current,
  }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="pb-16">
      {/* Masonry 갤러리 */}
      <ProjectDetailGallery
        images={project.images}
        title={project.title}
        description={project.description}
      />

      {/* 다음/이전 프로젝트 네비게이션 */}
      <ProjectNav prev={project.prevProject} next={project.nextProject} />
    </article>
  );
}

// ISR: 10분마다 재생성
export const revalidate = 600;
