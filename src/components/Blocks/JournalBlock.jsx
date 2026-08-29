import { useState, useMemo, useRef } from 'react';
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
} from 'lucide-react';
import { useDoubleBackdropClose } from '../../hooks/useDoubleBackdropClose';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import ImageUploadPicker from '../Editor/ImageUploadPicker';

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
      nodes.push(
        <a
          key={key}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            color: 'var(--color-accent-primary, #00f0aa)',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {linkText}
        </a>
      );
    } else if (isBoldItalic) {
      nodes.push(
        <strong key={key} style={{ fontWeight: 700, color: 'var(--card-heading-color, #ffffff)' }}>
          <em>{bi1 || bi2}</em>
        </strong>
      );
    } else if (isBold) {
      nodes.push(
        <strong key={key} style={{ fontWeight: 700, color: 'var(--card-heading-color, #ffffff)' }}>
          {b1 || b2}
        </strong>
      );
    } else if (isItalic) {
      nodes.push(<em key={key} style={{ fontStyle: 'italic' }}>{i1 || i2}</em>);
    } else if (isCode) {
      nodes.push(
        <code
          key={key}
          style={{
            background: 'rgba(255, 255, 255, 0.09)',
            color: 'var(--color-accent-primary, #00f0aa)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.86em',
          }}
        >
          {codeText}
        </code>
      );
    } else if (isStrike) {
      nodes.push(<del key={key} style={{ opacity: 0.6 }}>{strikeText}</del>);
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
        <pre
          key={`code-${blocks.length}`}
          style={{
            padding: '14px 18px',
            borderRadius: '10px',
            background: '#04060a',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.84rem',
            color: 'var(--color-accent-primary, #00f0aa)',
            overflowX: 'auto',
            margin: '16px 0',
            lineHeight: '1.6',
          }}
        >
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
        <blockquote
          key={`quote-${blocks.length}`}
          style={{
            borderLeft: '4px solid var(--color-accent-primary, #00f0aa)',
            background: 'rgba(0, 240, 170, 0.05)',
            padding: '12px 18px',
            margin: '16px 0',
            borderRadius: '0 8px 8px 0',
            color: 'var(--card-text-color, #e2e8f0)',
            fontStyle: 'italic',
            fontFamily: 'var(--font-serif)',
            fontSize: '1.05rem',
            lineHeight: '1.7',
          }}
        >
          {quoteLines.map((qLine, qIdx) => (
            <p key={qIdx} style={{ margin: qIdx > 0 ? '6px 0 0' : 0 }}>
              {parseInlineMarkdown(qLine)}
            </p>
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
        <ul
          key={`ul-${blocks.length}`}
          style={{
            margin: '12px 0 16px 20px',
            paddingLeft: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            color: 'var(--card-text-color, #cbd5e1)',
            fontFamily: 'var(--font-serif)',
            fontSize: '1rem',
            lineHeight: '1.65',
          }}
        >
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx}>
              {parseInlineMarkdown(item)}
            </li>
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
        <ol
          key={`ol-${blocks.length}`}
          style={{
            margin: '12px 0 16px 24px',
            paddingLeft: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            color: 'var(--card-text-color, #cbd5e1)',
            fontFamily: 'var(--font-serif)',
            fontSize: '1rem',
            lineHeight: '1.65',
          }}
        >
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx}>
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 5. Headings
    if (trimmed.startsWith('# ')) {
      blocks.push(
        <h2
          key={`h1-${blocks.length}`}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.75rem',
            color: 'var(--card-heading-color, #ffffff)',
            margin: '24px 0 10px',
            fontWeight: 700,
            lineHeight: '1.3',
          }}
        >
          {parseInlineMarkdown(trimmed.replace('# ', ''))}
        </h2>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      blocks.push(
        <h3
          key={`h2-${blocks.length}`}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.45rem',
            color: 'var(--card-heading-color, #ffffff)',
            margin: '22px 0 8px',
            fontWeight: 700,
            lineHeight: '1.3',
          }}
        >
          {parseInlineMarkdown(trimmed.replace('## ', ''))}
        </h3>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      blocks.push(
        <h4
          key={`h3-${blocks.length}`}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.22rem',
            color: 'var(--card-heading-color, #ffffff)',
            margin: '18px 0 6px',
            fontWeight: 700,
            lineHeight: '1.3',
          }}
        >
          {parseInlineMarkdown(trimmed.replace('### ', ''))}
        </h4>
      );
      i++;
      continue;
    }

    // 6. Horizontal Rule: --- or ***
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      blocks.push(
        <hr
          key={`hr-${blocks.length}`}
          style={{
            border: 'none',
            borderTop: '1px solid var(--card-border, rgba(255, 255, 255, 0.12))',
            margin: '22px 0',
          }}
        />
      );
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
      <p
        key={`p-${blocks.length}`}
        style={{
          color: 'var(--card-text-color, #e2e8f0)',
          fontSize: '1.02rem',
          lineHeight: '1.75',
          margin: '6px 0',
          fontFamily: 'var(--font-serif)',
        }}
      >
        {parseInlineMarkdown(line)}
      </p>
    );
    i++;
  }

  return blocks;
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

  // Quick Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formTab, setFormTab] = useState('write'); // 'write' | 'preview'

  // Form Fields
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [mood, setMood] = useState('');
  const [moodEmoji, setMoodEmoji] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');

  const textareaRef = useRef(null);
  const formRef = useRef(null);

  // Sort list by recent entry or oldest
  const sortedList = useMemo(() => {
    const copy = [...list];
    return copy.sort((a, b) => {
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
    setExcerpt('');
    setContent('');
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
    setExcerpt(entry.excerpt || '');
    setContent(entry.content || '');
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
              excerpt: excerpt.trim() || content.slice(0, 150),
              content: content.trim(),
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
        excerpt: excerpt.trim() || content.slice(0, 150),
        content: content.trim(),
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
              {/* Title & Date Row */}
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
                  <label className="journal-input-label">Publication Date</label>
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
                className={`journal-entry-card ${cover ? 'has-cover' : ''}`}
                onClick={() => setActiveArticle(entry)}
              >
                {/* Card Cover Photo */}
                {cover && (
                  <div className="journal-entry-cover-wrap">
                    <OptimizedImage
                      src={cover}
                      alt={entry.title}
                      className="journal-entry-cover-img"
                    />
                  </div>
                )}

                <div className="journal-entry-content">
                  <div className="journal-entry-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                          className="journal-card-btn"
                          onClick={(e) => handleStartEdit(entry, e)}
                          title="Edit this entry"
                        >
                          <Edit3 size={12} /> Edit
                        </button>
                        <button
                          type="button"
                          className="journal-card-btn btn-del"
                          onClick={(e) => handleDeleteEntry(entry.id, e)}
                          title="Delete this entry"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  <h3 className="journal-entry-title">{entry.title}</h3>
                  {entry.excerpt && <p className="journal-entry-preview">{entry.excerpt}</p>}
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
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
              background: 'rgba(5,5,8,0.88)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            {hintVisible && (
              <div className="modal-double-click-hint">
                <span>Click once more outside to close (or use ✕)</span>
              </div>
            )}
            <motion.div
              className="article-modal"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '720px',
                maxHeight: '85vh',
                overflowY: 'auto',
                padding: '38px 36px',
                borderRadius: '16px',
                background: 'var(--card-bg, #0d0d12)',
                border: '1px solid var(--card-border, rgba(255,255,255,0.08))',
                boxShadow: '0 24px 64px rgba(0,0,0,0.85)',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setActiveArticle(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--card-text-muted, #888)',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>

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

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span className="journal-date">{activeArticle.date}</span>
                {activeArticle.mood && (
                  <span className="journal-mood-badge">
                    {activeArticle.moodEmoji ? `${activeArticle.moodEmoji} ` : ''}{activeArticle.mood}
                  </span>
                )}
                <span style={{ fontSize: '0.75rem', color: 'var(--card-text-muted, #8b949e)', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
                  <Clock size={12} /> {activeReadTime} min read
                </span>
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2.1rem',
                  fontWeight: 700,
                  color: 'var(--card-heading-color, var(--color-card-heading, #ffffff))',
                  marginBottom: '24px',
                  lineHeight: '1.25',
                }}
              >
                {activeArticle.title}
              </h2>

              <div style={{ paddingBottom: '16px' }}>
                {renderJournalMarkdown(activeContent)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

