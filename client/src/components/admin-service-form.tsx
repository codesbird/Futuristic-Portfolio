import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertServiceSchema, type InsertService, type Service } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Trash2, Plus } from "lucide-react";

interface AdminServiceFormProps {
  onClose: () => void;
  service?: Service;
}

export default function AdminServiceForm({ onClose, service }: AdminServiceFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [features, setFeatures] = useState<string[]>(service?.features || [""]);

  const form = useForm<InsertService>({
    resolver: zodResolver(insertServiceSchema),
    defaultValues: {
      title: service?.title || "",
      description: service?.description || "",
      price: service?.price || "",
      features: service?.features || [""],
      icon: service?.icon || "💼",
      order: service?.order || 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertService) => apiRequest(`/api/services`, "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service created successfully!" });
      onClose();
    },
    onError: (error: any) => {
      toast({ title: "Error creating service", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertService) => apiRequest(`/api/services/${service?.id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service updated successfully!" });
      onClose();
    },
    onError: (error: any) => {
      toast({ title: "Error updating service", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertService) => {
    const filteredFeatures = features.filter(feature => feature.trim() !== "");
    const serviceData = { ...data, features: filteredFeatures };
    
    if (service) {
      updateMutation.mutate(serviceData);
    } else {
      createMutation.mutate(serviceData);
    }
  };

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const removeFeature = (index: number) => {
    if (features.length > 1) {
      const newFeatures = features.filter((_, i) => i !== index);
      setFeatures(newFeatures);
    }
  };

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-white">
          {service ? "Edit Service" : "Add New Service"}
        </DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Title</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-dark-bg border-gray-600 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Description</FormLabel>
                <FormControl>
                  <Textarea {...field} className="bg-dark-bg border-gray-600 text-white min-h-[100px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Price</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. $99/project" className="bg-dark-bg border-gray-600 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Icon (emoji)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="💼" className="bg-dark-bg border-gray-600 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Display Order</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number" 
                    value={field.value || 0}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    className="bg-dark-bg border-gray-600 text-white" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <label className="text-white text-sm font-medium">Features</label>
            {features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder={`Feature ${index + 1}`}
                  className="bg-dark-bg border-gray-600 text-white flex-1"
                />
                {features.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFeature(index)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFeature}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Plus size={16} className="mr-2" />
              Add Feature
            </Button>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-gradient-to-r from-tech-blue to-neon-cyan text-white"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : service
                ? "Update Service"
                : "Create Service"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}