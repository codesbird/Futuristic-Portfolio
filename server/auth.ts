import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { storage } from "./storage";
import { User, loginUserSchema, insertUserSchema } from "@shared/schema";
import ConnectPgSimple from "connect-pg-simple";
import { db } from "./storage";

declare global {
  namespace Express {
    interface User extends User {}
  }
}

const PgSession = ConnectPgSimple(session);

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  return await bcrypt.compare(supplied, stored);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: new PgSession({
      pool: db as any,
      tableName: "session",
      createTableIfMissing: true,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
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
}

// Middleware to require authentication
export function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}