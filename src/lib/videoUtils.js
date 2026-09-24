/**
 * Video URL Parser & Optimization Utility
 * Extracts video IDs, platforms, optimized embed URLs, and default poster thumbnails.
 */

export function parseVideoUrl(url) {
  if (!url || typeof url !== 'string') {
    return {
      type: 'unknown',
      videoId: null,
      embedUrl: null,
      thumbnailUrl: null,
      isDirect: false,
      platform: 'Video',
    };
  }

  const cleanUrl = url.trim();

  // 1. YouTube (standard watch, youtu.be shortlinks, embed, shorts)
  const ytMatch = cleanUrl.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      fallbackThumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      isDirect: false,
      platform: 'YouTube',
    };
  }

  // 2. Vimeo
  const vimeoMatch = cleanUrl.match(/(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/(?:\d+\/)?video\/|video\/|))(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1`,
      thumbnailUrl: null, // Vimeo requires async API or custom uploaded poster
      isDirect: false,
      platform: 'Vimeo',
    };
  }

  // 3. Streamable
  const streamableMatch = cleanUrl.match(/streamable\.com\/([a-zA-Z0-9]+)/i);
  if (streamableMatch && streamableMatch[1]) {
    const videoId = streamableMatch[1];
    return {
      type: 'streamable',
      videoId,
      embedUrl: `https://streamable.com/e/${videoId}?autoplay=1`,
      thumbnailUrl: `https://cdn-cf-east.streamable.com/image/${videoId}.jpg`,
      isDirect: false,
      platform: 'Streamable',
    };
  }

  // 4. Loom
  const loomMatch = cleanUrl.match(/loom\.com\/share\/([a-zA-Z0-9]+)/i);
  if (loomMatch && loomMatch[1]) {
    const videoId = loomMatch[1];
    return {
      type: 'loom',
      videoId,
      embedUrl: `https://www.loom.com/embed/${videoId}?autoplay=1`,
      thumbnailUrl: null,
      isDirect: false,
      platform: 'Loom',
    };
  }

  // 5. Direct Video Files (.mp4, .webm, .mov, /uploads/)
  const isDirect = /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i.test(cleanUrl) || cleanUrl.includes('/uploads/');
  if (isDirect) {
    return {
      type: 'direct',
      videoId: null,
      embedUrl: cleanUrl,
      thumbnailUrl: null,
      isDirect: true,
      platform: 'Direct Video',
    };
  }

  // 6. Generic or Custom Embed
  return {
    type: 'custom',
    videoId: null,
    embedUrl: cleanUrl,
    thumbnailUrl: null,
    isDirect: false,
    platform: 'Video',
  };
}
