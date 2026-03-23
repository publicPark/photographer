import { getAllProjects } from "@/lib/sanity";
import ProjectSection from "@/components/ProjectSection";

export default async function HomePage() {
  const projects = await getAllProjects();

  return (
    <div className="pt-24 md:pt-32">
      {/* Hero Section */}
      <section className="responsive-container mb-24 md:mb-32 lg:mb-40">
        <div className="text-left md:max-w-[50%] md:text-center md:mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.4] tracking-tight mb-6 animate-fade-in">
            Award-winning photographer & director based in Seoul
          </h1>
        </div>
      </section>

      {/* 프로젝트 섹션들 */}
      <div className="responsive-container">
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
