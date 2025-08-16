import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { 
  Edit, 
  Edit2,
  Trash2, 
  Plus, 
  Star, 
  ExternalLink,
  Mail,
  Phone,
  Calendar,
  User,
  MessageSquare,
  AlertTriangle,
  UserX,
  UserCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminSkillForm from "./admin-skill-form";
import AdminServiceForm from "./admin-service-form";
import AdminProjectForm from "./admin-project-form";
import AdminBlogForm from "./admin-blog-form";
import type { Skill, Service, Project, BlogPost, ContactMessage, Experience } from "@shared/schema";

// Experience List Component
export function ExperiencesList({ experiences, onEdit, onDelete }: {
  experiences: Experience[];
  onEdit: (experience: Experience) => void;
  onDelete: (id: string) => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/experiences/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
      toast({ title: "Experience deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting experience", description: error.message, variant: "destructive" });
    },
  });

  if (experiences.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No experiences found. Create your first experience!</p>
      </div>
    );
  }

  const [deleteConfirm, setDeleteConfirm] = useState<{open: boolean, experience: Experience | null}>({
    open: false,
    experience: null
  });

  return (
    <div className="space-y-4">
      {experiences.map((experience) => (
        <Card key={experience.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-3 md:space-y-0">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: experience.color }}
                  />
                  <h3 className="text-lg font-semibold text-white break-words">{experience.title}</h3>
                </div>
                <p className="text-gray-400 mb-1 text-sm md:text-base">{experience.company}</p>
                <p className="text-sm text-cyan-400 mb-2">{experience.period}</p>
                {experience.gpa && (
                  <p className="text-sm text-blue-400 mb-2">CGPA: {experience.gpa}</p>
                )}
                {experience.description && experience.description.length > 0 && (
                  <ul className="text-sm text-gray-300 space-y-1 mb-2">
                    {experience.description.map((desc, i) => (
                      <li key={i} className="break-words">• {desc}</li>
                    ))}
                  </ul>
                )}
                {experience.coursework && (
                  <p className="text-sm text-gray-300 break-words">{experience.coursework}</p>
                )}
              </div>
              <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 md:ml-4">
                <Button
                  onClick={() => onEdit(experience)}
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 flex-1 md:flex-none"
                >
                  <Edit2 size={14} className="mr-1" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <Button
                  onClick={() => setDeleteConfirm({open: true, experience})}
                  size="sm"
                  variant="outline"
                  disabled={deleteMutation.isPending}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex-1 md:flex-none"
                >
                  <Trash2 size={14} className="mr-1" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({open, experience: null})}
        title="Delete Experience"
        description={`Are you sure you want to delete "${deleteConfirm.experience?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        icon={<Trash2 size={20} className="text-red-500" />}
        onConfirm={() => {
          if (deleteConfirm.experience) {
            deleteMutation.mutate(deleteConfirm.experience.id);
            setDeleteConfirm({open: false, experience: null});
          }
        }}
      />
    </div>
  );
}

// Skills List Component
export function SkillsList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: skills = [], isLoading } = useQuery<Skill[]>({ 
    queryKey: ["/api/skills"] 
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

  if (isLoading) {
    return <div className="text-gray-400 text-center py-8">Loading skills...</div>;
  }

  if (skills.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No skills found. Create your first skill!</p>
      </div>
    );
  }

  const [deleteConfirm, setDeleteConfirm] = useState<{open: boolean, skill: Skill | null}>({
    open: false,
    skill: null
  });

  return (
    <div className="space-y-4">
      {skills.map((skill) => (
        <Card key={skill.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{skill.icon}</span>
                  <span className="text-white font-medium text-lg break-words">{skill.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs border-blue-400 text-blue-400">
                    {skill.level}%
                  </Badge>
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: skill.color }}
                  />
                </div>
              </div>
              <div className="flex flex-row space-x-2">
                <Dialog open={showForm && editingSkill?.id === skill.id} onOpenChange={(open) => {
                  setShowForm(open);
                  if (!open) setEditingSkill(null);
                }}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setEditingSkill(skill)}
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-600 flex-1 md:flex-none"
                    >
                      <Edit2 size={14} className="mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <AdminSkillForm 
                      editingSkill={editingSkill} 
                      onClose={() => {
                        setShowForm(false);
                        setEditingSkill(null);
                      }} 
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={() => setDeleteConfirm({open: true, skill})}
                  size="sm"
                  variant="outline"
                  disabled={deleteMutation.isPending}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex-1 md:flex-none"
                >
                  <Trash2 size={14} className="mr-1" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({open, skill: null})}
        title="Delete Skill"
        description={`Are you sure you want to delete "${deleteConfirm.skill?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        icon={<Trash2 size={20} className="text-red-500" />}
        onConfirm={() => {
          if (deleteConfirm.skill) {
            deleteMutation.mutate(deleteConfirm.skill.id);
            setDeleteConfirm({open: false, skill: null});
          }
        }}
      />
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
    queryKey: ["/api/services"] 
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

  if (isLoading) {
    return <div className="text-gray-400 text-center py-8">Loading services...</div>;
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No services found. Create your first service!</p>
      </div>
    );
  }

  const [deleteConfirm, setDeleteConfirm] = useState<{open: boolean, service: Service | null}>({
    open: false,
    service: null
  });

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <Card key={service.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-3 md:space-y-0">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{service.icon}</span>
                  <h3 className="text-white font-semibold text-lg break-words">{service.title}</h3>
                </div>
                <p className="text-gray-400 text-sm mb-3 break-words">{service.description}</p>
                {service.features && service.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {service.features.slice(0, 5).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {service.features.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{service.features.length - 5} more
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex items-center space-x-4 text-sm text-green-400">
                  <span className="font-medium">₹{service.price}</span>
                </div>
              </div>
              <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 md:ml-4">
                <Dialog open={showForm && editingService?.id === service.id} onOpenChange={(open) => {
                  setShowForm(open);
                  if (!open) setEditingService(null);
                }}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setEditingService(service)}
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-600 flex-1 md:flex-none"
                    >
                      <Edit2 size={14} className="mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <AdminServiceForm 
                      editingService={editingService} 
                      onClose={() => {
                        setShowForm(false);
                        setEditingService(null);
                      }} 
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={() => setDeleteConfirm({open: true, service})}
                  size="sm"
                  variant="outline"
                  disabled={deleteMutation.isPending}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex-1 md:flex-none"
                >
                  <Trash2 size={14} className="mr-1" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({open, service: null})}
        title="Delete Service"
        description={`Are you sure you want to delete "${deleteConfirm.service?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        icon={<Trash2 size={20} className="text-red-500" />}
        onConfirm={() => {
          if (deleteConfirm.service) {
            deleteMutation.mutate(deleteConfirm.service.id);
            setDeleteConfirm({open: false, service: null});
          }
        }}
      />
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
    queryKey: ["/api/projects"] 
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

  if (isLoading) {
    return <div className="text-gray-400 text-center py-8">Loading projects...</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No projects found. Create your first project!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id} className="bg-gray-700 border-gray-600">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.technologies.slice(0, 4).map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-blue-400 text-blue-400">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 4} more
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" 
                       className="hover:text-white">
                      GitHub
                    </a>
                  )}
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" 
                       className="hover:text-white">
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Dialog open={showForm && editingProject?.id === project.id} onOpenChange={(open) => {
                  setShowForm(open);
                  if (!open) setEditingProject(null);
                }}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setEditingProject(project)}
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-600"
                    >
                      <Edit2 size={14} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <AdminProjectForm 
                      editingProject={editingProject} 
                      onClose={() => {
                        setShowForm(false);
                        setEditingProject(null);
                      }} 
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this project?')) {
                      deleteMutation.mutate(project.id);
                    }
                  }}
                  size="sm"
                  variant="outline"
                  disabled={deleteMutation.isPending}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Blog Posts List Component
export function BlogPostsList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({ 
    queryKey: ["/api/blog-posts"], 
    queryFn: () => fetch("/api/blog-posts?published=false").then(res => res.json())
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

  if (isLoading) {
    return <div className="text-gray-400 text-center py-8">Loading blog posts...</div>;
  }

  if (blogPosts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No blog posts found. Create your first blog post!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {blogPosts.map((post) => (
        <Card key={post.id} className="bg-gray-700 border-gray-600">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{post.excerpt}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                  </span>
                  <Badge variant={post.published ? "default" : "secondary"} className="text-xs">
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
              <div className="flex space-x-2">
                <Dialog open={showForm && editingPost?.id === post.id} onOpenChange={(open) => {
                  setShowForm(open);
                  if (!open) setEditingPost(null);
                }}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setEditingPost(post)}
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-600"
                    >
                      <Edit2 size={14} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <AdminBlogForm 
                      editingPost={editingPost} 
                      onClose={() => {
                        setShowForm(false);
                        setEditingPost(null);
                      }} 
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this blog post?')) {
                      deleteMutation.mutate(post.id);
                    }
                  }}
                  size="sm"
                  variant="outline"
                  disabled={deleteMutation.isPending}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Newsletter List Component
export function AdminNewsletterList() {
  const { data: subscribers, isLoading } = useQuery({
    queryKey: ["/api/newsletter/subscribers"],
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/newsletter/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/newsletter/subscribers"] });
      toast({
        title: "Success",
        description: "Newsletter subscriber deleted successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await apiRequest("PUT", `/api/newsletter/${id}`, { isActive });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/newsletter/subscribers"] });
      toast({
        title: "Success",
        description: "Subscriber status updated successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{open: boolean, subscriber: any | null}>({
    open: false,
    subscriber: null
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading newsletter subscribers...</div>
      </div>
    );
  }

  if (!subscribers || subscribers.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No Newsletter Subscribers</h3>
        <p className="text-gray-400">Newsletter subscribers will appear here once users subscribe.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subscribers.map((subscriber: any) => (
        <Card key={subscriber.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="text-orange-400" size={20} />
                  <span className="text-white font-medium text-lg break-words">{subscriber.email}</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-4 text-sm text-gray-400">
                  <span>Subscribed: {format(new Date(subscriber.subscribedAt), "MMM dd, yyyy")}</span>
                  {subscriber.unsubscribedAt && (
                    <span>Unsubscribed: {format(new Date(subscriber.unsubscribedAt), "MMM dd, yyyy")}</span>
                  )}
                </div>
                <div className="mt-2">
                  <Badge 
                    variant={subscriber.isActive ? "default" : "secondary"}
                    className={subscriber.isActive ? "bg-green-600" : "bg-gray-600"}
                  >
                    {subscriber.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 md:ml-4">
                <Button
                  onClick={() => toggleActiveMutation.mutate({ 
                    id: subscriber.id, 
                    isActive: !subscriber.isActive 
                  })}
                  size="sm"
                  variant="outline"
                  disabled={toggleActiveMutation.isPending}
                  className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white flex-1 md:flex-none"
                >
                  {subscriber.isActive ? (
                    <>
                      <UserX size={14} className="mr-1" />
                      <span className="hidden sm:inline">Deactivate</span>
                    </>
                  ) : (
                    <>
                      <UserCheck size={14} className="mr-1" />
                      <span className="hidden sm:inline">Activate</span>
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setDeleteConfirm({open: true, subscriber})}
                  size="sm"
                  variant="outline"
                  disabled={deleteMutation.isPending}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex-1 md:flex-none"
                >
                  <Trash2 size={14} className="mr-1" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({open, subscriber: null})}
        title="Delete Newsletter Subscriber"
        description={`Are you sure you want to delete "${deleteConfirm.subscriber?.email}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        icon={<Trash2 size={20} className="text-red-500" />}
        onConfirm={() => {
          if (deleteConfirm.subscriber) {
            deleteMutation.mutate(deleteConfirm.subscriber.id);
            setDeleteConfirm({open: false, subscriber: null});
          }
        }}
      />
    </div>
  );
}

// Contact Messages List Component
export function ContactMessagesList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery<ContactMessage[]>({ 
    queryKey: ["/api/contact-messages"] 
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/contact-messages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
      toast({ title: "Message deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting message", description: error.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return <div className="text-gray-400 text-center py-8">Loading messages...</div>;
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No contact messages found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card key={message.id} className="bg-gray-700 border-gray-600">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">{message.subject}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                  <span className="flex items-center">
                    <User size={12} className="mr-1" />
                    {message.name}
                  </span>
                  <span className="flex items-center">
                    <Mail size={12} className="mr-1" />
                    {message.email}
                  </span>
                  <span className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {format(new Date(message.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{message.message}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this message?')) {
                      deleteMutation.mutate(message.id);
                    }
                  }}
                  size="sm"
                  variant="outline"
                  disabled={deleteMutation.isPending}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}