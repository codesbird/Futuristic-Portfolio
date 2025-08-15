import { useState, useEffect } from "react";
import { Menu, X, Zap, Code, Cpu, Wifi } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = ['home', 'about', 'services', 'portfolio', 'experience', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: "#home", label: "Home", icon: Zap },
    { href: "#about", label: "About", icon: Code },
    { href: "#services", label: "Services", icon: Cpu },
    { href: "#portfolio", label: "Portfolio", icon: Wifi },
    { href: "#experience", label: "Experience", icon: Code },
    { href: "#contact", label: "Contact", icon: Zap },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Futuristic background pattern */}
      <div className="fixed top-0 left-0 w-full h-20 z-40 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-tech-blue/5 via-transparent to-neon-cyan/5" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-tech-light to-transparent animate-pulse" />
      </div>
      
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-dark-bg/95 backdrop-blur-xl border-b border-tech-light/20 shadow-lg shadow-tech-light/10' 
            : 'bg-glass-bg backdrop-blur-md'
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-tech-blue to-neon-cyan rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300" />
              <div className="relative text-2xl font-inter font-bold gradient-text tracking-wider">
                <span className="inline-block hover:scale-110 transition-transform duration-300">T</span>
                <span className="inline-block hover:scale-110 transition-transform duration-300 delay-75">E</span>
                <span className="inline-block hover:scale-110 transition-transform duration-300 delay-150">C</span>
                <span className="inline-block hover:scale-110 transition-transform duration-300 delay-225">H</span>
                <span className="inline-block text-neon-cyan hover:scale-110 transition-transform duration-300 delay-300">2</span>
                <span className="inline-block hover:scale-110 transition-transform duration-300 delay-375">S</span>
                <span className="inline-block hover:scale-110 transition-transform duration-300 delay-450">A</span>
                <span className="inline-block hover:scale-110 transition-transform duration-300 delay-525">I</span>
                <span className="inline-block hover:scale-110 transition-transform duration-300 delay-600">N</span>
                <span className="inline-block hover:scale-110 transition-transform duration-300 delay-675">I</span>
              </div>
            </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className={`relative px-4 py-2 rounded-full transition-all duration-300 group ${
                    isActive 
                      ? 'text-tech-light bg-tech-light/10 shadow-lg shadow-tech-light/20' 
                      : 'text-gray-300 hover:text-tech-light hover:bg-tech-light/5'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon size={16} className={`transition-all duration-300 ${
                      isActive ? 'animate-pulse' : 'group-hover:rotate-12'
                    }`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-tech-light to-transparent animate-pulse" />
                  )}
                  <div className={`absolute inset-0 rounded-full border border-tech-light/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : ''
                  }`} />
                </button>
              );
            })}
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden relative group p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-tech-blue/20 to-neon-cyan/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300" />
            <div className="relative">
              {isOpen ? <X size={24} className="transition-transform duration-300 rotate-90" /> : <Menu size={24} className="transition-transform duration-300" />}
            </div>
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="pt-4 pb-2 border-t border-tech-light/20 mt-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeSection === item.href.replace('#', '');
                return (
                  <button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'text-tech-light bg-tech-light/10 shadow-lg shadow-tech-light/20' 
                        : 'text-gray-300 hover:text-tech-light hover:bg-tech-light/5'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Icon size={18} className={`transition-all duration-300 ${
                      isActive ? 'animate-pulse' : 'hover:rotate-12'
                    }`} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && <div className="w-2 h-2 bg-tech-light rounded-full animate-pulse" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Animated border bottom */}
      <div className={`absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-tech-light/50 to-transparent transition-opacity duration-500 ${
        scrolled ? 'opacity-100' : 'opacity-30'
      }`} />
    </nav>
    </>
  );
}
