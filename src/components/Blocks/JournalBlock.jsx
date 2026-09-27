import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  X,
  BookOpen,
  Clock,
  Plus,
  Edit3,
  Trash2,
  ArrowDown,
  ArrowUp,
  Check,
  Eye,
  PenLine,
  PenTool,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Code,
  Code2,
  Link2,
  Minus,
  Pin,
  Image as ImageIcon,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useDoubleBackdropClose } from '../../hooks/useDoubleBackdropClose';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import ImageUploadPicker from '../Editor/ImageUploadPicker';
import { safeUrl } from '../../lib/safeUrl';

const MOOD_OPTIONS = [
  { emoji: '', label: '🚫 None', isNone: true },
  { emoji: '💡', label: 'Inspired' },
  { emoji: '🎯', label: 'Focused' },
  { emoji: '☕', label: 'Relaxed' },
  { emoji: '🚀', label: 'Productive' },
  { emoji: '🌙', label: 'Reflective' },
  { emoji: '✨', label: 'Creative' },
  { emoji: '🎨', label: 'Artistic' },
  { emoji: '⚡', label: 'Energized' },
  { emoji: '🌿', label: 'Mindful' },
  { emoji: '💻', label: 'Deep Work' },
];

function getEntryDateValue(entry) {
  if (!entry) return 0;
  if (entry.createdAt) {
    const t = new Date(entry.createdAt).getTime();
    if (!isNaN(t)) return t;
  }
  if (entry.date) {
    const t = new Date(entry.date).getTime();
    if (!isNaN(t)) return t;
    const num = Date.parse(entry.date);
    if (!isNaN(num)) return num;
  }
  return 0;
}

// Robust inline markdown parser for bold, italic, links, code, strikethrough
function parseInlineMarkdown(text) {
  if (!text || typeof text !== 'string') return text;

  // Regex matching:
  // 1. Link: [Text](URL)
  // 2. Bold+Italic: ***text*** or ___text___
  // 3. Bold: **text** or __text__
  // 4. Italic: *text* or _text_
  // 5. Code: `text`
  // 6. Strikethrough: ~~text~~
  const inlineRegex = /(\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|\/[^\s)]+)\))|(\*\*\*([^*]+)\*\*\*|___([^_]+)___)|(\*\*([^*]+)\*\*|__([^_]+)__)|(\*([^*\s][^*]*)\*|_([^_]+)_)|(`([^`]+)`)|(~~([^~]+)~~)/g;

  const nodes = [];
  let lastIndex = 0;
  let match;

  while ((match = inlineRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.substring(lastIndex, match.index));
    }

    const [
      fullMatch,
      isLink, linkText, linkUrl,
      isBoldItalic, bi1, bi2,
      isBold, b1, b2,
      isItalic, i1, i2,
      isCode, codeText,
      isStrike, strikeText,
    ] = match;

    const key = `inline-${match.index}-${nodes.length}`;

    if (isLink) {
      const href = safeUrl(linkUrl);
      nodes.push(
        href ? (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="journal-prose-link"
          >
            {linkText}
          </a>
        ) : (
          // Unsafe scheme such as javascript: — keep the words, drop the link.
          <span key={key}>{linkText}</span>
        )
      );
    } else if (isBoldItalic) {
      nodes.push(
        <strong key={key} className="journal-prose-bold">
          <em className="journal-prose-italic">{bi1 || bi2}</em>
        </strong>
      );
    } else if (isBold) {
      nodes.push(
        <strong key={key} className="journal-prose-bold">
          {b1 || b2}
        </strong>
      );
    } else if (isItalic) {
      nodes.push(<em key={key} className="journal-prose-italic">{i1 || i2}</em>);
    } else if (isCode) {
      nodes.push(
        <code key={key} className="journal-prose-code">
          {codeText}
        </code>
      );
    } else if (isStrike) {
      nodes.push(<del key={key} className="journal-prose-del">{strikeText}</del>);
    }

    lastIndex = match.index + fullMatch.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.substring(lastIndex));
  }

  return nodes.length > 0 ? nodes : text;
}

// Complete Block-Level Markdown Parser
function renderJournalMarkdown(content) {
  if (!content) return null;

  const lines = content.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Code Block: ```
    if (trimmed.startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // consume closing ```
      blocks.push(
        <pre key={`code-${blocks.length}`} className="journal-prose-pre">
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    // 2. Blockquote: lines starting with >
    if (trimmed.startsWith('>')) {
      const quoteLines = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      blocks.push(
        <blockquote key={`quote-${blocks.length}`} className="journal-prose-quote">
          {quoteLines.map((qLine, qIdx) => (
            <p key={qIdx}>{parseInlineMarkdown(qLine)}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    // 3. Unordered List: lines starting with - or *
    if (/^[-*]\s+/.test(trimmed)) {
      const listItems = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="journal-prose-ul">
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx}>{parseInlineMarkdown(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // 4. Ordered List: lines starting with 1.
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push(
        <ol key={`ol-${blocks.length}`} className="journal-prose-ol">
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx}>{parseInlineMarkdown(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // 5. Headings
    if (trimmed.startsWith('# ')) {
      blocks.push(
        <h2 key={`h1-${blocks.length}`} className="journal-prose-h1">
          {parseInlineMarkdown(trimmed.replace('# ', ''))}
        </h2>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      blocks.push(
        <h3 key={`h2-${blocks.length}`} className="journal-prose-h2">
          {parseInlineMarkdown(trimmed.replace('## ', ''))}
        </h3>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      blocks.push(
        <h4 key={`h3-${blocks.length}`} className="journal-prose-h3">
          {parseInlineMarkdown(trimmed.replace('### ', ''))}
        </h4>
      );
      i++;
      continue;
    }

    // 6. Horizontal Rule: --- or ***
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      blocks.push(<hr key={`hr-${blocks.length}`} className="journal-prose-hr" />);
      i++;
      continue;
    }

    // 7. Empty line spacing
    if (trimmed === '') {
      blocks.push(<div key={`sp-${blocks.length}`} style={{ height: '8px' }} />);
      i++;
      continue;
    }

    // 8. Regular Paragraph
    blocks.push(
      <p key={`p-${blocks.length}`} className="journal-prose-p">
        {parseInlineMarkdown(line)}
      </p>
    );
    i++;
  }

  return <div className="journal-article-prose">{blocks}</div>;
}

export default function JournalBlock({
  data = {},
  isEditing = false,
  onUpdateData,
}) {
  const { items = [] } = data;
  const list = Array.isArray(items) ? items : [];

  // Sorting state: 'newest' (default) or 'oldest'
  const [sortBy, setSortBy] = useState('newest');

  // Reader Modal State
  const [activeArticle, setActiveArticle] = useState(null);
  const { handleBackdropClick, hintVisible } = useDoubleBackdropClose(() => setActiveArticle(null));

  // Close reader modal on Escape key press and lock background scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveArticle(null);
      }
    };
    if (activeArticle) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeArticle]);

  // Quick Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formTab, setFormTab] = useState('write'); // 'write' | 'preview'
  const [pinWarning, setPinWarning] = useState('');

  // Form Fields
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [mood, setMood] = useState('');
  const [moodEmoji, setMoodEmoji] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [pinned, setPinned] = useState(false);

  const textareaRef = useRef(null);
  const formRef = useRef(null);

  // Sort list: Pinned entries always on top (max 3), followed by date (newest or oldest)
  const sortedList = useMemo(() => {
    const copy = [...list];
    return copy.sort((a, b) => {
      const pinA = Boolean(a.pinned);
      const pinB = Boolean(b.pinned);
      if (pinA !== pinB) {
        return pinA ? -1 : 1;
      }
      const timeA = getEntryDateValue(a);
      const timeB = getEntryDateValue(b);
      if (timeA !== timeB) {
        return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
      }
      return 0;
    });
  }, [list, sortBy]);

  // Hide the entry currently being edited in the form
  const visibleList = useMemo(() => {
    return sortedList.filter((entry) => !editingId || entry.id !== editingId);
  }, [sortedList, editingId]);

  // Pin toggle handler with strict max 3 limitation
  const handleTogglePin = (entryId, e) => {
    e.stopPropagation();
    const target = list.find((item) => item.id === entryId);
    if (!target) return;

    const otherPinnedCount = list.filter((item) => item.pinned && item.id !== entryId).length;

    if (!target.pinned && otherPinnedCount >= 3) {
      setPinWarning('Maximum of 3 pinned entries allowed. Unpin another entry first.');
      setTimeout(() => setPinWarning(''), 3500);
      return;
    }

    setPinWarning('');
    const updated = list.map((item) =>
      item.id === entryId ? { ...item, pinned: !item.pinned } : item
    );
    if (onUpdateData) {
      onUpdateData({ items: updated });
    }
  };

  // Insert markdown shortcuts into editor textarea
  const insertText = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const prev = textarea.value;
    const selected = prev.substring(start, end) || 'text';

    const replacement = `${before}${selected}${after}`;
    const next = prev.substring(0, start) + replacement + prev.substring(end);

    setContent(next);
    if (!excerpt) {
      setExcerpt(next.slice(0, 160));
    }

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 10);
  };

  const handleOpenNewForm = () => {
    setEditingId(null);
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setMood('');
    setMoodEmoji('');
    setCoverUrl('');
    setIsSpoiler(false);
    setExcerpt('');
    setContent('');
    setPinned(false);
    setFormTab('write');
    setIsFormOpen(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  };

  const handleStartEdit = (entry, e) => {
    e.stopPropagation();
    setEditingId(entry.id);
    setTitle(entry.title || '');
    setDate(entry.date || new Date().toISOString().split('T')[0]);
    setMood(entry.mood || '');
    setMoodEmoji(entry.moodEmoji || '');
    setCoverUrl(entry.coverUrl || entry.imageUrl || '');
    setIsSpoiler(Boolean(entry.spoiler || entry.hasSpoiler));
    setExcerpt(entry.excerpt || '');
    setContent(entry.content || '');
    setPinned(Boolean(entry.pinned));
    setFormTab('write');
    setIsFormOpen(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  };

  const handleDeleteEntry = (entryId, e) => {
    e.stopPropagation();
    const updated = list.filter((item) => item.id !== entryId);
    if (onUpdateData) {
      onUpdateData({ items: updated });
    }
  };

  const handleSaveEntry = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Check max pinned count
    let isPinnedValid = Boolean(pinned);
    if (isPinnedValid) {
      const otherPinnedCount = list.filter((item) => item.pinned && item.id !== editingId).length;
      if (otherPinnedCount >= 3) {
        setPinWarning('Maximum of 3 pinned entries allowed.');
        setTimeout(() => setPinWarning(''), 3500);
        isPinnedValid = false;
      }
    }

    let updatedItems = [];
    if (editingId) {
      updatedItems = list.map((item) =>
        item.id === editingId
          ? {
              ...item,
              title: title.trim(),
              date: date || new Date().toISOString().split('T')[0],
              mood: mood || null,
              moodEmoji: moodEmoji || null,
              coverUrl: coverUrl || null,
              spoiler: Boolean(isSpoiler),
              excerpt: excerpt.trim() || content.slice(0, 150),
              content: content.trim(),
              pinned: isPinnedValid,
            }
          : item
      );
    } else {
      const newEntry = {
        id: `entry-${Date.now()}`,
        title: title.trim(),
        date: date || new Date().toISOString().split('T')[0],
        mood: mood || null,
        moodEmoji: moodEmoji || null,
        coverUrl: coverUrl || null,
        spoiler: Boolean(isSpoiler),
        excerpt: excerpt.trim() || content.slice(0, 150),
        content: content.trim(),
        pinned: isPinnedValid,
      };
      updatedItems = [newEntry, ...list];
    }

    if (onUpdateData) {
      onUpdateData({ items: updatedItems });
    }

    setIsFormOpen(false);
    setEditingId(null);
  };

  const activeContent = activeArticle ? (activeArticle.content || activeArticle.excerpt || '') : '';
  const activeWords = activeContent.trim() ? activeContent.trim().split(/\s+/).length : 0;
  const activeReadTime = Math.max(1, Math.ceil(activeWords / 200));

  return (
    <>
      {/* Top Toolbar: Entries Count, Sort Filter (Newest / Oldest), and Quick Add Button */}
      <div className="journal-toolbar">
        <div className="journal-filter-group">
          <span className="journal-count-badge">
            {list.length} {list.length === 1 ? 'entry' : 'entries'}
          </span>
          <button
            type="button"
            className={`journal-sort-btn ${sortBy === 'newest' ? 'active' : ''}`}
            onClick={() => setSortBy('newest')}
            title="Sort by most recent entry first"
          >
            <ArrowDown size={12} /> Newest
          </button>
          <button
            type="button"
            className={`journal-sort-btn ${sortBy === 'oldest' ? 'active' : ''}`}
            onClick={() => setSortBy('oldest')}
            title="Sort by earliest entry first"
          >
            <ArrowUp size={12} /> Oldest
          </button>
          {pinWarning && (
            <div className="journal-pin-alert">
              <AlertCircle size={13} />
              <span>{pinWarning}</span>
            </div>
          )}
        </div>

        {isEditing && (
          <button
            type="button"
            className="journal-quick-add-btn"
            onClick={handleOpenNewForm}
          >
            <Plus size={14} /> Quick Add Entry
          </button>
        )}
      </div>

      {/* Inline Quick Add / Edit Entry Form */}
      <AnimatePresence>
        {isFormOpen && isEditing && (
          <motion.div
            ref={formRef}
            className="journal-quick-form"
            initial={{ opacity: 0, y: -12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -12, height: 0 }}
          >
            <div className="journal-form-header">
              <div className="journal-form-title">
                <PenLine size={16} color="var(--color-accent-primary, #00f0aa)" />
                <span>{editingId ? 'Edit Journal Entry' : 'Write New Journal Entry'}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingId(null);
                }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                title="Close form"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEntry} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Title & Date Row + Pin Checkbox */}
              <div className="journal-form-row-2">
                <div>
                  <label className="journal-input-label">Entry Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Reflections on System Architecture"
                    className="journal-form-input"
                    required
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <label className="journal-input-label" style={{ margin: 0 }}>Publication Date</label>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#cbd5e1', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={pinned}
                        onChange={(e) => {
                          if (e.target.checked) {
                            const otherPinned = list.filter((i) => i.pinned && i.id !== editingId).length;
                            if (otherPinned >= 3) {
                              setPinWarning('Maximum of 3 pinned entries allowed.');
                              setTimeout(() => setPinWarning(''), 3500);
                              return;
                            }
                          }
                          setPinned(e.target.checked);
                        }}
                      />
                      <Pin size={11} color={pinned ? '#00f0aa' : '#94a3b8'} />
                      <span style={{ color: pinned ? '#00f0aa' : '#cbd5e1', fontWeight: pinned ? 700 : 400 }}>Pin to top</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                    className="journal-form-input"
                  />
                </div>
              </div>

              {/* Cover Photo */}
              <ImageUploadPicker
                label="Cover Image (Optional)"
                value={coverUrl}
                onChange={setCoverUrl}
              />

              {coverUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '-4px' }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#cbd5e1', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isSpoiler}
                      onChange={(e) => setIsSpoiler(e.target.checked)}
                      style={{ accentColor: 'var(--color-accent-primary, #00f0aa)' }}
                    />
                    <span>Use spoiler blur with "View Attachment" button</span>
                  </label>
                </div>
              )}

              {/* Quick Mood & Reflection Tag Selector */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>
                    Mood / Reflection Theme
                  </label>
                  {mood && (
                    <button
                      type="button"
                      onClick={() => setMoodEmoji((prev) => (prev ? '' : '✨'))}
                      style={{
                        background: !moodEmoji ? 'rgba(0, 240, 170, 0.15)' : 'transparent',
                        border: '1px solid',
                        borderColor: !moodEmoji ? '#00f0aa' : 'rgba(255,255,255,0.12)',
                        color: !moodEmoji ? '#00f0aa' : '#cbd5e1',
                        fontSize: '0.7rem',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                      title={moodEmoji ? 'Hide emoji from mood tag' : 'Show emoji with mood tag'}
                    >
                      {moodEmoji ? '🚫 No Emoji' : '✨ Show Emoji'}
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {MOOD_OPTIONS.map((m) => {
                    const isSelected = m.isNone ? (!mood || mood === 'None') : (mood === m.label);
                    return (
                      <button
                        key={m.label}
                        type="button"
                        onClick={() => {
                          if (m.isNone || isSelected) {
                            setMood('');
                            setMoodEmoji('');
                          } else {
                            setMood(m.label);
                            setMoodEmoji(moodEmoji === '' ? '' : m.emoji);
                          }
                        }}
                        style={{
                          padding: '4px 9px',
                          borderRadius: '6px',
                          background: isSelected ? 'rgba(0, 240, 170, 0.15)' : '#06070a',
                          border: '1px solid',
                          borderColor: isSelected ? '#00f0aa' : 'rgba(255,255,255,0.08)',
                          color: isSelected ? '#00f0aa' : '#cbd5e1',
                          fontSize: '0.74rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {m.emoji && <span>{m.emoji}</span>}
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="journal-input-label">Short Excerpt (Card Summary)</label>
                <input
                  type="text"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief 1-2 sentence preview for the card..."
                  className="journal-form-input"
                />
              </div>

              {/* Formatting Toolbar & Write/Preview Container */}
              <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', overflow: 'hidden', background: '#06070a' }}>
                {/* Editor Toolbar Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    background: '#10141f',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    flexWrap: 'wrap',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => insertText('**', '**')}
                      title="Bold"
                      style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
                    >
                      <Bold size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('*', '*')}
                      title="Italic"
                      style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
                    >
                      <Italic size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('## ')}
                      title="Heading 2"
                      style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
                    >
                      <Heading2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('### ')}
                      title="Heading 3"
                      style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
                    >
                      <Heading3 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('> ')}
                      title="Quote"
                      style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
                    >
                      <Quote size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('- ')}
                      title="Bullet List"
                      style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
                    >
                      <List size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('1. ')}
                      title="Numbered List"
                      style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
                    >
                      <ListOrdered size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('`', '`')}
                      title="Inline Code"
                      style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
                    >
                      <Code2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('```\n', '\n```')}
                      title="Code Block"
                      style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
                    >
                      <Code size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('[', '](https://...)')}
                      title="Link"
                      style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
                    >
                      <Link2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('\n---\n')}
                      title="Divider Line"
                      style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
                    >
                      <Minus size={14} />
                    </button>
                  </div>

                  {/* Write / Preview Tab Switcher */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: '#06070a', padding: '2px', borderRadius: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setFormTab('write')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: formTab === 'write' ? '#1c2233' : 'none',
                        border: 'none',
                        color: formTab === 'write' ? '#00f0aa' : '#94a3b8',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <PenTool size={12} /> Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormTab('preview')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: formTab === 'preview' ? '#1c2233' : 'none',
                        border: 'none',
                        color: formTab === 'preview' ? '#00f0aa' : '#94a3b8',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <Eye size={12} /> Preview
                    </button>
                  </div>
                </div>

                {/* Textarea or Preview Body */}
                {formTab === 'write' ? (
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                      if (!excerpt) {
                        setExcerpt(e.target.value.slice(0, 160));
                      }
                    }}
                    placeholder="Write your article, story, or reflection in markdown...&#10;&#10;Use ## for headings, > for quotes, - for bullet lists, and ``` for code blocks."
                    style={{
                      width: '100%',
                      minHeight: '180px',
                      padding: '14px',
                      background: 'transparent',
                      border: 'none',
                      color: '#f1f5f9',
                      fontSize: '0.88rem',
                      lineHeight: '1.6',
                      fontFamily: 'var(--font-serif)',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                ) : (
                  <div style={{ padding: '16px', minHeight: '180px', maxHeight: '380px', overflowY: 'auto' }}>
                    {content.trim() ? (
                      renderJournalMarkdown(content)
                    ) : (
                      <p style={{ color: '#888', fontStyle: 'italic', fontSize: '0.85rem' }}>No content yet...</p>
                    )}
                  </div>
                )}

                {/* Stats Footer */}
                <div
                  style={{
                    padding: '6px 12px',
                    background: '#0d1017',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.7rem',
                    color: '#8b949e',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span>{content.trim() ? content.trim().split(/\s+/).length : 0} words</span>
                    <span>{content.length} characters</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} /> {Math.max(1, Math.ceil((content.trim() ? content.trim().split(/\s+/).length : 0) / 200))} min read
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingId(null);
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#cbd5e1',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="journal-quick-add-btn"
                  style={{ padding: '8px 20px', fontSize: '0.82rem' }}
                >
                  <Check size={15} /> {editingId ? 'Update Entry' : 'Publish Entry'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!isFormOpen && sortedList.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 20px',
            background: 'var(--card-bg, rgba(255,255,255,0.02))',
            borderRadius: '12px',
            border: '1px dashed var(--card-border, rgba(255,255,255,0.1))',
          }}
        >
          <BookOpen size={28} color="#64748b" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '14px' }}>
            No journal entries published yet.
          </p>
          {isEditing && (
            <button
              type="button"
              className="journal-quick-add-btn"
              onClick={handleOpenNewForm}
              style={{ margin: '0 auto' }}
            >
              <Plus size={14} /> Write First Entry
            </button>
          )}
        </div>
      )}

      {/* Journal Entries List (Sorted, hiding actively edited entry) */}
      {visibleList.length > 0 && (
        <div className="journal-list">
          {visibleList.map((entry, idx) => {
            const cover = entry.coverUrl || entry.imageUrl;
            return (
              <div
                key={entry.id || idx}
                className={`journal-entry-card ${cover ? 'has-cover' : ''} ${entry.pinned ? 'is-pinned-card' : ''}`}
                onClick={() => setActiveArticle(entry)}
              >
                {/* Card Cover Photo with optional Spoiler Effect */}
                {cover && (
                  <div className={`journal-entry-cover-wrap ${entry.spoiler ? 'is-spoiler' : ''}`}>
                    <OptimizedImage
                      src={cover}
                      alt={entry.title}
                      className="journal-entry-cover-img"
                    />
                    {entry.spoiler && (
                      <div className="journal-attachment-overlay">
                        <span className="journal-attachment-btn">
                          <ImageIcon size={12} /> View Attachment
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="journal-entry-content">
                  <div className="journal-entry-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {entry.pinned && (
                        <span className="journal-pin-badge">
                          <Pin size={10} /> PINNED
                        </span>
                      )}
                      <span className="journal-date">
                        <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        {entry.date || 'Recent'}
                      </span>
                      {entry.mood && (
                        <span className="journal-mood-badge">
                          {entry.moodEmoji ? `${entry.moodEmoji} ` : ''}{entry.mood}
                        </span>
                      )}
                    </div>

                    {/* Edit mode card actions */}
                    {isEditing && (
                      <div className="journal-card-actions">
                        <button
                          type="button"
                          className={`journal-card-btn ${entry.pinned ? 'btn-pinned' : ''}`}
                          onClick={(e) => handleTogglePin(entry.id, e)}
                          title={entry.pinned ? 'Unpin entry' : 'Pin to top (max 3)'}
                        >
                          <Pin size={11} /> {entry.pinned ? 'Pinned' : 'Pin'}
                        </button>
                        <button
                          type="button"
                          className="journal-card-btn"
                          onClick={(e) => handleStartEdit(entry, e)}
                          title="Edit this entry"
                        >
                          <Edit3 size={11} /> Edit
                        </button>
                        <button
                          type="button"
                          className="journal-card-btn btn-del"
                          onClick={(e) => handleDeleteEntry(entry.id, e)}
                          title="Delete this entry"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    )}
                  </div>

                  <h3 className="journal-entry-title">{entry.title}</h3>
                  {entry.excerpt && <p className="journal-entry-preview">{entry.excerpt}</p>}

                  <div className="journal-entry-footer">
                    <span className="journal-read-btn">
                      Read Entry <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div
            className="article-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          >
            {hintVisible && (
              <div className="modal-double-click-hint">
                <span>Click once more outside to close (or use close button)</span>
              </div>
            )}
            <motion.div
              className="article-modal"
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="article-modal-close-btn"
                onClick={() => setActiveArticle(null)}
                title="Close reader (Esc)"
                aria-label="Close reader"
              >
                <X size={18} />
              </button>

              <div className="article-modal-header">
                <span className="article-modal-kicker">
                  <BookOpen size={13} /> Journal & Thoughts
                </span>

                <h2 className="article-modal-title">
                  {activeArticle.title}
                </h2>

                <div className="article-modal-meta">
                  <span className="journal-date">
                    <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {activeArticle.date || 'Recent'}
                  </span>
                  {activeArticle.mood && (
                    <span className="journal-mood-badge">
                      {activeArticle.moodEmoji ? `${activeArticle.moodEmoji} ` : ''}{activeArticle.mood}
                    </span>
                  )}
                  <span className="journal-read-time">
                    <Clock size={12} /> {activeReadTime} min read
                  </span>
                </div>
              </div>

              {/* Modal Cover Image (if available) */}
              {(activeArticle.coverUrl || activeArticle.imageUrl) && (
                <div className="journal-modal-cover-wrap">
                  <OptimizedImage
                    src={activeArticle.coverUrl || activeArticle.imageUrl}
                    alt={activeArticle.title}
                    className="journal-modal-cover-img"
                  />
                </div>
              )}

              <div className="article-modal-body">
                {renderJournalMarkdown(activeContent)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

