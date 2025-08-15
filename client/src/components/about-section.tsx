import { useEffect, useRef, useState } from "react";
import SkillCard from "./skill-card";
import { SKILLS, ADDITIONAL_SKILLS } from "@/lib/constants";

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {SKILLS.map((skill, index) => (
            <SkillCard 
              key={skill.name}
              skill={skill}
              isVisible={isVisible}
              delay={index * 100}
            />
          ))}
        </div>
        
        {/* Additional Skills */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ADDITIONAL_SKILLS.map((skill) => (
            <div key={skill.name} className="glass-morphism rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">{skill.icon}</div>
              <div className="text-sm font-semibold">{skill.name} ({skill.level}%)</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
