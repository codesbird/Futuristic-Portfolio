import { ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/lib/constants";

export default function BlogSection() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-inter font-bold mb-6">
            Latest <span className="gradient-text">News</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Stay updated with my latest projects, insights, and achievements in the world of technology.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post, index) => (
            <div 
              key={index}
              className="glass-morphism rounded-xl overflow-hidden group hover:scale-105 transition-all duration-300"
            >
              <div className="p-6">
                <div className="text-sm text-neon-cyan mb-2">{post.date}</div>
                <h3 className="text-lg font-bold mb-3 group-hover:text-tech-light transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {post.excerpt}
                </p>
                <div className="text-xs text-gray-500 mb-4">Author: {post.author}</div>
                <button className="inline-flex items-center text-tech-light hover:text-neon-cyan transition-colors text-sm">
                  Read More <ArrowRight size={14} className="ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
