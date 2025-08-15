import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { BlogPost } from "@shared/schema";

export default function BlogPage() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ["/api/blog-posts", slug],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/blog-posts/${slug}`);
      return response.json();
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-tech-light"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Blog post not found</h1>
          <Link href="/">
            <Button>Back to Portfolio</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <div className="container mx-auto px-6 py-8">
        <Link href="/">
          <Button variant="outline" className="mb-8">
            <ArrowLeft className="mr-2" size={16} />
            Back to Portfolio
          </Button>
        </Link>

        <article className="max-w-4xl mx-auto">
          {post.featuredImage && (
            <div className="mb-8">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>
          )}

          <header className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">{post.title}</h1>
            
            <div className="flex items-center space-x-6 text-gray-400 mb-6">
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-xl text-gray-300 italic">{post.excerpt}</p>
          </header>

          <div className="prose prose-invert max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="text-gray-300 leading-relaxed"
            />
          </div>
        </article>
      </div>
    </div>
  );
}