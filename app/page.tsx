import { getAllProjects } from "@/lib/sanity";
import ProjectSection from "@/components/ProjectSection";

export default async function HomePage() {
  const projects = await getAllProjects();

  return (
    <div className="pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* 히어로 텍스트 (선택사항) */}
        <header className="mb-16 md:mb-24 lg:mb-32">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Amateur photographer
            <br />
            Based in Seoul, actively shooting around the city.
          </h1>
        </header>

        {/* 프로젝트 섹션들 */}
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <ProjectSection key={project._id} project={project} index={index} />
          ))
        ) : (
          <div className="text-center text-gray-500 py-20">
            프로젝트가 없습니다. Sanity Studio에서 프로젝트를 추가해주세요.
          </div>
        )}
      </div>
    </div>
  );
}

// ISR: 10분마다 재생성
export const revalidate = 600;
