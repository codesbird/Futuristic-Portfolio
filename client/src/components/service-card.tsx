import { useState } from "react";

interface Service {
  title: string;
  description: string;
  price: string;
  features: string[];
  icon: string;
}

interface ServiceCardProps {
  service: Service;
  index: number;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="glass-morphism rounded-xl p-8 group transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered ? '0 20px 40px rgba(0, 170, 255, 0.2)' : 'none'
      }}
    >
      <div className={`text-4xl mb-4 transition-all duration-300 ${isHovered ? 'animate-bounce' : ''}`}>
        {service.icon}
      </div>
      <h3 className="text-xl font-bold mb-4 group-hover:text-tech-light transition-colors">
        {service.title}
      </h3>
      <p className="text-gray-400 mb-6">
        {service.description}
      </p>
      <div className="text-2xl font-bold text-neon-cyan mb-4">{service.price}</div>
      <ul className="text-sm text-gray-400 space-y-2">
        {service.features.map((feature, index) => (
          <li key={index}>• {feature}</li>
        ))}
      </ul>
    </div>
  );
}
