import { FolderKanban, RotateCcw } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import ColorInput from './ColorInput';
import {
  NAV_LOOKS,
  NAV_BAR_MODES,
  NAV_DEFAULTS,
  NAV_COLOR_KEYS,
  NAV_RESET_PATHS,
  resolveNav,
  customNavColor,
  hasNavCustomization,
} from '../../../lib/navStyle';

const muted = { fontSize: '0.76rem', color: 'var(--fn-editor-muted)', lineHeight: '1.4' };
const groupTitle = { fontSize: '0.78rem', fontWeight: 700, color: 'var(--fn-editor-ink)', margin: '0 0 8px' };

/** A row of mutually exclusive choices. */
function Segmented({ label, value, options, onChange, fieldId }) {
  return (
    <div className="editor-control" data-theme-field={fieldId}>
      <label>{label}</label>
      <div role="radiogroup" aria-label={label} style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {options.map((o) => {
          const active = o.id === value;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                color: 'var(--fn-editor-ink)',
                border: `1.5px solid ${active ? 'var(--fn-editor-coral)' : 'var(--fn-editor-line)'}`,
                background: active ? 'color-mix(in srgb, var(--fn-editor-coral) 16%, transparent)' : 'transparent',
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Preview chip drawn from the same tokens the real tab bar uses. */
function Chip({ children, v, state }) {
  const bg = { active: v['--nav-active-bg'], hover: v['--nav-hover-bg'], rest: v['--nav-tab-bg'] }[state];
  const text = { active: v['--nav-active-text'], hover: v['--nav-hover-text'], rest: v['--nav-tab-text'] }[state];
  const border = { active: v['--nav-active-border'], hover: v['--nav-hover-border'], rest: v['--nav-tab-border'] }[state];
  const shadow = { active: v['--nav-active-shadow'], hover: v['--nav-hover-shadow'], rest: 'none' }[state];
  const lift = state === 'hover' ? v['--nav-hover-lift'] : '0px';
  return (
    <span
      style={{
        padding: '6px 14px',
        borderRadius: v['--nav-tab-radius'],
        border: `${v['--nav-tab-border-w']} solid ${border}`,
        background: bg,
        color: text,
        boxShadow: shadow,
        transform: `translate(${lift}, ${lift})`,
        fontSize: '0.76rem',
        fontWeight: v['--nav-tab-weight'],
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

/**
 * Theme panel > Navigation. Everything here is a choice on top of the theme:
 * left empty, the bar follows the palette and design. Applying a preset or a
 * palette clears these choices (see applyDesignPreset / applyPalette).
 */
export default function NavigationSection() {
  const { theme, updateTheme, getNestedValue } = useTheme();
  const { vars, look } = resolveNav(theme);
  const nav = { ...NAV_DEFAULTS, ...(theme.global?.nav || {}) };
  const customized = hasNavCustomization(theme);
  const lookLabel = NAV_LOOKS.find((l) => l.id === look)?.label;

  const setNav = (key, value) => updateTheme(`global.nav.${key}`, value);
  const colorRow = (key, label, resolved) => {
    const path = NAV_COLOR_KEYS[key];
    const field = path.replace('global.', '');
    return (
      <ColorInput
        key={key}
        fieldId={path}
        label={label}
        value={customNavColor(theme, field) || ''}
        placeholder="Follows theme"
        swatch={resolved}
        onChange={(v) => updateTheme(path, v || null)}
      />
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <FolderKanban size={14} color="var(--fn-editor-coral)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fn-editor-ink)' }}>Navigation bar</span>
        </div>
        <p style={{ ...muted, margin: 0 }}>
          The bar follows your theme. Pick a look and adjust it. Choosing a preset or a palette resets these
          choices, so the most recent change always wins.
        </p>
      </div>

      {/* Live preview, built from the same tokens as the real bar */}
      <div
        aria-label="Navigation bar preview"
        style={{
          padding: 10,
          borderRadius: 10,
          border: '1.5px solid var(--fn-editor-line)',
          background: getNestedValue('global.backgroundColor') || 'transparent',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 12px',
            overflowX: 'auto',
            justifyContent: nav.align === 'left' ? 'flex-start' : 'center',
            background: vars['--nav-bar-bg'],
            borderBottom: `1px solid ${vars['--nav-bar-border']}`,
          }}
        >
          <Chip v={vars} state="active">Active</Chip>
          <Chip v={vars} state="rest">Tab</Chip>
          <Chip v={vars} state="hover">Hover</Chip>
        </div>
      </div>

      <div>
        <p style={groupTitle}>Look</p>
        <div role="radiogroup" aria-label="Navigation look" data-theme-field="global.nav.look" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
          {NAV_LOOKS.map((l) => {
            const active = l.id === nav.look;
            return (
              <button
                key={l.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setNav('look', l.id)}
                style={{
                  textAlign: 'left',
                  padding: '8px 10px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  color: 'var(--fn-editor-ink)',
                  border: `1.5px solid ${active ? 'var(--fn-editor-coral)' : 'var(--fn-editor-line)'}`,
                  background: active ? 'color-mix(in srgb, var(--fn-editor-coral) 14%, transparent)' : 'transparent',
                }}
              >
                <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700 }}>
                  {l.id === 'auto' ? `Auto (${lookLabel})` : l.label}
                </span>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--fn-editor-muted)' }}>{l.hint}</span>
              </button>
            );
          })}
        </div>
      </div>

      <ColorInput
        fieldId="global.nav.accent"
        label="Accent (hover, focus and active)"
        value={nav.accent || ''}
        placeholder="Follows theme"
        swatch={vars['--nav-accent']}
        onChange={(v) => setNav('accent', v || null)}
      />

      <Segmented
        fieldId="global.nav.align"
        label="Alignment"
        value={nav.align}
        options={[{ id: 'center', label: 'Center' }, { id: 'left', label: 'Left' }]}
        onChange={(v) => setNav('align', v)}
      />
      <Segmented
        fieldId="global.nav.size"
        label="Size"
        value={nav.size}
        options={[{ id: 'comfortable', label: 'Comfortable' }, { id: 'compact', label: 'Compact' }]}
        onChange={(v) => setNav('size', v)}
      />
      <Segmented
        fieldId="global.nav.bar"
        label="Bar style"
        value={nav.bar}
        options={NAV_BAR_MODES}
        onChange={(v) => setNav('bar', v)}
      />

      <div>
        <p style={groupTitle}>Colors</p>
        <p style={{ ...muted, margin: '0 0 10px' }}>Leave a field empty to follow the theme. Text colors adjust automatically.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {colorRow('barBg', 'Bar background', vars['--nav-bar-bg'])}
          {colorRow('tabBg', 'Tab background', vars['--nav-tab-bg'])}
          {colorRow('tabText', 'Tab text', vars['--nav-tab-text'])}
          {colorRow('activeBg', 'Active tab color', vars['--nav-active-bg'])}
        </div>
      </div>

      <button
        type="button"
        disabled={!customized}
        onClick={() => NAV_RESET_PATHS.forEach((p) => updateTheme(p, null))}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          width: 'fit-content',
          padding: '7px 12px',
          borderRadius: 8,
          fontSize: '0.78rem',
          fontWeight: 700,
          cursor: customized ? 'pointer' : 'not-allowed',
          opacity: customized ? 1 : 0.5,
          color: 'var(--fn-editor-ink)',
          border: '1.5px solid var(--fn-editor-line)',
          background: 'transparent',
        }}
      >
        <RotateCcw size={13} aria-hidden="true" /> Reset to theme
      </button>
    </div>
  );
}
