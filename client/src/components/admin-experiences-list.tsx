import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminExperienceForm from "./admin-experience-form";
import type { Experience } from "@shared/schema";

export function AdminExperiencesList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: experiences = [], isLoading } = useQuery<Experience[]>({ 
    queryKey: ["/api/experiences"] 
  });

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

  if (isLoading) {
    return <div className="text-gray-400 text-center py-8">Loading experiences...</div>;
  }

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
                <Dialog open={showForm && editingExperience?.id === experience.id} onOpenChange={(open) => {
                  setShowForm(open);
                  if (!open) setEditingExperience(null);
                }}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setEditingExperience(experience);
                        setShowForm(true);
                      }}
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 flex-1 md:flex-none"
                    >
                      <Edit2 size={14} className="mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <AdminExperienceForm 
                      editingExperience={editingExperience} 
                      onClose={() => {
                        setShowForm(false);
                        setEditingExperience(null);
                      }} 
                    />
                  </DialogContent>
                </Dialog>
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