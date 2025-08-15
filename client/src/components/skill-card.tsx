import { useEffect, useState, useRef } from "react";

interface Skill {
  name: string;
  level: number;
  icon: string;
  color: string;
}

interface SkillCardProps {
  skill: Skill;
  isVisible: boolean;
  delay: number;
}

export default function SkillCard({ skill, isVisible, delay }: SkillCardProps) {
  const [progress, setProgress] = useState(0);
  const [animatedLevel, setAnimatedLevel] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setProgress(skill.level);
        
        // Animate the percentage number
        let start = 0;
        const increment = skill.level / 50; // 50 steps for smooth animation
        const counter = setInterval(() => {
          start += increment;
          if (start >= skill.level) {
            setAnimatedLevel(skill.level);
            clearInterval(counter);
          } else {
            setAnimatedLevel(Math.floor(start));
          }
        }, 40); // Update every 40ms
        
        return () => clearInterval(counter);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, skill.level, delay]);

  return (
    <div 
      ref={cardRef}
      className="glass-morphism rounded-xl p-6 group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-tech-light/20"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="text-3xl mr-4 group-hover:animate-bounce">{skill.icon}</div>
          <span className="font-semibold text-white group-hover:text-tech-light transition-colors">{skill.name}</span>
        </div>
        <span className="text-tech-light font-bold text-lg">{animatedLevel}%</span>
      </div>
      <div className="w-full bg-gray-700/50 rounded-full h-3 relative overflow-hidden">
        <div 
          className="h-3 rounded-full transition-all duration-2000 ease-out relative"
          style={{ 
            width: `${progress}%`,
            background: skill.color,
            boxShadow: progress > 0 ? `0 0 10px ${skill.color.match(/#[a-fA-F0-9]{6}/) || 'rgba(0, 170, 255, 0.5)'}` : 'none'
          }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        </div>
        {/* Background glow */}
        <div 
          className="absolute inset-0 rounded-full opacity-20"
          style={{
            background: `linear-gradient(90deg, transparent, ${skill.color.match(/#[a-fA-F0-9]{6}/) || 'rgba(0, 170, 255, 0.3)'}, transparent)`,
            width: `${progress}%`,
            transition: 'width 2s ease-out'
          }}
        />
      </div>
    </div>
  );
}
