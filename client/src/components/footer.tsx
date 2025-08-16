import { Linkedin, Github, Twitter, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Subscribed!",
          description: "You've been added to our newsletter.",
        });
        setEmail("");
      } else {
        toast({
          title: "Subscription failed",
          description: data.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="py-12 bg-dark-bg border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="text-2xl font-inter font-bold gradient-text mb-4">TECH2SAINI</div>
            <p className="text-gray-400 max-w-md mb-6">
              Explore innovative solutions, personalized services, and projects tailored to your needs. 
              Let's create something exceptional together!
            </p>
            
            {/* Newsletter Subscription */}
            <div className="max-w-md">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Mail size={18} className="text-tech-light" />
                Newsletter
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                Get updates on new projects, blog posts, and tech insights.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-tech-light"
                  required
                />
                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="bg-tech-light hover:bg-tech-light/80 text-white px-4 py-2"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <ArrowRight size={16} />
                  )}
                </Button>
              </form>
            </div>
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
