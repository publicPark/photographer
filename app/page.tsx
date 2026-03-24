import { getAllProjects } from "@/lib/sanity";
import ProjectSection from "@/components/ProjectSection";

export default async function HomePage() {
  const projects = await getAllProjects();

  return (
    <div className="pt-24 md:pt-38">
      {/* Hero Section */}
      <section className="responsive-container mb-8 md:mb-16 lg:mb-24">
        <div className="text-left">
          <h2 className="text-xl md:text-2xl lg:text-4xl font-medium leading-[1.4] tracking-tight mb-6 animate-fade-in">
            Self-award-winning <br /> photographer & director <br /> based in
            Seoul
          </h2>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-normal leading-[1.4] tracking-tight mb-6 animate-fade-in">
            마음에 드는 것을 보면 폰을 들어 사진으로 남기는
            <br />
            아마추어 사진 작가 & 디렉터입니다.
            <br />
            아래 프로젝트를 통해 사진 작업을 확인해보세요.
          </h2>
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
