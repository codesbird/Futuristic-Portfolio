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

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

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

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users).set({ ...updates, updatedAt: new Date() }).where(eq(users.id, id)).returning();
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
    const result = await db.update(skills).set({ ...skill, updatedAt: new Date() }).where(eq(skills.id, id)).returning();
    return result[0];
  }

  async deleteSkill(id: string): Promise<boolean> {
    const result = await db.delete(skills).where(eq(skills.id, id));
    return result.rowCount > 0;
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
    const result = await db.update(services).set({ ...service, updatedAt: new Date() }).where(eq(services.id, id)).returning();
    return result[0];
  }

  async deleteService(id: string): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id));
    return result.rowCount > 0;
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
    const result = await db.update(projects).set({ ...project, updatedAt: new Date() }).where(eq(projects.id, id)).returning();
    return result[0];
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.rowCount > 0;
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
    const result = await db.update(experiences).set({ ...experience, updatedAt: new Date() }).where(eq(experiences.id, id)).returning();
    return result[0];
  }

  async deleteExperience(id: string): Promise<boolean> {
    const result = await db.delete(experiences).where(eq(experiences.id, id));
    return result.rowCount > 0;
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
    const result = await db.update(blogPosts).set({ ...post, updatedAt: new Date() }).where(eq(blogPosts.id, id)).returning();
    return result[0];
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
export { db };
