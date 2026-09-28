/**
 * Search registry — static + dynamic entries for the editor command palette.
 *
 * Every entry carries a label, keywords for fuzzy matching, a category badge,
 * a Lucide icon name, and an action descriptor that tells the palette what to
 * do when the entry is selected.
 */

// ---------------------------------------------------------------------------
// Action entries (toolbar buttons)
// ---------------------------------------------------------------------------
const ACTION_ENTRIES = [
  {
    id: 'action-save',
    label: 'Save Changes',
    keywords: ['save', 'publish', 'deploy', 'commit'],
    category: 'Action',
    icon: 'Save',
    action: { type: 'callback', key: 'save' },
  },
  {
    id: 'action-undo',
    label: 'Undo',
    keywords: ['undo', 'revert', 'back', 'ctrl z'],
    category: 'Action',
    icon: 'Undo2',
    action: { type: 'callback', key: 'undo' },
  },
  {
    id: 'action-redo',
    label: 'Redo',
    keywords: ['redo', 'forward', 'ctrl y'],
    category: 'Action',
    icon: 'Redo2',
    action: { type: 'callback', key: 'redo' },
  },
  {
    id: 'action-preview',
    label: 'Preview Profile',
    keywords: ['preview', 'view', 'open', 'public', 'live'],
    category: 'Action',
    icon: 'Eye',
    action: { type: 'callback', key: 'preview' },
  },
  {
    id: 'action-exit',
    label: 'Exit Editor',
    keywords: ['exit', 'close', 'leave', 'quit', 'back'],
    category: 'Action',
    icon: 'X',
    action: { type: 'callback', key: 'exit' },
  },
  {
    id: 'action-add-block',
    label: 'Add Block',
    keywords: ['add', 'new', 'block', 'section', 'create', 'insert'],
    category: 'Action',
    icon: 'Plus',
    action: { type: 'open-add-block' },
  },
  {
    id: 'action-manage-tabs',
    label: 'Manage Tabs',
    keywords: ['tabs', 'pages', 'manage', 'organize', 'reorder', 'navigation'],
    category: 'Action',
    icon: 'FolderKanban',
    action: { type: 'open-tab-manager' },
  },
  {
    id: 'action-theme',
    label: 'Open Theme Panel',
    keywords: ['theme', 'style', 'design', 'customize', 'appearance', 'look'],
    category: 'Action',
    icon: 'Palette',
    action: { type: 'open-theme', section: 'style' },
  },
  {
    id: 'action-account',
    label: 'Account Settings',
    keywords: ['account', 'settings', 'profile', 'avatar', 'picture', 'username', 'password'],
    category: 'Action',
    icon: 'Settings',
    action: { type: 'open-account-settings', tab: 'profile' },
  },
  {
    id: 'action-dark-light',
    label: 'Toggle Editor Dark / Light Mode',
    keywords: ['dark', 'light', 'mode', 'theme', 'toggle', 'night', 'day', 'editor'],
    category: 'Action',
    icon: 'Moon',
    action: { type: 'callback', key: 'toggleEditorTheme' },
  },
];

// ---------------------------------------------------------------------------
// Theme section entries
// ---------------------------------------------------------------------------
const THEME_SECTION_ENTRIES = [
  {
    id: 'theme-sec-preset',
    label: 'Design Presets',
    keywords: ['preset', 'template', 'style', 'design', 'field notes', 'obsidian', 'midnight', 'brutalist', 'aurora'],
    category: 'Theme',
    icon: 'Sparkles',
    action: { type: 'open-theme', section: 'style' },
  },
  {
    id: 'theme-sec-typography',
    label: 'Typography',
    keywords: ['font', 'typography', 'text', 'heading', 'body', 'mono', 'serif', 'typeface', 'letter'],
    category: 'Theme',
    icon: 'Type',
    action: { type: 'open-theme', section: 'typography' },
  },
  {
    id: 'theme-sec-colors',
    label: 'Colors',
    keywords: ['color', 'palette', 'hue', 'shade', 'tint', 'scheme'],
    category: 'Theme',
    icon: 'Palette',
    action: { type: 'open-theme', section: 'colors' },
  },
  {
    id: 'theme-sec-layout',
    label: 'Layout',
    keywords: ['layout', 'spacing', 'gap', 'padding', 'radius', 'border', 'card', 'glass', 'animation', 'speed', 'divider'],
    category: 'Theme',
    icon: 'Layers',
    action: { type: 'open-theme', section: 'layout' },
  },
  {
    id: 'theme-sec-navigation',
    label: 'Tab Navigation',
    keywords: ['navigation', 'tab', 'bar', 'nav', 'button', 'active'],
    category: 'Theme',
    icon: 'Compass',
    action: { type: 'open-theme', section: 'navigation' },
  },
  {
    id: 'theme-sec-backgrounds',
    label: 'Backgrounds',
    keywords: ['background', 'image', 'wallpaper', 'gradient', 'overlay', 'blur', 'photo'],
    category: 'Theme',
    icon: 'Image',
    action: { type: 'open-theme', section: 'backgrounds' },
  },
];

// ---------------------------------------------------------------------------
// Individual theme field entries
// ---------------------------------------------------------------------------
const THEME_FIELD_ENTRIES = [
  // Colors section
  { id: 'tf-bg-color', label: 'Background Color', keywords: ['background', 'color', 'canvas', 'page'], category: 'Colors', icon: 'Palette', action: { type: 'open-theme', section: 'colors', field: 'global.backgroundColor' } },
  { id: 'tf-heading-color', label: 'Heading Color', keywords: ['heading', 'title', 'color', 'h1', 'h2'], category: 'Colors', icon: 'Palette', action: { type: 'open-theme', section: 'colors', field: 'global.headingColor' } },
  { id: 'tf-text-color', label: 'Text Color', keywords: ['text', 'body', 'paragraph', 'color'], category: 'Colors', icon: 'Palette', action: { type: 'open-theme', section: 'colors', field: 'global.textColor' } },
  { id: 'tf-text-muted', label: 'Muted Text Color', keywords: ['muted', 'secondary', 'subtle', 'dim', 'gray'], category: 'Colors', icon: 'Palette', action: { type: 'open-theme', section: 'colors', field: 'global.textColorMuted' } },
  { id: 'tf-accent', label: 'Accent Color', keywords: ['accent', 'primary', 'highlight', 'brand', 'green', 'tint'], category: 'Colors', icon: 'Palette', action: { type: 'open-theme', section: 'colors', field: 'global.accentColor' } },
  { id: 'tf-accent-sec', label: 'Secondary Accent Color', keywords: ['secondary', 'accent', 'alternate'], category: 'Colors', icon: 'Palette', action: { type: 'open-theme', section: 'colors', field: 'global.accentColorSecondary' } },
  { id: 'tf-card-bg', label: 'Card Background', keywords: ['card', 'background', 'surface', 'panel'], category: 'Colors', icon: 'Square', action: { type: 'open-theme', section: 'colors', field: 'global.cardBackground' } },
  { id: 'tf-card-border', label: 'Card Border Color', keywords: ['card', 'border', 'outline', 'stroke'], category: 'Colors', icon: 'Square', action: { type: 'open-theme', section: 'colors', field: 'global.cardBorder' } },
  { id: 'tf-card-heading', label: 'Card Heading Color', keywords: ['card', 'heading', 'title'], category: 'Colors', icon: 'Square', action: { type: 'open-theme', section: 'colors', field: 'global.cardHeadingColor' } },
  { id: 'tf-card-text', label: 'Card Text Color', keywords: ['card', 'text', 'body'], category: 'Colors', icon: 'Square', action: { type: 'open-theme', section: 'colors', field: 'global.cardTextColor' } },
  { id: 'tf-card-text-muted', label: 'Card Muted Text', keywords: ['card', 'muted', 'subtle'], category: 'Colors', icon: 'Square', action: { type: 'open-theme', section: 'colors', field: 'global.cardTextMuted' } },
  { id: 'tf-btn-bg', label: 'Button Background', keywords: ['button', 'background', 'cta', 'primary'], category: 'Colors', icon: 'Square', action: { type: 'open-theme', section: 'colors', field: 'global.buttonBackground' } },
  { id: 'tf-btn-text', label: 'Button Text Color', keywords: ['button', 'text', 'label'], category: 'Colors', icon: 'Square', action: { type: 'open-theme', section: 'colors', field: 'global.buttonTextColor' } },

  // Typography section
  { id: 'tf-heading-font', label: 'Heading Font', keywords: ['heading', 'font', 'typeface', 'display', 'title'], category: 'Typography', icon: 'Type', action: { type: 'open-theme', section: 'typography', field: 'global.headingFont' } },
  { id: 'tf-body-font', label: 'Body Font', keywords: ['body', 'font', 'text', 'paragraph', 'sans'], category: 'Typography', icon: 'Type', action: { type: 'open-theme', section: 'typography', field: 'global.fontFamily' } },
  { id: 'tf-mono-font', label: 'Monospace Font', keywords: ['mono', 'code', 'monospace', 'terminal', 'console'], category: 'Typography', icon: 'Type', action: { type: 'open-theme', section: 'typography', field: 'global.monoFont' } },
  { id: 'tf-serif-font', label: 'Serif / Journal Font', keywords: ['serif', 'journal', 'editorial', 'book', 'literary'], category: 'Typography', icon: 'Type', action: { type: 'open-theme', section: 'typography', field: 'global.serifFont' } },
  { id: 'tf-font-size', label: 'Base Font Size', keywords: ['font', 'size', 'base', 'scale', 'text', 'bigger', 'smaller'], category: 'Typography', icon: 'Type', action: { type: 'open-theme', section: 'typography', field: 'global.baseFontSize' } },
  { id: 'tf-heading-weight', label: 'Heading Font Weight', keywords: ['weight', 'bold', 'heading', 'thick', 'thin'], category: 'Typography', icon: 'Type', action: { type: 'open-theme', section: 'typography', field: 'global.headingFontWeight' } },

  // Layout section
  { id: 'tf-border-radius', label: 'Border Radius', keywords: ['radius', 'rounded', 'corner', 'sharp', 'square'], category: 'Layout', icon: 'Sliders', action: { type: 'open-theme', section: 'layout', field: 'global.borderRadius' } },
  { id: 'tf-glass-blur', label: 'Glass Blur', keywords: ['glass', 'blur', 'frost', 'frosted', 'transparent'], category: 'Layout', icon: 'Sliders', action: { type: 'open-theme', section: 'layout', field: 'global.glassBlur' } },
  { id: 'tf-animation-speed', label: 'Animation Speed', keywords: ['animation', 'speed', 'transition', 'motion', 'fast', 'slow'], category: 'Layout', icon: 'Sliders', action: { type: 'open-theme', section: 'layout', field: 'global.animationSpeed' } },
  { id: 'tf-block-gap', label: 'Block Gap / Spacing', keywords: ['gap', 'spacing', 'margin', 'distance', 'between', 'block'], category: 'Layout', icon: 'Sliders', action: { type: 'open-theme', section: 'layout', field: 'global.blockGap' } },
  { id: 'tf-block-padding', label: 'Block Padding', keywords: ['padding', 'inner', 'inset', 'block'], category: 'Layout', icon: 'Sliders', action: { type: 'open-theme', section: 'layout', field: 'global.blockPadding' } },
  { id: 'tf-divider', label: 'Block Divider Style', keywords: ['divider', 'separator', 'line', 'between', 'hr'], category: 'Layout', icon: 'Sliders', action: { type: 'open-theme', section: 'layout', field: 'global.blockDividerStyle' } },
  { id: 'tf-card-shadow', label: 'Card Shadow', keywords: ['shadow', 'elevation', 'depth', 'drop', 'card'], category: 'Layout', icon: 'Sliders', action: { type: 'open-theme', section: 'layout', field: 'global.cardBoxShadow' } },
  { id: 'tf-card-border-width', label: 'Card Border Width', keywords: ['border', 'width', 'thickness', 'card', 'stroke'], category: 'Layout', icon: 'Sliders', action: { type: 'open-theme', section: 'layout', field: 'global.cardBorderWidth' } },
  { id: 'tf-pill-style', label: 'Pill / Badge Style', keywords: ['pill', 'badge', 'tag', 'chip', 'label', 'style'], category: 'Layout', icon: 'Sliders', action: { type: 'open-theme', section: 'layout', field: 'global.pillStyle' } },
  { id: 'tf-button-style', label: 'Button Style', keywords: ['button', 'style', 'tactile', 'flat', 'glow', 'brutalist'], category: 'Layout', icon: 'Sliders', action: { type: 'open-theme', section: 'layout', field: 'global.buttonStyle' } },
  { id: 'tf-icon-style', label: 'Icon Style', keywords: ['icon', 'style', 'glass', 'bordered', 'glow', 'flat'], category: 'Layout', icon: 'Sliders', action: { type: 'open-theme', section: 'layout', field: 'global.iconStyle' } },

  // Navigation section
  { id: 'tf-tab-nav-bg', label: 'Tab Bar Background', keywords: ['tab', 'bar', 'background', 'navigation', 'nav'], category: 'Navigation', icon: 'Compass', action: { type: 'open-theme', section: 'navigation', field: 'global.tabNavBackground' } },
  { id: 'tf-tab-btn-bg', label: 'Tab Button Background', keywords: ['tab', 'button', 'background', 'inactive'], category: 'Navigation', icon: 'Compass', action: { type: 'open-theme', section: 'navigation', field: 'global.tabButtonBackground' } },
  { id: 'tf-tab-btn-text', label: 'Tab Button Text Color', keywords: ['tab', 'button', 'text', 'label', 'color'], category: 'Navigation', icon: 'Compass', action: { type: 'open-theme', section: 'navigation', field: 'global.tabButtonTextColor' } },
  { id: 'tf-tab-active-bg', label: 'Active Tab Background', keywords: ['tab', 'active', 'selected', 'current', 'background'], category: 'Navigation', icon: 'Compass', action: { type: 'open-theme', section: 'navigation', field: 'global.tabButtonActiveBackground' } },
  { id: 'tf-tab-active-text', label: 'Active Tab Text Color', keywords: ['tab', 'active', 'selected', 'text', 'color'], category: 'Navigation', icon: 'Compass', action: { type: 'open-theme', section: 'navigation', field: 'global.tabButtonActiveTextColor' } },

  // Backgrounds section
  { id: 'tf-bg-gradient', label: 'Background Gradient', keywords: ['gradient', 'background', 'blend', 'fade', 'linear', 'radial'], category: 'Backgrounds', icon: 'Image', action: { type: 'open-theme', section: 'backgrounds', field: 'global.backgroundGradient' } },
  { id: 'tf-bg-image', label: 'Background Image', keywords: ['background', 'image', 'wallpaper', 'photo', 'picture', 'upload'], category: 'Backgrounds', icon: 'Image', action: { type: 'open-theme', section: 'backgrounds', field: 'global.backgroundImage' } },
  { id: 'tf-bg-overlay', label: 'Background Overlay Opacity', keywords: ['overlay', 'opacity', 'dim', 'darken', 'lighten', 'transparency'], category: 'Backgrounds', icon: 'Image', action: { type: 'open-theme', section: 'backgrounds', field: 'global.backgroundOverlayOpacity' } },
];

// ---------------------------------------------------------------------------
// Block type entries (for adding new blocks)
// ---------------------------------------------------------------------------
const BLOCK_TYPE_ENTRIES = [
  { id: 'block-hero', label: 'Add Hero Block', keywords: ['hero', 'profile', 'avatar', 'bio', 'headline', 'social', 'links', 'cta', 'intro'], category: 'Block', icon: 'User', action: { type: 'open-add-block', blockType: 'hero' } },
  { id: 'block-services', label: 'Add Services Block', keywords: ['services', 'pricing', 'commission', 'freelance', 'rates', 'tiers'], category: 'Block', icon: 'Briefcase', action: { type: 'open-add-block', blockType: 'services' } },
  { id: 'block-skills', label: 'Add Skills Block', keywords: ['skills', 'technologies', 'tools', 'stack', 'expertise', 'abilities'], category: 'Block', icon: 'Code2', action: { type: 'open-add-block', blockType: 'skills' } },
  { id: 'block-cards-grid', label: 'Add Projects / Cards Grid', keywords: ['projects', 'cards', 'grid', 'portfolio', 'work', 'case study'], category: 'Block', icon: 'Layers', action: { type: 'open-add-block', blockType: 'cards_grid' } },
  { id: 'block-timeline', label: 'Add Timeline Block', keywords: ['timeline', 'experience', 'history', 'work', 'career', 'education'], category: 'Block', icon: 'Briefcase', action: { type: 'open-add-block', blockType: 'timeline' } },
  { id: 'block-media-reviews', label: 'Add Media Reviews Block', keywords: ['media', 'reviews', 'anime', 'movie', 'book', 'game', 'rating'], category: 'Block', icon: 'Film', action: { type: 'open-add-block', blockType: 'media_reviews' } },
  { id: 'block-journal', label: 'Add Journal Block', keywords: ['journal', 'blog', 'diary', 'thoughts', 'writing', 'entries', 'articles'], category: 'Block', icon: 'BookOpen', action: { type: 'open-add-block', blockType: 'journal' } },
  { id: 'block-specs-grid', label: 'Add Specs Grid Block', keywords: ['specs', 'setup', 'gear', 'equipment', 'hardware', 'software', 'pc'], category: 'Block', icon: 'Cpu', action: { type: 'open-add-block', blockType: 'specs_grid' } },
  { id: 'block-stacked-deck', label: 'Add Stacked Deck Block', keywords: ['stacked', 'deck', 'cards', 'carousel', 'slider', 'showcase'], category: 'Block', icon: 'Layers', action: { type: 'open-add-block', blockType: 'stacked_deck' } },
  { id: 'block-gallery', label: 'Add Gallery Block', keywords: ['gallery', 'images', 'photos', 'pictures', 'portfolio', 'art', 'screenshots'], category: 'Block', icon: 'Image', action: { type: 'open-add-block', blockType: 'gallery' } },
  { id: 'block-events', label: 'Add Events Block', keywords: ['events', 'calendar', 'schedule', 'streams', 'meetups', 'dates'], category: 'Block', icon: 'Target', action: { type: 'open-add-block', blockType: 'events' } },
  { id: 'block-featured-video', label: 'Add Featured Video Block', keywords: ['featured', 'video', 'youtube', 'showcase', 'embed', 'clip'], category: 'Block', icon: 'Video', action: { type: 'open-add-block', blockType: 'featured_video' } },
  { id: 'block-video-gallery', label: 'Add Video Gallery Block', keywords: ['video', 'gallery', 'collection', 'youtube', 'clips', 'reel'], category: 'Block', icon: 'Film', action: { type: 'open-add-block', blockType: 'video_gallery' } },
  { id: 'block-github-heatmap', label: 'Add GitHub Heatmap Block', keywords: ['github', 'heatmap', 'contributions', 'commits', 'activity', 'git'], category: 'Block', icon: 'Github', action: { type: 'open-add-block', blockType: 'github_heatmap' } },
  { id: 'block-music-player', label: 'Add Music Player Block', keywords: ['music', 'player', 'spotify', 'playlist', 'songs', 'tracks', 'audio'], category: 'Block', icon: 'Music', action: { type: 'open-add-block', blockType: 'music_player' } },
  { id: 'block-milestones', label: 'Add Milestones Block', keywords: ['milestones', 'achievements', 'goals', 'stats', 'numbers', 'metrics'], category: 'Block', icon: 'Target', action: { type: 'open-add-block', blockType: 'milestones' } },
];

// ---------------------------------------------------------------------------
// Account settings entries
// ---------------------------------------------------------------------------
const ACCOUNT_ENTRIES = [
  { id: 'acc-avatar', label: 'Change Profile Picture', keywords: ['avatar', 'picture', 'photo', 'profile', 'image', 'pfp'], category: 'Account', icon: 'User', action: { type: 'open-account-settings', tab: 'profile' } },
  { id: 'acc-display-name', label: 'Change Display Name', keywords: ['display', 'name', 'full name'], category: 'Account', icon: 'User', action: { type: 'open-account-settings', tab: 'profile' } },
  { id: 'acc-username', label: 'Change Username', keywords: ['username', 'handle', 'url', 'slug'], category: 'Account', icon: 'User', action: { type: 'open-account-settings', tab: 'profile' } },
  { id: 'acc-bio', label: 'Change Account Bio', keywords: ['bio', 'description', 'about'], category: 'Account', icon: 'User', action: { type: 'open-account-settings', tab: 'profile' } },
  { id: 'acc-public', label: 'Profile Visibility (Public / Private)', keywords: ['public', 'private', 'visibility', 'hidden', 'visible'], category: 'Account', icon: 'Globe', action: { type: 'open-account-settings', tab: 'profile' } },
  { id: 'acc-password', label: 'Change Password', keywords: ['password', 'security', 'credentials', 'login'], category: 'Account', icon: 'Lock', action: { type: 'open-account-settings', tab: 'security' } },
  { id: 'acc-logout', label: 'Logout', keywords: ['logout', 'sign out', 'session', 'exit'], category: 'Account', icon: 'LogOut', action: { type: 'open-account-settings', tab: 'security' } },
  { id: 'acc-delete', label: 'Delete Account', keywords: ['delete', 'remove', 'destroy', 'account'], category: 'Account', icon: 'Trash2', action: { type: 'open-account-settings', tab: 'security' } },
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const STATIC_ENTRIES = [
  ...ACTION_ENTRIES,
  ...THEME_SECTION_ENTRIES,
  ...THEME_FIELD_ENTRIES,
  ...BLOCK_TYPE_ENTRIES,
  ...ACCOUNT_ENTRIES,
];

/**
 * Build the full searchable entry list.
 *
 * @param {Array} userBlocks — blocks currently on the active tab, each with
 *   `{ id, type, title }`. These are turned into "Edit <title>" entries so the
 *   user can jump straight to editing a specific block.
 */
export function buildSearchEntries(userBlocks = []) {
  const dynamicBlockEntries = userBlocks.map((b) => ({
    id: `edit-block-${b.id}`,
    label: `Edit: ${b.title || b.type}`,
    keywords: [b.type, b.title, 'edit', 'modify', 'change', 'update'].filter(Boolean).map((s) => s.toLowerCase()),
    category: 'Your Blocks',
    icon: 'Edit3',
    action: { type: 'open-block-editor', blockId: b.id },
  }));

  return [...STATIC_ENTRIES, ...dynamicBlockEntries];
}

/**
 * Fuzzy match a query against a text string.
 * Returns a score (higher = better). 0 = no match.
 */
export function scoreMatch(query, text) {
  if (!query || !text) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();

  // Exact prefix
  if (t.startsWith(q)) return 100;
  // Contains
  if (t.includes(q)) return 80;
  // Subsequence
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  if (qi === q.length) return 50;

  return 0;
}

/**
 * Search the entries and return up to `limit` results ranked by relevance.
 */
export function searchEntries(entries, query, limit = 10) {
  if (!query.trim()) return [];

  const scored = [];
  for (const entry of entries) {
    const labelScore = scoreMatch(query, entry.label);
    let bestKeyword = 0;
    for (const kw of entry.keywords) {
      const s = scoreMatch(query, kw);
      if (s > bestKeyword) bestKeyword = s;
    }
    const score = Math.max(labelScore, bestKeyword * 0.9);
    if (score > 0) {
      scored.push({ entry, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.entry);
}
