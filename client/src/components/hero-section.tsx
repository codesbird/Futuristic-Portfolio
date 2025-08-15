import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import TypingAnimation from "./typing-animation";

export default function HeroSection() {
  const [counters, setCounters] = useState({ projects: 0, experience: 0, satisfaction: 0 });

  useEffect(() => {
    const targets = { projects: 10, experience: 2, satisfaction: 100 };
    const increments = { 
      projects: targets.projects / 100, 
      experience: targets.experience / 100, 
      satisfaction: targets.satisfaction / 100 
    };

    const timer = setInterval(() => {
      setCounters(prev => {
        const newCounters = { ...prev };
        let allComplete = true;

        Object.keys(targets).forEach(key => {
          const targetKey = key as keyof typeof targets;
          if (newCounters[targetKey] < targets[targetKey]) {
            newCounters[targetKey] = Math.min(
              newCounters[targetKey] + increments[targetKey],
              targets[targetKey]
            );
            allComplete = false;
          }
        });

        if (allComplete) {
          clearInterval(timer);
        }

        return newCounters;
      });
    }, 20);

    return () => clearInterval(timer);
  }, []);

  const scrollToNext = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with parallax effect */}
      <div 
        className="absolute inset-0 parallax opacity-30"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        <div className="particle w-2 h-2 top-20 left-20 animate-float" style={{ animationDelay: '0s' }} />
        <div className="particle w-3 h-3 top-40 right-32 animate-float" style={{ animationDelay: '2s' }} />
        <div className="particle w-1 h-1 bottom-32 left-40 animate-float" style={{ animationDelay: '4s' }} />
        <div className="particle w-2 h-2 top-60 left-1/2 animate-float" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="animate-fade-in">
          <h1 className="text-lg md:text-xl text-gray-300 mb-4">Hello, I am</h1>
          <h2 className="text-4xl md:text-7xl font-inter font-bold mb-6 gradient-text">
            Monu Saini
          </h2>
          <div className="text-xl md:text-2xl text-gray-300 mb-8 min-h-[60px]">
            <TypingAnimation />
          </div>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-400 mb-12 leading-relaxed">
            Python Developer with 2+ years of freelancing experience delivering automation tools, 
            data-driven solutions, and web applications for clients worldwide.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
            <div className="glass-morphism rounded-lg p-6">
              <div className="text-3xl font-bold text-tech-light">
                {Math.ceil(counters.projects)}+
              </div>
              <div className="text-sm text-gray-400">Complete Projects</div>
            </div>
            <div className="glass-morphism rounded-lg p-6">
              <div className="text-3xl font-bold text-neon-cyan">
                {Math.ceil(counters.experience)}+
              </div>
              <div className="text-sm text-gray-400">Years Experience</div>
            </div>
            <div className="glass-morphism rounded-lg p-6 col-span-2 md:col-span-1">
              <div className="text-3xl font-bold text-neon-pink">
                {Math.ceil(counters.satisfaction)}%
              </div>
              <div className="text-sm text-gray-400">Client Satisfaction</div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-tech-blue to-tech-light px-8 py-4 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-tech-light/50 transform hover:scale-105 transition-all duration-300"
            >
              View My Work
            </button>
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="glass-morphism px-8 py-4 rounded-full text-white font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Get In Touch
            </button>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <button 
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-tech-light"
      >
        <ChevronDown size={24} />
      </button>
    </section>
  );
}
