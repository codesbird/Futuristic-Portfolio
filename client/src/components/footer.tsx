import { Linkedin, Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 bg-dark-bg border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="text-2xl font-inter font-bold gradient-text mb-4">TECH2SAINI</div>
            <p className="text-gray-400 max-w-md">
              Explore innovative solutions, personalized services, and projects tailored to your needs. 
              Let's create something exceptional together!
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <div className="space-y-2">
              {['Home', 'About', 'Services', 'Portfolio', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                  className="block text-gray-400 hover:text-tech-light transition-colors text-left"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <div className="space-y-2">
              {['Software Development', 'Web Development', 'Data Analysis', 'Automation', 'AI/ML Solutions'].map((service) => (
                <div key={service} className="text-gray-400">{service}</div>
              ))}
            </div>
          </div>
        </div>
        
        <hr className="border-gray-800 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2024 Monu Saini. All rights reserved.
          </div>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a 
              href="https://linkedin.com/in/monupydev" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-tech-light/20 rounded-full flex items-center justify-center text-tech-light hover:bg-tech-light hover:text-white transition-all duration-300"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 bg-neon-cyan/20 rounded-full flex items-center justify-center text-neon-cyan hover:bg-neon-cyan hover:text-dark-bg transition-all duration-300"
            >
              <Github size={20} />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 bg-neon-pink/20 rounded-full flex items-center justify-center text-neon-pink hover:bg-neon-pink hover:text-white transition-all duration-300"
            >
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
