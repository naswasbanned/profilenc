import { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Sparkles, Type, Check, Layers, Palette, Square, FolderKanban, Image, Trash2 } from 'lucide-react';
import ImageUploadPicker from '../ImageUploadPicker';

const HEADING_FONT_GROUPS = {
  'Tech & Modern Display': [
    { label: 'Space Grotesk (Recommended)', value: 'Space Grotesk' },
    { label: 'Orbitron (Cyber / Futuristic)', value: 'Orbitron' },
    { label: 'Plus Jakarta Sans (Crisp Modern)', value: 'Plus Jakarta Sans' },
    { label: 'Outfit (Clean Geometric)', value: 'Outfit' },
    { label: 'Syne (Avant-Garde / Bold)', value: 'Syne' },
    { label: 'Unbounded (Wide Neo-Tech)', value: 'Unbounded' },
    { label: 'Cabinet Grotesk (Industrial)', value: 'Cabinet Grotesk' },
    { label: 'Clash Display (High-Contrast)', value: 'Clash Display' },
    { label: 'Montserrat (Classic Display)', value: 'Montserrat' },
    { label: 'Poppins (Rounded Modern)', value: 'Poppins' },
  ],
  'Editorial & Classic Serif': [
    { label: 'Playfair Display (Luxury Editorial)', value: 'Playfair Display' },
    { label: 'Cinzel (Cinematic Classical)', value: 'Cinzel' },
    { label: 'Cormorant Garamond (Graceful Serif)', value: 'Cormorant Garamond' },
    { label: 'Prata (Modern Didone)', value: 'Prata' },
  ],
  'Clean & Functional': [
    { label: 'Inter (Neutral Swiss)', value: 'Inter' },
    { label: 'DM Sans (Friendly Geometric)', value: 'DM Sans' },
    { label: 'Manrope (Precision UI)', value: 'Manrope' },
    { label: 'Work Sans (Architectural)', value: 'Work Sans' },
    { label: 'Bebas Neue (Bold Condensed)', value: 'Bebas Neue' },
  ],
};

const BODY_FONT_GROUPS = {
  'Modern Sans-Serif': [
    { label: 'Plus Jakarta Sans (Recommended)', value: 'Plus Jakarta Sans' },
    { label: 'Inter (Standard UI)', value: 'Inter' },
    { label: 'DM Sans (Friendly UI)', value: 'DM Sans' },
    { label: 'Manrope (Engineered UI)', value: 'Manrope' },
    { label: 'Work Sans (Clear Technical)', value: 'Work Sans' },
    { label: 'Roboto (Versatile Tech)', value: 'Roboto' },
    { label: 'Open Sans (Accessible Neutral)', value: 'Open Sans' },
    { label: 'Outfit (Minimalist)', value: 'Outfit' },
    { label: 'Poppins (Friendly Geometric)', value: 'Poppins' },
    { label: 'Raleway (Refined Sans)', value: 'Raleway' },
  ],
  'Literary & Editorial Serif': [
    { label: 'Crimson Text (Warm Literary)', value: 'Crimson Text' },
    { label: 'Lora (Contemporary Book Serif)', value: 'Lora' },
    { label: 'Merriweather (High Legibility)', value: 'Merriweather' },
    { label: 'EB Garamond (Classical Book)', value: 'EB Garamond' },
  ],
};

const MONO_FONT_OPTIONS = [
  { label: 'JetBrains Mono (Recommended)', value: 'JetBrains Mono' },
  { label: 'Fira Code (Programmer Ligatures)', value: 'Fira Code' },
  { label: 'IBM Plex Mono (Industrial Tech)', value: 'IBM Plex Mono' },
  { label: 'Space Mono (Retro Geometric)', value: 'Space Mono' },
  { label: 'Source Code Pro (Classic Clean)', value: 'Source Code Pro' },
  { label: 'Inconsolata (Humanist Mono)', value: 'Inconsolata' },
  { label: 'Roboto Mono (Structured Tech)', value: 'Roboto Mono' },
];

const SERIF_FONT_OPTIONS = [
  { label: 'Crimson Text (Warm Literary - Default)', value: 'Crimson Text' },
  { label: 'Lora (Contemporary Book Serif)', value: 'Lora' },
  { label: 'Playfair Display (Luxury Editorial)', value: 'Playfair Display' },
  { label: 'EB Garamond (Classical Book Serif)', value: 'EB Garamond' },
  { label: 'Cormorant Garamond (Graceful Elegant)', value: 'Cormorant Garamond' },
  { label: 'Merriweather (Screen-Optimized)', value: 'Merriweather' },
  { label: 'Prata (Modern Didone)', value: 'Prata' },
  { label: 'Cinzel (Cinematic Classical)', value: 'Cinzel' },
  { label: 'Bodoni Moda (High Fashion Serif)', value: 'Bodoni Moda' },
  { label: 'Newsreader (Literary Review)', value: 'Newsreader' },
  { label: 'Source Serif 4 (Clean Text Serif)', value: 'Source Serif 4' },
];

const CURATED_PAIRINGS = [
  {
    name: 'Technical Obsidian',
    tag: 'Default',
    heading: 'Space Grotesk',
    body: 'Plus Jakarta Sans',
    mono: 'JetBrains Mono',
    serif: 'Crimson Text',
    desc: 'Engineering precision with crisp geometric balance.',
  },
  {
    name: 'Cyberpunk Terminal',
    tag: 'Sci-Fi',
    heading: 'Orbitron',
    body: 'JetBrains Mono',
    mono: 'Fira Code',
    serif: 'Cinzel',
    desc: 'High-contrast futuristic heads with developer mono body.',
  },
  {
    name: 'Editorial Journal',
    tag: 'Serif',
    heading: 'Playfair Display',
    body: 'Lora',
    mono: 'JetBrains Mono',
    serif: 'Playfair Display',
    desc: 'Warm literary personality for storytelling and writing.',
  },
  {
    name: 'Clean Architectural',
    tag: 'Minimal',
    heading: 'Outfit',
    body: 'DM Sans',
    mono: 'IBM Plex Mono',
    serif: 'Source Serif 4',
    desc: 'Ultra-clean Scandinavian minimalist interface style.',
  },
  {
    name: 'Neo-Grotesque Studio',
    tag: 'Expressive',
    heading: 'Syne',
    body: 'Manrope',
    mono: 'Space Mono',
    serif: 'Bodoni Moda',
    desc: 'Avant-garde bold typography for creative portfolios.',
  },
  {
    name: 'Classic Developer',
    tag: 'Standard',
    heading: 'Space Grotesk',
    body: 'Inter',
    mono: 'JetBrains Mono',
    serif: 'Crimson Text',
    desc: 'Focused technical clarity for software engineers.',
  },
];

const CURATED_PALETTES = [
  {
    name: 'Technical Obsidian',
    tag: 'Dark',
    bg: '#090a0f',
    heading: '#ffffff',
    text: '#e6edf3',
    textMuted: '#8b949e',
    card: '#12151e',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    cardHeading: '#ffffff',
    cardText: '#e6edf3',
    cardTextMuted: '#8b949e',
    accent: '#00f0aa',
    accentSec: '#f59e0b',
    btnBg: '#00f0aa',
    btnText: '#090a0f',
  },
  {
    name: 'Clean Studio Light',
    tag: 'Light',
    bg: '#f8fafc',
    heading: '#0f172a',
    text: '#334155',
    textMuted: '#64748b',
    card: '#ffffff',
    cardBorder: 'rgba(15, 23, 42, 0.08)',
    cardHeading: '#0f172a',
    cardText: '#334155',
    cardTextMuted: '#64748b',
    accent: '#059669',
    accentSec: '#d97706',
    btnBg: '#0f172a',
    btnText: '#ffffff',
  },
  {
    name: 'Warm Paper Editorial',
    tag: 'Paper',
    bg: '#fdfcf7',
    heading: '#1c1917',
    text: '#44403c',
    textMuted: '#78716c',
    card: '#ffffff',
    cardBorder: 'rgba(28, 25, 23, 0.1)',
    cardHeading: '#1c1917',
    cardText: '#44403c',
    cardTextMuted: '#78716c',
    accent: '#d97706',
    accentSec: '#b45309',
    btnBg: '#1c1917',
    btnText: '#fdfcf7',
  },
  {
    name: 'Cyberpunk Neon',
    tag: 'Neon',
    bg: '#050508',
    heading: '#ffea00',
    text: '#e0e7ff',
    textMuted: '#818cf8',
    card: '#0d0d18',
    cardBorder: 'rgba(255, 234, 0, 0.2)',
    cardHeading: '#ffea00',
    cardText: '#e0e7ff',
    cardTextMuted: '#818cf8',
    accent: '#ffea00',
    accentSec: '#ff0055',
    btnBg: '#ffea00',
    btnText: '#050508',
  },
  {
    name: 'Nordic Frost',
    tag: 'Clean',
    bg: '#f1f5f9',
    heading: '#090d16',
    text: '#334155',
    textMuted: '#64748b',
    card: '#ffffff',
    cardBorder: 'rgba(9, 13, 22, 0.08)',
    cardHeading: '#090d16',
    cardText: '#334155',
    cardTextMuted: '#64748b',
    accent: '#0284c7',
    accentSec: '#0ea5e9',
    btnBg: '#0284c7',
    btnText: '#ffffff',
  },
  {
    name: 'Midnight Violet',
    tag: 'Creative',
    bg: '#0a0714',
    heading: '#f5f3ff',
    text: '#ddd6fe',
    textMuted: '#8b5cf6',
    card: '#130d24',
    cardBorder: 'rgba(167, 139, 250, 0.15)',
    cardHeading: '#f5f3ff',
    cardText: '#ddd6fe',
    cardTextMuted: '#8b5cf6',
    accent: '#a78bfa',
    accentSec: '#38bdf8',
    btnBg: '#a78bfa',
    btnText: '#0a0714',
  },
];

function ColorInput({ label, value, onChange }) {
  return (
    <div className="editor-control">
      <label style={{ color: '#e2e8f0' }}>{label}</label>
      <div className="editor-color-input">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="editor-text-input"
          style={{ color: '#f1f5f9', background: '#06070a', border: '1px solid rgba(255,255,255,0.12)' }}
        />
      </div>
    </div>
  );
}

function SliderInput({ label, value, onChange, min, max, step, unit }) {
  return (
    <div className="editor-control">
      <label style={{ color: '#e2e8f0' }}>
        {label}
        <span className="editor-value" style={{ color: '#00f0aa' }}>{value}{unit || ''}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step || 1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="editor-slider"
      />
    </div>
  );
}

function GroupedSelectInput({ label, value, onChange, groups }) {
  return (
    <div className="editor-control">
      <label style={{ color: '#e2e8f0' }}>{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="editor-select"
        style={{ color: '#f1f5f9', background: '#06070a', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        {Object.entries(groups).map(([groupName, options]) => (
          <optgroup key={groupName} label={groupName} style={{ background: '#141824', color: '#f1f5f9' }}>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ background: '#141824', color: '#f1f5f9' }}>
                {opt.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

function SimpleSelectInput({ label, value, onChange, options }) {
  return (
    <div className="editor-control">
      <label style={{ color: '#e2e8f0' }}>{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="editor-select"
        style={{ color: '#f1f5f9', background: '#06070a', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt} style={{ background: '#141824', color: '#f1f5f9' }}>
            {opt.label || opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function ThemePanel({ tabs = [] }) {
  const { updateTheme, getNestedValue } = useTheme();
  const [section, setSection] = useState('typography');

  const sections = [
    { id: 'typography', label: 'Typography' },
    { id: 'colors', label: 'Colors' },
    { id: 'layout', label: 'Layout' },
    { id: 'backgrounds', label: 'Backgrounds' },
  ];

  const currentHeadingFont = (getNestedValue('global.headingFont') || 'Space Grotesk')
    ?.split(',')[0]
    ?.trim()
    ?.replace(/['"]/g, '');

  const currentBodyFont = (getNestedValue('global.fontFamily') || 'Plus Jakarta Sans')
    ?.split(',')[0]
    ?.trim()
    ?.replace(/['"]/g, '');

  const currentMonoFont = (getNestedValue('global.monoFont') || 'JetBrains Mono')
    ?.split(',')[0]
    ?.trim()
    ?.replace(/['"]/g, '');

  const currentSerifFont = (getNestedValue('global.serifFont') || getNestedValue('global.journalFont') || 'Crimson Text')
    ?.split(',')[0]
    ?.trim()
    ?.replace(/['"]/g, '');

  const applyPairing = (pairing) => {
    updateTheme('global.headingFont', `'${pairing.heading}', sans-serif`);
    updateTheme('global.fontFamily', `'${pairing.body}', sans-serif`);
    updateTheme('global.monoFont', `'${pairing.mono}', monospace`);
    if (pairing.serif) {
      updateTheme('global.serifFont', `'${pairing.serif}', Georgia, serif`);
    }
  };

  const applyPalette = (p) => {
    updateTheme('global.backgroundColor', p.bg);
    updateTheme('global.headingColor', p.heading);
    updateTheme('global.textColor', p.text);
    updateTheme('global.textColorMuted', p.textMuted);
    updateTheme('global.cardBackground', p.card);
    updateTheme('global.cardBorder', p.cardBorder);
    updateTheme('global.cardHeadingColor', p.cardHeading || p.heading);
    updateTheme('global.cardTextColor', p.cardText || p.text);
    updateTheme('global.cardTextMuted', p.cardTextMuted || p.textMuted);
    updateTheme('global.accentColor', p.accent);
    updateTheme('global.accentColorSecondary', p.accentSec);
    updateTheme('global.buttonBackground', p.btnBg);
    updateTheme('global.buttonTextColor', p.btnText);
  };

  const displayTabs = tabs && tabs.length > 0 ? tabs : [{ id: 'tab-main', label: 'Portfolio' }];

  // Values for live previews
  const liveCanvasBg = getNestedValue('global.backgroundColor') || '#090a0f';
  const liveHeadingColor = getNestedValue('global.headingColor') || (getNestedValue('global.textColor') === '#e6edf3' ? '#ffffff' : getNestedValue('global.textColor')) || '#ffffff';
  const liveCanvasTextColor = getNestedValue('global.textColor') || '#e6edf3';
  const liveCardBg = getNestedValue('global.cardBackground') || '#12151e';
  const liveCardBorder = getNestedValue('global.cardBorder') || 'rgba(255, 255, 255, 0.08)';
  const liveCardHeadingColor = getNestedValue('global.cardHeadingColor') || liveHeadingColor;
  const liveCardTextColor = getNestedValue('global.cardTextColor') || liveCanvasTextColor;
  const liveAccentColor = getNestedValue('global.accentColor') || '#00f0aa';
  const liveBtnBg = getNestedValue('global.buttonBackground') || liveAccentColor;
  const liveBtnText = getNestedValue('global.buttonTextColor') || '#090a0f';
  const liveRadius = getNestedValue('global.borderRadius') ?? 10;
  const liveGlassBlur = getNestedValue('global.glassBlur') ?? 12;
  const liveSpeed = getNestedValue('global.animationSpeed') ?? 1;
  const liveTabNavBg = getNestedValue('global.tabNavBackground') || 'rgba(10, 10, 15, 0.82)';
  const liveTabNavBorder = getNestedValue('global.tabNavBorder') || 'rgba(255, 255, 255, 0.06)';
  const liveTabBtnBg = getNestedValue('global.tabButtonBackground') || 'rgba(255, 255, 255, 0.03)';
  const liveTabBtnText = getNestedValue('global.tabButtonTextColor') || '#aaaaaa';
  const liveTabBtnBorder = getNestedValue('global.tabButtonBorder') || 'rgba(255, 255, 255, 0.08)';
  const liveTabActiveBg = getNestedValue('global.tabButtonActiveBackground') || `color-mix(in srgb, ${liveAccentColor} 15%, rgba(0,0,0,0.4))`;
  const liveTabActiveText = getNestedValue('global.tabButtonActiveTextColor') || liveAccentColor;

  return (
    <div className="theme-panel">
      {/* Sub-tabs */}
      <div className="theme-tabs">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`theme-tab ${section === s.id ? 'active' : ''}`}
            onClick={() => setSection(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="theme-panel-content">
        {/* --- TYPOGRAPHY TAB --- */}
        {section === 'typography' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 1-Click Font Pairings */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Sparkles size={14} color="#00f0aa" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                  Curated Font Pairings
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {CURATED_PAIRINGS.map((pairing) => {
                  const isSelected =
                    currentHeadingFont === pairing.heading &&
                    currentBodyFont === pairing.body;

                  return (
                    <button
                      key={pairing.name}
                      type="button"
                      onClick={() => applyPairing(pairing)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '6px',
                        background: isSelected ? 'rgba(0, 240, 170, 0.12)' : '#06070a',
                        border: '1px solid',
                        borderColor: isSelected ? '#00f0aa' : 'rgba(255, 255, 255, 0.08)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        transition: 'border-color 150ms ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isSelected ? '#00f0aa' : '#f8fafc' }}>
                          {pairing.name}
                        </span>
                        {isSelected && <Check size={13} color="#00f0aa" />}
                      </div>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', lineHeight: '1.3' }}>
                        {pairing.heading} + {pairing.body}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: '0' }} />

            {/* Individual Font Selectors */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                <Type size={14} color="#00f0aa" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                  Custom Font Selection
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <GroupedSelectInput
                  label="Display & Heading Font"
                  value={currentHeadingFont}
                  onChange={(v) => updateTheme('global.headingFont', `'${v}', sans-serif`)}
                  groups={HEADING_FONT_GROUPS}
                />

                <GroupedSelectInput
                  label="Body & Interface Font"
                  value={currentBodyFont}
                  onChange={(v) => updateTheme('global.fontFamily', `'${v}', sans-serif`)}
                  groups={BODY_FONT_GROUPS}
                />

                <SimpleSelectInput
                  label="Journal & Editorial Serif Font"
                  value={currentSerifFont}
                  onChange={(v) => updateTheme('global.serifFont', `'${v}', Georgia, serif`)}
                  options={SERIF_FONT_OPTIONS}
                />

                <SimpleSelectInput
                  label="Monospace / Code Font"
                  value={currentMonoFont}
                  onChange={(v) => updateTheme('global.monoFont', `'${v}', monospace`)}
                  options={MONO_FONT_OPTIONS}
                />

                <SliderInput
                  label="Base Font Size"
                  value={getNestedValue('global.baseFontSize') || 16}
                  onChange={(v) => updateTheme('global.baseFontSize', v)}
                  min={13}
                  max={20}
                  unit="px"
                />
              </div>
            </div>

            {/* Live Typography Preview Card */}
            <div
              style={{
                padding: '16px',
                borderRadius: '8px',
                background: '#06070a',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>
                Live Type Preview
              </span>

              <div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Heading ({currentHeadingFont})
                </span>
                <h3
                  style={{
                    fontFamily: `'${currentHeadingFont}', sans-serif`,
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    margin: 0,
                    lineHeight: '1.25',
                  }}
                >
                  The Architecture of Digital Identity
                </h3>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Body Text ({currentBodyFont})
                </span>
                <p
                  style={{
                    fontFamily: `'${currentBodyFont}', sans-serif`,
                    fontSize: '0.86rem',
                    color: '#e2e8f0',
                    margin: 0,
                    lineHeight: '1.5',
                  }}
                >
                  Interfaces communicate through intentional typographic hierarchy, balanced contrast, and fluid motion.
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Journal & Literary ({currentSerifFont})
                </span>
                <p
                  style={{
                    fontFamily: `'${currentSerifFont}', Georgia, serif`,
                    fontSize: '0.96rem',
                    fontStyle: 'italic',
                    color: '#cbd5e1',
                    margin: 0,
                    lineHeight: '1.6',
                  }}
                >
                  "A quiet evening under the amber luminescence of the city, contemplating software as craft."
                </p>
              </div>

              <div
                style={{
                  padding: '8px 10px',
                  borderRadius: '4px',
                  background: '#12151e',
                  fontFamily: `'${currentMonoFont}', monospace`,
                  fontSize: '0.78rem',
                  color: '#00f0aa',
                }}
              >
                const config = &#123; journalFont: '{currentSerifFont}', status: 'synced' &#125;;
              </div>
            </div>
          </div>
        )}

        {/* --- COLORS TAB --- */}
        {section === 'colors' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 1-Click Curated Color Palettes */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Palette size={14} color="#00f0aa" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                  1-Click Color Palettes
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {CURATED_PALETTES.map((pal) => (
                  <button
                    key={pal.name}
                    type="button"
                    onClick={() => applyPalette(pal)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '6px',
                      background: '#06070a',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      transition: 'border-color 150ms ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>
                        {pal.name}
                      </span>
                      <span style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px', background: '#141824', color: '#94a3b8' }}>
                        {pal.tag}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <span style={{ width: '13px', height: '13px', borderRadius: '50%', background: pal.bg, border: '1px solid rgba(255,255,255,0.2)' }} title="Canvas Bg" />
                      <span style={{ width: '13px', height: '13px', borderRadius: '50%', background: pal.card, border: '1px solid rgba(255,255,255,0.2)' }} title="Card Bg" />
                      <span style={{ width: '13px', height: '13px', borderRadius: '50%', background: pal.heading, border: '1px solid rgba(255,255,255,0.2)' }} title="Heading" />
                      <span style={{ width: '13px', height: '13px', borderRadius: '50%', background: pal.accent }} title="Accent" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: 0 }} />

            {/* 1. Canvas & Block Headline Typography */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Type size={14} color="#00f0aa" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                  Canvas & Headline Typography
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <ColorInput
                  label="Block Headline Color (e.g. Tech Stack, Projects, Hero Name)"
                  value={getNestedValue('global.headingColor') || (getNestedValue('global.textColor') === '#e6edf3' ? '#ffffff' : getNestedValue('global.textColor')) || '#ffffff'}
                  onChange={(v) => updateTheme('global.headingColor', v)}
                />
                <ColorInput
                  label="Canvas Subtitle & Bio Color"
                  value={getNestedValue('global.textColor') || '#e6edf3'}
                  onChange={(v) => updateTheme('global.textColor', v)}
                />
                <ColorInput
                  label="Canvas Muted Text Color"
                  value={getNestedValue('global.textColorMuted') || '#8b949e'}
                  onChange={(v) => updateTheme('global.textColorMuted', v)}
                />
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: 0 }} />

            {/* 2. Inside Cards & Surfaces Typography */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Square size={14} color="#00f0aa" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                  🃏 Inside Cards & Surface Typography
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <ColorInput
                  label="Card Surface Background"
                  value={getNestedValue('global.cardBackground') || '#12151e'}
                  onChange={(v) => updateTheme('global.cardBackground', v)}
                />
                <ColorInput
                  label="Card Border Color"
                  value={getNestedValue('global.cardBorder') || 'rgba(255, 255, 255, 0.08)'}
                  onChange={(v) => updateTheme('global.cardBorder', v)}
                />
                <ColorInput
                  label="Card Heading / Title Color (Titles inside cards)"
                  value={getNestedValue('global.cardHeadingColor') || getNestedValue('global.headingColor') || '#ffffff'}
                  onChange={(v) => updateTheme('global.cardHeadingColor', v)}
                />
                <ColorInput
                  label="Card Body / Description Color (Text inside cards)"
                  value={getNestedValue('global.cardTextColor') || getNestedValue('global.textColor') || '#e6edf3'}
                  onChange={(v) => updateTheme('global.cardTextColor', v)}
                />
                <ColorInput
                  label="Card Muted / Date Color (Tags & meta inside cards)"
                  value={getNestedValue('global.cardTextMuted') || getNestedValue('global.textColorMuted') || '#8b949e'}
                  onChange={(v) => updateTheme('global.cardTextMuted', v)}
                />
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: 0 }} />

            {/* 3. Accents & Action Buttons */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Sparkles size={14} color="#00f0aa" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                  🔘 Accents & Action Buttons
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <ColorInput
                  label="Primary Accent (Links, Badges, Highlights)"
                  value={getNestedValue('global.accentColor') || '#00f0aa'}
                  onChange={(v) => updateTheme('global.accentColor', v)}
                />
                <ColorInput
                  label="Secondary Accent"
                  value={getNestedValue('global.accentColorSecondary') || '#f59e0b'}
                  onChange={(v) => updateTheme('global.accentColorSecondary', v)}
                />
                <ColorInput
                  label="Primary Button Background Color"
                  value={getNestedValue('global.buttonBackground') || getNestedValue('global.accentColor') || '#00f0aa'}
                  onChange={(v) => updateTheme('global.buttonBackground', v)}
                />
                <ColorInput
                  label="Primary Button Text Color"
                  value={getNestedValue('global.buttonTextColor') || '#090a0f'}
                  onChange={(v) => updateTheme('global.buttonTextColor', v)}
                />
              </div>
            </div>

            {/* Live Interactive Hierarchy Preview */}
            <div
              style={{
                padding: '16px',
                borderRadius: '8px',
                background: liveCanvasBg,
                border: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>
                Live Canvas & Card Hierarchy Preview
              </span>

              {/* Block Headline */}
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: liveHeadingColor, lineHeight: 1.2 }}>
                  Featured Projects
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: liveCanvasTextColor }}>
                  Subtitle on canvas outside card
                </p>
              </div>

              {/* Card Container */}
              <div
                style={{
                  padding: '14px',
                  borderRadius: `${liveRadius}px`,
                  background: liveCardBg,
                  border: `1px solid ${liveCardBorder}`,
                  backdropFilter: `blur(${liveGlassBlur}px)`,
                  WebkitBackdropFilter: `blur(${liveGlassBlur}px)`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: liveCardHeadingColor }}>
                  Card Title (Inside Card)
                </h4>

                <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: '1.5', color: liveCardTextColor }}>
                  This is the text inside your card. It can have distinct contrast from your outer canvas headline.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    style={{
                      padding: '6px 14px',
                      borderRadius: `${liveRadius}px`,
                      background: liveBtnBg,
                      color: liveBtnText,
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'default',
                    }}
                  >
                    Action Button
                  </button>

                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      background: `color-mix(in srgb, ${liveAccentColor} 15%, transparent)`,
                      color: liveAccentColor,
                      border: `1px solid color-mix(in srgb, ${liveAccentColor} 30%, transparent)`,
                      fontSize: '0.72rem',
                      fontWeight: 600,
                    }}
                  >
                    Accent Pill
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- LAYOUT TAB --- */}
        {section === 'layout' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <SliderInput
                label="Corner Border Radius"
                value={getNestedValue('global.borderRadius') ?? 10}
                onChange={(v) => updateTheme('global.borderRadius', v)}
                min={0}
                max={24}
                unit="px"
              />
              <SliderInput
                label="Glass Blur Intensity"
                value={getNestedValue('global.glassBlur') ?? 12}
                onChange={(v) => updateTheme('global.glassBlur', v)}
                min={0}
                max={30}
                unit="px"
              />
              <SliderInput
                label="Animation Speed Multiplier"
                value={getNestedValue('global.animationSpeed') ?? 1}
                onChange={(v) => updateTheme('global.animationSpeed', v)}
                min={0.5}
                max={2}
                step={0.1}
                unit="x"
              />
            </div>

            {/* Live Layout Preview Card */}
            <div
              style={{
                padding: '16px',
                borderRadius: `${liveRadius}px`,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: `blur(${liveGlassBlur}px)`,
                WebkitBackdropFilter: `blur(${liveGlassBlur}px)`,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                transition: `all ${Math.round(220 / liveSpeed)}ms cubic-bezier(0.16, 1, 0.3, 1)`,
              }}
            >
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>
                Live Layout & Radius Preview
              </span>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div
                  style={{
                    padding: '8px 16px',
                    borderRadius: `${liveRadius}px`,
                    background: liveAccentColor,
                    color: '#090a0f',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                  }}
                >
                  Radius: {liveRadius}px
                </div>
                <div
                  style={{
                    padding: '8px 14px',
                    borderRadius: `${Math.max(0, Math.round(liveRadius * 0.6))}px`,
                    background: '#06070a',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '0.78rem',
                    color: '#e2e8f0',
                  }}
                >
                  Glass Blur: {liveGlassBlur}px
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- BACKGROUNDS TAB (Dynamic Per-Tab) --- */}
        {section === 'backgrounds' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Sparkles size={14} color="#00f0aa" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                  Global Canvas Background
                </span>
              </div>

              <ColorInput
                label="Default Canvas Background"
                value={getNestedValue('global.backgroundColor') || '#090a0f'}
                onChange={(v) => updateTheme('global.backgroundColor', v)}
              />
              <div className="editor-control">
                <label style={{ color: '#e2e8f0' }}>Canvas Gradient (Optional)</label>
                <input
                  type="text"
                  value={getNestedValue('global.backgroundGradient') || ''}
                  onChange={(e) => updateTheme('global.backgroundGradient', e.target.value || null)}
                  placeholder="linear-gradient(180deg, #090a0f 0%, #12151e 100%)"
                  className="editor-text-input full-width"
                  style={{ color: '#f1f5f9', background: '#06070a', border: '1px solid rgba(255,255,255,0.12)' }}
                />
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: 0 }} />

            {/* Custom Background Image & Glass Overlay */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Image size={14} color="#00f0aa" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                  Custom Background Image
                </span>
              </div>
              <p style={{ fontSize: '0.76rem', color: '#94a3b8', marginBottom: '14px', lineHeight: '1.4' }}>
                Upload a background image with adjustable glass overlay and blur for a premium visual effect.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <ImageUploadPicker
                  label="Background Image"
                  value={getNestedValue('global.backgroundImage') || ''}
                  onChange={(url) => updateTheme('global.backgroundImage', url || null)}
                />

                {getNestedValue('global.backgroundImage') && (
                  <>
                    <SliderInput
                      label="Overlay Darkness"
                      value={Math.round((getNestedValue('global.backgroundOverlayOpacity') ?? 0.75) * 100)}
                      onChange={(v) => updateTheme('global.backgroundOverlayOpacity', v / 100)}
                      min={0}
                      max={100}
                      step={5}
                      unit="%"
                    />

                    <ColorInput
                      label="Overlay Color (defaults to canvas background)"
                      value={getNestedValue('global.backgroundOverlayColor') || getNestedValue('global.backgroundColor') || '#090a0f'}
                      onChange={(v) => updateTheme('global.backgroundOverlayColor', v)}
                    />

                    <SliderInput
                      label="Background Blur"
                      value={getNestedValue('global.backgroundBlur') ?? 0}
                      onChange={(v) => updateTheme('global.backgroundBlur', v)}
                      min={0}
                      max={20}
                      step={1}
                      unit="px"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        updateTheme('global.backgroundImage', null);
                        updateTheme('global.backgroundOverlayOpacity', 0.75);
                        updateTheme('global.backgroundOverlayColor', null);
                        updateTheme('global.backgroundBlur', 0);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 14px',
                        borderRadius: '6px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        width: 'fit-content',
                      }}
                    >
                      <Trash2 size={13} /> Remove Background Image
                    </button>
                  </>
                )}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: 0 }} />

            {/* Tab Navigation Bar Background & Buttons */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <FolderKanban size={14} color="#00f0aa" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                  Tab Navigation Bar & Button Colors
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <ColorInput
                  label="Tab Navigation Bar Background"
                  value={getNestedValue('global.tabNavBackground') || 'rgba(10, 10, 15, 0.82)'}
                  onChange={(v) => updateTheme('global.tabNavBackground', v)}
                />
                <ColorInput
                  label="Tab Navigation Bottom Border Line"
                  value={getNestedValue('global.tabNavBorder') || 'rgba(255, 255, 255, 0.06)'}
                  onChange={(v) => updateTheme('global.tabNavBorder', v)}
                />
                <ColorInput
                  label="Inactive Tab Button Background"
                  value={getNestedValue('global.tabButtonBackground') || 'rgba(255, 255, 255, 0.03)'}
                  onChange={(v) => updateTheme('global.tabButtonBackground', v)}
                />
                <ColorInput
                  label="Inactive Tab Button Text Color"
                  value={getNestedValue('global.tabButtonTextColor') || '#aaaaaa'}
                  onChange={(v) => updateTheme('global.tabButtonTextColor', v)}
                />
                <ColorInput
                  label="Inactive Tab Button Border Color"
                  value={getNestedValue('global.tabButtonBorder') || 'rgba(255, 255, 255, 0.08)'}
                  onChange={(v) => updateTheme('global.tabButtonBorder', v)}
                />
                <ColorInput
                  label="Active Tab Button Background Highlight (Optional)"
                  value={getNestedValue('global.tabButtonActiveBackground') || ''}
                  onChange={(v) => updateTheme('global.tabButtonActiveBackground', v || null)}
                />
                <ColorInput
                  label="Active Tab Text & Border Color (Optional)"
                  value={getNestedValue('global.tabButtonActiveTextColor') || getNestedValue('global.accentColor') || '#00f0aa'}
                  onChange={(v) => updateTheme('global.tabButtonActiveTextColor', v || null)}
                />
              </div>

              {/* Live Interactive Tab Bar Preview */}
              <div
                style={{
                  marginTop: '14px',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: liveTabNavBg,
                  border: `1px solid ${liveTabNavBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  overflowX: 'auto',
                }}
              >
                <div
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    background: liveTabActiveBg,
                    color: liveTabActiveText,
                    border: `1px solid ${liveTabActiveText}`,
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    boxShadow: `0 0 12px color-mix(in srgb, ${liveTabActiveText} 25%, transparent)`,
                  }}
                >
                  Active Tab
                </div>
                <div
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    background: liveTabBtnBg,
                    color: liveTabBtnText,
                    border: `1px solid ${liveTabBtnBorder}`,
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Inactive Tab
                </div>
                <div
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    background: liveTabBtnBg,
                    color: liveTabBtnText,
                    border: `1px solid ${liveTabBtnBorder}`,
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Projects
                </div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: 0 }} />

            {/* Dynamic Tab Backgrounds */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Layers size={14} color="#00f0aa" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                  Per-Tab Backgrounds ({displayTabs.length})
                </span>
              </div>
              <p style={{ fontSize: '0.76rem', color: '#94a3b8', marginBottom: '14px', lineHeight: '1.4' }}>
                Customize the distinct canvas background for each navigation tab.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {displayTabs.map((tab) => (
                  <div
                    key={tab.id}
                    style={{
                      padding: '14px',
                      borderRadius: '8px',
                      background: '#06070a',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f8fafc' }}>
                        {tab.label || tab.id}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                        #{tab.id}
                      </span>
                    </div>

                    <ColorInput
                      label="Tab Background Color"
                      value={getNestedValue(`tabs.${tab.id}.backgroundColor`) || getNestedValue('global.backgroundColor') || '#090a0f'}
                      onChange={(v) => updateTheme(`tabs.${tab.id}.backgroundColor`, v)}
                    />

                    <div className="editor-control" style={{ marginBottom: 0 }}>
                      <label style={{ color: '#e2e8f0' }}>Tab Gradient (Optional)</label>
                      <input
                        type="text"
                        value={getNestedValue(`tabs.${tab.id}.backgroundGradient`) || ''}
                        onChange={(e) => updateTheme(`tabs.${tab.id}.backgroundGradient`, e.target.value || null)}
                        placeholder="e.g. radial-gradient(circle at 50% 0%, #1a1e2e 0%, #090a0f 70%)"
                        className="editor-text-input full-width"
                        style={{ color: '#f1f5f9', background: '#06070a', border: '1px solid rgba(255,255,255,0.12)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
