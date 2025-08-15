import { useQuery } from "@tanstack/react-query";
import ServiceCard from "./service-card";
import type { Service } from "@shared/schema";

export default function ServicesSection() {
  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  if (isLoading) {
    return (
      <section id="services" className="py-20 bg-dark-secondary relative">
        <div className="container mx-auto px-6 text-center">
          <div className="text-white">Loading services...</div>
        </div>
      </section>
    );
  }

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
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
