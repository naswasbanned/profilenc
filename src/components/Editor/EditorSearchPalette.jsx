import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Save,
  Undo2,
  Redo2,
  Eye,
  X,
  Plus,
  FolderKanban,
  Palette,
  Settings,
  Moon,
  Sparkles,
  Type,
  Layers,
  Compass,
  Image,
  Square,
  Sliders,
  User,
  Briefcase,
  Code2,
  BookOpen,
  Cpu,
  Video,
  Film,
  Music,
  Target,
  Edit3,
  Globe,
  Lock,
  LogOut,
  Trash2,
  Gamepad2,
  Disc3,
} from 'lucide-react';
import { buildSearchEntries, searchEntries } from './searchRegistry';
import './styles/11-search-palette.css';

// GitHub icon is not in lucide; reuse Code2 as stand-in
const ICON_MAP = {
  Save, Undo2, Redo2, Eye, X, Plus, FolderKanban, Palette, Settings, Moon,
  Sparkles, Type, Layers, Compass, Image, Square, Sliders, User, Briefcase,
  Code2, BookOpen, Cpu, Video, Film, Music, Target, Edit3, Globe, Lock,
  LogOut, Trash2, Gamepad2, Disc3,
  Github: Code2,
};

function IconFor({ name, size = 16 }) {
  const Comp = ICON_MAP[name] || Search;
  return <Comp size={size} />;
}

const RECENT_KEY = 'profilenc_search_recent';

function getRecent() {
  try {
    return JSON.parse(sessionStorage.getItem(RECENT_KEY) || '[]');
  } catch { return []; }
}

function pushRecent(id) {
  const list = getRecent().filter((r) => r !== id);
  list.unshift(id);
  sessionStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 5)));
}

export default function EditorSearchPalette({
  isOpen,
  onClose,
  onAction,
  userBlocks = [],
  editorTheme,
}) {
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const resultsRef = useRef(null);

  const allEntries = useMemo(() => buildSearchEntries(userBlocks), [userBlocks]);

  const results = useMemo(() => {
    if (!query.trim()) {
      // Show recent + top actions when empty
      const recent = getRecent();
      const recentEntries = recent
        .map((id) => allEntries.find((e) => e.id === id))
        .filter(Boolean);
      if (recentEntries.length > 0) return recentEntries;
      // Default: show action entries
      return allEntries.filter((e) => e.category === 'Action').slice(0, 8);
    }
    return searchEntries(allEntries, query, 10);
  }, [query, allEntries]);

  // Reset active index when results change
  useEffect(() => setActiveIndex(0), [results]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      // Delay to let animation render
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  // Scroll active row into view
  useEffect(() => {
    if (!resultsRef.current) return;
    const active = resultsRef.current.querySelector('.esp-row.is-active');
    if (active) active.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const handleSelect = useCallback((entry) => {
    pushRecent(entry.id);
    onAction(entry.action);
    onClose();
  }, [onAction, onClose]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[activeIndex]) handleSelect(results[activeIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }, [results, activeIndex, handleSelect, onClose]);

  if (!isOpen) return null;

  // Group results by category for display
  const grouped = [];
  let lastCat = null;
  for (const entry of results) {
    if (entry.category !== lastCat) {
      grouped.push({ type: 'header', category: entry.category });
      lastCat = entry.category;
    }
    grouped.push({ type: 'entry', entry });
  }

  let entryIdx = -1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="esp-backdrop"
          data-editor-theme={editorTheme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            className="esp-container"
            initial={{ scale: 0.96, y: -8, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: -8, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Search input */}
            <div className="esp-input-row">
              <Search size={18} className="esp-input-icon" />
              <input
                ref={inputRef}
                className="esp-input"
                type="text"
                placeholder="Search actions, settings, blocks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                spellCheck={false}
              />
              <span className="esp-shortcut">ESC</span>
            </div>

            {/* Results */}
            <div className="esp-results" ref={resultsRef}>
              {results.length === 0 && query.trim() && (
                <div className="esp-empty">No results for "{query}"</div>
              )}
              {grouped.map((item, i) => {
                if (item.type === 'header') {
                  return (
                    <div key={`cat-${item.category}`} className="esp-category-label">
                      {item.category}
                    </div>
                  );
                }
                entryIdx++;
                const idx = entryIdx;
                const entry = item.entry;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    className={`esp-row ${idx === activeIndex ? 'is-active' : ''}`}
                    onClick={() => handleSelect(entry)}
                    onMouseEnter={() => setActiveIndex(idx)}
                  >
                    <div className="esp-row-icon">
                      <IconFor name={entry.icon} size={16} />
                    </div>
                    <div className="esp-row-body">
                      <div className="esp-row-label">{entry.label}</div>
                    </div>
                    <span className="esp-row-category">{entry.category}</span>
                    <span className="esp-row-enter">ENTER</span>
                  </button>
                );
              })}
            </div>

            {/* Footer hints */}
            <div className="esp-footer">
              <span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span>
              <span><kbd>↵</kbd> select</span>
              <span><kbd>esc</kbd> close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
