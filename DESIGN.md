# Design System: Technical Obsidian & Precision Luminescence

## 1. Stylistic Direction
**"Technical Obsidian & Precision Luminescence"**
A clean, high-contrast, technical dark visual language engineered for digital craftspeople. It decisively breaks away from the generic "AI/SaaS template" aesthetic (floating purple/cyan gradient orbs, frosted glassmorphism glows, unstyled Inter typography, and uniform roundness) in favor of structural grid discipline, true z-depth surface elevation, and razor-sharp typographic hierarchy.

---

## 2. Token Architecture & Rationale

### Typography System
- **Display / Heading**: `Space Grotesk` (`--font-display`) — A geometric grotesque with technical personality, deep ink-traps, and angular nuances. Replaces the generic `Orbitron` / unstyled sans.
- **Body / Interface**: `Plus Jakarta Sans` (`--font-body`) — A balanced, neo-grotesque interface face with open counters and robust legibility across small sizes. Replaces ubiquitous `Inter`.
- **Monospace / Code / Data**: `JetBrains Mono` (`--font-mono`) — High-precision monospace with clear distinction between 0/O, 1/l, and structured tabular numbers.
- **Editorial / Journal (Diary Mode)**: `Crimson Text` / `Crimson Pro` (`--font-serif`) — Classic literary serif for narrative warmth.
- **Modular Type Scale**:
  - `--text-2xs`: `0.6875rem` (11px) | Line-height: `1.4`
  - `--text-xs`: `0.75rem` (12px) | Line-height: `1.4`
  - `--text-sm`: `0.875rem` (14px) | Line-height: `1.5`
  - `--text-base`: `1rem` (16px) | Line-height: `1.6`
  - `--text-lg`: `1.125rem` (18px) | Line-height: `1.5`
  - `--text-xl`: `1.25rem` (20px) | Line-height: `1.4`
  - `--text-2xl`: `1.5rem` (24px) | Line-height: `1.3`
  - `--text-3xl`: `1.875rem` (30px) | Line-height: `1.2`
  - `--text-4xl`: `2.25rem` (36px) | Line-height: `1.15`
  - `--text-5xl`: `3rem` (48px) | Line-height: `1.05`

### Color Palette & Surfaces
- **Dominant Base**: Deep Obsidian (`--color-bg-base`: `#090a0f`).
- **Surface Hierarchy**:
  - Sunken / Inset: `#050608` (`--color-surface-sunken`)
  - Default Canvas: `#090a0f` (`--color-surface-base`)
  - Raised Card: `#11131a` (`--color-surface-raised`)
  - Overlay / Hover: `#171a24` (`--color-surface-overlay`)
  - Elevated Modal / Nav: `#1f2330` (`--color-surface-elevated`)
  - Border Subtle: `rgba(255, 255, 255, 0.07)` (`--color-border-subtle`)
  - Border Strong: `rgba(255, 255, 255, 0.14)` (`--color-border-strong`)
- **Primary Dominant Accent**: **Signal Mint / Emerald** (`--color-accent-primary`: `#00f0aa`, `--color-accent-hover`: `#00d296`, `--color-accent-dim`: `rgba(0, 240, 170, 0.12)`). High visibility, energetic, and distinct from generic indigo/purple.
- **Secondary Accent**: **Solar Amber** (`--color-accent-secondary`: `#f59e0b`, `--color-accent-secondary-dim`: `rgba(245, 158, 11, 0.12)`).
- **Destructive / Error**: **Muted Crimson** (`--color-danger`: `#f43f5e`, `--color-danger-dim`: `rgba(244, 63, 94, 0.12)`).
- **Success**: **Emerald Green** (`--color-success`: `#10b981`).

### Radius Scale (Proportional & Hierarchical)
- `--radius-xs`: `4px` (Tags, pill badges, micro-indicators)
- `--radius-sm`: `6px` (Buttons, form inputs, list items)
- `--radius-md`: `10px` (Cards, panels, content blocks)
- `--radius-lg`: `16px` (Modals, major feature containers)
- `--radius-full`: `9999px` (Avatars, capsule badges)

### Elevation & Shadow Scale (Physics-Grounded Z-Depth)
- `--shadow-sm`: `0 1px 3px 0 rgba(0, 0, 0, 0.4)`
- `--shadow-md`: `0 4px 12px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.4)`
- `--shadow-lg`: `0 12px 28px -4px rgba(0, 0, 0, 0.6), 0 4px 12px -2px rgba(0, 0, 0, 0.4)`
- `--shadow-xl`: `0 24px 48px -8px rgba(0, 0, 0, 0.7), 0 8px 20px -4px rgba(0, 0, 0, 0.5)`

### Motion & Interaction Tokens
- `--ease-out`: `cubic-bezier(0.16, 1, 0.3, 1)`
- `--transition-fast`: `150ms cubic-bezier(0.16, 1, 0.3, 1)`
- `--transition-normal`: `220ms cubic-bezier(0.16, 1, 0.3, 1)`
- Real interactive states across all interactive elements (`:hover`, `:focus-visible`, `:active`, `:disabled`), with comprehensive `@media (prefers-reduced-motion: reduce)` fallbacks.

---

## 3. Audit & Slop Removal Summary

Across the audit of all 14 stylesheets, the codebase exhibited prominent AI boilerplate signals:
1. **Typography**: Monolithic hardcoded `font-family: 'Inter', sans-serif` peppered arbitrarily across cards, buttons, inputs, and footers without paired contrast or structured type scaling.
2. **Color**: Pervasive `linear-gradient(135deg, #00d4ff, #a855f7, #f472b6)` gradients across hero text, action buttons, avatars, and badge borders, creating the single most recognizable Tailwind AI template signature.
3. **Surfaces & Glows**: Floating decorative background orbs (`.landing-orb`, `.dashboard-orb`, `.auth-orb` with `filter: blur(120px)` and continuous pulsing animations) and uniform 1px white borders with neon drop shadows on every card without depth hierarchy.
4. **Motion & State**: Pervasive `transition: all` and uniform `transform: translateY(-2px)` bounce applied to every element without purpose-driven property transitions, absent `:focus-visible` keyboard accessibility rings, and total lack of `@media (prefers-reduced-motion: reduce)` considerations.

All of these instances have been purged and replaced with a coherent, auditable CSS token engine and purposeful interaction design.
