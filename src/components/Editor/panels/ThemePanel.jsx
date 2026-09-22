import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import { Sparkles, Type, Check, Layers, Palette, Square, FolderKanban, Image, Trash2, LayoutTemplate, ShieldCheck, Sliders, Compass, Info } from 'lucide-react';
import ImageUploadPicker from '../ImageUploadPicker';

const HEADING_FONT_GROUPS = {
  'Editorial & Classic Serif': [
    { label: 'Fraunces (Field Notes Editorial)', value: 'Fraunces' },
    { label: 'Playfair Display (Luxury Editorial)', value: 'Playfair Display' },
    { label: 'Cinzel (Cinematic Classical)', value: 'Cinzel' },
    { label: 'Cormorant Garamond (Graceful Serif)', value: 'Cormorant Garamond' },
    { label: 'Prata (Modern Didone)', value: 'Prata' },
  ],
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
    { label: 'DM Sans (Field Notes UI)', value: 'DM Sans' },
    { label: 'Plus Jakarta Sans (Recommended)', value: 'Plus Jakarta Sans' },
    { label: 'Inter (Standard UI)', value: 'Inter' },
    { label: 'Manrope (Engineered UI)', value: 'Manrope' },
    { label: 'Work Sans (Clear Technical)', value: 'Work Sans' },
    { label: 'Roboto (Versatile Tech)', value: 'Roboto' },
    { label: 'Open Sans (Accessible Neutral)', value: 'Open Sans' },
    { label: 'Outfit (Minimalist)', value: 'Outfit' },
    { label: 'Poppins (Friendly Geometric)', value: 'Poppins' },
    { label: 'Raleway (Refined Sans)', value: 'Raleway' },
  ],
  'Literary & Editorial Serif': [
    { label: 'Fraunces (Field Notes Warm Serif)', value: 'Fraunces' },
    { label: 'Crimson Text (Warm Literary)', value: 'Crimson Text' },
    { label: 'Lora (Contemporary Book Serif)', value: 'Lora' },
    { label: 'Merriweather (High Legibility)', value: 'Merriweather' },
    { label: 'EB Garamond (Classical Book)', value: 'EB Garamond' },
  ],
};

const MONO_FONT_OPTIONS = [
  { label: 'DM Mono (Field Notes Mono)', value: 'DM Mono' },
  { label: 'JetBrains Mono (Recommended)', value: 'JetBrains Mono' },
  { label: 'Fira Code (Programmer Ligatures)', value: 'Fira Code' },
  { label: 'IBM Plex Mono (Industrial Tech)', value: 'IBM Plex Mono' },
  { label: 'Space Mono (Retro Geometric)', value: 'Space Mono' },
  { label: 'Source Code Pro (Classic Clean)', value: 'Source Code Pro' },
  { label: 'Inconsolata (Humanist Mono)', value: 'Inconsolata' },
  { label: 'Roboto Mono (Structured Tech)', value: 'Roboto Mono' },
];

const SERIF_FONT_OPTIONS = [
  { label: 'Fraunces (Field Notes Warm Serif)', value: 'Fraunces' },
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
    name: 'Field Notes Editorial',
    tag: 'New Default',
    heading: 'Fraunces',
    body: 'DM Sans',
    mono: 'DM Mono',
    serif: 'Fraunces',
    desc: 'Tactile paper, literary Fraunces serif headings, and clean DM Sans typography.',
  },
  {
    name: 'Technical Obsidian',
    tag: 'Dark Glass',
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
    name: 'Field Notes Editorial',
    tag: 'Paper',
    bg: '#f5efdf',
    heading: '#252320',
    text: '#252320',
    textMuted: '#746e63',
    card: '#fffaf0',
    cardBorder: '#d7ccb8',
    cardHeading: '#252320',
    cardText: '#252320',
    cardTextMuted: '#746e63',
    accent: '#e96d52',
    accentSec: '#f4cf62',
    btnBg: '#252320',
    btnText: '#fffaf0',
  },
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

const DESIGN_PRESETS = [
  {
    id: 'field-notes',
    name: 'Field Notes Editorial',
    tag: 'New Default',
    desc: 'Tactile warm paper, deep ink, rich serif Fraunces typography, and offset frame shadows.',
    preview: {
      bg: '#f5efdf',
      card: '#fffaf0',
      border: '#d7ccb8',
      accent: '#e96d52',
      text: '#252320',
      shadow: '3px 4px 0 rgba(37, 35, 32, 0.22)',
    },
    theme: {
      'global.designStyle': 'field-notes',
      'global.fontFamily': "'DM Sans', sans-serif",
      'global.headingFont': "'Fraunces', serif",
      'global.monoFont': "'DM Mono', monospace",
      'global.serifFont': "'Fraunces', Georgia, serif",
      'global.backgroundColor': '#f5efdf',
      'global.headingColor': '#252320',
      'global.textColor': '#252320',
      'global.textColorMuted': '#746e63',
      'global.cardBackground': '#fffaf0',
      'global.cardBorder': '#d7ccb8',
      'global.cardHeadingColor': '#252320',
      'global.cardTextColor': '#252320',
      'global.cardTextMuted': '#746e63',
      'global.accentColor': '#e96d52',
      'global.accentColorSecondary': '#f4cf62',
      'global.buttonBackground': '#252320',
      'global.buttonTextColor': '#fffaf0',
      'global.borderRadius': 14,
      'global.cardBorderWidth': 2,
      'global.cardBorderStyle': 'solid',
      'global.cardBoxShadow': '4px 5px 0 rgba(37, 35, 32, 0.22)',
      'global.cardShadow': '4px 5px 0 rgba(37, 35, 32, 0.22)',
      'global.cardShadowHover': '6px 7px 0 rgba(37, 35, 32, 0.32)',
      'global.blockGap': 32,
      'global.blockPadding': 20,
      'global.blockDividerStyle': 'solid',
      'global.blockDividerColor': '#d7ccb8',
      'global.headingFontWeight': 600,
      'global.pillStyle': 'editorial-bordered',
      'global.buttonStyle': 'editorial-tactile',
      'global.iconStyle': 'bordered-box',
      'global.tabNavBackground': 'rgba(255, 250, 240, 0.96)',
      'global.tabNavBorder': '#d7ccb8',
      'global.tabButtonBackground': '#fffaf0',
      'global.tabButtonTextColor': '#746e63',
      'global.tabButtonBorder': '#d7ccb8',
      'global.tabButtonActiveBackground': '#e96d52',
      'global.tabButtonActiveTextColor': '#fffaf0',
      'global.glassBlur': 0,
    },
  },
  {
    id: 'obsidian',
    name: 'Technical Obsidian',
    tag: 'Classic Dark',
    desc: 'Deep space obsidian canvas, vibrant luminescence, glassmorphism, and monospace code accents.',
    preview: {
      bg: '#090a0f',
      card: '#12151e',
      border: 'rgba(255, 255, 255, 0.08)',
      accent: '#00f0aa',
      text: '#e6edf3',
      shadow: 'none',
    },
    theme: {
      'global.designStyle': 'obsidian',
      'global.fontFamily': "'Plus Jakarta Sans', system-ui, sans-serif",
      'global.headingFont': "'Space Grotesk', sans-serif",
      'global.monoFont': "'JetBrains Mono', monospace",
      'global.serifFont': "'Crimson Text', Georgia, serif",
      'global.backgroundColor': '#090a0f',
      'global.headingColor': '#ffffff',
      'global.textColor': '#e6edf3',
      'global.textColorMuted': '#8b949e',
      'global.cardBackground': 'rgba(18, 21, 30, 0.82)',
      'global.cardBorder': 'rgba(255, 255, 255, 0.08)',
      'global.cardHeadingColor': '#ffffff',
      'global.cardTextColor': '#e6edf3',
      'global.cardTextMuted': '#8b949e',
      'global.accentColor': '#00f0aa',
      'global.accentColorSecondary': '#f59e0b',
      'global.buttonBackground': '#00f0aa',
      'global.buttonTextColor': '#090a0f',
      'global.borderRadius': 10,
      'global.cardBorderWidth': 1,
      'global.cardBorderStyle': 'solid',
      'global.cardBoxShadow': 'none',
      'global.cardShadow': 'none',
      'global.cardShadowHover': '0 8px 24px rgba(0, 0, 0, 0.45)',
      'global.blockGap': 28,
      'global.blockPadding': 20,
      'global.blockDividerStyle': 'none',
      'global.blockDividerColor': 'rgba(255, 255, 255, 0.08)',
      'global.headingFontWeight': 700,
      'global.pillStyle': 'rounded-glow',
      'global.buttonStyle': 'flat-border',
      'global.iconStyle': 'glass-accent',
      'global.tabNavBackground': 'rgba(10, 10, 15, 0.82)',
      'global.tabNavBorder': 'rgba(255, 255, 255, 0.08)',
      'global.tabButtonBackground': 'rgba(255, 255, 255, 0.03)',
      'global.tabButtonTextColor': '#8b949e',
      'global.tabButtonBorder': 'rgba(255, 255, 255, 0.08)',
      'global.tabButtonActiveBackground': 'rgba(0, 240, 170, 0.15)',
      'global.tabButtonActiveTextColor': '#00f0aa',
      'global.glassBlur': 12,
    },
  },
  {
    id: 'clean-light',
    name: 'Clean Studio Light',
    tag: 'Minimal Light',
    desc: 'Crisp white cards, balanced slate typography, subtle shadows, and emerald accents.',
    preview: {
      bg: '#f8fafc',
      card: '#ffffff',
      border: 'rgba(15, 23, 42, 0.08)',
      accent: '#059669',
      text: '#334155',
      shadow: '0 4px 12px rgba(0,0,0,0.06)',
    },
    theme: {
      'global.designStyle': 'clean-light',
      'global.fontFamily': "'Inter', sans-serif",
      'global.headingFont': "'Space Grotesk', sans-serif",
      'global.monoFont': "'JetBrains Mono', monospace",
      'global.serifFont': "'Crimson Text', Georgia, serif",
      'global.backgroundColor': '#f8fafc',
      'global.headingColor': '#0f172a',
      'global.textColor': '#334155',
      'global.textColorMuted': '#64748b',
      'global.cardBackground': '#ffffff',
      'global.cardBorder': 'rgba(15, 23, 42, 0.08)',
      'global.cardHeadingColor': '#0f172a',
      'global.cardTextColor': '#334155',
      'global.cardTextMuted': '#64748b',
      'global.accentColor': '#059669',
      'global.accentColorSecondary': '#d97706',
      'global.buttonBackground': '#0f172a',
      'global.buttonTextColor': '#ffffff',
      'global.borderRadius': 12,
      'global.cardBorderWidth': 1,
      'global.cardBorderStyle': 'solid',
      'global.cardBoxShadow': '0 4px 12px rgba(15, 23, 42, 0.06)',
      'global.cardShadow': '0 4px 12px rgba(15, 23, 42, 0.06)',
      'global.cardShadowHover': '0 8px 20px rgba(15, 23, 42, 0.12)',
      'global.blockGap': 28,
      'global.blockPadding': 20,
      'global.blockDividerStyle': 'solid',
      'global.blockDividerColor': 'rgba(15, 23, 42, 0.08)',
      'global.headingFontWeight': 700,
      'global.pillStyle': 'flat-minimal',
      'global.buttonStyle': 'flat-border',
      'global.iconStyle': 'glass-accent',
      'global.tabNavBackground': 'rgba(255, 255, 255, 0.92)',
      'global.tabNavBorder': 'rgba(15, 23, 42, 0.08)',
      'global.tabButtonBackground': '#ffffff',
      'global.tabButtonTextColor': '#64748b',
      'global.tabButtonBorder': 'rgba(15, 23, 42, 0.08)',
      'global.tabButtonActiveBackground': '#059669',
      'global.tabButtonActiveTextColor': '#ffffff',
      'global.glassBlur': 8,
    },
  },
  {
    id: 'neo-brutalist',
    name: 'Neo-Brutalist',
    tag: 'High Contrast',
    desc: 'Raw solid borders, bold offset shadows, square corners, and punchy pop accents.',
    preview: {
      bg: '#fafafa',
      card: '#ffffff',
      border: '#000000',
      accent: '#ffdd00',
      text: '#111111',
      shadow: '4px 4px 0 #000000',
    },
    theme: {
      'global.designStyle': 'neo-brutalist',
      'global.fontFamily': "'Space Mono', monospace",
      'global.headingFont': "'Space Grotesk', sans-serif",
      'global.monoFont': "'Space Mono', monospace",
      'global.serifFont': "'Crimson Text', Georgia, serif",
      'global.backgroundColor': '#fafafa',
      'global.headingColor': '#000000',
      'global.textColor': '#111111',
      'global.textColorMuted': '#555555',
      'global.cardBackground': '#ffffff',
      'global.cardBorder': '#000000',
      'global.cardHeadingColor': '#000000',
      'global.cardTextColor': '#111111',
      'global.cardTextMuted': '#555555',
      'global.accentColor': '#ffdd00',
      'global.accentColorSecondary': '#ff3366',
      'global.buttonBackground': '#000000',
      'global.buttonTextColor': '#ffffff',
      'global.borderRadius': 0,
      'global.cardBorderWidth': 3,
      'global.cardBorderStyle': 'solid',
      'global.cardBoxShadow': '5px 5px 0 #000000',
      'global.cardShadow': '5px 5px 0 #000000',
      'global.cardShadowHover': '7px 7px 0 #000000',
      'global.blockGap': 32,
      'global.blockPadding': 20,
      'global.blockDividerStyle': 'solid',
      'global.blockDividerColor': '#000000',
      'global.headingFontWeight': 800,
      'global.pillStyle': 'editorial-bordered',
      'global.buttonStyle': 'neo-brutalist',
      'global.iconStyle': 'bordered-box',
      'global.tabNavBackground': '#ffffff',
      'global.tabNavBorder': '#000000',
      'global.tabButtonBackground': '#ffffff',
      'global.tabButtonTextColor': '#000000',
      'global.tabButtonBorder': '#000000',
      'global.tabButtonActiveBackground': '#ffdd00',
      'global.tabButtonActiveTextColor': '#000000',
      'global.glassBlur': 0,
    },
  },
  {
    id: 'midnight-violet',
    name: 'Midnight Violet',
    tag: 'Creative',
    desc: 'Deep violet nightscape, luminous neon lilac accents, and atmospheric glass glow.',
    preview: {
      bg: '#0a0714',
      card: '#130d24',
      border: 'rgba(167, 139, 250, 0.15)',
      accent: '#a78bfa',
      text: '#ddd6fe',
      shadow: 'none',
    },
    theme: {
      'global.designStyle': 'midnight-violet',
      'global.fontFamily': "'Plus Jakarta Sans', system-ui, sans-serif",
      'global.headingFont': "'Syne', sans-serif",
      'global.monoFont': "'JetBrains Mono', monospace",
      'global.serifFont': "'Bodoni Moda', Georgia, serif",
      'global.backgroundColor': '#0a0714',
      'global.headingColor': '#f5f3ff',
      'global.textColor': '#ddd6fe',
      'global.textColorMuted': '#8b5cf6',
      'global.cardBackground': '#130d24',
      'global.cardBorder': 'rgba(167, 139, 250, 0.15)',
      'global.cardHeadingColor': '#f5f3ff',
      'global.cardTextColor': '#ddd6fe',
      'global.cardTextMuted': '#8b5cf6',
      'global.accentColor': '#a78bfa',
      'global.accentColorSecondary': '#38bdf8',
      'global.buttonBackground': '#a78bfa',
      'global.buttonTextColor': '#0a0714',
      'global.borderRadius': 14,
      'global.cardBorderWidth': 1,
      'global.cardBorderStyle': 'solid',
      'global.cardBoxShadow': 'none',
      'global.cardShadow': 'none',
      'global.cardShadowHover': '0 8px 30px rgba(0, 0, 0, 0.55), 0 0 20px rgba(167, 139, 250, 0.2)',
      'global.blockGap': 28,
      'global.blockPadding': 20,
      'global.blockDividerStyle': 'none',
      'global.blockDividerColor': 'rgba(167, 139, 250, 0.15)',
      'global.headingFontWeight': 700,
      'global.pillStyle': 'rounded-glow',
      'global.buttonStyle': 'rounded-glow',
      'global.iconStyle': 'glass-accent',
      'global.tabNavBackground': 'rgba(19, 13, 36, 0.85)',
      'global.tabNavBorder': 'rgba(167, 139, 250, 0.15)',
      'global.tabButtonBackground': 'rgba(255, 255, 255, 0.03)',
      'global.tabButtonTextColor': '#8b5cf6',
      'global.tabButtonBorder': 'rgba(167, 139, 250, 0.15)',
      'global.tabButtonActiveBackground': 'rgba(167, 139, 250, 0.2)',
      'global.tabButtonActiveTextColor': '#a78bfa',
      'global.glassBlur': 16,
    },
  },
];

const SHADOW_OPTIONS = [
  { label: 'None (Classic Glass)', value: 'none' },
  { label: 'Subtle Soft (0 2px 8px rgba(0,0,0,0.08))', value: '0 2px 8px rgba(0,0,0,0.08)' },
  { label: 'Editorial Small (3px 4px 0)', value: '3px 4px 0 #252320' },
  { label: 'Editorial Medium (4px 5px 0)', value: '4px 5px 0 #252320' },
  { label: 'Editorial Heavy (6px 7px 0)', value: '6px 7px 0 #252320' },
  { label: 'Brutalist Solid (5px 5px 0 #000000)', value: '5px 5px 0 #000000' },
];

const BORDER_STYLE_OPTIONS = [
  { label: 'Solid', value: 'solid' },
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' },
  { label: 'None', value: 'none' },
];

const DIVIDER_STYLE_OPTIONS = [
  { label: 'None (No Divider)', value: 'none' },
  { label: 'Solid Line', value: 'solid' },
  { label: 'Dashed Line', value: 'dashed' },
  { label: 'Dotted Line', value: 'dotted' },
];

const PILL_STYLE_OPTIONS = [
  { label: 'Rounded Glow (Classic Obsidian)', value: 'rounded-glow' },
  { label: 'Editorial Bordered (Field Notes)', value: 'editorial-bordered' },
  { label: 'Flat Minimal (Clean)', value: 'flat-minimal' },
];

const BUTTON_STYLE_OPTIONS = [
  { label: 'Tactile 2px Border + Shadow (Field Notes)', value: 'editorial-tactile' },
  { label: 'Classic Border (Obsidian / Minimal)', value: 'flat-border' },
  { label: 'Rounded Glow Pill', value: 'rounded-glow' },
  { label: 'Raw Heavy Border (Neo-Brutalist)', value: 'neo-brutalist' },
];

const ICON_STYLE_OPTIONS = [
  { label: 'Glass Accent (Classic Obsidian)', value: 'glass-accent' },
  { label: 'Bordered Box (Field Notes)', value: 'bordered-box' },
  { label: 'Hidden / None', value: 'none' },
];

const HEADING_WEIGHT_OPTIONS = [
  { label: '400 - Regular', value: '400' },
  { label: '500 - Medium', value: '500' },
  { label: '600 - Semi-Bold (Editorial)', value: '600' },
  { label: '700 - Bold (Standard)', value: '700' },
  { label: '800 - Extra Bold', value: '800' },
  { label: '900 - Black', value: '900' },
];

function ColorInput({ label, value, onChange }) {
  return (
    <div className="editor-control">
      <label>{label}</label>
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
        />
      </div>
    </div>
  );
}

function SliderInput({ label, value, onChange, min, max, step, unit }) {
  return (
    <div className="editor-control">
      <label>
        {label}
        <span className="editor-value">{value}{unit || ''}</span>
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
      <label>{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="editor-select"
      >
        {Object.entries(groups).map(([groupName, options]) => (
          <optgroup key={groupName} label={groupName}>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
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
      <label>{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="editor-select"
      >
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function ThemePanel({ tabs = [] }) {
  const { updateTheme, getNestedValue } = useTheme();
  const [section, setSection] = useState('style');

  const sections = [
    { id: 'style', label: 'Preset' },
    { id: 'typography', label: 'Typography' },
    { id: 'colors', label: 'Colors' },
    { id: 'layout', label: 'Layout' },
    { id: 'navigation', label: 'Navigation' },
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

  const applyDesignPreset = (preset) => {
    Object.entries(preset.theme).forEach(([path, val]) => {
      updateTheme(path, val);
    });
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
  const currentDesignStyle = getNestedValue('global.designStyle') || (liveCanvasBg === '#f5efdf' ? 'field-notes' : 'obsidian');
  const isLightOrPaper = liveCanvasBg === '#f5efdf' || liveCanvasBg === '#fffaf0' || liveCanvasBg === '#fafafa' || liveCanvasBg === '#ffffff' || liveCanvasBg === '#f8fafc' || currentDesignStyle === 'field-notes' || currentDesignStyle === 'clean-light' || currentDesignStyle === 'neo-brutalist';

  const liveTabNavBg = getNestedValue('global.tabNavBackground') || (isLightOrPaper ? 'rgba(255, 250, 240, 0.96)' : 'rgba(10, 10, 15, 0.82)');
  const liveTabNavBorder = getNestedValue('global.tabNavBorder') || (isLightOrPaper ? liveCardBorder : 'rgba(255, 255, 255, 0.06)');
  const liveTabBtnBg = getNestedValue('global.tabButtonBackground') || (isLightOrPaper ? liveCardBg : 'rgba(255, 255, 255, 0.03)');
  const liveTabBtnText = getNestedValue('global.tabButtonTextColor') || (isLightOrPaper ? (getNestedValue('global.textColorMuted') || '#746e63') : '#aaaaaa');
  const liveTabBtnBorder = getNestedValue('global.tabButtonBorder') || (isLightOrPaper ? liveCardBorder : 'rgba(255, 255, 255, 0.08)');
  const liveTabActiveBg = getNestedValue('global.tabButtonActiveBackground') || (isLightOrPaper ? liveAccentColor : `color-mix(in srgb, ${liveAccentColor} 15%, rgba(0,0,0,0.4))`);
  const liveTabActiveText = getNestedValue('global.tabButtonActiveTextColor') || (isLightOrPaper ? '#fffaf0' : liveAccentColor);

  const liveCardShadow = getNestedValue('global.cardBoxShadow') || getNestedValue('global.cardShadow') || 'none';
  const liveCardBorderWidth = getNestedValue('global.cardBorderWidth') ?? 1;
  const liveCardBorderStyle = getNestedValue('global.cardBorderStyle') || 'solid';
  const liveBlockGap = getNestedValue('global.blockGap') ?? 28;
  const liveBlockPadding = getNestedValue('global.blockPadding') ?? 20;
  const liveBlockDividerStyle = getNestedValue('global.blockDividerStyle') || 'none';
  const liveBlockDividerColor = getNestedValue('global.blockDividerColor') || liveCardBorder;
  const liveHeadingWeight = getNestedValue('global.headingFontWeight') || 700;
  const livePillStyle = getNestedValue('global.pillStyle') || (currentDesignStyle === 'field-notes' ? 'editorial-bordered' : 'rounded-glow');
  const liveButtonStyle = getNestedValue('global.buttonStyle') || (currentDesignStyle === 'field-notes' || isLightOrPaper ? 'editorial-tactile' : 'flat-border');
  const liveIconStyle = getNestedValue('global.iconStyle') || (currentDesignStyle === 'field-notes' ? 'bordered-box' : 'glass-accent');

  return (
    <div className="theme-panel">
      {/* Sub-tabs with fluid sliding pill */}
      <div className="theme-tabs">
        {sections.map((s) => {
          const isActive = section === s.id;
          return (
            <button
              key={s.id}
              type="button"
              className={`theme-tab ${isActive ? 'active' : ''}`}
              onClick={() => setSection(s.id)}
            >
              {isActive && (
                <motion.div
                  layoutId="themeActiveTabPill"
                  className="theme-tab-indicator"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 9999,
                    background: 'var(--fn-editor-coral)',
                    border: '2px solid var(--fn-editor-ink)',
                    boxShadow: 'var(--fn-editor-shadow-xs)',
                    zIndex: 1,
                  }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 2 }}>{s.label}</span>
            </button>
          );
        })}
      </div>

      <div className="theme-panel-content">
        {/* --- PRESET TAB (formerly style) --- */}
        {section === 'style' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Presets List */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <LayoutTemplate size={14} color="var(--fn-editor-coral)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fn-editor-ink)' }}>
                  1-Click Design Presets
                </span>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--fn-editor-muted)', marginBottom: '14px', lineHeight: 1.4 }}>
                Switch complete aesthetic styling in one click. Colors, typography, borders, and shadows update together while preserving all your content.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {DESIGN_PRESETS.map((preset) => {
                  const isActive = currentDesignStyle === preset.id;

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyDesignPreset(preset)}
                      style={{
                        padding: '14px',
                        borderRadius: '10px',
                        background: isActive ? 'var(--fn-editor-paper-light)' : 'var(--fn-editor-paper-sunken)',
                        border: isActive ? '2px solid var(--fn-editor-ink)' : '2px solid var(--fn-editor-line)',
                        boxShadow: isActive ? 'var(--fn-editor-shadow-xs)' : 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: isActive ? 'var(--fn-editor-coral)' : 'var(--fn-editor-ink)' }}>
                            {preset.name}
                          </span>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: isActive ? 'color-mix(in srgb, var(--fn-editor-coral) 20%, transparent)' : 'var(--fn-editor-paper)',
                              color: isActive ? 'var(--fn-editor-coral)' : 'var(--fn-editor-muted)',
                              border: '1px solid var(--fn-editor-line)',
                              fontWeight: 600,
                            }}
                          >
                            {preset.tag}
                          </span>
                        </div>
                        {isActive && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: 'var(--fn-editor-coral)', fontWeight: 600 }}>
                            <Check size={13} /> Active
                          </div>
                        )}
                      </div>

                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--fn-editor-muted)', lineHeight: 1.4 }}>
                        {preset.desc}
                      </p>

                      {/* Visual palette bar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            background: preset.preview.bg,
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                          }}
                          title="Canvas Background"
                        />
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            background: preset.preview.card,
                            border: `1px solid ${preset.preview.border}`,
                          }}
                          title="Card Background"
                        />
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            background: preset.preview.accent,
                          }}
                          title="Accent Color"
                        />
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            background: preset.preview.text,
                          }}
                          title="Text Color"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* --- TYPOGRAPHY TAB --- */}
        {section === 'typography' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 1-Click Font Pairings */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Sparkles size={14} color="var(--fn-editor-coral)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fn-editor-ink)' }}>
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
                        borderRadius: '8px',
                        background: isSelected ? 'var(--fn-editor-paper-light)' : 'var(--fn-editor-paper-sunken)',
                        border: isSelected ? '2px solid var(--fn-editor-ink)' : '2px solid var(--fn-editor-line)',
                        boxShadow: isSelected ? 'var(--fn-editor-shadow-xs)' : 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        transition: 'all 150ms ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isSelected ? 'var(--fn-editor-coral)' : 'var(--fn-editor-ink)' }}>
                          {pairing.name}
                        </span>
                        {isSelected && <Check size={13} color="var(--fn-editor-coral)" />}
                      </div>
                      <span style={{ fontSize: '0.68rem', color: 'var(--fn-editor-muted)', lineHeight: '1.3' }}>
                        {pairing.heading} + {pairing.body}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1.5px solid var(--fn-editor-line)', margin: '0' }} />

            {/* Individual Font Selectors */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                <Type size={14} color="var(--fn-editor-coral)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fn-editor-ink)' }}>
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

                <SimpleSelectInput
                  label="Heading Font Weight"
                  value={String(getNestedValue('global.headingFontWeight') || 700)}
                  onChange={(v) => updateTheme('global.headingFontWeight', Number(v))}
                  options={HEADING_WEIGHT_OPTIONS}
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
                borderRadius: '12px',
                background: 'var(--fn-editor-paper-light)',
                border: '2px solid var(--fn-editor-line)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--fn-editor-muted)', letterSpacing: '0.05em' }}>
                Live Type Preview
              </span>

              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--fn-editor-muted)', display: 'block', marginBottom: '4px' }}>
                  Heading ({currentHeadingFont})
                </span>
                <h3
                  style={{
                    fontFamily: `'${currentHeadingFont}', sans-serif`,
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--fn-editor-ink)',
                    margin: 0,
                    lineHeight: '1.25',
                  }}
                >
                  The Architecture of Digital Identity
                </h3>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--fn-editor-muted)', display: 'block', marginBottom: '4px' }}>
                  Body Text ({currentBodyFont})
                </span>
                <p
                  style={{
                    fontFamily: `'${currentBodyFont}', sans-serif`,
                    fontSize: '0.86rem',
                    color: 'var(--fn-editor-ink)',
                    margin: 0,
                    lineHeight: '1.5',
                  }}
                >
                  Interfaces communicate through intentional typographic hierarchy, balanced contrast, and fluid motion.
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--fn-editor-muted)', display: 'block', marginBottom: '4px' }}>
                  Journal & Literary ({currentSerifFont})
                </span>
                <p
                  style={{
                    fontFamily: `'${currentSerifFont}', Georgia, serif`,
                    fontSize: '0.96rem',
                    fontStyle: 'italic',
                    color: 'var(--fn-editor-muted)',
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
                  borderRadius: '6px',
                  background: 'var(--fn-editor-paper-sunken)',
                  border: '1px solid var(--fn-editor-line)',
                  fontFamily: `'${currentMonoFont}', monospace`,
                  fontSize: '0.78rem',
                  color: 'var(--fn-editor-coral)',
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
                <Palette size={14} color="var(--fn-editor-coral)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fn-editor-ink)' }}>
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
                      borderRadius: '10px',
                      background: 'var(--fn-editor-paper-light)',
                      border: '2px solid var(--fn-editor-line)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      transition: 'border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--fn-editor-ink)' }}>
                        {pal.name}
                      </span>
                      <span style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px', background: 'var(--fn-editor-paper)', color: 'var(--fn-editor-muted)', border: '1px solid var(--fn-editor-line)' }}>
                        {pal.tag}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <span style={{ width: '13px', height: '13px', borderRadius: '50%', background: pal.bg, border: '1px solid var(--fn-editor-line)' }} title="Canvas Bg" />
                      <span style={{ width: '13px', height: '13px', borderRadius: '50%', background: pal.card, border: '1px solid var(--fn-editor-line)' }} title="Card Bg" />
                      <span style={{ width: '13px', height: '13px', borderRadius: '50%', background: pal.heading, border: '1px solid var(--fn-editor-line)' }} title="Heading" />
                      <span style={{ width: '13px', height: '13px', borderRadius: '50%', background: pal.accent }} title="Accent" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1.5px solid var(--fn-editor-line)', margin: 0 }} />

            {/* 1. Canvas & Block Headline Typography */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Type size={14} color="var(--fn-editor-coral)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fn-editor-ink)' }}>
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

            <hr style={{ border: 'none', borderTop: '1.5px solid var(--fn-editor-line)', margin: 0 }} />

            {/* 2. Inside Cards & Surfaces Typography */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Square size={14} color="var(--fn-editor-coral)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fn-editor-ink)' }}>
                  Inside Cards & Surface Typography
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

            <hr style={{ border: 'none', borderTop: '1.5px solid var(--fn-editor-line)', margin: 0 }} />

            {/* 3. Accents & Action Buttons */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Sparkles size={14} color="var(--fn-editor-coral)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fn-editor-ink)' }}>
                  Accents & Action Buttons
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
                borderRadius: '12px',
                background: liveCanvasBg,
                border: '2px solid var(--fn-editor-line)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--fn-editor-muted)', letterSpacing: '0.05em' }}>
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
            {/* Card Surface & Borders */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Square size={14} color="var(--fn-editor-coral)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fn-editor-ink)' }}>
                  Card Surface & Borders
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <SliderInput
                  label="Corner Border Radius"
                  value={getNestedValue('global.borderRadius') ?? 10}
                  onChange={(v) => updateTheme('global.borderRadius', v)}
                  min={0}
                  max={28}
                  unit="px"
                />

                <SliderInput
                  label="Card Border Width"
                  value={getNestedValue('global.cardBorderWidth') ?? 1}
                  onChange={(v) => updateTheme('global.cardBorderWidth', v)}
                  min={0}
                  max={4}
                  unit="px"
                />

                <SimpleSelectInput
                  label="Card Border Style"
                  value={getNestedValue('global.cardBorderStyle') || 'solid'}
                  onChange={(v) => updateTheme('global.cardBorderStyle', v)}
                  options={BORDER_STYLE_OPTIONS}
                />

                <SimpleSelectInput
                  label="Card Box Shadow"
                  value={
                    SHADOW_OPTIONS.some((o) => o.value === liveCardShadow)
                      ? liveCardShadow
                      : 'custom'
                  }
                  onChange={(v) => {
                    if (v !== 'custom') {
                      updateTheme('global.cardBoxShadow', v);
                      updateTheme('global.cardShadow', v);
                    }
                  }}
                  options={[
                    ...SHADOW_OPTIONS,
                    { label: 'Custom Shadow String', value: 'custom' },
                  ]}
                />

                {(!SHADOW_OPTIONS.some((o) => o.value === liveCardShadow) || liveCardShadow === 'custom') && (
                  <div className="editor-control">
                    <label style={{ color: 'var(--fn-editor-ink)' }}>Custom Box Shadow (CSS)</label>
                    <input
                      type="text"
                      value={liveCardShadow === 'custom' ? '' : liveCardShadow}
                      onChange={(e) => {
                        updateTheme('global.cardBoxShadow', e.target.value);
                        updateTheme('global.cardShadow', e.target.value);
                      }}
                      placeholder="4px 5px 0 #252320"
                      className="editor-text-input full-width"
                      style={{ color: 'var(--fn-editor-ink)', background: 'var(--fn-editor-paper-light)', border: '2px solid var(--fn-editor-line)' }}
                    />
                  </div>
                )}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1.5px solid var(--fn-editor-line)', margin: 0 }} />

            {/* Block Spacing & Layout Structure */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Sliders size={14} color="var(--fn-editor-coral)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fn-editor-ink)' }}>
                  Block Spacing & Padding
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <SliderInput
                  label="Block Spacing (Gap Between Blocks)"
                  value={getNestedValue('global.blockGap') ?? 28}
                  onChange={(v) => updateTheme('global.blockGap', v)}
                  min={16}
                  max={56}
                  unit="px"
                />

                <SliderInput
                  label="Block Inner Padding"
                  value={getNestedValue('global.blockPadding') ?? 20}
                  onChange={(v) => updateTheme('global.blockPadding', v)}
                  min={12}
                  max={36}
                  unit="px"
                />

                <SimpleSelectInput
                  label="Block Header Divider"
                  value={getNestedValue('global.blockDividerStyle') || 'none'}
                  onChange={(v) => updateTheme('global.blockDividerStyle', v)}
                  options={DIVIDER_STYLE_OPTIONS}
                />

                {(getNestedValue('global.blockDividerStyle') && getNestedValue('global.blockDividerStyle') !== 'none') && (
                  <ColorInput
                    label="Block Header Divider Color"
                    value={getNestedValue('global.blockDividerColor') || liveCardBorder}
                    onChange={(v) => updateTheme('global.blockDividerColor', v)}
                  />
                )}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1.5px solid var(--fn-editor-line)', margin: 0 }} />

            {/* Badge & Icon Styling */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Layers size={14} color="var(--fn-editor-coral)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fn-editor-ink)' }}>
                  Badges & Icon Elements
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <SimpleSelectInput
                  label="Pill & Badge Style"
                  value={getNestedValue('global.pillStyle') || (currentDesignStyle === 'field-notes' ? 'editorial-bordered' : 'rounded-glow')}
                  onChange={(v) => updateTheme('global.pillStyle', v)}
                  options={PILL_STYLE_OPTIONS}
                />

                <SimpleSelectInput
                  label="Button Style"
                  value={getNestedValue('global.buttonStyle') || (currentDesignStyle === 'field-notes' || isLightOrPaper ? 'editorial-tactile' : 'flat-border')}
                  onChange={(v) => updateTheme('global.buttonStyle', v)}
                  options={BUTTON_STYLE_OPTIONS}
                />

                <SimpleSelectInput
                  label="Block Header Icon Style"
                  value={getNestedValue('global.iconStyle') || (currentDesignStyle === 'field-notes' ? 'bordered-box' : 'glass-accent')}
                  onChange={(v) => updateTheme('global.iconStyle', v)}
                  options={ICON_STYLE_OPTIONS}
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
            </div>

            {/* Live Layout Preview Card */}
            <div
              style={{
                padding: '18px',
                borderRadius: `${liveRadius}px`,
                background: liveCardBg,
                border: `${liveCardBorderWidth}px ${liveCardBorderStyle} ${liveCardBorder}`,
                boxShadow: liveCardShadow === 'none' ? undefined : liveCardShadow,
                backdropFilter: `blur(${liveGlassBlur}px)`,
                WebkitBackdropFilter: `blur(${liveGlassBlur}px)`,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: `all ${Math.round(220 / liveSpeed)}ms cubic-bezier(0.16, 1, 0.3, 1)`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--fn-editor-muted)', letterSpacing: '0.05em' }}>
                  Live Surface Preview
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--fn-editor-muted)' }}>
                  Border: {liveCardBorderWidth}px {liveCardBorderStyle}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div
                  style={{
                    padding: '8px 16px',
                    borderRadius: liveButtonStyle === 'neo-brutalist' ? '0' : liveButtonStyle === 'rounded-glow' ? '9999px' : `${liveRadius}px`,
                    background: liveBtnBg,
                    color: liveBtnText,
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    border: liveButtonStyle === 'editorial-tactile' ? '2px solid #252320' : liveButtonStyle === 'neo-brutalist' ? '3px solid #000' : `${liveCardBorderWidth}px solid ${liveCardBorder}`,
                    boxShadow: liveButtonStyle === 'editorial-tactile' ? '3px 4px 0 #252320' : liveButtonStyle === 'neo-brutalist' ? '4px 4px 0 #000' : (liveCardShadow === 'none' ? undefined : liveCardShadow),
                  }}
                >
                  Action Button
                </div>

                {livePillStyle === 'editorial-bordered' ? (
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: liveCardBg,
                      border: '1.5px solid #252320',
                      boxShadow: '1.5px 2px 0 #252320',
                      color: liveCardTextColor,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    Editorial Pill
                  </span>
                ) : livePillStyle === 'flat-minimal' ? (
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: liveCardTextColor,
                      fontSize: '0.75rem',
                      fontWeight: 500,
                    }}
                  >
                    Minimal Pill
                  </span>
                ) : (
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      background: `color-mix(in srgb, ${liveAccentColor} 15%, transparent)`,
                      color: liveAccentColor,
                      border: `1px solid color-mix(in srgb, ${liveAccentColor} 30%, transparent)`,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    Glow Pill
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- BACKGROUNDS TAB (Dynamic Per-Tab) --- */}
        {section === 'backgrounds' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Sparkles size={14} color="var(--fn-editor-coral)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fn-editor-ink)' }}>
                  Global Canvas Background
                </span>
              </div>

              <ColorInput
                label="Main Canvas Background"
                value={getNestedValue('global.backgroundColor') || '#090a0f'}
                onChange={(v) => updateTheme('global.backgroundColor', v)}
              />
              <div className="editor-control">
                <label style={{ color: 'var(--fn-editor-ink)' }}>Canvas Gradient (Optional)</label>
                <input
                  type="text"
                  value={getNestedValue('global.backgroundGradient') || ''}
                  onChange={(e) => updateTheme('global.backgroundGradient', e.target.value || null)}
                  placeholder="linear-gradient(180deg, #090a0f 0%, #12151e 100%)"
                  className="editor-text-input full-width"
                  style={{ color: 'var(--fn-editor-ink)', background: 'var(--fn-editor-paper-light)', border: '2px solid var(--fn-editor-line)' }}
                />
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1.5px solid var(--fn-editor-line)', margin: 0 }} />

            {/* Custom Background Image & Glass Overlay */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Image size={14} color="var(--fn-editor-coral)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fn-editor-ink)' }}>
                  Custom Background Image
                </span>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--fn-editor-muted)', marginBottom: '14px', lineHeight: '1.4' }}>
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
          </div>
        )}

        {/* --- NAVIGATION TAB --- */}
        {section === 'navigation' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Tab Navigation Bar Background & Buttons */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <FolderKanban size={14} color="var(--fn-editor-coral)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fn-editor-ink)' }}>
                  Tab Navigation Bar & Button Colors
                </span>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--fn-editor-muted)', marginBottom: '14px', lineHeight: '1.4' }}>
                Customize the header navigation bar appearance and button states. The navigation bar color is separated from the main canvas background by default.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <ColorInput
                  label="Navigation Bar Background (Header)"
                  value={getNestedValue('global.tabNavBackground') || (isLightOrPaper ? 'rgba(255, 250, 240, 0.96)' : 'rgba(10, 10, 15, 0.82)')}
                  onChange={(v) => updateTheme('global.tabNavBackground', v)}
                />
                <ColorInput
                  label="Navigation Bar Bottom Border Line"
                  value={getNestedValue('global.tabNavBorder') || (isLightOrPaper ? liveCardBorder : 'rgba(255, 255, 255, 0.06)')}
                  onChange={(v) => updateTheme('global.tabNavBorder', v)}
                />
                <ColorInput
                  label="Inactive Tab Button Background"
                  value={getNestedValue('global.tabButtonBackground') || (isLightOrPaper ? liveCardBg : 'rgba(255, 255, 255, 0.03)')}
                  onChange={(v) => updateTheme('global.tabButtonBackground', v)}
                />
                <ColorInput
                  label="Inactive Tab Button Text Color"
                  value={getNestedValue('global.tabButtonTextColor') || (isLightOrPaper ? (getNestedValue('global.textColorMuted') || '#746e63') : '#aaaaaa')}
                  onChange={(v) => updateTheme('global.tabButtonTextColor', v)}
                />
                <ColorInput
                  label="Inactive Tab Button Border Color"
                  value={getNestedValue('global.tabButtonBorder') || (isLightOrPaper ? liveCardBorder : 'rgba(255, 255, 255, 0.08)')}
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

            <hr style={{ border: 'none', borderTop: '1.5px solid var(--fn-editor-line)', margin: 0 }} />

            {/* Dynamic Per-Tab Navigation & Canvas Colors */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Layers size={14} color="var(--fn-editor-coral)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fn-editor-ink)' }}>
                  Per-Tab Colors ({displayTabs.length})
                </span>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--fn-editor-muted)', marginBottom: '14px', lineHeight: '1.4' }}>
                Separate the canvas background and navigation bar colors for each navigation tab. They can be unique per tab, or kept the same as default settings.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {displayTabs.map((tab) => (
                  <div
                    key={tab.id}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      background: 'var(--fn-editor-paper-light)',
                      border: '2px solid var(--fn-editor-line)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--fn-editor-ink)' }}>
                        {tab.label || tab.id}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--fn-editor-muted)', fontFamily: 'var(--font-mono)' }}>
                        #{tab.id}
                      </span>
                    </div>

                    <ColorInput
                      label="Canvas Background (This Tab)"
                      value={getNestedValue(`tabs.${tab.id}.backgroundColor`) || getNestedValue('global.backgroundColor') || '#090a0f'}
                      onChange={(v) => updateTheme(`tabs.${tab.id}.backgroundColor`, v)}
                    />

                    <ColorInput
                      label="Navigation Bar Background (This Tab, Optional)"
                      value={getNestedValue(`tabs.${tab.id}.tabNavBackground`) || getNestedValue('global.tabNavBackground') || (isLightOrPaper ? 'rgba(255, 250, 240, 0.96)' : 'rgba(10, 10, 15, 0.82)')}
                      onChange={(v) => updateTheme(`tabs.${tab.id}.tabNavBackground`, v || null)}
                    />

                    <div className="editor-control" style={{ marginBottom: 0 }}>
                      <label style={{ color: 'var(--fn-editor-ink)' }}>Canvas Gradient (Optional)</label>
                      <input
                        type="text"
                        value={getNestedValue(`tabs.${tab.id}.backgroundGradient`) || ''}
                        onChange={(e) => updateTheme(`tabs.${tab.id}.backgroundGradient`, e.target.value || null)}
                        placeholder="e.g. radial-gradient(circle at 50% 0%, #1a1e2e 0%, #090a0f 70%)"
                        className="editor-text-input full-width"
                        style={{ color: 'var(--fn-editor-ink)', background: 'var(--fn-editor-paper-light)', border: '2px solid var(--fn-editor-line)' }}
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
