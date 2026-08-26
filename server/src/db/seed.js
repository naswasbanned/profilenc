import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/db.js';

import fsSync from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve publicDir robustly across Docker container and local host
const candidatePaths = [
  path.resolve(__dirname, '..', '..', 'public'),       // /app/public (Docker container)
  path.resolve(__dirname, '..', '..', '..', 'public'), // ../../../public (local dev)
  path.resolve(process.cwd(), 'public'),
  path.resolve(process.cwd(), '..', 'public'),
];
const publicDir = candidatePaths.find((p) => fsSync.existsSync(path.join(p, 'data', 'profile.json'))) || candidatePaths[0];
const dataDir = path.join(publicDir, 'data');
const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads');

// All 15 content keys mapped to their JSON filenames
const CONTENT_FILES = [
  { key: 'profile', file: 'profile.json' },
  { key: 'dev-skills', file: 'dev-skills.json' },
  { key: 'dev-projects', file: 'dev-projects.json' },
  { key: 'dev-experience', file: 'dev-experience.json' },
  { key: 'dev-services', file: 'dev-services.json' },
  { key: 'hobbies-specs', file: 'hobbies-specs.json' },
  { key: 'hobbies-setup', file: 'hobbies-setup.json' },
  { key: 'hobbies-story-games', file: 'hobbies-story-games.json' },
  { key: 'hobbies-currently-playing', file: 'hobbies-currently-playing.json' },
  { key: 'hobbies-backlog', file: 'hobbies-backlog.json' },
  { key: 'hobbies-philosophy', file: 'hobbies-philosophy.json' },
  { key: 'hobbies-movies', file: 'hobbies-movies.json' },
  { key: 'hobbies-movies-watching', file: 'hobbies-movies-watching.json' },
  { key: 'hobbies-movies-backlog', file: 'hobbies-movies-backlog.json' },
  { key: 'diary-entries', file: 'diary-entries.json' },
];

/**
 * Process a single image file through sharp → WebP → uploads/.
 * Returns { oldPath, newUrl, filename } or null on failure.
 */
async function processImageFile(imagePath) {
  const absolutePath = path.join(publicDir, imagePath);
  try {
    await fs.access(absolutePath);
  } catch {
    console.warn(`  ⚠ Image not found, skipping: ${imagePath}`);
    return null;
  }

  const filename = `${uuidv4()}.webp`;
  const outputPath = path.join(uploadsDir, filename);

  try {
    const result = await sharp(absolutePath)
      .rotate()
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);

    // Insert image record
    await query(
      `INSERT INTO images (filename, original_name, size_bytes, width, height)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (filename) DO NOTHING`,
      [filename, path.basename(imagePath), result.size, result.width, result.height]
    );

    return { oldPath: imagePath, newUrl: `/uploads/${filename}`, filename };
  } catch (err) {
    console.warn(`  ⚠ Failed to process ${imagePath}: ${err.message}`);
    return null;
  }
}

/**
 * Recursively find all image path strings in a JSON value.
 * Returns array of { path: string, location: description }.
 */
function findImagePaths(obj, prefix = '') {
  const paths = [];
  if (typeof obj === 'string' && obj.startsWith('/images/')) {
    paths.push(obj);
  } else if (Array.isArray(obj)) {
    for (const item of obj) {
      paths.push(...findImagePaths(item, prefix));
    }
  } else if (obj && typeof obj === 'object') {
    for (const [key, val] of Object.entries(obj)) {
      paths.push(...findImagePaths(val, `${prefix}.${key}`));
    }
  }
  return paths;
}

/**
 * Replace all old image paths in a JSON value with new upload URLs.
 */
function replaceImagePaths(obj, pathMap) {
  if (typeof obj === 'string') {
    return pathMap.get(obj) || obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => replaceImagePaths(item, pathMap));
  }
  if (obj && typeof obj === 'object') {
    const result = {};
    for (const [key, val] of Object.entries(obj)) {
      result[key] = replaceImagePaths(val, pathMap);
    }
    return result;
  }
  return obj;
}

async function seed() {
  console.log('=== Seeding database ===\n');

  // Ensure uploads dir exists
  await fs.mkdir(path.join(uploadsDir, 'temp'), { recursive: true });

  // 1. Load all JSON data
  console.log('1. Loading JSON data...');
  const allData = new Map();
  for (const { key, file } of CONTENT_FILES) {
    const filePath = path.join(dataDir, file);
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      allData.set(key, JSON.parse(raw));
      console.log(`   ✓ ${file}`);
    } catch (err) {
      console.warn(`   ⚠ Could not read ${file}: ${err.message}`);
    }
  }

  // 2. Collect all unique image paths across all data
  console.log('\n2. Collecting image paths...');
  const allImagePaths = new Set();
  for (const [key, data] of allData) {
    const paths = findImagePaths(data);
    for (const p of paths) {
      allImagePaths.add(p);
    }
  }
  console.log(`   Found ${allImagePaths.size} unique image paths`);

  // 3. Process all images through sharp → WebP
  console.log('\n3. Processing images → WebP...');
  const pathMap = new Map(); // oldPath → newUrl
  for (const imagePath of allImagePaths) {
    const result = await processImageFile(imagePath);
    if (result) {
      pathMap.set(result.oldPath, result.newUrl);
      console.log(`   ✓ ${imagePath} → ${result.newUrl}`);
    }
  }
  console.log(`   Processed ${pathMap.size} images`);

  // 4. Replace image paths in data and insert into DB
  console.log('\n4. Inserting content into database...');
  for (const [key, data] of allData) {
    const updated = replaceImagePaths(data, pathMap);
    await query(
      `INSERT INTO content (key, data, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (key) DO UPDATE SET data = $2, updated_at = NOW()`,
      [key, JSON.stringify(updated)]
    );
    console.log(`   ✓ ${key}`);
  }

  // 5. Create admin user
  console.log('\n5. Creating admin user...');
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin';
  const hash = await bcrypt.hash(password, 12);

  await query(
    `INSERT INTO admin_user (username, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (username) DO UPDATE SET password_hash = $2`,
    [username, hash]
  );
  console.log(`   ✓ Admin user "${username}" created`);

  console.log('\n=== Seed complete ===');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
