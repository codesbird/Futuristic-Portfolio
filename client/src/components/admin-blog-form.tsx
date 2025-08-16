import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertBlogPostSchema, type InsertBlogPost, type BlogPost } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Trash2, Plus } from "lucide-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface AdminBlogFormProps {
  onClose: () => void;
  blogPost?: BlogPost;
}

export default function AdminBlogForm({ onClose, blogPost }: AdminBlogFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tags, setTags] = useState<string[]>(blogPost?.tags || [""]);

  const form = useForm<InsertBlogPost>({
    resolver: zodResolver(insertBlogPostSchema),
    defaultValues: {
      title: blogPost?.title || "",
      excerpt: blogPost?.excerpt || "",
      content: blogPost?.content || "",
      author: blogPost?.author || "Monu Saini",
      slug: blogPost?.slug || "",
      published: blogPost?.published || false,
      featuredImage: blogPost?.featuredImage || "",
      tags: blogPost?.tags || [""],
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertBlogPost) => apiRequest("POST", `/api/blog-posts`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({ title: "Blog post created successfully!" });
      onClose();
    },
    onError: (error: any) => {
      toast({ title: "Error creating blog post", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertBlogPost) => apiRequest("PUT", `/api/blog-posts/${blogPost?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({ title: "Blog post updated successfully!" });
      onClose();
    },
    onError: (error: any) => {
      toast({ title: "Error updating blog post", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertBlogPost) => {
    const filteredTags = tags.filter(tag => tag.trim() !== "");
    const postData = {
      ...data,
      tags: filteredTags,
      slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
    };

    if (blogPost) {
      updateMutation.mutate(postData);
    } else {
      createMutation.mutate(postData);
    }
  };

  const addTag = () => {
    setTags([...tags, ""]);
  };

  const updateTag = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const removeTag = (index: number) => {
    if (tags.length > 1) {
      const newTags = tags.filter((_, i) => i !== index);
      setTags(newTags);
    }
  };

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-white">
          {blogPost ? "Edit Blog Post" : "Add New Blog Post"}
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
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Slug (optional - will auto-generate from title)</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-dark-bg border-gray-600 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Excerpt</FormLabel>
                <FormControl>
                  <Textarea {...field} className="bg-dark-bg border-gray-600 text-white min-h-[80px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => {
              const [showHtml, setShowHtml] = useState(false);

              return (
                <FormItem>
                  <FormLabel className="text-white">Content</FormLabel>
                  <FormControl>
                    <div className="quill-wrapper">
                      {/* Toggle button */}
                      <button
                        type="button"
                        onClick={() => setShowHtml(!showHtml)}
                        className="mb-2 px-3 py-1 bg-gray-700 text-white rounded"
                      >
                        {showHtml ? "Editor" : "</> HTML"}
                      </button>

                      {/* Conditional view */}
                      {showHtml ? (
                        <textarea
                          className="w-full h-64 p-2 border border-gray-600 bg-dark-bg text-white rounded"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      ) : (
                        <ReactQuill
                          theme="snow"
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Write your blog post content here..."
                          modules={{
                            toolbar: [
                              [{ header: [1, 2, 3, 4, 5, 6, false] }],
                              ["bold", "italic", "underline", "strike", "blockquote"],
                              [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                              ["link", "image", "code-block"],
                              [{ align: [] }],
                              ["clean"],
                            ],
                          }}
                          formats={[
                            "header",
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "blockquote",
                            "list",
                            "bullet",
                            "indent",
                            "link",
                            "image",
                            "code-block",
                            "align",
                          ]}
                          style={{
                            backgroundColor: "transparent",
                            borderRadius: "6px",
                            border: "1px solid #4b5563",
                            minHeight: "200px",
                          }}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Author</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-dark-bg border-gray-600 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featuredImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Featured Image URL</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} className="bg-dark-bg border-gray-600 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <label className="text-white text-sm font-medium">Tags</label>
            {tags.map((tag, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={tag}
                  onChange={(e) => updateTag(index, e.target.value)}
                  placeholder={`Tag ${index + 1}`}
                  className="bg-dark-bg border-gray-600 text-white flex-1"
                />
                {tags.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeTag(index)}
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
              onClick={addTag}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Plus size={16} className="mr-2" />
              Add Tag
            </Button>
          </div>

          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-white">Published</FormLabel>
                  <div className="text-sm text-gray-400">
                    Make this blog post visible to the public
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

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
                : blogPost
                  ? "Update Post"
                  : "Create Post"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}