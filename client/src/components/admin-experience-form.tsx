import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogClose } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { insertExperienceSchema, type InsertExperience, type Experience } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface ExperienceFormProps {
  onSuccess?: () => void;
  editingExperience?: Experience | null;
}

export default function AdminExperienceForm({ onSuccess, editingExperience }: ExperienceFormProps) {
  const [descriptions, setDescriptions] = useState<string[]>([""]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<InsertExperience>({
    resolver: zodResolver(insertExperienceSchema),
  });

  useEffect(() => {
    if (editingExperience) {
      setValue("title", editingExperience.title);
      setValue("company", editingExperience.company);
      setValue("period", editingExperience.period);
      setValue("color", editingExperience.color);
      setValue("gpa", editingExperience.gpa || "");
      setValue("coursework", editingExperience.coursework || "");
      setValue("order", editingExperience.order || 0);
      setDescriptions(editingExperience.description || [""]);
    }
  }, [editingExperience, setValue]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertExperience) => {
      const response = await apiRequest("POST", "/api/experiences", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
      toast({
        title: "Experience created!",
        description: "The experience has been added successfully.",
      });
      reset();
      setDescriptions([""]);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertExperience) => {
      const response = await apiRequest("PUT", `/api/experiences/${editingExperience!.id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
      toast({
        title: "Experience updated!",
        description: "The experience has been updated successfully.",
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertExperience) => {
    const formData = {
      ...data,
      description: descriptions.filter(desc => desc.trim() !== ""),
      gpa: data.gpa || null,
      coursework: data.coursework || null,
    };

    if (editingExperience) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const addDescription = () => {
    setDescriptions([...descriptions, ""]);
  };

  const removeDescription = (index: number) => {
    setDescriptions(descriptions.filter((_, i) => i !== index));
  };

  const updateDescription = (index: number, value: string) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = value;
    setDescriptions(newDescriptions);
  };

  return (
    <Card className="bg-dark-secondary border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">
          {editingExperience ? "Edit Experience" : "Add New Experience"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-white">Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="e.g., Software Developer"
                className="bg-gray-800 border-gray-600 text-white"
              />
              {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="company" className="text-white">Company/Institution *</Label>
              <Input
                id="company"
                {...register("company")}
                placeholder="e.g., Tech Corp"
                className="bg-gray-800 border-gray-600 text-white"
              />
              {errors.company && <p className="text-red-400 text-sm mt-1">{errors.company.message}</p>}
            </div>

            <div>
              <Label htmlFor="period" className="text-white">Period *</Label>
              <Input
                id="period"
                {...register("period")}
                placeholder="e.g., 2022 - Present"
                className="bg-gray-800 border-gray-600 text-white"
              />
              {errors.period && <p className="text-red-400 text-sm mt-1">{errors.period.message}</p>}
            </div>

            <div>
              <Label htmlFor="color" className="text-white">Color *</Label>
              <Input
                id="color"
                {...register("color")}
                placeholder="e.g., #3B82F6"
                className="bg-gray-800 border-gray-600 text-white"
              />
              {errors.color && <p className="text-red-400 text-sm mt-1">{errors.color.message}</p>}
            </div>

            <div>
              <Label htmlFor="gpa" className="text-white">GPA/CGPA</Label>
              <Input
                id="gpa"
                {...register("gpa")}
                placeholder="e.g., 3.8"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="order" className="text-white">Order</Label>
              <Input
                id="order"
                type="number"
                {...register("order", { valueAsNumber: true })}
                placeholder="0"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="coursework" className="text-white">Coursework/Additional Info</Label>
            <Textarea
              id="coursework"
              {...register("coursework")}
              placeholder="Relevant coursework or additional information"
              className="bg-gray-800 border-gray-600 text-white"
              rows={3}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-white">Description Points</Label>
              <Button
                type="button"
                onClick={addDescription}
                size="sm"
                className="bg-tech-light hover:bg-tech-light/80"
              >
                <Plus size={16} className="mr-1" />
                Add Point
              </Button>
            </div>
            
            <div className="space-y-3">
              {descriptions.map((desc, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={desc}
                    onChange={(e) => updateDescription(index, e.target.value)}
                    placeholder={`Description point ${index + 1}`}
                    className="bg-gray-800 border-gray-600 text-white flex-1"
                  />
                  {descriptions.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeDescription(index)}
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <DialogClose asChild>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-gradient-to-r from-tech-blue to-tech-light hover:from-tech-blue/80 hover:to-tech-light/80"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : editingExperience
                ? "Update Experience"
                : "Create Experience"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}