import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Experience } from "@shared/schema";

export default function ExperienceSection() {
  const { data: experiences = [], isLoading } = useQuery<Experience[]>({
    queryKey: ["/api/experiences"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/experiences");
      return await response.json();
    },
  });

  if (isLoading) {
    return (
      <section id="experience" className="py-20 bg-dark-secondary relative">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-tech-light mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading experiences...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-20 bg-dark-secondary relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-inter font-bold mb-6">
            My <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A timeline of my professional journey and key achievements in software development.
          </p>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gradient-to-b from-tech-light to-neon-cyan" />
          
          {/* Timeline items */}
          <div className="space-y-12">
            {experiences.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No experiences found. Please add some experiences in the admin panel.</p>
              </div>
            ) : (
              experiences.map((item, index) => (
                <div key={item.id} className={`relative flex items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 rounded-full border-4 border-dark-bg`} style={{ backgroundColor: item.color }} />
                  <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 1 ? 'md:pl-8' : 'md:pr-8'}`}>
                    <div className="glass-morphism rounded-xl p-6">
                      <div className="text-sm text-neon-cyan mb-2">{item.period}</div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-400 mb-4">{item.company}</p>
                      {item.gpa && (
                        <div className="text-tech-light font-semibold mb-2">CGPA: {item.gpa}</div>
                      )}
                      {item.description && item.description.length > 0 && (
                        <ul className="text-sm text-gray-300 space-y-2">
                          {item.description.map((desc, i) => (
                            <li key={i}>• {desc}</li>
                          ))}
                        </ul>
                      )}
                      {item.coursework && (
                        <p className="text-sm text-gray-300">{item.coursework}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
