import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProjectFormData {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  gradientFrom: string;
  gradientTo: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  content?: string;
}

interface AdminProjectFormProps {
  onClose: () => void;
}

export default function AdminProjectForm({ onClose }: AdminProjectFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    image: "",
    technologies: [],
    gradientFrom: "#3b82f6",
    gradientTo: "#1e293b",
    demoUrl: "",
    githubUrl: "",
    featured: false,
    order: 1,
    content: "",
  });

  const [techInput, setTechInput] = useState("");

  const createProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const response = await apiRequest("POST", "/api/projects", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: "Project added successfully!",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProjectMutation.mutate(formData);
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      });
      setTechInput("");
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech),
    });
  };

  return (
    <Card className="bg-dark-secondary border-gray-700 max-w-2xl">
      <CardHeader>
        <CardTitle className="text-white">Add New Project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-white">Project Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-dark-bg border-gray-600 text-white"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="order" className="text-white">Display Order</Label>
              <Input
                id="order"
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                className="bg-dark-bg border-gray-600 text-white"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-dark-bg border-gray-600 text-white"
              rows={3}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="image" className="text-white">Image URL</Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="bg-dark-bg border-gray-600 text-white"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>
          
          <div>
            <Label className="text-white">Technologies</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                className="bg-dark-bg border-gray-600 text-white"
                placeholder="Add technology (e.g., React)"
              />
              <Button type="button" onClick={addTechnology} className="px-4">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-tech-light/20 text-tech-light rounded-full text-sm flex items-center"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    className="ml-2 text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gradientFrom" className="text-white">Gradient Start Color</Label>
              <Input
                id="gradientFrom"
                type="color"
                value={formData.gradientFrom}
                onChange={(e) => setFormData({ ...formData, gradientFrom: e.target.value })}
                className="bg-dark-bg border-gray-600 text-white h-12"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="gradientTo" className="text-white">Gradient End Color</Label>
              <Input
                id="gradientTo"
                type="color"
                value={formData.gradientTo}
                onChange={(e) => setFormData({ ...formData, gradientTo: e.target.value })}
                className="bg-dark-bg border-gray-600 text-white h-12"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="demoUrl" className="text-white">Demo URL (Optional)</Label>
              <Input
                id="demoUrl"
                type="url"
                value={formData.demoUrl}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                className="bg-dark-bg border-gray-600 text-white"
                placeholder="https://demo.example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="githubUrl" className="text-white">GitHub URL (Optional)</Label>
              <Input
                id="githubUrl"
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="bg-dark-bg border-gray-600 text-white"
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="content" className="text-white">Detailed Content (Optional)</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="bg-dark-bg border-gray-600 text-white"
              rows={4}
              placeholder="Detailed project description for the project page..."
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
            />
            <Label htmlFor="featured" className="text-white">
              Featured Project
            </Label>
          </div>

          <div className="flex space-x-2">
            <Button 
              type="submit" 
              disabled={createProjectMutation.isPending}
              className="bg-gradient-to-r from-tech-blue to-tech-light"
            >
              {createProjectMutation.isPending ? "Adding..." : "Add Project"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}