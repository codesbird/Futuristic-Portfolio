import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { 
  Settings, 
  LogOut, 
  Users, 
  Mail, 
  FileText, 
  Code, 
  Briefcase, 
  Star,
  Shield,
  Plus
} from "lucide-react";
import AdminSkillForm from "@/components/admin-skill-form";
import AdminProjectForm from "@/components/admin-project-form";

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);

  if (!user) {
    setLocation("/admin/login");
    return null;
  }

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    setLocation("/admin/login");
  };

  const stats = [
    { title: "Contact Messages", value: "12", icon: Mail, color: "bg-blue-500" },
    { title: "Blog Posts", value: "8", icon: FileText, color: "bg-green-500" },
    { title: "Projects", value: "6", icon: Code, color: "bg-purple-500" },
    { title: "Skills", value: "12", icon: Star, color: "bg-yellow-500" },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Header */}
      <div className="bg-dark-secondary border-b border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold gradient-text">TECH2SAINI Admin</h1>
            <p className="text-gray-400">Content Management System</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-tech-blue to-neon-cyan rounded-full flex items-center justify-center">
                <Users size={16} />
              </div>
              <span className="text-sm text-gray-300">{user.name}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-dark-secondary border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{stat.title}</p>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                      <Icon className="text-white" size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-dark-secondary">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-dark-secondary border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Mail className="mr-2" size={20} />
                    Recent Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">No recent contact messages</p>
                  <Button className="mt-4" variant="outline">
                    View All Messages
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-dark-secondary border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="mr-2" size={20} />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="mr-2" size={16} />
                    Add New Blog Post
                  </Button>
                  <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
                    <DialogTrigger asChild>
                      <Button className="w-full justify-start" variant="outline">
                        <Plus className="mr-2" size={16} />
                        Add New Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <AdminProjectForm onClose={() => setShowProjectForm(false)} />
                    </DialogContent>
                  </Dialog>
                  <Dialog open={showSkillForm} onOpenChange={setShowSkillForm}>
                    <DialogTrigger asChild>
                      <Button className="w-full justify-start" variant="outline">
                        <Plus className="mr-2" size={16} />
                        Add New Skill
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <AdminSkillForm onClose={() => setShowSkillForm(false)} />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <Card className="bg-dark-secondary border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center">
                    <Star className="mr-2" size={20} />
                    Manage Skills
                  </span>
                  <Dialog open={showSkillForm} onOpenChange={setShowSkillForm}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2" size={16} />
                        Add Skill
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <AdminSkillForm onClose={() => setShowSkillForm(false)} />
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Skills management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card className="bg-dark-secondary border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center">
                    <Briefcase className="mr-2" size={20} />
                    Manage Services
                  </span>
                  <Button>
                    <Plus className="mr-2" size={16} />
                    Add Service
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Services management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card className="bg-dark-secondary border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center">
                    <Code className="mr-2" size={20} />
                    Manage Projects
                  </span>
                  <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2" size={16} />
                        Add Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <AdminProjectForm onClose={() => setShowProjectForm(false)} />
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Projects management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog">
            <Card className="bg-dark-secondary border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center">
                    <FileText className="mr-2" size={20} />
                    Manage Blog Posts
                  </span>
                  <Button>
                    <Plus className="mr-2" size={16} />
                    Add Post
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Blog management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-dark-secondary border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="mr-2" size={20} />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="text-tech-light" size={20} />
                    <div>
                      <h3 className="text-white font-semibold">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-400">
                        {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {user.twoFactorEnabled ? "Disable" : "Enable"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}