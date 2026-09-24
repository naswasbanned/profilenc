import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  Code2,
  Coffee,
  Cpu,
  Film,
  Flame,
  Folder,
  Gamepad2,
  Globe,
  Heart,
  Layers,
  Music,
  Play,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Terminal,
  User,
  Video,
  Zap,
} from 'lucide-react';

/**
 * Icons a profile owner can attach to tabs and blocks.
 *
 * Stored content only ever holds the key (for example `"Gamepad2"`), so this
 * map is the single place that resolves a stored key to a component.
 */
export const ICON_LIBRARY = {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  Code2,
  Coffee,
  Cpu,
  Film,
  Flame,
  Folder,
  Gamepad2,
  Globe,
  Heart,
  Layers,
  Music,
  Play,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Terminal,
  User,
  Video,
  Zap,
};

/** Values that mean "render no icon at all". */
const NO_ICON_VALUES = new Set(['none', 'text-only', false]);

export function isIconDisabled(iconName) {
  return NO_ICON_VALUES.has(iconName);
}

/**
 * Resolve a stored icon key to a Lucide component.
 * @returns {Function|null} The component, or null when unknown / disabled.
 */
export function getIcon(iconName) {
  if (isIconDisabled(iconName)) return null;
  return ICON_LIBRARY[iconName] || null;
}
