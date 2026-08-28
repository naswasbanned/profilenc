import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import imageRoutes from './routes/images.js';
import userRoutes from './routes/users.js';
import templateRoutes from './routes/templates.js';
import { ensureUploadDirs } from './services/imageService.js';
import { runMigrations } from './db/migrate.js';
import { seedTemplates } from './db/seeds/templates.js';
import { migrateExisting } from './db/migrations/002_migrate_existing.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Serve uploaded images statically (supports both /uploads/file and /uploads/:userId/file)
app.use('/uploads', express.static(uploadsDir, {
  maxAge: '7d',
  immutable: true,
}));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);     // Legacy single-user (kept for backward compatibility)
app.use('/api/images', imageRoutes);
app.use('/api/u', userRoutes);              // Multi-user profile routes
app.use('/api/templates', templateRoutes);  // Template browsing & featured profiles

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Max 10MB.' });
  }

  res.status(500).json({ error: 'Internal server error' });
});

// Database initialization with retries for Docker boot
async function initDatabase(retries = 5, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await runMigrations();
      await seedTemplates();
      await migrateExisting();
      return;
    } catch (err) {
      console.warn(`Database init attempt ${i + 1}/${retries} failed: ${err.message}`);
      if (i < retries - 1) {
        await new Promise((res) => setTimeout(res, delay));
      } else {
        throw err;
      }
    }
  }
}

// Start server
async function start() {
  await ensureUploadDirs();
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
