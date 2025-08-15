import { drizzle } from "drizzle-orm/postgres-js";
import { eq, desc } from "drizzle-orm";
import postgres from "postgres";
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
  users,
  contactMessages,
  skills,
  services,
  projects,
  experiences,
  blogPosts
} from "@shared/schema";

// Database connection with error handling
let db: any = null;
let dbConnected = false;

async function initializeDatabase() {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL not provided");
    }
    const client = postgres(connectionString);
    db = drizzle(client);
    // Test the connection
    await client`SELECT 1`;
    dbConnected = true;
    console.log("✅ Database connected successfully");
    return true;
  } catch (error) {
    console.warn("⚠️  Database connection failed, falling back to in-memory storage:", error);
    dbConnected = false;
    return false;
  }
}

// Initialize database connection
initializeDatabase();

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
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
}

// In-memory storage implementation
export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private contactMessages: Map<string, ContactMessage> = new Map();
  private skills: Map<string, Skill> = new Map();
  private services: Map<string, Service> = new Map();
  private projects: Map<string, Project> = new Map();
  private experiences: Map<string, Experience> = new Map();
  private blogPosts: Map<string, BlogPost> = new Map();

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
      icon: service.icon,
      description: service.description,
      price: service.price,
      features: Array.from(service.features || []),
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
      icon: service.icon || existing.icon,
      description: service.description || existing.description,
      price: service.price || existing.price,
      features: service.features ? Array.from(service.features) : existing.features,
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
      .sort((a, b) => {
        const orderA = a.order || 0;
        const orderB = b.order || 0;
        if (orderA !== orderB) return orderA - orderB;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    for (const project of Array.from(this.projects.values())) {
      if (project.title.toLowerCase().replace(/\s+/g, '-') === slug) {
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
      technologies: Array.from(project.technologies || []),
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
      technologies: project.technologies ? Array.from(project.technologies) : existing.technologies,
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
      .sort((a, b) => {
        const orderA = a.order || 0;
        const orderB = b.order || 0;
        if (orderA !== orderB) return orderA - orderB;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
  }

  async createExperience(experience: InsertExperience): Promise<Experience> {
    const id = crypto.randomUUID();
    const newExperience: Experience = {
      title: experience.title,
      color: experience.color,
      period: experience.period,
      company: experience.company,
      description: experience.description ? Array.from(experience.description) : null,
      gpa: experience.gpa || null,
      coursework: experience.coursework || null,
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
      title: experience.title || existing.title,
      color: experience.color || existing.color,
      period: experience.period || existing.period,
      company: experience.company || existing.company,
      description: experience.description ? Array.from(experience.description) : existing.description,
      gpa: experience.gpa !== undefined ? experience.gpa : existing.gpa,
      coursework: experience.coursework !== undefined ? experience.coursework : existing.coursework,
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
    let posts = Array.from(this.blogPosts.values());
    if (publishedOnly) {
      posts = posts.filter(post => post.published === true);
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
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      published: post.published || null,
      featuredImage: post.featuredImage || null,
      tags: post.tags ? Array.from(post.tags) : null,
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
      slug: post.slug || existing.slug,
      title: post.title || existing.title,
      excerpt: post.excerpt || existing.excerpt,
      content: post.content || existing.content,
      author: post.author || existing.author,
      published: post.published !== undefined ? post.published : existing.published,
      featuredImage: post.featuredImage !== undefined ? post.featuredImage : existing.featuredImage,
      tags: post.tags ? Array.from(post.tags) : existing.tags,
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  // Contact messages
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const result = await db.insert(contactMessages).values(insertMessage).returning();
    return result[0];
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    return await db.select().from(skills).orderBy(skills.order, skills.name);
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const result = await db.insert(skills).values(skill).returning();
    return result[0];
  }

  async updateSkill(id: string, skill: Partial<InsertSkill>): Promise<Skill | undefined> {
    const result = await db.update(skills).set(skill).where(eq(skills.id, id)).returning();
    return result[0];
  }

  async deleteSkill(id: string): Promise<boolean> {
    await db.delete(skills).where(eq(skills.id, id));
    return true;
  }

  // Services
  async getServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(services.order, services.title);
  }

  async createService(service: InsertService): Promise<Service> {
    const result = await db.insert(services).values(service).returning();
    return result[0];
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined> {
    const result = await db.update(services).set(service).where(eq(services.id, id)).returning();
    return result[0];
  }

  async deleteService(id: string): Promise<boolean> {
    await db.delete(services).where(eq(services.id, id));
    return true;
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(projects.order, desc(projects.createdAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result[0];
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.title, slug)).limit(1);
    return result[0];
  }

  async createProject(project: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(project).returning();
    return result[0];
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const result = await db.update(projects).set(project).where(eq(projects.id, id)).returning();
    return result[0];
  }

  async deleteProject(id: string): Promise<boolean> {
    await db.delete(projects).where(eq(projects.id, id));
    return true;
  }

  // Experiences
  async getExperiences(): Promise<Experience[]> {
    return await db.select().from(experiences).orderBy(experiences.order, desc(experiences.createdAt));
  }

  async createExperience(experience: InsertExperience): Promise<Experience> {
    const result = await db.insert(experiences).values(experience).returning();
    return result[0];
  }

  async updateExperience(id: string, experience: Partial<InsertExperience>): Promise<Experience | undefined> {
    const result = await db.update(experiences).set(experience).where(eq(experiences.id, id)).returning();
    return result[0];
  }

  async deleteExperience(id: string): Promise<boolean> {
    await db.delete(experiences).where(eq(experiences.id, id));
    return true;
  }

  // Blog posts
  async getBlogPosts(publishedOnly = false): Promise<BlogPost[]> {
    const query = db.select().from(blogPosts);
    if (publishedOnly) {
      query.where(eq(blogPosts.published, true));
    }
    return await query.orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return result[0];
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return result[0];
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const result = await db.insert(blogPosts).values(post).returning();
    return result[0];
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const result = await db.update(blogPosts).set(post).where(eq(blogPosts.id, id)).returning();
    return result[0];
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return true;
  }
}

// Create storage instance with fallback
function createStorage(): IStorage {
  if (dbConnected && db) {
    console.log("🗄️  Using database storage");
    return new DatabaseStorage();
  } else {
    console.log("💾 Using in-memory storage");
    return new MemoryStorage();
  }
}

export const storage = createStorage();
export { db };
