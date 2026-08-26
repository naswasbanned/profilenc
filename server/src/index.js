import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import imageRoutes from './routes/images.js';
import { ensureUploadDirs } from './services/imageService.js';

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

// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir, {
  maxAge: '7d',
  immutable: true,
}));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/images', imageRoutes);

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

// Start
async function start() {
  await ensureUploadDirs();
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
