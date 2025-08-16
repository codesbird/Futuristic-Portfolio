import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sendNewsletterEmail } from '../../../server/email';

// This component handles automatic newsletter sending when blog posts are published
export function NewsletterAutomation() {
  const { data: blogPosts = [] } = useQuery({
    queryKey: ["/api/blog-posts"],
    queryFn: async () => {
      const response = await fetch("/api/blog-posts?published=false");
      return await response.json();
    },
  });

  const { data: subscribers = [] } = useQuery({
    queryKey: ["/api/newsletter/subscribers"],
  });

  useEffect(() => {
    // Listen for newly published blog posts
    const checkForNewPosts = () => {
      blogPosts.forEach(post => {
        if (post.published && !post.newsletterSent) {
          // Send newsletter to all subscribers
          subscribers.forEach(subscriber => {
            sendNewsletterEmail(
              subscriber.email, 
              `New Blog Post: ${post.title}`,
              `
                <h2>${post.title}</h2>
                <p>${post.excerpt}</p>
                <p><a href="${window.location.origin}/blog/${post.slug}">Read more...</a></p>
              `
            );
          });

          // Mark as newsletter sent (you'd need to add this field to the schema)
          // updateBlogPost(post.id, { newsletterSent: true });
        }
      });
    };

    checkForNewPosts();
  }, [blogPosts, subscribers]);

  return null; // This is a background component
}

export default NewsletterAutomation;