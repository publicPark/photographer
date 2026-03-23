import { getAllProjects } from "@/lib/sanity";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";

export default async function WorkPage() {
  const projects = await getAllProjects();

  return (
    <div className="pt-24 md:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* 프로젝트 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {projects.map((project) => {
            const coverImage = project.coverMedia;

            return (
              <Link
                key={project._id}
                href={`/projects/${project.slug.current}`}
                className="group"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 mb-4">
                  {coverImage && coverImage._type === "image" ? (
                    <Image
                      src={urlFor(coverImage).width(600).quality(90).url()}
                      alt={coverImage.alt || project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : coverImage && coverImage._type === "video" && coverImage.thumbnail ? (
                    <Image
                      src={urlFor(coverImage.thumbnail).width(600).quality(90).url()}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : null}
                </div>
                <h2 className="text-xl md:text-2xl font-medium mb-2 group-hover:opacity-60 transition-opacity">
                  {project.title}
                </h2>
                {project.description && (
                  <p className="text-gray-600 text-sm md:text-base line-clamp-2">
                    {project.description}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const revalidate = 600;
