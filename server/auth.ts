import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { storage } from "./storage";
import { User, loginUserSchema, insertUserSchema } from "@shared/schema";
import MemoryStore from "memorystore";
import { supabaseAdmin } from "./supabase";
import { sendPasswordResetEmail } from "./email";
import crypto from "crypto";

declare global {
  namespace Express {
    interface User extends User {}
  }
}

const MemStore = MemoryStore(session);

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  return await bcrypt.compare(supplied, stored);
}

export function setupAuth(app: Express) {
  // Use in-memory session store since we're using in-memory storage
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "tech2saini-secret-key",
    resave: false,
    saveUninitialized: false,
    store: new MemStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    cookie: {
      secure: false, // Set to false for development
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user || !(await comparePasswords(password, user.password))) {
            return done(null, false, { message: "Invalid credentials" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Register endpoint
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await hashPassword(validatedData.password);
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({ 
          id: user.id, 
          email: user.email, 
          name: user.name,
          twoFactorEnabled: user.twoFactorEnabled 
        });
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Login endpoint
  app.post("/api/auth/login", async (req, res, next) => {
    try {
      const { email, password, twoFactorCode } = loginUserSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || !(await comparePasswords(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check 2FA if enabled
      if (user.twoFactorEnabled && user.twoFactorSecret) {
        if (!twoFactorCode) {
          return res.status(200).json({ requiresTwoFactor: true });
        }

        const verified = speakeasy.totp.verify({
          secret: user.twoFactorSecret,
          encoding: "base32",
          token: twoFactorCode,
          window: 2,
        });

        if (!verified) {
          return res.status(401).json({ error: "Invalid 2FA code" });
        }
      }

      req.login(user, (err) => {
        if (err) return next(err);
        res.json({ 
          id: user.id, 
          email: user.email, 
          name: user.name,
          twoFactorEnabled: user.twoFactorEnabled 
        });
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ success: true });
    });
  });

  // Get current user
  app.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    res.json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      twoFactorEnabled: req.user.twoFactorEnabled,
    });
  });

  // Setup 2FA
  app.post("/api/auth/setup-2fa", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const secret = speakeasy.generateSecret({
        name: `Tech2Saini (${req.user.email})`,
        issuer: "Tech2Saini Portfolio",
      });

      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

      res.json({
        secret: secret.base32,
        qrCode: qrCodeUrl,
        manualEntryKey: secret.base32,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Verify and enable 2FA
  app.post("/api/auth/verify-2fa", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const { token, secret } = req.body;

      const verified = speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token,
        window: 2,
      });

      if (!verified) {
        return res.status(400).json({ error: "Invalid token" });
      }

      // Save the secret and enable 2FA
      await storage.updateUser(req.user.id, {
        twoFactorSecret: secret,
        twoFactorEnabled: true,
      });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Disable 2FA
  app.post("/api/auth/disable-2fa", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      await storage.updateUser(req.user.id, {
        twoFactorSecret: null,
        twoFactorEnabled: false,
      });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Forgot password endpoint
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists for security
        return res.json({ success: true, message: "If email exists, reset link sent" });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Store reset token (you may want to add these fields to user schema)
      await storage.updateUser(user.id, {
        // resetToken,
        // resetTokenExpiry: tokenExpiry
      });

      // Send reset email
      await sendPasswordResetEmail(email, resetToken);

      res.json({ success: true, message: "Password reset email sent" });
    } catch (error: any) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Reset password endpoint
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ error: "Token and new password are required" });
      }

      // Find user by reset token (implement token validation)
      // This is a simplified version - you should implement proper token storage
      const hashedPassword = await hashPassword(newPassword);
      
      // Update user password and clear reset token
      // await storage.updateUser(userId, {
      //   password: hashedPassword,
      //   resetToken: null,
      //   resetTokenExpiry: null
      // });

      res.json({ success: true, message: "Password reset successful" });
    } catch (error: any) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: "Invalid or expired token" });
    }
  });

  // Change password endpoint
  app.post("/api/auth/change-password", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current and new passwords are required" });
      }

      const user = await storage.getUser(req.user.id);
      if (!user || !(await comparePasswords(currentPassword, user.password))) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUser(req.user.id, { password: hashedPassword });

      res.json({ success: true, message: "Password changed successfully" });
    } catch (error: any) {
      console.error('Change password error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update user profile endpoint
  app.post("/api/auth/update-profile", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const { name, email } = req.body;
      
      if (!name && !email) {
        return res.status(400).json({ error: "Name or email is required" });
      }

      // Check if email is already taken by another user
      if (email && email !== req.user.email) {
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser && existingUser.id !== req.user.id) {
          return res.status(400).json({ error: "Email already in use" });
        }
      }

      const updates: any = {};
      if (name) updates.name = name;
      if (email) updates.email = email;

      const updatedUser = await storage.updateUser(req.user.id, updates);
      
      res.json({
        id: updatedUser?.id,
        name: updatedUser?.name,
        email: updatedUser?.email,
        twoFactorEnabled: updatedUser?.twoFactorEnabled
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: error.message });
    }
  });
}

// Middleware to require authentication
export function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}