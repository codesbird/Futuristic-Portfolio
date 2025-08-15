import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        setProgress(skill.level);
      }, delay);
    }
  }, [isVisible, skill.level, delay]);

  return (
    <div className="glass-morphism rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="text-2xl mr-3">{skill.icon}</div>
          <span className="font-semibold">{skill.name}</span>
        </div>
        <span className="text-tech-light font-bold">{skill.level}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className="h-2 rounded-full transition-all duration-2000 ease-out"
          style={{ 
            width: `${progress}%`,
            background: skill.color
          }}
        />
      </div>
    </div>
  );
}
