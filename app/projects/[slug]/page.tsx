import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjects } from "@/lib/sanity";
import { formatDate } from "@/lib/utils";
import ImageGallery from "@/components/ImageGallery";
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

  return {
    title: `${project.title} - Jiyun`,
    description: project.description || project.title,
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
    <article className="pt-24 md:pt-32 pb-16">
      {/* 프로젝트 헤더 */}
      <header className="max-w-4xl mx-auto px-6 md:px-8 mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
          {project.title}
        </h1>
        <div className="text-gray-600 text-sm md:text-base mb-6">
          {formatDate(project.date)}
        </div>
        {project.description && (
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            {project.description}
          </p>
        )}
      </header>

      {/* 이미지/동영상 갤러리 */}
      <ImageGallery images={project.images} />

      {/* 다음/이전 프로젝트 네비게이션 */}
      <ProjectNav prev={project.prevProject} next={project.nextProject} />
    </article>
  );
}

// ISR: 10분마다 재생성
export const revalidate = 600;
