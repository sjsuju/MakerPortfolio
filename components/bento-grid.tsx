import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/data";

export function BentoGrid() {
  const featured = projects.filter((project) => project.featured);

  return (
    <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-4">
      {featured.map((project, index) => (
        <ProjectCard key={project.title} project={project} large={index === 0} />
      ))}
    </div>
  );
}
