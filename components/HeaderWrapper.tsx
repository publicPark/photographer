import { client } from "@/lib/sanity";
import Header from "./Header";

interface Project {
  _id: string;
  title: string;
  slug: { current: string };
}

async function getProjects(): Promise<Project[]> {
  try {
    const data = await client.fetch(
      `*[_type == "project"] | order(orderRank) {
        _id,
        title,
        slug
      }`,
      {},
      {
        cache: "no-store",
      }
    );
    return data;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export default async function HeaderWrapper() {
  const projects = await getProjects();
  return <Header projects={projects} />;
}
