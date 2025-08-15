import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Edit, 
  Trash2, 
  Plus, 
  Star, 
  ExternalLink,
  Mail,
  Phone,
  Calendar,
  User,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminSkillForm from "./admin-skill-form";
import AdminServiceForm from "./admin-service-form";
import AdminProjectForm from "./admin-project-form";
import AdminBlogForm from "./admin-blog-form";
import type { Skill, Service, Project, BlogPost, ContactMessage } from "@shared/schema";

// Skills List Component
export function SkillsList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: skills = [], isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/skills/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({ title: "Skill deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting skill", description: error.message, variant: "destructive" });
    },
  });

  if (isLoading) return <div className="text-white">Loading skills...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Skills Management</h3>
        <Dialog open={showForm && !editingSkill} onOpenChange={() => { setShowForm(!showForm); setEditingSkill(null); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" size={16} />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AdminSkillForm onClose={() => setShowForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill: Skill) => (
          <Card key={skill.id} className="bg-dark-secondary border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{skill.icon}</span>
                  <span className="text-white font-medium">{skill.name}</span>
                </div>
                <div className="flex space-x-1">
                  <Dialog open={editingSkill?.id === skill.id} onOpenChange={(open) => !open && setEditingSkill(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSkill(skill)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Edit size={12} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <AdminSkillForm 
                        skill={editingSkill}
                        onClose={() => setEditingSkill(null)} 
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(skill.id)}
                    disabled={deleteMutation.isPending}
                    className="border-red-600 text-red-400 hover:bg-red-900"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Level: {skill.level}%</span>
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${skill.level}%`,
                      backgroundColor: skill.color 
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Services List Component
export function ServicesList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting service", description: error.message, variant: "destructive" });
    },
  });

  if (isLoading) return <div className="text-white">Loading services...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Services Management</h3>
        <Dialog open={showForm && !editingService} onOpenChange={() => { setShowForm(!showForm); setEditingService(null); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" size={16} />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <AdminServiceForm onClose={() => setShowForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {services.map((service: Service) => (
          <Card key={service.id} className="bg-dark-secondary border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{service.icon}</span>
                  <div>
                    <h4 className="text-white font-semibold">{service.title}</h4>
                    <p className="text-tech-light font-bold">{service.price}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Dialog open={editingService?.id === service.id} onOpenChange={(open) => !open && setEditingService(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingService(service)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Edit size={12} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <AdminServiceForm 
                        service={editingService}
                        onClose={() => setEditingService(null)} 
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(service.id)}
                    disabled={deleteMutation.isPending}
                    className="border-red-600 text-red-400 hover:bg-red-900"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">{service.description}</p>
              <div className="space-y-2">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Star size={14} className="text-tech-light" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Projects List Component
export function ProjectsList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting project", description: error.message, variant: "destructive" });
    },
  });

  if (isLoading) return <div className="text-white">Loading projects...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Projects Management</h3>
        <Dialog open={showForm && !editingProject} onOpenChange={() => { setShowForm(!showForm); setEditingProject(null); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" size={16} />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <AdminProjectForm onClose={() => setShowForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project: Project) => (
          <Card key={project.id} className="bg-dark-secondary border-gray-700">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-white font-semibold text-lg">{project.title}</h4>
                  {project.featured && (
                    <Badge className="mt-1 bg-tech-light text-dark-bg">Featured</Badge>
                  )}
                </div>
                <div className="flex space-x-1">
                  <Dialog open={editingProject?.id === project.id} onOpenChange={(open) => !open && setEditingProject(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingProject(project)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Edit size={12} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <AdminProjectForm 
                        project={editingProject}
                        onClose={() => setEditingProject(null)} 
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(project.id)}
                    disabled={deleteMutation.isPending}
                    className="border-red-600 text-red-400 hover:bg-red-900"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
              
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              
              <p className="text-gray-300 text-sm mb-4">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                    {tech}
                  </Badge>
                ))}
              </div>
              
              <div className="flex space-x-2">
                {project.demoUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={14} className="mr-1" />
                      Demo
                    </a>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={14} className="mr-1" />
                      GitHub
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Blog Posts List Component
export function BlogPostsList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/blog-posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({ title: "Blog post deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting blog post", description: error.message, variant: "destructive" });
    },
  });

  if (isLoading) return <div className="text-white">Loading blog posts...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Blog Posts Management</h3>
        <Dialog open={showForm && !editingPost} onOpenChange={() => { setShowForm(!showForm); setEditingPost(null); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" size={16} />
              Add Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <AdminBlogForm onClose={() => setShowForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {posts.map((post: BlogPost) => (
          <Card key={post.id} className="bg-dark-secondary border-gray-700">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-white font-semibold text-lg">{post.title}</h4>
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{post.excerpt}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>By {post.author}</span>
                    <span>{format(new Date(post.createdAt), "MMM dd, yyyy")}</span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Dialog open={editingPost?.id === post.id} onOpenChange={(open) => !open && setEditingPost(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPost(post)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Edit size={12} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <AdminBlogForm 
                        blogPost={editingPost}
                        onClose={() => setEditingPost(null)} 
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(post.id)}
                    disabled={deleteMutation.isPending}
                    className="border-red-600 text-red-400 hover:bg-red-900"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Contact Messages List Component
export function ContactMessagesList() {
  const { data: messages = [], isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact-messages"],
  });

  if (isLoading) return <div className="text-white">Loading contact messages...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Recent Contact Messages</h3>
      
      {messages.length === 0 ? (
        <Card className="bg-dark-secondary border-gray-700">
          <CardContent className="p-6 text-center">
            <MessageSquare className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-400">No contact messages yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id} className="bg-dark-secondary border-gray-700">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-white font-semibold">{message.subject}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                      <div className="flex items-center space-x-1">
                        <User size={14} />
                        <span>{message.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail size={14} />
                        <span>{message.email}</span>
                      </div>
                      {message.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone size={14} />
                          <span>{message.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-400">
                    <Calendar size={14} />
                    <span>{format(new Date(message.createdAt), "MMM dd, yyyy HH:mm")}</span>
                  </div>
                </div>
                
                <Separator className="my-4 bg-gray-700" />
                
                <p className="text-gray-300 whitespace-pre-wrap">{message.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}