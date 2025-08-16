import { useEffect, useState } from "react";
import { ChevronDown, Zap, Brain, Sparkles } from "lucide-react";
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
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{marginTop: '80px'}}>
      {/* Futuristic grid background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-gray-900 to-dark-secondary" />
      <div className="absolute inset-0 opacity-20">
        <div className="grid-pattern" />
      </div>
      
      {/* Floating AI elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-16 h-16 bg-tech-light/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-32 w-12 h-12 bg-neon-cyan/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-32 left-40 w-8 h-8 bg-neon-pink/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }} />
        <div className="absolute top-60 left-1/2 w-20 h-20 bg-tech-light/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-10 w-4 h-4 border border-tech-light/30 rotate-45 animate-spin" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-1/4 right-20 w-6 h-6 border border-neon-cyan/30 rotate-12 animate-bounce" style={{ animationDelay: '3s' }} />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-left lg:text-left animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-tech-light" />
              <h1 className="text-lg md:text-xl text-gray-300">AI-Powered Developer</h1>
            </div>
            <h2 className="text-4xl md:text-6xl font-inter font-bold mb-6 gradient-text">
              Monu Saini
            </h2>
            <div className="text-xl md:text-2xl text-gray-300 mb-8 min-h-[60px]">
              <TypingAnimation />
            </div>
            <p className="text-lg max-w-lg text-gray-400 mb-8 leading-relaxed">
              Leveraging cutting-edge AI and automation to deliver next-generation solutions. 
              2+ years of experience building intelligent systems that transform businesses.
            </p>
            
            {/* Features */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 glass-morphism px-4 py-2 rounded-full">
                <Zap className="w-4 h-4 text-tech-light" />
                <span className="text-sm">AI Integration</span>
              </div>
              <div className="flex items-center gap-2 glass-morphism px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-neon-cyan" />
                <span className="text-sm">Automation</span>
              </div>
              <div className="flex items-center gap-2 glass-morphism px-4 py-2 rounded-full">
                <Brain className="w-4 h-4 text-neon-pink" />
                <span className="text-sm">ML Solutions</span>
              </div>
            </div>
          
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-tech-blue to-tech-light px-8 py-4 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-tech-light/50 transform hover:scale-105 transition-all duration-300"
              >
                View AI Projects
              </button>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="glass-morphism px-8 py-4 rounded-full text-white font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Start Project
              </button>
            </div>
          </div>
          
          {/* Right side - AI Visual */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="relative max-w-lg mx-auto">
              {/* AI Agent with generated image */}
              <div className="aspect-video bg-gradient-to-br from-tech-light/20 to-neon-cyan/20 rounded-2xl relative overflow-hidden">
                <img 
                  src="/attached_assets/generated_images/Futuristic_AI_agent_visual_572bc57b.png" 
                  alt="Futuristic AI Agent" 
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-lg font-semibold text-white">AI-Powered Development</div>
                  <div className="text-sm text-gray-300">Next-Gen Solutions</div>
                </div>
                
                {/* Floating data points */}
                <div className="absolute top-4 left-4 w-3 h-3 bg-tech-light rounded-full animate-ping" />
                <div className="absolute top-8 right-8 w-2 h-2 bg-neon-cyan rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-6 left-8 w-4 h-4 bg-neon-pink rounded-full animate-ping" style={{ animationDelay: '2s' }} />
              </div>
              
              {/* Stats overlay */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 grid grid-cols-3 gap-4 w-full max-w-sm">
                <div className="glass-morphism rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-tech-light">
                    {Math.ceil(counters.projects)}+
                  </div>
                  <div className="text-xs text-gray-400">AI Projects</div>
                </div>
                <div className="glass-morphism rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-neon-cyan">
                    {Math.ceil(counters.experience)}+
                  </div>
                  <div className="text-xs text-gray-400">Years Exp</div>
                </div>
                <div className="glass-morphism rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-neon-pink">
                    {Math.ceil(counters.satisfaction)}%
                  </div>
                  <div className="text-xs text-gray-400">Success</div>
                </div>
              </div>
            </div>
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
