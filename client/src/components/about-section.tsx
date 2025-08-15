import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SkillCard from "./skill-card";
import { apiRequest } from "@/lib/queryClient";
import { Skill } from "@shared/schema";

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  const { data: skills = [], isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/skills");
      return response.json();
    },
  });
  
  const mainSkills = skills.filter(skill => !skill.isAdditional);
  const additionalSkills = skills.filter(skill => skill.isAdditional);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-20 relative">
      {/* Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-inter font-bold mb-6">
            My <span className="gradient-text">Advantage</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Dedicated and skilled in Python, machine learning, and web development, 
            I combine analytical thinking with creative solutions to deliver impactful results.
          </p>
        </div>
        
        {/* Skills Grid */}
        {isLoading ? (
          <div className="text-center text-gray-400 mb-16">
            Loading skills...
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {mainSkills.map((skill, index) => (
                <SkillCard 
                  key={skill.id}
                  skill={{
                    name: skill.name,
                    level: skill.level,
                    icon: skill.icon,
                    color: skill.color
                  }}
                  isVisible={isVisible}
                  delay={index * 100}
                />
              ))}
            </div>
            
            {/* Additional Skills */}
            {additionalSkills.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {additionalSkills.map((skill) => (
                  <div key={skill.id} className="glass-morphism rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">{skill.icon}</div>
                    <div className="text-sm font-semibold">{skill.name} ({skill.level}%)</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
