import { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Music, Disc3, ExternalLink } from 'lucide-react';

/**
 * Detect provider from embed URL and return normalized embed src with autoplay support.
 */
function parseEmbedUrl(url, autoplay = false) {
  if (!url) return { provider: null, embedSrc: null, defaultHeight: 80 };

  // Spotify
  // Accepts: open.spotify.com/track/xxx, open.spotify.com/album/xxx, open.spotify.com/playlist/xxx
  const spotifyMatch = url.match(/open\.spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/);
  if (spotifyMatch) {
    const isSingleTrack = spotifyMatch[1] === 'track';
    return {
      provider: 'spotify',
      embedSrc: `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}?utm_source=generator&theme=0${autoplay ? '&autoplay=1' : ''}`,
      defaultHeight: isSingleTrack ? 152 : 352,
    };
  }

  // Already an embed URL
  if (url.includes('open.spotify.com/embed')) {
    const sep = url.includes('?') ? '&' : '?';
    return {
      provider: 'spotify',
      embedSrc: autoplay && !url.includes('autoplay=1') ? `${url}${sep}autoplay=1` : url,
      defaultHeight: 152,
    };
  }

  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) {
    return {
      provider: 'youtube',
      embedSrc: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=${autoplay ? '1' : '0'}&enablejsapi=1&playsinline=1&rel=0`,
      defaultHeight: 200,
    };
  }

  // SoundCloud
  if (url.includes('soundcloud.com')) {
    return {
      provider: 'soundcloud',
      embedSrc: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%2300f0aa&auto_play=${autoplay ? 'true' : 'false'}&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`,
      defaultHeight: 166,
    };
  }

  // Apple Music
  if (url.includes('music.apple.com')) {
    const appleEmbed = url.replace('music.apple.com', 'embed.music.apple.com');
    return {
      provider: 'apple',
      embedSrc: appleEmbed,
      defaultHeight: 150,
    };
  }

  // Unknown — try as direct iframe src
  return { provider: 'other', embedSrc: url, defaultHeight: 120 };
}

const PROVIDER_LABELS = {
  spotify: 'Spotify',
  youtube: 'YouTube',
  soundcloud: 'SoundCloud',
  apple: 'Apple Music',
  other: 'Link',
};

const PROVIDER_COLORS = {
  spotify: '#1db954',
  youtube: '#ff0000',
  soundcloud: '#ff5500',
  apple: '#fc3c44',
  other: '#888',
};

function VinylDisc({ artworkUrl, isPlaying, onClick }) {
  return (
    <div className="vinyl-player-disc-container" onClick={onClick}>
      {/* Tonearm */}
      <div className={`vinyl-tonearm ${isPlaying ? 'playing' : ''}`}>
        <div className="tonearm-base" />
        <div className="tonearm-arm" />
        <div className="tonearm-head" />
      </div>

      {/* Vinyl record */}
      <div className={`vinyl-disc ${isPlaying ? 'spinning' : ''}`}>
        {/* Grooves */}
        <div className="vinyl-groove vinyl-groove-1" />
        <div className="vinyl-groove vinyl-groove-2" />
        <div className="vinyl-groove vinyl-groove-3" />
        <div className="vinyl-groove vinyl-groove-4" />

        {/* Center label / artwork */}
        <div className="vinyl-center">
          {artworkUrl ? (
            <img src={artworkUrl} alt="Album art" className="vinyl-artwork" />
          ) : (
            <div className="vinyl-center-default">
              <Disc3 size={28} />
            </div>
          )}
        </div>

        {/* Center hole */}
        <div className="vinyl-hole" />
      </div>

      {/* Play/Pause overlay */}
      <div className="vinyl-play-overlay">
        {isPlaying ? <Pause size={28} /> : <Play size={28} />}
      </div>
    </div>
  );
}

function getTrackArtwork(track) {
  if (track?.artworkUrl) return track.artworkUrl;
  if (!track?.embedUrl) return null;
  const ytMatch = track.embedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  }
  return null;
}

export default function MusicPlayerBlock({ data }) {
  const items = useMemo(() => {
    // Support single track or playlist
    if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
      return data.items;
    }
    // Single track fallback
    if (data?.embedUrl) {
      return [
        {
          id: 'single',
          embedUrl: data.embedUrl,
          artworkUrl: data.artworkUrl || null,
          title: data.trackTitle || data.title || 'Now Playing',
          artist: data.artist || '',
        },
      ];
    }
    return [];
  }, [data]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(() => !!data?.autoplay);
  const iframeRef = useRef(null);

  const currentTrack = items[currentIndex] || null;
  const parsed = useMemo(
    () => parseEmbedUrl(currentTrack?.embedUrl, isPlaying || data?.autoplay),
    [currentTrack?.embedUrl, isPlaying, data?.autoplay]
  );

  // Send play/pause commands to YouTube iframe via postMessage API
  useEffect(() => {
    if (!iframeRef.current?.contentWindow) return;
    try {
      if (isPlaying) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo', args: '' }),
          '*'
        );
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'unMute', args: '' }),
          '*'
        );
      } else {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'pauseVideo', args: '' }),
          '*'
        );
      }
    } catch {
      // ignore cross-origin error
    }
  }, [isPlaying, currentIndex]);

  // Mobile Autoplay unlock: mobile browsers (iOS/Android) block unmuted audio until first user interaction.
  // This listener starts audio the moment the user touches/taps anywhere on the screen to scroll or browse.
  useEffect(() => {
    if (!data?.autoplay) return;

    let unlocked = false;
    const unlockAudio = () => {
      if (unlocked) return;
      unlocked = true;
      setIsPlaying(true);
      if (iframeRef.current?.contentWindow) {
        try {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'playVideo', args: '' }),
            '*'
          );
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'unMute', args: '' }),
            '*'
          );
        } catch {
          // ignore
        }
      }
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('click', unlockAudio);
    };

    window.addEventListener('touchstart', unlockAudio, { passive: true, once: true });
    window.addEventListener('pointerdown', unlockAudio, { passive: true, once: true });
    window.addEventListener('click', unlockAudio, { passive: true, once: true });

    return () => {
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('click', unlockAudio);
    };
  }, [data?.autoplay]);

  const handlePlayToggle = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleNext = () => {
    if (items.length <= 1) return;
    setIsPlaying(true);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    if (items.length <= 1) return;
    setIsPlaying(true);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  if (!items.length) {
    return (
      <div className="music-player-empty">
        <Music size={32} />
        <p>Add a Spotify, YouTube, or SoundCloud link to start</p>
      </div>
    );
  }

  const showVisibleEmbed = data?.showEmbed === true || data?.displayMode === 'embedded';

  return (
    <div className="music-player-block">
      <div className="music-player-layout">
        {/* Vinyl Disc Visual */}
        <VinylDisc
          artworkUrl={getTrackArtwork(currentTrack)}
          isPlaying={isPlaying}
          onClick={handlePlayToggle}
        />

        {/* Track Info + Controls */}
        <div className="music-player-info">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="music-track-details"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <h4 className="music-track-title">
                {currentTrack?.title || 'Untitled Track'}
              </h4>
              {currentTrack?.artist && (
                <p className="music-track-artist">{currentTrack.artist}</p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Playback Controls */}
          <div className="music-controls">
            <button
              type="button"
              className="music-control-btn"
              onClick={handlePrev}
              disabled={items.length <= 1}
              aria-label="Previous track"
            >
              <SkipBack size={18} />
            </button>
            <button
              type="button"
              className="music-control-btn music-play-btn"
              onClick={handlePlayToggle}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              type="button"
              className="music-control-btn"
              onClick={handleNext}
              disabled={items.length <= 1}
              aria-label="Next track"
            >
              <SkipForward size={18} />
            </button>
          </div>

          {/* Playlist counter */}
          {items.length > 1 && (
            <div className="music-playlist-counter">
              {currentIndex + 1} / {items.length}
            </div>
          )}

          {/* Provider badge */}
          {parsed.provider && (
            <a
              href={currentTrack?.embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="music-provider-badge"
              style={{ '--provider-color': PROVIDER_COLORS[parsed.provider] || '#888' }}
            >
              <span className="music-provider-dot" />
              <span>{PROVIDER_LABELS[parsed.provider]}</span>
              <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>

      {/* Invisible YouTube / Audio Streamer (Maintained in DOM for Mobile WebKit/Chromium) */}
      {parsed.embedSrc && !showVisibleEmbed && (
        <iframe
          ref={iframeRef}
          src={parsed.embedSrc}
          title={currentTrack?.title || 'Music Stream'}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          loading="eager"
          style={{
            position: 'absolute',
            left: '-9999px',
            top: '-9999px',
            width: '240px',
            height: '240px',
            border: 'none',
            opacity: 0.01,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Visible interactive embed player (only if user enabled) */}
      {parsed.embedSrc && showVisibleEmbed && (
        <div className="music-player-iframe-wrapper">
          <iframe
            ref={iframeRef}
            src={parsed.embedSrc}
            title={currentTrack?.title || 'Music Player'}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="music-player-iframe"
            style={{ height: `${parsed.defaultHeight || 152}px` }}
          />
        </div>
      )}
    </div>
  );
}
