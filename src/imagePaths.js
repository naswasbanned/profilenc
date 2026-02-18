// Central place to configure image paths used across the app.
// Put your actual image files under `public/images/...` matching these paths,
// or update these strings to point wherever you prefer.

import { s } from "framer-motion/client";

export const imagePaths = {
  // Profile avatars (square, used at ~160×160 in UI)
  // Recommended: 160×160 or larger square (e.g. 512×512) so it stays sharp.
  devAvatar: '/images/profile/dev-avatar.png',
  csAvatar: '/images/profile/cs-avatar.png',

  // Gaming setup (CS side) – small card thumbnails
  // Recommended: around 200×140 or larger with similar aspect ratio.
  setupMonitor: '/images/setup/monitor.png',
  setupMouse: '/images/setup/mouse.png',
  setupKeyboard: '/images/setup/keyboard.png',
  setupHeadset: '/images/setup/headset.png',

  // Programmer projects – wide banner image (~480×180 in UI)
  // Recommended: 480×180 or any 8:3 / 16:6 ratio, at least that large.
  project1: '/images/projects/competitive-programming-module.png',
  project2: '/images/projects/advance-quiz-platform.png',
  project3: '/images/projects/halalcraft.png',
  project4: '/images/projects/template.png',

  // CS highlight clips – medium-wide thumbnails (~380×160 in UI)
  // Recommended: 1920x620 or similar 19:8 ratio.
  highlight1: '/images/gaming/highlights/highlight-1.png',
  highlight2: '/images/gaming/highlights/highlight-2.png',
  highlight3: '/images/gaming/highlights/highlight-3.png',

  // Currently playing games – smaller wide thumbnails (~380×100 in UI)
  // Recommended: 380×100 or similar 19:5 ratio.
  game1: '/images/gaming/currently-playing/ace.png',
  game2: '/images/gaming/currently-playing/raidou.png',
  game3: '/images/gaming/currently-playing/smt4.png',

  // Favorite story games – large wide banners (~560×140 in UI)
  // Recommended: 1920x620 or similar 4:1 ratio.
  story1: '/images/gaming/story-games/p4g.webp',
  story2: '/images/gaming/story-games/rdr2.png',
  story3: '/images/gaming/story-games/elden-ring.webp',
  story4: '/images/gaming/story-games/kh2.png',
  story5: '/images/gaming/story-games/e33.jpg',
  story6: '/images/gaming/story-games/ff7.jpg',
  story7: '/images/gaming/story-games/metaphor.jpg',
  story8: '/images/gaming/story-games/p3r.png',
  story9: '/images/gaming/story-games/gowr.jpg',
  story10: '/images/gaming/story-games/spiderman.jpg',
  story11: '/images/gaming/story-games/p5r.jpg',
  story12: '/images/gaming/story-games/gow.jpg',
};
