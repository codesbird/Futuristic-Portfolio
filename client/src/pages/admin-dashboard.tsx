import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Plus,
  Clock,
  Home,
  BarChart3,
  Layout,
  Table,
  FileEdit,
  Square,
  Edit3,
  Calendar,
  AlertTriangle,
  Menu
} from "lucide-react";
import AdminSkillForm from "@/components/admin-skill-form";
import AdminProjectForm from "@/components/admin-project-form";
import AdminServiceForm from "@/components/admin-service-form";
import AdminBlogForm from "@/components/admin-blog-form";
import AdminExperienceForm from "@/components/admin-experience-form";
import { 
  SkillsList, 
  ServicesList, 
  ProjectsList, 
  BlogPostsList, 
  ContactMessagesList,
  ExperiencesList,
  AdminNewsletterList 
} from "@/components/admin-list-items";
import type { Skill, Service, Project, BlogPost, ContactMessage, Experience } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

type NavItem = {
  id: string;
  label: string;
  icon: any;
  color?: string;
};

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Layout, color: "text-blue-400" },
  { id: "skills", label: "Skills", icon: Star, color: "text-yellow-400" },
  { id: "services", label: "Services", icon: Briefcase, color: "text-green-400" },
  { id: "projects", label: "Projects", icon: Code, color: "text-purple-400" },
  { id: "experiences", label: "Experience", icon: Clock, color: "text-indigo-400" },
  { id: "blog", label: "Blog Posts", icon: FileText, color: "text-red-400" },
  { id: "messages", label: "Messages", icon: Mail, color: "text-cyan-400" },
  { id: "newsletter", label: "Newsletter", icon: Users, color: "text-orange-400" },
  { id: "settings", label: "Settings", icon: Settings, color: "text-gray-400" },
];

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);

  // Fetch data for stats
  const { data: skills = [] } = useQuery<Skill[]>({ queryKey: ["/api/skills"] });
  const { data: services = [] } = useQuery<Service[]>({ queryKey: ["/api/services"] });
  const { data: projects = [] } = useQuery<Project[]>({ queryKey: ["/api/projects"] });
  const { data: blogPosts = [] } = useQuery<BlogPost[]>({ 
    queryKey: ["/api/blog-posts"], 
    queryFn: () => fetch("/api/blog-posts?published=false").then(res => res.json())
  });
  const { data: messages = [] } = useQuery<ContactMessage[]>({ queryKey: ["/api/contact-messages"] });
  const { data: experiences = [] } = useQuery<Experience[]>({ queryKey: ["/api/experiences"] });

  if (!user) {
    setLocation("/admin/login");
    return null;
  }

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    setLocation("/admin/login");
  };

  const dashboardCards = [
    { title: "Dashboard", icon: Layout, color: "from-blue-500 to-blue-600", textColor: "text-white" },
    { title: "Analytics", icon: BarChart3, color: "from-green-500 to-green-600", textColor: "text-white" },
    { title: "Widgets", icon: Square, color: "from-orange-500 to-orange-600", textColor: "text-white" },
    { title: "Tables", icon: Table, color: "from-red-500 to-red-600", textColor: "text-white" },
    { title: "Full Width", icon: Layout, color: "from-indigo-500 to-indigo-600", textColor: "text-white" },
    { title: "Forms", icon: FileEdit, color: "from-red-600 to-red-700", textColor: "text-white" },
    { title: "Buttons", icon: Square, color: "from-blue-600 to-blue-700", textColor: "text-white" },
    { title: "Elements", icon: Edit3, color: "from-cyan-500 to-cyan-600", textColor: "text-white" },
    { title: "Calendar", icon: Calendar, color: "from-green-600 to-green-700", textColor: "text-white" },
    { title: "Errors", icon: AlertTriangle, color: "from-yellow-500 to-yellow-600", textColor: "text-white" },
  ];

  const overviewStats = [
    { title: "Total Users", value: "2540", icon: Users, color: "bg-gray-700" },
    { title: "New Users", value: "120", icon: Users, color: "bg-gray-800" },
    { title: "Total Shop", value: "656", icon: Briefcase, color: "bg-gray-700" },
    { title: "Total Orders", value: "9540", icon: FileText, color: "bg-gray-800" },
    { title: "Pending Orders", value: "100", icon: Clock, color: "bg-gray-700" },
    { title: "Online Orders", value: "8540", icon: Code, color: "bg-gray-800" },
  ];

  const portfolioStats = [
    { title: "Contact Messages", value: messages.length, icon: Mail, color: "bg-blue-600" },
    { title: "Blog Posts", value: blogPosts.length, icon: FileText, color: "bg-green-600" },
    { title: "Projects", value: projects.length, icon: Code, color: "bg-purple-600" },
    { title: "Skills", value: skills.length, icon: Star, color: "bg-yellow-600" },
    { title: "Services", value: services.length, icon: Briefcase, color: "bg-red-600" },
    { title: "Experiences", value: experiences.length, icon: Clock, color: "bg-indigo-600" },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Portfolio Overview Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Portfolio Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {portfolioStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`${stat.color} rounded-lg p-4 text-center text-white`}>
                <Icon className="mx-auto mb-2" size={24} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs opacity-90">{stat.title}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <p className="text-gray-400">No recent messages</p>
            ) : (
              <div className="space-y-3">
                {messages.slice(0, 5).map((message) => (
                  <div key={message.id} className="flex items-center space-x-3 p-2 bg-gray-700 rounded">
                    <Mail className="text-blue-400" size={16} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{message.subject}</p>
                      <p className="text-gray-400 text-xs">{message.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Dialog open={showBlogForm} onOpenChange={setShowBlogForm}>
              <DialogTrigger asChild>
                <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2" size={16} />
                  Add New Blog Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <AdminBlogForm onClose={() => setShowBlogForm(false)} />
              </DialogContent>
            </Dialog>

            <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
              <DialogTrigger asChild>
                <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
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
                <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2" size={16} />
                  Add New Skill
                </Button>
              </DialogTrigger>
              <DialogContent>
                <AdminSkillForm onClose={() => setShowSkillForm(false)} />
              </DialogContent>
            </Dialog>

            <Dialog open={showExperienceForm} onOpenChange={setShowExperienceForm}>
              <DialogTrigger asChild>
                <Button className="w-full justify-start bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="mr-2" size={16} />
                  Add New Experience
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <AdminExperienceForm onSuccess={() => setShowExperienceForm(false)} />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "skills":
        return (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center">
                  <Star className="mr-2" size={20} />
                  Manage Skills
                </span>
                <Dialog open={showSkillForm} onOpenChange={setShowSkillForm}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
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
              <SkillsList />
            </CardContent>
          </Card>
        );
      case "services":
        return (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center">
                  <Briefcase className="mr-2" size={20} />
                  Manage Services
                </span>
                <Dialog open={showServiceForm} onOpenChange={setShowServiceForm}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="mr-2" size={16} />
                      Add Service
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <AdminServiceForm onClose={() => setShowServiceForm(false)} />
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ServicesList />
            </CardContent>
          </Card>
        );
      case "projects":
        return (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center">
                  <Code className="mr-2" size={20} />
                  Manage Projects
                </span>
                <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
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
              <ProjectsList />
            </CardContent>
          </Card>
        );
      case "experiences":
        return (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center">
                  <Clock className="mr-2" size={20} />
                  Manage Experiences
                </span>
                <Dialog open={showExperienceForm} onOpenChange={setShowExperienceForm}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="mr-2" size={16} />
                      Add Experience
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <AdminExperienceForm onSuccess={() => setShowExperienceForm(false)} />
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ExperiencesList 
                experiences={experiences}
                onEdit={(experience) => {
                  // Handle edit functionality
                  console.log('Edit experience:', experience);
                }}
                onDelete={async (id) => {
                  // Handle delete functionality
                  try {
                    await apiRequest("DELETE", `/api/experiences/${id}`);
                    // Invalidate queries to refresh data
                    // queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
                  } catch (error) {
                    console.error('Failed to delete experience:', error);
                  }
                }}
              />
            </CardContent>
          </Card>
        );
      case "blog":
        return (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center">
                  <FileText className="mr-2" size={20} />
                  Manage Blog Posts
                </span>
                <Dialog open={showBlogForm} onOpenChange={setShowBlogForm}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="mr-2" size={16} />
                      Add Blog Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <AdminBlogForm onClose={() => setShowBlogForm(false)} />
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BlogPostsList />
            </CardContent>
          </Card>
        );
      case "messages":
        return (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Mail className="mr-2" size={20} />
                Contact Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ContactMessagesList />
            </CardContent>
          </Card>
        );
      case "newsletter":
        return (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="mr-2" size={20} />
                Newsletter Subscribers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdminNewsletterList />
            </CardContent>
          </Card>
        );
      case "settings":
        return (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="mr-2" size={20} />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded">
                  <div>
                    <h3 className="text-white font-medium">Admin User</h3>
                    <p className="text-gray-400 text-sm">{user.name} ({user.email})</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded flex items-center justify-center">
              <Layout className="text-white" size={16} />
            </div>
            <h1 className="text-white font-bold text-lg">{user.name} Admin</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon size={18} className={item.color} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-300"
              >
                <Menu size={20} />
              </Button>
              <div>
                <h1 className="text-white font-semibold capitalize">{activeTab}</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-300 hover:text-white"
              >
                <LogOut size={16} />
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
          {renderContent()}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}