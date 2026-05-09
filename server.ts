import express from "express";
import mysql from "mysql2/promise";
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

let db: mysql.Pool;

async function setupDatabase() {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  const port = parseInt(process.env.DB_PORT || "3306");

  if (!host || !user || !database) {
    console.warn("MySQL configuration missing from environment variables. Waiting for user to configure.");
    // We create a dummy pool that will fail nicely if queried, or we can just initialize normally and let it fail.
    // However, if the user hasn't configured it, we still want the server to start but endpoints to fail,
    // or we can retry connection.
  }

  db = mysql.createPool({
    host: host || 'localhost',
    user: user || 'root',
    password: password || '',
    database: database || 'kekarjaya',
    port: port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    const connection = await db.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        image_url VARCHAR(255),
        likes_count INT DEFAULT 0,
        shares_count INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        order_index INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS settings (
        setting_key VARCHAR(255) PRIMARY KEY,
        setting_value TEXT NOT NULL
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        ip VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS ip_blocks (
        ip VARCHAR(255) PRIMARY KEY,
        attempts INT DEFAULT 0,
        blocked_until DATETIME
      );
    `);

    // Insert dummy data if table is empty
    const [actRows] = await connection.query("SELECT COUNT(*) as count FROM activities");
    if ((actRows as any)[0].count === 0) {
      await connection.query(`
        INSERT INTO activities (date, title, location, content, image_url) VALUES 
        ('2026-05-01', 'Pelatihan Security Guard', 'Jakarta', 'Pelatihan intensif untuk meningkatkan kesiapsiagaan.', 'https://images.unsplash.com/photo-1541888086053-96b653b6f264'),
        ('2026-05-05', 'Implementasi Sistem CCTV', 'Bandung', 'Pemasangan sistem keamanan terpadu di area pabrik.', 'https://images.unsplash.com/photo-1557597775-5da74fb2fb0d')
      `);
    }

    // Insert user settings
    await connection.query(`
      INSERT IGNORE INTO settings (setting_key, setting_value) VALUES 
      ('admin_password', 'admin123')
    `);

    connection.release();
    console.log("Database initialized successfully");
  } catch (err: any) {
    console.error("Failed to initialize database:", err.message);
  }
}

// Simple authentication middleware using a token
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "kekarjaya-admin-token";
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
  
  app.use(express.json());
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  await setupDatabase();

  // API Routes
  
  // Login
  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    let storedPassword = "admin123";
    try {
      if (db) {
        const [rows] = await db.query("SELECT setting_value FROM settings WHERE setting_key = 'admin_password'");
        if ((rows as any[]).length > 0) {
          storedPassword = (rows as any)[0].setting_value;
        }
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
  app.put("/api/admin/password", adminAuth, async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      
      let storedPassword = "admin123";
      const [pwRow] = await db.query("SELECT setting_value FROM settings WHERE setting_key = 'admin_password'");
      if ((pwRow as any[]).length > 0) {
        storedPassword = (pwRow as any)[0].setting_value;
      }

      if (oldPassword !== storedPassword) {
        return res.status(400).json({ error: "Password lama tidak sesuai" });
      }

      await db.query("INSERT INTO settings (setting_key, setting_value) VALUES ('admin_password', ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)", [newPassword]);
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update password" });
    }
  });

  // Get all settings
  app.get("/api/settings", async (req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM settings");
      const settings = (rows as any[]).reduce((acc: any, row: any) => {
        acc[row.setting_key] = row.setting_value;
        return acc;
      }, {});
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  // Update settings
  app.put("/api/settings", adminAuth, async (req, res) => {
    try {
      const settings = req.body;
      for (const [key, value] of Object.entries(settings)) {
        await db.query("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)", [key, String(value)]);
      }
      res.json({ message: "Settings updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Get all contacts
  app.get("/api/contacts", adminAuth, async (req, res) => {
    try {
      const [contacts] = await db.query("SELECT * FROM contacts ORDER BY created_at DESC");
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  // Submit contact
  app.post("/api/contacts", async (req, res) => {
    try {
      const clientIp = String((req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || 'unknown');

      // Check if blocked
      const [blockRows] = await db.query("SELECT * FROM ip_blocks WHERE ip = ?", [clientIp]);
      const blockRow = (blockRows as any[])[0];
      if (blockRow && blockRow.attempts >= 5) {
        if (new Date(blockRow.blocked_until) > new Date()) {
          return res.status(403).json({ error: "Terlalu banyak percobaan. IP Anda diblokir sementara." });
        } else {
          // unblock if time passed
          await db.query("UPDATE ip_blocks SET attempts = 0 WHERE ip = ?", [clientIp]);
        }
      }

      const { name, email, message, captchaAnswer, captchaExpected } = req.body;
      
      if (!name || !email || !message || captchaAnswer === undefined) {
        return res.status(400).json({ error: "Kolom tidak boleh kosong!" });
      }

      const parsedAns = parseInt(captchaAnswer);
      const parsedExp = parseInt(captchaExpected);

      if (isNaN(parsedAns) || isNaN(parsedExp) || parsedAns !== parsedExp) {
         const blockTime = new Date(Date.now() + 15 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
         await db.query("INSERT INTO ip_blocks (ip, attempts, blocked_until) VALUES (?, 1, ?) ON DUPLICATE KEY UPDATE attempts = attempts + 1, blocked_until = ?", [clientIp, blockTime, blockTime]);
         return res.status(400).json({ error: "Captcha salah!" });
      }

      const sanitize = (str: string) => str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();

      await db.query("INSERT INTO contacts (name, email, message, ip) VALUES (?, ?, ?, ?)", [sanitize(name), sanitize(email), sanitize(message), clientIp]);
      await db.query("DELETE FROM ip_blocks WHERE ip = ?", [clientIp]);
      
      res.status(201).json({ message: "Contact submitted" });
    } catch (error) {
      console.error(error);
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
  app.get("/api/activities", async (req, res) => {
    try {
      const [activities] = await db.query("SELECT * FROM activities ORDER BY created_at DESC");
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  // Add an activity
  app.post("/api/activities", adminAuth, async (req, res) => {
    const { date, title, location, content, imageUrl } = req.body;
    try {
      const [result] = await db.query(
        "INSERT INTO activities (date, title, location, content, image_url) VALUES (?, ?, ?, ?, ?)",
        [date, title, location, content, imageUrl]
      );
      res.json({ id: (result as any).insertId });
    } catch (error) {
      res.status(500).json({ error: "Failed to add activity" });
    }
  });

  // Get single activity
  app.get("/api/activities/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await db.query("SELECT * FROM activities WHERE id = ?", [id]);
      const activity = (rows as any[])[0];
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
  app.put("/api/activities/:id", adminAuth, async (req, res) => {
    const { id } = req.params;
    const { date, title, location, content, imageUrl } = req.body;
    try {
      await db.query(
        "UPDATE activities SET date = ?, title = ?, location = ?, content = ?, image_url = ? WHERE id = ?",
        [date, title, location, content, imageUrl, id]
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update activity" });
    }
  });

  // Like an activity
  app.put("/api/activities/:id/like", async (req, res) => {
    const { id } = req.params;
    try {
      await db.query("UPDATE activities SET likes_count = likes_count + 1 WHERE id = ?", [id]);
      const [rows] = await db.query("SELECT likes_count FROM activities WHERE id = ?", [id]);
      const activity = (rows as any[])[0];
      if (activity) {
        res.json({ likes: activity.likes_count });
      } else {
        res.status(404).json({ error: "Activity not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to like activity" });
    }
  });

  // Share an activity
  app.put("/api/activities/:id/share", async (req, res) => {
    const { id } = req.params;
    try {
      await db.query("UPDATE activities SET shares_count = shares_count + 1 WHERE id = ?", [id]);
      const [rows] = await db.query("SELECT shares_count FROM activities WHERE id = ?", [id]);
      const activity = (rows as any[])[0];
      if (activity) {
        res.json({ shares: activity.shares_count });
      } else {
        res.status(404).json({ error: "Activity not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to share activity" });
    }
  });

  // Delete an activity
  app.delete("/api/activities/:id", adminAuth, async (req, res) => {
    const { id } = req.params;
    try {
      await db.query("DELETE FROM activities WHERE id = ?", [id]);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete activity" });
    }
  });

  // --- CLIENTS API ---

  // Get all clients
  app.get("/api/clients", async (req, res) => {
    try {
      const [clients] = await db.query("SELECT * FROM clients ORDER BY order_index ASC, created_at DESC");
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  // Create client
  app.post("/api/clients", adminAuth, async (req, res) => {
    try {
      const { name, description, image_url, order_index } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }
      const [info] = await db.query("INSERT INTO clients (name, description, image_url, order_index) VALUES (?, ?, ?, ?)",
        [name, description || null, image_url || null, order_index || 0]
      );
      res.status(201).json({ id: (info as any).insertId, message: "Client created" });
    } catch (error) {
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  // Update client
  app.put("/api/clients/:id", adminAuth, async (req, res) => {
    try {
      const { name, description, image_url, order_index } = req.body;
      await db.query("UPDATE clients SET name = ?, description = ?, image_url = ?, order_index = ? WHERE id = ?",
        [name, description || null, image_url || null, order_index || 0, req.params.id]
      );
      res.json({ message: "Client updated" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  // Delete client
  app.delete("/api/clients/:id", adminAuth, async (req, res) => {
    try {
      await db.query("DELETE FROM clients WHERE id = ?", [req.params.id]);
      res.json({ message: "Client deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete client" });
    }
  });


  let distPath = path.join(process.cwd(), "dist");
  if (!fs.existsSync(path.join(distPath, "index.html")) && fs.existsSync(path.join(process.cwd(), "index.html"))) {
    // If cwd is already the dist folder (some hosting providers do this)
    distPath = process.cwd();
  }

  const isProd = fs.existsSync(path.join(distPath, "index.html"));

  // Vite middleware for development
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

