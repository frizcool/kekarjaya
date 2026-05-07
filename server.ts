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
    if (username === "admin" && password === "admin123") {
      res.json({ token: ADMIN_TOKEN });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
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
