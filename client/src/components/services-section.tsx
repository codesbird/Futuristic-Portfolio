import ServiceCard from "./service-card";
import { SERVICES } from "@/lib/constants";

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-dark-secondary relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-inter font-bold mb-6">
            Popular <span className="gradient-text">Services</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Offering innovative and user-friendly solutions tailored to enhance customer experiences 
            and meet their needs effectively.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
