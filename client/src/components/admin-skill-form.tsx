import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SkillFormData {
  name: string;
  level: number;
  icon: string;
  color: string;
  isAdditional: boolean;
  order: number;
}

interface AdminSkillFormProps {
  onClose: () => void;
  editingSkill?: any;
}

export default function AdminSkillForm({ onClose, editingSkill }: AdminSkillFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<SkillFormData>({
    name: editingSkill?.name || "",
    level: editingSkill?.level || 75,
    icon: editingSkill?.icon || "⚡",
    color: editingSkill?.color || "#3b82f6",
    isAdditional: editingSkill?.isAdditional || false,
    order: editingSkill?.order || 1,
  });

  const createSkillMutation = useMutation({
    mutationFn: async (data: SkillFormData) => {
      const method = editingSkill ? "PUT" : "POST";
      const url = editingSkill ? `/api/skills/${editingSkill.id}` : "/api/skills";
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({
        title: "Success",
        description: editingSkill ? "Skill updated successfully!" : "Skill added successfully!",
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
    createSkillMutation.mutate(formData);
  };

  return (
    <Card className="bg-dark-secondary border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">{editingSkill ? "Edit Skill" : "Add New Skill"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white">Skill Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-dark-bg border-gray-600 text-white"
              placeholder="e.g., Python, React"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="level" className="text-white">Level (0-100)</Label>
            <Input
              id="level"
              type="number"
              min="0"
              max="100"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 0 })}
              className="bg-dark-bg border-gray-600 text-white"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="icon" className="text-white">Icon (Emoji)</Label>
            <Input
              id="icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="bg-dark-bg border-gray-600 text-white"
              placeholder="⚡"
              maxLength={2}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="color" className="text-white">Color</Label>
            <Input
              id="color"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="bg-dark-bg border-gray-600 text-white h-12"
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
          
          <div className="flex items-center space-x-2">
            <Switch
              id="isAdditional"
              checked={formData.isAdditional}
              onCheckedChange={(checked) => setFormData({ ...formData, isAdditional: checked })}
            />
            <Label htmlFor="isAdditional" className="text-white">
              Additional Skill (shows in secondary section)
            </Label>
          </div>

          <div className="flex space-x-2">
            <Button 
              type="submit" 
              disabled={createSkillMutation.isPending}
              className="bg-gradient-to-r from-tech-blue to-tech-light"
            >
              {createSkillMutation.isPending ? (skill ? "Updating..." : "Adding...") : (skill ? "Update Skill" : "Add Skill")}
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