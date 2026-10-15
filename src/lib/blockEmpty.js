const hasItems = (v) => Array.isArray(v) && v.length > 0;

/**
 * True when a block has nothing to show a visitor. Mirrors the empty-state
 * checks inside each block component; types not listed are never empty.
 */
export function isBlockEmpty(block) {
  const d = block?.data || {};
  switch (block?.type) {
    case 'stacked_deck':
      return !hasItems(d.images);
    case 'featured_video':
    case 'video':
      return !d.videoUrl && !d.title && !d.description;
    case 'music_player':
      return !hasItems(d.items) && !d.embedUrl;
    case 'contact':
      return !hasItems(d.fields);
    case 'github_heatmap':
      return !d.username;
    case 'cards_grid':
    case 'events':
    case 'calendar':
    case 'gallery':
    case 'media_reviews':
    case 'services':
    case 'commission':
    case 'skills':
    case 'specs_grid':
    case 'timeline':
    case 'video_gallery':
    case 'milestones':
    case 'journal':
      return !hasItems(d.items);
    default:
      return false;
  }
}

/** True when a visitor would see nothing on the tab: every block is hidden or empty. */
export function isTabEmpty(tab) {
  return (tab?.blocks || []).every((block) => !block || block.hidden || isBlockEmpty(block));
}
