import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import emailjs from '@emailjs/browser';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const submitContactForm = useMutation({
    mutationFn: async (data: ContactForm) => {
      // Save to database
      const dbResponse = await apiRequest('POST', '/api/contact', data);
      
      // Send email notification using EmailJS
      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        to_name: 'Monu Saini',
      };
      
      try {
        // Get EmailJS credentials from server-side endpoint
        const configResponse = await fetch('/api/email-config');
        const config = await configResponse.json();
        
        await emailjs.send(
          config.serviceId,
          config.templateId,
          templateParams,
          config.publicKey
        );
      } catch (emailError) {
        console.warn('Email notification failed:', emailError);
        // Don't fail the entire operation if email fails
      }
      
      return dbResponse;
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContactForm.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-20 bg-dark-secondary relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-inter font-bold mb-6">
            Let's <span className="gradient-text">Talk</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Feel free to reach out and discuss how we can collaborate to bring your ideas to life 
            with innovative and tailored solutions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-bold mb-8">Get In Touch</h3>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-tech-light/20 rounded-lg flex items-center justify-center mr-4">
                  <Mail className="text-tech-light" size={20} />
                </div>
                <div>
                  <div className="font-semibold">Email</div>
                  <div className="text-gray-400">monusainideveloper@gmail.com</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-neon-cyan/20 rounded-lg flex items-center justify-center mr-4">
                  <Phone className="text-neon-cyan" size={20} />
                </div>
                <div>
                  <div className="font-semibold">Phone</div>
                  <div className="text-gray-400">+91 8696807790</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-neon-pink/20 rounded-lg flex items-center justify-center mr-4">
                  <MapPin className="text-neon-pink" size={20} />
                </div>
                <div>
                  <div className="font-semibold">Location</div>
                  <div className="text-gray-400">Chhatarpur, New Delhi</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                  <Linkedin className="text-blue-400" size={20} />
                </div>
                <div>
                  <div className="font-semibold">LinkedIn</div>
                  <div className="text-gray-400">linkedin.com/in/monupydev</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="glass-morphism rounded-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Your Name" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-bg/50 border border-gray-600 rounded-lg focus:border-tech-light focus:outline-none transition-colors text-white placeholder-gray-400" 
                />
              </div>
              
              <div>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Your Email" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-bg/50 border border-gray-600 rounded-lg focus:border-tech-light focus:outline-none transition-colors text-white placeholder-gray-400" 
                />
              </div>
              
              <div>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="Phone" 
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark-bg/50 border border-gray-600 rounded-lg focus:border-tech-light focus:outline-none transition-colors text-white placeholder-gray-400" 
                />
              </div>
              
              <div>
                <input 
                  type="text" 
                  name="subject"
                  placeholder="Subject" 
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-bg/50 border border-gray-600 rounded-lg focus:border-tech-light focus:outline-none transition-colors text-white placeholder-gray-400" 
                />
              </div>
              
              <div>
                <textarea 
                  rows={4} 
                  name="message"
                  placeholder="Message" 
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-bg/50 border border-gray-600 rounded-lg focus:border-tech-light focus:outline-none transition-colors resize-none text-white placeholder-gray-400"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={submitContactForm.isPending}
                className="w-full bg-gradient-to-r from-tech-blue to-tech-light px-8 py-4 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-tech-light/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitContactForm.isPending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
