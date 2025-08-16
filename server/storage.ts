import { createClient } from '@supabase/supabase-js';
import { 
  type User, 
  type InsertUser,
  type LoginUser,
  type ContactMessage, 
  type InsertContactMessage,
  type Skill,
  type InsertSkill,
  type Service,
  type InsertService,
  type Project,
  type InsertProject,
  type Experience,
  type InsertExperience,
  type BlogPost,
  type InsertBlogPost,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber
} from "@shared/schema";

// Supabase client setup
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

let supabase: any = null;
let dbConnected = false;

async function initializeSupabase() {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials not provided");
    }
    
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Test the connection
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error && !error.message.includes('relation "users" does not exist')) {
      throw error;
    }
    
    dbConnected = true;
    console.log("✅ Supabase connected successfully");
    return true;
  } catch (error) {
    console.warn("⚠️  Supabase connection failed, falling back to in-memory storage:", error);
    dbConnected = false;
    return false;
  }
}

// Initialize Supabase connection
initializeSupabase();

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Contact messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  
  // Skills
  getSkills(): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: string, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: string): Promise<boolean>;
  
  // Services
  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;
  
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  getProjectBySlug(slug: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  
  // Experiences
  getExperiences(): Promise<Experience[]>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  updateExperience(id: string, experience: Partial<InsertExperience>): Promise<Experience | undefined>;
  deleteExperience(id: string): Promise<boolean>;
  
  // Blog posts
  getBlogPosts(publishedOnly?: boolean): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, blogPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
  
  // Newsletter subscribers
  getNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  unsubscribeNewsletter(email: string): Promise<boolean>;
  isEmailSubscribed(email: string): Promise<boolean>;
}

// Supabase storage implementation
export class SupabaseStorage implements IStorage {
  // User management
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return {
      ...data,
      createdAt: new Date(data.created_at),
      twoFactorSecret: data.two_factor_secret,
      twoFactorEnabled: data.two_factor_enabled
    };
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !data) return undefined;
    return {
      ...data,
      createdAt: new Date(data.created_at),
      twoFactorSecret: data.two_factor_secret,
      twoFactorEnabled: data.two_factor_enabled
    };
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: insertUser.email,
        password: insertUser.password,
        name: insertUser.name,
        two_factor_secret: insertUser.twoFactorSecret,
        two_factor_enabled: insertUser.twoFactorEnabled || false
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      createdAt: new Date(data.created_at),
      twoFactorSecret: data.two_factor_secret,
      twoFactorEnabled: data.two_factor_enabled
    };
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const updateData: any = {};
    if (updates.email) updateData.email = updates.email;
    if (updates.password) updateData.password = updates.password;
    if (updates.name) updateData.name = updates.name;
    if (updates.twoFactorSecret !== undefined) updateData.two_factor_secret = updates.twoFactorSecret;
    if (updates.twoFactorEnabled !== undefined) updateData.two_factor_enabled = updates.twoFactorEnabled;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return {
      ...data,
      createdAt: new Date(data.created_at),
      twoFactorSecret: data.two_factor_secret,
      twoFactorEnabled: data.two_factor_enabled
    };
  }

  // Contact messages
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name: insertMessage.name,
        email: insertMessage.email,
        phone: insertMessage.phone,
        subject: insertMessage.subject,
        message: insertMessage.message
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      createdAt: new Date(data.created_at)
    };
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map((item: any) => ({
      ...item,
      createdAt: new Date(item.created_at)
    }));
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data.map((item: any) => ({
      ...item,
      isAdditional: item.is_additional,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const { data, error } = await supabase
      .from('skills')
      .insert({
        name: skill.name,
        level: skill.level,
        icon: skill.icon,
        color: skill.color,
        is_additional: skill.isAdditional || false,
        order: skill.order || 0
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      isAdditional: data.is_additional,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async updateSkill(id: string, skill: Partial<InsertSkill>): Promise<Skill | undefined> {
    const updateData: any = {};
    if (skill.name) updateData.name = skill.name;
    if (skill.level !== undefined) updateData.level = skill.level;
    if (skill.icon) updateData.icon = skill.icon;
    if (skill.color) updateData.color = skill.color;
    if (skill.isAdditional !== undefined) updateData.is_additional = skill.isAdditional;
    if (skill.order !== undefined) updateData.order = skill.order;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('skills')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return {
      ...data,
      isAdditional: data.is_additional,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async deleteSkill(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);

    return !error;
  }

  // Services
  async getServices(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data.map((item: any) => ({
      ...item,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  }

  async createService(service: InsertService): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert({
        title: service.title,
        description: service.description,
        price: service.price,
        features: service.features,
        icon: service.icon,
        order: service.order || 0
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined> {
    const updateData: any = {};
    if (service.title) updateData.title = service.title;
    if (service.description) updateData.description = service.description;
    if (service.price) updateData.price = service.price;
    if (service.features) updateData.features = service.features;
    if (service.icon) updateData.icon = service.icon;
    if (service.order !== undefined) updateData.order = service.order;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return {
      ...data,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async deleteService(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    return !error;
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map((item: any) => ({
      ...item,
      gradientFrom: item.gradient_from,
      gradientTo: item.gradient_to,
      demoUrl: item.demo_url,
      githubUrl: item.github_url,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return {
      ...data,
      gradientFrom: data.gradient_from,
      gradientTo: data.gradient_to,
      demoUrl: data.demo_url,
      githubUrl: data.github_url,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('title', slug)
      .single();

    if (error || !data) return undefined;
    return {
      ...data,
      gradientFrom: data.gradient_from,
      gradientTo: data.gradient_to,
      demoUrl: data.demo_url,
      githubUrl: data.github_url,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async createProject(project: InsertProject): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: project.title,
        description: project.description,
        content: project.content,
        image: project.image,
        technologies: project.technologies,
        gradient_from: project.gradientFrom,
        gradient_to: project.gradientTo,
        demo_url: project.demoUrl,
        github_url: project.githubUrl,
        featured: project.featured || false,
        order: project.order || 0
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      gradientFrom: data.gradient_from,
      gradientTo: data.gradient_to,
      demoUrl: data.demo_url,
      githubUrl: data.github_url,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const updateData: any = {};
    if (project.title) updateData.title = project.title;
    if (project.description) updateData.description = project.description;
    if (project.content) updateData.content = project.content;
    if (project.image) updateData.image = project.image;
    if (project.technologies) updateData.technologies = project.technologies;
    if (project.gradientFrom) updateData.gradient_from = project.gradientFrom;
    if (project.gradientTo) updateData.gradient_to = project.gradientTo;
    if (project.demoUrl) updateData.demo_url = project.demoUrl;
    if (project.githubUrl) updateData.github_url = project.githubUrl;
    if (project.featured !== undefined) updateData.featured = project.featured;
    if (project.order !== undefined) updateData.order = project.order;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return {
      ...data,
      gradientFrom: data.gradient_from,
      gradientTo: data.gradient_to,
      demoUrl: data.demo_url,
      githubUrl: data.github_url,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async deleteProject(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    return !error;
  }

  // Experiences
  async getExperiences(): Promise<Experience[]> {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map((item: any) => ({
      ...item,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  }

  async createExperience(experience: InsertExperience): Promise<Experience> {
    const { data, error } = await supabase
      .from('experiences')
      .insert({
        period: experience.period,
        title: experience.title,
        company: experience.company,
        description: experience.description,
        gpa: experience.gpa,
        coursework: experience.coursework,
        color: experience.color,
        order: experience.order || 0
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async updateExperience(id: string, experience: Partial<InsertExperience>): Promise<Experience | undefined> {
    const updateData: any = {};
    if (experience.period) updateData.period = experience.period;
    if (experience.title) updateData.title = experience.title;
    if (experience.company) updateData.company = experience.company;
    if (experience.description) updateData.description = experience.description;
    if (experience.gpa) updateData.gpa = experience.gpa;
    if (experience.coursework) updateData.coursework = experience.coursework;
    if (experience.color) updateData.color = experience.color;
    if (experience.order !== undefined) updateData.order = experience.order;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('experiences')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return {
      ...data,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async deleteExperience(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);

    return !error;
  }

  // Blog posts
  async getBlogPosts(publishedOnly = false): Promise<BlogPost[]> {
    let query = supabase.from('blog_posts').select('*');
    
    if (publishedOnly) {
      query = query.eq('published', true);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data.map((item: any) => ({
      ...item,
      publishedAt: item.published_at ? new Date(item.published_at) : null,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return {
      ...data,
      publishedAt: data.published_at ? new Date(data.published_at) : null,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) return undefined;
    return {
      ...data,
      publishedAt: data.published_at ? new Date(data.published_at) : null,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        tags: post.tags,
        published: post.published || false,
        published_at: post.publishedAt?.toISOString(),
        order: post.order || 0
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      publishedAt: data.published_at ? new Date(data.published_at) : null,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const updateData: any = {};
    if (post.title) updateData.title = post.title;
    if (post.slug) updateData.slug = post.slug;
    if (post.excerpt) updateData.excerpt = post.excerpt;
    if (post.content) updateData.content = post.content;
    if (post.image) updateData.image = post.image;
    if (post.tags) updateData.tags = post.tags;
    if (post.published !== undefined) updateData.published = post.published;
    if (post.publishedAt) updateData.published_at = post.publishedAt.toISOString();
    if (post.order !== undefined) updateData.order = post.order;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return {
      ...data,
      publishedAt: data.published_at ? new Date(data.published_at) : null,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    return !error;
  }

  // Newsletter subscribers
  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('is_active', true)
      .order('subscribed_at', { ascending: false });

    if (error) throw error;
    return data.map((item: any) => ({
      ...item,
      isActive: item.is_active,
      subscribedAt: new Date(item.subscribed_at),
      unsubscribedAt: item.unsubscribed_at ? new Date(item.unsubscribed_at) : null
    }));
  }

  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: subscriber.email,
        name: subscriber.name,
        is_active: subscriber.isActive !== undefined ? subscriber.isActive : true
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      isActive: data.is_active,
      subscribedAt: new Date(data.subscribed_at),
      unsubscribedAt: data.unsubscribed_at ? new Date(data.unsubscribed_at) : null
    };
  }

  async unsubscribeNewsletter(email: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString()
      })
      .eq('email', email)
      .select();

    return !error && data.length > 0;
  }

  async isEmailSubscribed(email: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    return !error && !!data;
  }
}

// In-memory storage implementation as fallback
export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private contactMessages: Map<string, ContactMessage> = new Map();
  private skills: Map<string, Skill> = new Map();
  private services: Map<string, Service> = new Map();
  private projects: Map<string, Project> = new Map();
  private experiences: Map<string, Experience> = new Map();
  private blogPosts: Map<string, BlogPost> = new Map();
  private newsletterSubscribers: Map<string, NewsletterSubscriber> = new Map();

  // User management
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = crypto.randomUUID();
    const user: User = {
      ...insertUser,
      id,
      twoFactorSecret: null,
      twoFactorEnabled: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = {
      ...user,
      ...updates,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Contact messages
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = crypto.randomUUID();
    const message: ContactMessage = {
      name: insertMessage.name,
      email: insertMessage.email,
      subject: insertMessage.subject,
      message: insertMessage.message,
      phone: insertMessage.phone || null,
      id,
      createdAt: new Date(),
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    return Array.from(this.skills.values())
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const id = crypto.randomUUID();
    const newSkill: Skill = {
      name: skill.name,
      level: skill.level,
      icon: skill.icon,
      color: skill.color,
      isAdditional: skill.isAdditional || null,
      order: skill.order || null,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.skills.set(id, newSkill);
    return newSkill;
  }

  async updateSkill(id: string, skill: Partial<InsertSkill>): Promise<Skill | undefined> {
    const existing = this.skills.get(id);
    if (!existing) return undefined;
    
    const updated = {
      ...existing,
      name: skill.name || existing.name,
      level: skill.level || existing.level,
      icon: skill.icon || existing.icon,
      color: skill.color || existing.color,
      isAdditional: skill.isAdditional !== undefined ? skill.isAdditional : existing.isAdditional,
      order: skill.order !== undefined ? skill.order : existing.order,
      updatedAt: new Date(),
    };
    this.skills.set(id, updated);
    return updated;
  }

  async deleteSkill(id: string): Promise<boolean> {
    return this.skills.delete(id);
  }

  // Services
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values())
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async createService(service: InsertService): Promise<Service> {
    const id = crypto.randomUUID();
    const newService: Service = {
      title: service.title,
      description: service.description,
      price: service.price,
      features: service.features,
      icon: service.icon,
      order: service.order || null,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.services.set(id, newService);
    return newService;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined> {
    const existing = this.services.get(id);
    if (!existing) return undefined;
    
    const updated = {
      ...existing,
      title: service.title || existing.title,
      description: service.description || existing.description,
      price: service.price || existing.price,
      features: service.features || existing.features,
      icon: service.icon || existing.icon,
      order: service.order !== undefined ? service.order : existing.order,
      updatedAt: new Date(),
    };
    this.services.set(id, updated);
    return updated;
  }

  async deleteService(id: string): Promise<boolean> {
    return this.services.delete(id);
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    for (const project of Array.from(this.projects.values())) {
      if (project.title === slug) {
        return project;
      }
    }
    return undefined;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = crypto.randomUUID();
    const newProject: Project = {
      title: project.title,
      description: project.description,
      content: project.content || null,
      image: project.image,
      technologies: project.technologies,
      gradientFrom: project.gradientFrom,
      gradientTo: project.gradientTo,
      demoUrl: project.demoUrl || null,
      githubUrl: project.githubUrl || null,
      featured: project.featured || null,
      order: project.order || null,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, newProject);
    return newProject;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const existing = this.projects.get(id);
    if (!existing) return undefined;
    
    const updated = {
      ...existing,
      title: project.title || existing.title,
      description: project.description || existing.description,
      content: project.content !== undefined ? project.content : existing.content,
      image: project.image || existing.image,
      technologies: project.technologies || existing.technologies,
      gradientFrom: project.gradientFrom || existing.gradientFrom,
      gradientTo: project.gradientTo || existing.gradientTo,
      demoUrl: project.demoUrl !== undefined ? project.demoUrl : existing.demoUrl,
      githubUrl: project.githubUrl !== undefined ? project.githubUrl : existing.githubUrl,
      featured: project.featured !== undefined ? project.featured : existing.featured,
      order: project.order !== undefined ? project.order : existing.order,
      updatedAt: new Date(),
    };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Experiences
  async getExperiences(): Promise<Experience[]> {
    return Array.from(this.experiences.values())
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async createExperience(experience: InsertExperience): Promise<Experience> {
    const id = crypto.randomUUID();
    const newExperience: Experience = {
      period: experience.period,
      title: experience.title,
      company: experience.company,
      description: experience.description || null,
      gpa: experience.gpa || null,
      coursework: experience.coursework || null,
      color: experience.color,
      order: experience.order || null,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.experiences.set(id, newExperience);
    return newExperience;
  }

  async updateExperience(id: string, experience: Partial<InsertExperience>): Promise<Experience | undefined> {
    const existing = this.experiences.get(id);
    if (!existing) return undefined;
    
    const updated = {
      ...existing,
      period: experience.period || existing.period,
      title: experience.title || existing.title,
      company: experience.company || existing.company,
      description: experience.description !== undefined ? experience.description : existing.description,
      gpa: experience.gpa !== undefined ? experience.gpa : existing.gpa,
      coursework: experience.coursework !== undefined ? experience.coursework : existing.coursework,
      color: experience.color || existing.color,
      order: experience.order !== undefined ? experience.order : existing.order,
      updatedAt: new Date(),
    };
    this.experiences.set(id, updated);
    return updated;
  }

  async deleteExperience(id: string): Promise<boolean> {
    return this.experiences.delete(id);
  }

  // Blog posts
  async getBlogPosts(publishedOnly = false): Promise<BlogPost[]> {
    const posts = Array.from(this.blogPosts.values());
    if (publishedOnly) {
      return posts.filter(post => post.published);
    }
    return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    for (const post of Array.from(this.blogPosts.values())) {
      if (post.slug === slug) {
        return post;
      }
    }
    return undefined;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = crypto.randomUUID();
    const newPost: BlogPost = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || null,
      content: post.content,
      image: post.image || null,
      tags: post.tags || null,
      published: post.published || null,
      publishedAt: post.publishedAt || null,
      order: post.order || null,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existing = this.blogPosts.get(id);
    if (!existing) return undefined;
    
    const updated = {
      ...existing,
      title: post.title || existing.title,
      slug: post.slug || existing.slug,
      excerpt: post.excerpt !== undefined ? post.excerpt : existing.excerpt,
      content: post.content || existing.content,
      image: post.image !== undefined ? post.image : existing.image,
      tags: post.tags !== undefined ? post.tags : existing.tags,
      published: post.published !== undefined ? post.published : existing.published,
      publishedAt: post.publishedAt !== undefined ? post.publishedAt : existing.publishedAt,
      order: post.order !== undefined ? post.order : existing.order,
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // Newsletter subscribers
  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return Array.from(this.newsletterSubscribers.values())
      .filter(sub => sub.isActive)
      .sort((a, b) => b.subscribedAt.getTime() - a.subscribedAt.getTime());
  }

  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const id = crypto.randomUUID();
    const newSubscriber: NewsletterSubscriber = {
      email: subscriber.email,
      name: subscriber.name || null,
      isActive: subscriber.isActive !== undefined ? subscriber.isActive : true,
      id,
      subscribedAt: new Date(),
      unsubscribedAt: null,
    };
    this.newsletterSubscribers.set(id, newSubscriber);
    return newSubscriber;
  }

  async unsubscribeNewsletter(email: string): Promise<boolean> {
    for (const [id, subscriber] of this.newsletterSubscribers.entries()) {
      if (subscriber.email === email) {
        const updated = {
          ...subscriber,
          isActive: false,
          unsubscribedAt: new Date(),
        };
        this.newsletterSubscribers.set(id, updated);
        return true;
      }
    }
    return false;
  }

  async isEmailSubscribed(email: string): Promise<boolean> {
    for (const subscriber of Array.from(this.newsletterSubscribers.values())) {
      if (subscriber.email === email && subscriber.isActive) {
        return true;
      }
    }
    return false;
  }
}

// Create storage instance with Supabase prioritized
function createStorage(): IStorage {
  if (dbConnected && supabase) {
    console.log("🗄️  Using Supabase storage");
    return new SupabaseStorage();
  } else {
    console.log("💾 Using in-memory storage");
    return new MemoryStorage();
  }
}

export const storage = createStorage();

// Initialize database with sample data
export async function initializeData() {
  try {
    // Check if we already have data
    const existingSkills = await storage.getSkills();
    if (existingSkills.length > 0) {
      console.log("📊 Database already has data, skipping initialization");
      return;
    }

    console.log("📊 Initializing database with portfolio data...");
    
    // Create sample skills
    const skillsData = [
      { name: "HTML/CSS", level: 93, icon: "🎨", color: "#E44D26", order: 1 },
      { name: "JavaScript", level: 88, icon: "📝", color: "#F7DF1E", order: 2 },
      { name: "Python", level: 95, icon: "🐍", color: "#3776AB", order: 3 },
      { name: "React", level: 85, icon: "⚛️", color: "#61DAFB", order: 4 },
      { name: "Node.js", level: 80, icon: "🟢", color: "#339933", order: 5 },
      { name: "Data Science", level: 90, icon: "📊", color: "#FF6B6B", order: 6 },
      { name: "Machine Learning", level: 87, icon: "🤖", color: "#4ECDC4", order: 7 },
      { name: "SQL", level: 85, icon: "🗃️", color: "#336791", order: 8 },
    ];

    for (const skill of skillsData) {
      await storage.createSkill(skill);
    }

    // Create sample services
    const servicesData = [
      {
        title: "Software Development",
        icon: "💻",
        description: "Custom software solutions tailored to your business needs with modern technologies and best practices.",
        price: "Starting at $2,500",
        features: ["Custom Web Applications", "API Development", "Database Design", "Code Review & Optimization"],
        order: 1
      },
      {
        title: "Data Analysis & Visualization",
        icon: "📊",
        description: "Transform your raw data into actionable insights with advanced analytics and beautiful visualizations.",
        price: "Starting at $1,800",
        features: ["Data Mining & Cleaning", "Statistical Analysis", "Interactive Dashboards", "Predictive Modeling"],
        order: 2
      },
      {
        title: "Machine Learning Solutions",
        icon: "🤖",
        description: "Implement AI-powered solutions to automate processes and gain competitive advantages.",
        price: "Starting at $3,500",
        features: ["Model Development", "Algorithm Optimization", "Deployment Strategy", "Performance Monitoring"],
        order: 3
      }
    ];

    for (const service of servicesData) {
      await storage.createService(service);
    }

    // Create sample projects
    const projectsData = [
      {
        title: "Sales Prediction System",
        description: "Machine learning model to predict sales trends and optimize inventory management for retail businesses.",
        image: "/api/placeholder/600/400",
        technologies: ["Python", "Scikit-learn", "Pandas", "Flask", "Chart.js"],
        gradientFrom: "#667eea",
        gradientTo: "#764ba2",
        demoUrl: "https://demo.example.com",
        githubUrl: "https://github.com/example/sales-prediction",
        featured: true,
        order: 1
      },
      {
        title: "Customer Analytics Dashboard",
        description: "Interactive dashboard providing real-time insights into customer behavior and business metrics.",
        image: "/api/placeholder/600/400",
        technologies: ["React", "D3.js", "Node.js", "MongoDB", "Express"],
        gradientFrom: "#f093fb",
        gradientTo: "#f5576c",
        demoUrl: "https://demo.example.com",
        githubUrl: "https://github.com/example/analytics-dashboard",
        featured: true,
        order: 2
      },
      {
        title: "Automated Trading Bot",
        description: "Algorithmic trading system using technical analysis and market sentiment to execute trades.",
        image: "/api/placeholder/600/400",
        technologies: ["Python", "Pandas", "NumPy", "Alpha Vantage API", "PostgreSQL"],
        gradientFrom: "#4facfe",
        gradientTo: "#00f2fe",
        githubUrl: "https://github.com/example/trading-bot",
        featured: false,
        order: 3
      }
    ];

    for (const project of projectsData) {
      await storage.createProject(project);
    }

    console.log("✅ Database initialized with portfolio data");
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
  }
}

// Initialize data when the module loads
initializeData();