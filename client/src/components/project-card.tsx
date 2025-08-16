import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/project/${project.id}`}>
      <div 
        className="glass-morphism rounded-xl overflow-hidden group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
          boxShadow: isHovered ? '0 15px 30px rgba(0, 255, 255, 0.15)' : 'none'
        }}
      >
        <div className={`relative h-48 bg-gradient-to-br from-${project.gradientFrom} to-dark-secondary overflow-hidden`}>
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent" />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 group-hover:text-tech-light transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded"
              >
                {tech}
              </span>
            ))}
          </div>
          <button className="inline-flex items-center text-tech-light hover:text-neon-cyan transition-colors">
            View Project <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </Link>
  );
}
