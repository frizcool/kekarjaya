import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up image upload using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage: storage });

function setupDatabase() {
  const db = new Database(path.join(process.cwd(), "database.sqlite"));

  db.exec(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      likes_count INTEGER DEFAULT 0,
      shares_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Simple migration to add columns if they don't exist
  try {
    db.prepare("ALTER TABLE activities ADD COLUMN likes_count INTEGER DEFAULT 0").run();
  } catch (e) {
    // Column might already exist
  }
  try {
    db.prepare("ALTER TABLE activities ADD COLUMN shares_count INTEGER DEFAULT 0").run();
  } catch (e) {
    // Column might already exist
  }

  // Clients Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Settings Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Contacts Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  try {
    db.prepare("ALTER TABLE contacts ADD COLUMN ip TEXT").run();
  } catch (e) {
    // Column might already exist
  }

  // IP Blocks Table for Rate Limiting
  db.exec(`
    CREATE TABLE IF NOT EXISTS ip_blocks (
      ip TEXT PRIMARY KEY,
      attempts INTEGER DEFAULT 0,
      blocked_until DATETIME
    );
  `);

  return db;
}

// Simple authentication middleware using a token
const ADMIN_TOKEN = "kekarjaya-admin-token";
const adminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader === `Bearer ${ADMIN_TOKEN}`) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  const db = setupDatabase();

  // API Routes
  
  // Login
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    // Hardcoded credentials for simplicity as requested by standard prototypes
    let storedPassword = "admin123";
    try {
      const pwRow = db.prepare("SELECT value FROM settings WHERE key = 'admin_password'").get();
      if (pwRow && (pwRow as any).value) {
        storedPassword = (pwRow as any).value;
      }
    } catch (e) {
      // ignore
    }

    if (username === "admin" && password === storedPassword) {
      res.json({ token: ADMIN_TOKEN });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Change Admin Password
  app.put("/api/admin/password", adminAuth, (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      
      let storedPassword = "admin123";
      const pwRow = db.prepare("SELECT value FROM settings WHERE key = 'admin_password'").get();
      if (pwRow && (pwRow as any).value) {
        storedPassword = (pwRow as any).value;
      }

      if (oldPassword !== storedPassword) {
        return res.status(400).json({ error: "Password lama tidak sesuai" });
      }

      db.prepare("INSERT INTO settings (key, value) VALUES ('admin_password', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(newPassword);
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update password" });
    }
  });

  // Get all settings
  app.get("/api/settings", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM settings").all();
      const settings = (rows as any[]).reduce((acc: any, row: any) => {
        acc[row.key] = row.value;
        return acc;
      }, {});
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  // Update settings
  app.put("/api/settings", adminAuth, (req, res) => {
    try {
      const settings = req.body;
      const stmt = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value");
      const insertMany = db.transaction((settings: Record<string, string>) => {
        for (const [key, value] of Object.entries(settings)) {
          stmt.run(key, String(value));
        }
      });
      insertMany(settings);
      res.json({ message: "Settings updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Get all contacts
  app.get("/api/contacts", adminAuth, (req, res) => {
    try {
      const contacts = db.prepare("SELECT * FROM contacts ORDER BY created_at DESC").all();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  // Submit contact
  app.post("/api/contacts", (req, res) => {
    try {
      const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || 'unknown';

      // Check if blocked
      const blockRow = db.prepare("SELECT * FROM ip_blocks WHERE ip = ?").get(String(clientIp)) as any;
      if (blockRow && blockRow.attempts >= 5) {
        if (new Date(blockRow.blocked_until) > new Date()) {
          return res.status(403).json({ error: "Terlalu banyak percobaan. IP Anda diblokir sementara." });
        } else {
          // unblock if time passed
          db.prepare("UPDATE ip_blocks SET attempts = 0 WHERE ip = ?").run(String(clientIp));
        }
      }

      const { name, email, message, captchaAnswer, captchaExpected } = req.body;
      
      if (!name || !email || !message || captchaAnswer === undefined) {
        return res.status(400).json({ error: "Kolom tidak boleh kosong!" });
      }

      const parsedAns = parseInt(captchaAnswer);
      const parsedExp = parseInt(captchaExpected);

      if (isNaN(parsedAns) || isNaN(parsedExp) || parsedAns !== parsedExp) {
         const blockTime = new Date(Date.now() + 15 * 60 * 1000).toISOString();
         db.prepare("INSERT INTO ip_blocks (ip, attempts, blocked_until) VALUES (?, 1, ?) ON CONFLICT(ip) DO UPDATE SET attempts = attempts + 1, blocked_until = ?").run(String(clientIp), blockTime, blockTime);
         return res.status(400).json({ error: "Captcha salah!" });
      }

      const sanitize = (str: string) => str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();

      db.prepare("INSERT INTO contacts (name, email, message, ip) VALUES (?, ?, ?, ?)").run(sanitize(name), sanitize(email), sanitize(message), String(clientIp));
      db.prepare("DELETE FROM ip_blocks WHERE ip = ?").run(String(clientIp));
      
      res.status(201).json({ message: "Contact submitted" });
    } catch (error) {
      res.status(500).json({ error: "Gagal mengirim pesan" });
    }
  });

  // Upload an image
  app.post("/api/upload", adminAuth, upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  });

  // Get all activities
  app.get("/api/activities", (req, res) => {
    try {
      const activities = db.prepare("SELECT * FROM activities ORDER BY created_at DESC").all();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  // Add an activity
  app.post("/api/activities", adminAuth, (req, res) => {
    const { date, title, location, content, imageUrl } = req.body;
    try {
      const stmt = db.prepare(
        "INSERT INTO activities (date, title, location, content, image_url) VALUES (?, ?, ?, ?, ?)"
      );
      const result = stmt.run(date, title, location, content, imageUrl);
      res.json({ id: result.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Failed to add activity" });
    }
  });

  // Get single activity
  app.get("/api/activities/:id", (req, res) => {
    const { id } = req.params;
    try {
      const activity = db.prepare("SELECT * FROM activities WHERE id = ?").get(id);
      if (activity) {
        res.json(activity);
      } else {
        res.status(404).json({ error: "Activity not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activity" });
    }
  });

  // Edit an activity
  app.put("/api/activities/:id", adminAuth, (req, res) => {
    const { id } = req.params;
    const { date, title, location, content, imageUrl } = req.body;
    try {
      const stmt = db.prepare(
        "UPDATE activities SET date = ?, title = ?, location = ?, content = ?, image_url = ? WHERE id = ?"
      );
      stmt.run(date, title, location, content, imageUrl, id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update activity" });
    }
  });

  // Like an activity
  app.put("/api/activities/:id/like", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("UPDATE activities SET likes_count = likes_count + 1 WHERE id = ?").run(id);
      const activity = db.prepare("SELECT likes_count FROM activities WHERE id = ?").get(id);
      if (activity) {
        res.json({ likes: (activity as any).likes_count });
      } else {
        res.status(404).json({ error: "Activity not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to like activity" });
    }
  });

  // Share an activity
  app.put("/api/activities/:id/share", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("UPDATE activities SET shares_count = shares_count + 1 WHERE id = ?").run(id);
      const activity = db.prepare("SELECT shares_count FROM activities WHERE id = ?").get(id);
      if (activity) {
        res.json({ shares: (activity as any).shares_count });
      } else {
        res.status(404).json({ error: "Activity not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to share activity" });
    }
  });

  // Delete an activity
  app.delete("/api/activities/:id", adminAuth, (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM activities WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete activity" });
    }
  });

  // --- CLIENTS API ---

  // Get all clients
  app.get("/api/clients", (req, res) => {
    try {
      const clients = db.prepare("SELECT * FROM clients ORDER BY order_index ASC, created_at DESC").all();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  // Create client
  app.post("/api/clients", adminAuth, (req, res) => {
    try {
      const { name, description, image_url, order_index } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }
      const info = db.prepare("INSERT INTO clients (name, description, image_url, order_index) VALUES (?, ?, ?, ?)").run(
        name, description || null, image_url || null, order_index || 0
      );
      res.status(201).json({ id: info.lastInsertRowid, message: "Client created" });
    } catch (error) {
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  // Update client
  app.put("/api/clients/:id", adminAuth, (req, res) => {
    try {
      const { name, description, image_url, order_index } = req.body;
      db.prepare("UPDATE clients SET name = ?, description = ?, image_url = ?, order_index = ? WHERE id = ?").run(
        name, description || null, image_url || null, order_index || 0, req.params.id
      );
      res.json({ message: "Client updated" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  // Delete client
  app.delete("/api/clients/:id", adminAuth, (req, res) => {
    try {
      db.prepare("DELETE FROM clients WHERE id = ?").run(req.params.id);
      res.json({ message: "Client deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete client" });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
