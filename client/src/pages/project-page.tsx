import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { Project } from "@shared/schema";

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", id],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/projects/${id}`);
      return response.json();
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-tech-light"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Project not found</h1>
          <Link href="/">
            <Button>Back to Portfolio</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <div className="container mx-auto px-6 py-8">
        <Link href="/">
          <Button variant="outline" className="mb-8">
            <ArrowLeft className="mr-2" size={16} />
            Back to Portfolio
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-64 object-cover rounded-xl"
            />
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">{project.title}</h1>
            <p className="text-xl text-gray-300 mb-6">{project.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-tech-light/20 text-tech-light rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex space-x-4">
              {project.demoUrl && (
                <Button asChild>
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2" size={16} />
                    Live Demo
                  </a>
                </Button>
              )}
              {project.githubUrl && (
                <Button variant="outline" asChild>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2" size={16} />
                    View Code
                  </a>
                </Button>
              )}
            </div>
          </div>

          {project.content && (
            <div className="prose prose-invert max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: project.content }}
                className="text-gray-300 leading-relaxed"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}