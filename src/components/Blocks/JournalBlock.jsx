import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, X, BookOpen, Clock } from 'lucide-react';
import OptimizedImage from '../OptimizedImage/OptimizedImage';

function renderJournalMarkdown(content) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBuffer = [];

  lines.forEach((line, idx) => {
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${idx}`}
            style={{
              padding: '14px 16px',
              borderRadius: '8px',
              background: 'var(--color-surface-sunken, #06070a)',
              border: '1px solid var(--color-border-subtle, rgba(255,255,255,0.08))',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.84rem',
              color: 'var(--color-accent-primary, #00f0aa)',
              overflowX: 'auto',
              margin: '14px 0',
            }}
          >
            <code>{codeBuffer.join('\n')}</code>
          </pre>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    if (line.startsWith('### ')) {
      elements.push(
        <h4
          key={idx}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.25rem',
            color: 'var(--card-heading-color, var(--color-card-heading, #ffffff))',
            margin: '20px 0 8px',
            fontWeight: 700,
          }}
        >
          {line.replace('### ', '')}
        </h4>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h3
          key={idx}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.5rem',
            color: 'var(--card-heading-color, var(--color-card-heading, #ffffff))',
            margin: '24px 0 10px',
            fontWeight: 700,
          }}
        >
          {line.replace('## ', '')}
        </h3>
      );
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote
          key={idx}
          style={{
            borderLeft: '3px solid var(--color-accent-primary, #00f0aa)',
            paddingLeft: '16px',
            margin: '16px 0',
            color: 'var(--card-text-color, var(--color-text-secondary))',
            fontStyle: 'italic',
            fontFamily: 'var(--font-serif)',
            fontSize: '1.05rem',
          }}
        >
          {line.replace('> ', '')}
        </blockquote>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li
          key={idx}
          style={{
            marginLeft: '24px',
            color: 'var(--card-text-color, var(--color-text-secondary))',
            fontSize: '1rem',
            lineHeight: '1.7',
            fontFamily: 'var(--font-serif)',
          }}
        >
          {line.replace(/^[-*]\s+/, '')}
        </li>
      );
    } else if (/^\d+\.\s+/.test(line)) {
      elements.push(
        <li
          key={idx}
          style={{
            marginLeft: '24px',
            color: 'var(--card-text-color, var(--color-text-secondary))',
            fontSize: '1rem',
            lineHeight: '1.7',
            fontFamily: 'var(--font-serif)',
          }}
        >
          {line.replace(/^\d+\.\s+/, '')}
        </li>
      );
    } else if (line.trim() === '---') {
      elements.push(
        <hr
          key={idx}
          style={{
            border: 'none',
            borderTop: '1px solid var(--card-border, rgba(255,255,255,0.1))',
            margin: '20px 0',
          }}
        />
      );
    } else if (line.trim() === '') {
      elements.push(<div key={idx} style={{ height: '10px' }} />);
    } else {
      elements.push(
        <p
          key={idx}
          style={{
            color: 'var(--card-text-color, var(--color-text-primary))',
            fontSize: '1.02rem',
            lineHeight: '1.75',
            margin: '6px 0',
            fontFamily: 'var(--font-serif)',
          }}
        >
          {line}
        </p>
      );
    }
  });

  return elements;
}

export default function JournalBlock({ data = {} }) {
  const { items = [] } = data;
  const list = Array.isArray(items) ? items : [];

  const [activeArticle, setActiveArticle] = useState(null);

  if (list.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px', color: '#888', fontSize: '0.85rem' }}>
        No journal entries yet. Click Edit to write an entry.
      </div>
    );
  }

  const activeContent = activeArticle ? (activeArticle.content || activeArticle.excerpt || '') : '';
  const activeWords = activeContent.trim() ? activeContent.trim().split(/\s+/).length : 0;
  const activeReadTime = Math.max(1, Math.ceil(activeWords / 200));

  return (
    <>
      <div className="journal-list">
        {list.map((entry, idx) => {
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
                  <span className="journal-date">
                    <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {entry.date || 'Recent'}
                  </span>
                  {entry.mood && (
                    <span className="journal-mood-badge">
                      {entry.moodEmoji || '✨'} {entry.mood}
                    </span>
                  )}
                </div>

                <h3 className="journal-entry-title">{entry.title}</h3>
                {entry.excerpt && <p className="journal-entry-preview">{entry.excerpt}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div
            className="article-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveArticle(null)}
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
                    {activeArticle.moodEmoji || '✨'} {activeArticle.mood}
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
