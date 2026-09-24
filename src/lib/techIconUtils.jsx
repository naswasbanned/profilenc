import { useState } from 'react';
import {
  Code2,
  Sparkles,
  Terminal,
  Globe,
  Layers,
  Cpu,
  Database,
  Server,
  Smartphone,
  Wrench,
  Palette,
  Cloud,
} from 'lucide-react';

// Curated dictionary of popular tech stacks with verified slugs & official brand colors
export const POPULAR_TECH_PRESETS = [
  // Languages
  { name: 'Go', slug: 'go', color: '#00ADD8', category: 'Backend & Systems' },
  { name: 'TypeScript', slug: 'typescript', color: '#3178C6', category: 'Languages' },
  { name: 'JavaScript', slug: 'javascript', color: '#F7DF1E', category: 'Languages' },
  { name: 'Python', slug: 'python', color: '#3776AB', category: 'Languages' },
  { name: 'Rust', slug: 'rust', color: '#DEA584', category: 'Languages' },
  { name: 'C++', slug: 'cplusplus', color: '#00599C', category: 'Languages' },
  { name: 'C#', slug: 'csharp', color: '#239120', category: 'Languages' },
  { name: 'PHP', slug: 'php', color: '#777BB4', category: 'Languages' },
  { name: 'Java', slug: 'openjdk', color: '#ED8B00', category: 'Languages' },
  { name: 'Kotlin', slug: 'kotlin', color: '#7F52FF', category: 'Languages' },
  { name: 'Swift', slug: 'swift', color: '#F05138', category: 'Languages' },
  { name: 'Dart', slug: 'dart', color: '#0175C2', category: 'Languages' },
  { name: 'Ruby', slug: 'ruby', color: '#CC342D', category: 'Languages' },
  { name: 'HTML5', slug: 'html5', color: '#E34F26', category: 'Frontend' },
  { name: 'CSS3', slug: 'css3', color: '#1572B6', category: 'Frontend' },

  // Frameworks & Frontend
  { name: 'Next.js', slug: 'nextdotjs', color: '#ffffff', category: 'Frontend' },
  { name: 'React', slug: 'react', color: '#61DAFB', category: 'Frontend' },
  { name: 'Vue.js', slug: 'vuedotjs', color: '#4FC08D', category: 'Frontend' },
  { name: 'Svelte', slug: 'svelte', color: '#FF3E00', category: 'Frontend' },
  { name: 'Angular', slug: 'angular', color: '#DD0031', category: 'Frontend' },
  { name: 'Astro', slug: 'astro', color: '#BC52EE', category: 'Frontend' },
  { name: 'Tailwind CSS', slug: 'tailwindcss', color: '#06B6D4', category: 'Frontend' },
  { name: 'Bootstrap', slug: 'bootstrap', color: '#7952B3', category: 'Frontend' },
  { name: 'Sass', slug: 'sass', color: '#CC6699', category: 'Frontend' },

  // Backend & Runtime
  { name: 'Node.js', slug: 'nodedotjs', color: '#5FA04E', category: 'Backend' },
  { name: 'Bun', slug: 'bun', color: '#FBF0DF', category: 'Backend' },
  { name: 'Laravel', slug: 'laravel', color: '#FF2D20', category: 'Backend' },
  { name: 'Django', slug: 'django', color: '#092E20', category: 'Backend' },
  { name: 'FastAPI', slug: 'fastapi', color: '#009688', category: 'Backend' },
  { name: 'Express', slug: 'express', color: '#ffffff', category: 'Backend' },
  { name: 'NestJS', slug: 'nestjs', color: '#E0234E', category: 'Backend' },
  { name: 'Spring Boot', slug: 'springboot', color: '#6DB33F', category: 'Backend' },
  { name: 'Ruby on Rails', slug: 'rubyonrails', color: '#CC0000', category: 'Backend' },
  { name: '.NET', slug: 'dotnet', color: '#512BD4', category: 'Backend' },
  { name: 'GraphQL', slug: 'graphql', color: '#E10098', category: 'Backend' },

  // Mobile & Cross-platform
  { name: 'Flutter', slug: 'flutter', color: '#02569B', category: 'Mobile' },
  { name: 'React Native', slug: 'react', color: '#61DAFB', category: 'Mobile' },
  { name: 'Electron', slug: 'electron', color: '#47848F', category: 'Desktop' },
  { name: 'Tauri', slug: 'tauri', color: '#24C8DB', category: 'Desktop' },

  // Databases & Storage
  { name: 'PostgreSQL', slug: 'postgresql', color: '#4169E1', category: 'Database' },
  { name: 'MySQL', slug: 'mysql', color: '#4479A1', category: 'Database' },
  { name: 'MongoDB', slug: 'mongodb', color: '#47A248', category: 'Database' },
  { name: 'Redis', slug: 'redis', color: '#DC382D', category: 'Database' },
  { name: 'SQLite', slug: 'sqlite', color: '#003B57', category: 'Database' },
  { name: 'Supabase', slug: 'supabase', color: '#3ECF8E', category: 'Database' },
  { name: 'Firebase', slug: 'firebase', color: '#FFCA28', category: 'Database' },
  { name: 'Prisma', slug: 'prisma', color: '#2D3748', category: 'Database' },

  // DevOps, Cloud & Tools
  { name: 'Docker', slug: 'docker', color: '#2496ED', category: 'DevOps' },
  { name: 'Kubernetes', slug: 'kubernetes', color: '#326CE5', category: 'DevOps' },
  { name: 'Linux', slug: 'linux', color: '#FCC624', category: 'DevOps' },
  { name: 'Git', slug: 'git', color: '#F05032', category: 'DevOps' },
  { name: 'GitHub', slug: 'github', color: '#ffffff', category: 'DevOps' },
  { name: 'GitLab', slug: 'gitlab', color: '#FC6D26', category: 'DevOps' },
  { name: 'AWS', slug: 'amazonwebservices', color: '#FF9900', category: 'Cloud' },
  { name: 'Google Cloud', slug: 'googlecloud', color: '#4285F4', category: 'Cloud' },
  { name: 'Azure', slug: 'microsoftazure', color: '#0078D4', category: 'Cloud' },
  { name: 'Vercel', slug: 'vercel', color: '#ffffff', category: 'Cloud' },
  { name: 'Cloudflare', slug: 'cloudflare', color: '#F38020', category: 'Cloud' },
  { name: 'Nginx', slug: 'nginx', color: '#009639', category: 'DevOps' },

  // AI & Data Science
  { name: 'OpenAI', slug: 'openai', color: '#10A37F', category: 'AI & Data' },
  { name: 'PyTorch', slug: 'pytorch', color: '#EE4C2C', category: 'AI & Data' },
  { name: 'TensorFlow', slug: 'tensorflow', color: '#FF6F00', category: 'AI & Data' },
  { name: 'Pandas', slug: 'pandas', color: '#150458', category: 'AI & Data' },

  // Design & Creative
  { name: 'Figma', slug: 'figma', color: '#F24E1E', category: 'Design' },
  { name: 'Blender', slug: 'blender', color: '#E87D0D', category: 'Design' },
  { name: 'Unity', slug: 'unity', color: '#ffffff', category: 'Game Dev' },
  { name: 'Unreal Engine', slug: 'unrealengine', color: '#ffffff', category: 'Game Dev' },
];

// Alias mapping dictionary for automatic name-to-slug resolution
const TECH_ALIAS_MAP = {
  // Go
  go: 'go',
  golang: 'go',

  // Next.js
  next: 'nextdotjs',
  nextjs: 'nextdotjs',
  'next.js': 'nextdotjs',
  nextdotjs: 'nextdotjs',

  // React & Vue
  react: 'react',
  reactjs: 'react',
  'react.js': 'react',
  'react native': 'react',
  vue: 'vuedotjs',
  vuejs: 'vuedotjs',
  'vue.js': 'vuedotjs',
  vuedotjs: 'vuedotjs',
  svelte: 'svelte',
  sveltekit: 'svelte',
  angular: 'angular',
  angularjs: 'angular',
  astro: 'astro',

  // Node & JS & TS
  node: 'nodedotjs',
  nodejs: 'nodedotjs',
  'node.js': 'nodedotjs',
  nodedotjs: 'nodedotjs',
  bun: 'bun',
  ts: 'typescript',
  typescript: 'typescript',
  js: 'javascript',
  javascript: 'javascript',

  // Languages
  python: 'python',
  py: 'python',
  rust: 'rust',
  rs: 'rust',
  cpp: 'cplusplus',
  'c++': 'cplusplus',
  cplusplus: 'cplusplus',
  csharp: 'csharp',
  'c#': 'csharp',
  dotnet: 'dotnet',
  '.net': 'dotnet',
  php: 'php',
  laravel: 'laravel',
  java: 'openjdk',
  kotlin: 'kotlin',
  swift: 'swift',
  dart: 'dart',
  flutter: 'flutter',
  ruby: 'ruby',
  rails: 'rubyonrails',
  'ruby on rails': 'rubyonrails',

  // Styling
  tailwind: 'tailwindcss',
  tailwindcss: 'tailwindcss',
  'tailwind css': 'tailwindcss',
  bootstrap: 'bootstrap',
  sass: 'sass',
  scss: 'sass',
  html: 'html5',
  html5: 'html5',
  css: 'css3',
  css3: 'css3',

  // Backend
  django: 'django',
  fastapi: 'fastapi',
  flask: 'flask',
  express: 'express',
  expressjs: 'express',
  nestjs: 'nestjs',
  spring: 'spring',
  springboot: 'springboot',
  'spring boot': 'springboot',
  graphql: 'graphql',

  // Databases
  postgres: 'postgresql',
  postgresql: 'postgresql',
  mysql: 'mysql',
  mongo: 'mongodb',
  mongodb: 'mongodb',
  redis: 'redis',
  sqlite: 'sqlite',
  supabase: 'supabase',
  firebase: 'firebase',
  prisma: 'prisma',

  // DevOps & Cloud
  docker: 'docker',
  k8s: 'kubernetes',
  kubernetes: 'kubernetes',
  linux: 'linux',
  ubuntu: 'ubuntu',
  debian: 'debian',
  git: 'git',
  github: 'github',
  gitlab: 'gitlab',
  aws: 'amazonwebservices',
  'amazon web services': 'amazonwebservices',
  gcp: 'googlecloud',
  'google cloud': 'googlecloud',
  azure: 'microsoftazure',
  vercel: 'vercel',
  netlify: 'netlify',
  cloudflare: 'cloudflare',
  nginx: 'nginx',

  // Design & Media
  figma: 'figma',
  blender: 'blender',
  unity: 'unity',
  unreal: 'unrealengine',
  'unreal engine': 'unrealengine',
  openai: 'openai',
  pytorch: 'pytorch',
  tensorflow: 'tensorflow',
};

/**
 * Automatically resolves a tech name or icon string into a valid SimpleIcons CDN slug or image URL
 * @param {string} name - e.g. "Go", "Next.js", "Rust", "Tailwind"
 * @param {string} customIcon - e.g. "go", "nextdotjs", "https://...", "Code2"
 * @param {string} customColor - optional hex color code
 */
export function resolveTechIcon(name = '', customIcon = '', customColor = '') {
  // If customIcon is already a full image URL (uploaded or external)
  if (customIcon && (customIcon.startsWith('http') || customIcon.startsWith('/') || customIcon.startsWith('data:'))) {
    return {
      isUrl: true,
      url: customIcon,
      slug: '',
      color: customColor || '#00f0aa',
    };
  }

  const rawKey = (customIcon || name || '').trim().toLowerCase();
  
  // 1. Check alias dictionary
  let resolvedSlug = TECH_ALIAS_MAP[rawKey];

  // 2. Check curated presets
  if (!resolvedSlug) {
    const matchedPreset = POPULAR_TECH_PRESETS.find(
      (p) => p.name.toLowerCase() === rawKey || p.slug.toLowerCase() === rawKey
    );
    if (matchedPreset) {
      resolvedSlug = matchedPreset.slug;
      if (!customColor && matchedPreset.color) {
        customColor = matchedPreset.color;
      }
    }
  }

  // 3. Normalize custom string (strip non-alphanumeric, dots, and dashes)
  if (!resolvedSlug && rawKey) {
    resolvedSlug = rawKey
      .replace(/\.js$/i, 'dotjs')
      .replace(/\.net$/i, 'dotnet')
      .replace(/\+/g, 'plus')
      .replace(/#/g, 'sharp')
      .replace(/[^a-z0-9]/g, '');
  }

  // Clean hex color for SimpleIcons CDN (remove '#' if present)
  const cleanColorHex = customColor ? customColor.replace('#', '') : '';

  // SimpleIcons CDN URL
  const cdnUrl = resolvedSlug
    ? `https://cdn.simpleicons.org/${resolvedSlug}${cleanColorHex ? `/${cleanColorHex}` : ''}`
    : '';

  return {
    isUrl: false,
    slug: resolvedSlug || '',
    color: customColor || '#00f0aa',
    url: cdnUrl,
  };
}

/**
 * Universal Tech Badge Icon Component
 * Renders high-resolution vector SVG icon with auto-fallback on error
 */
export function TechIcon({ name = '', icon = '', color = '#00f0aa', size = 16, className = '' }) {
  const [loadError, setLoadError] = useState(false);
  const resolved = resolveTechIcon(name, icon, color);

  if (!resolved.url || loadError) {
    return (
      <span className={`tech-icon-fallback ${className}`} style={{ color: color || '#00f0aa', display: 'inline-flex', alignItems: 'center' }}>
        <Code2 size={size} />
      </span>
    );
  }

  return (
    <img
      src={resolved.url}
      alt={name || 'Tech Icon'}
      width={size}
      height={size}
      className={`tech-badge-icon-img ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
      loading="lazy"
      onError={() => setLoadError(true)}
    />
  );
}
