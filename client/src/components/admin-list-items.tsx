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
  Edit2,
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

  return (
    <div className="space-y-4">
      {experiences.map((experience) => (
        <Card key={experience.id} className="bg-dark-secondary border-gray-700">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: experience.color }}
                  />
                  <h3 className="text-lg font-semibold text-white">{experience.title}</h3>
                </div>
                <p className="text-gray-400 mb-1">{experience.company}</p>
                <p className="text-sm text-neon-cyan mb-2">{experience.period}</p>
                {experience.gpa && (
                  <p className="text-sm text-tech-light mb-2">CGPA: {experience.gpa}</p>
                )}
                {experience.description && experience.description.length > 0 && (
                  <ul className="text-sm text-gray-300 space-y-1 mb-2">
                    {experience.description.map((desc, i) => (
                      <li key={i}>• {desc}</li>
                    ))}
                  </ul>
                )}
                {experience.coursework && (
                  <p className="text-sm text-gray-300">{experience.coursework}</p>
                )}
              </div>
              <div className="flex space-x-2 ml-4">
                <Button
                  onClick={() => onEdit(experience)}
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Edit2 size={16} className="mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this experience?')) {
                      deleteMutation.mutate(experience.id);
                    }
                  }}
                  size="sm"
                  variant="outline"
                  disabled={deleteMutation.isPending}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Export placeholder for other components
export function SkillsList() { return <div>Skills management placeholder</div>; }
export function ServicesList() { return <div>Services management placeholder</div>; }
export function ProjectsList() { return <div>Projects management placeholder</div>; }
export function BlogPostsList() { return <div>Blog posts management placeholder</div>; }
export function ContactMessagesList() { return <div>Contact messages placeholder</div>; }