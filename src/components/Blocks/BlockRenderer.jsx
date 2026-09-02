import { motion } from 'framer-motion';
import {
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Layers,
  Code2,
  Briefcase,
  Gamepad2,
  BookOpen,
  Cpu,
  User,
  Star,
  Heart,
  Zap,
  Globe,
  Award,
  Terminal,
  Folder,
  Coffee,
  Shield,
  Activity,
  Flame,
  Rocket,
  Film,
  Music,
  Video,
  Play,
} from 'lucide-react';
import HeroBlock from './HeroBlock';
import CardsGridBlock from './CardsGridBlock';
import StackedDeckBlock from './StackedDeckBlock';
import SkillsBlock from './SkillsBlock';
import TimelineBlock from './TimelineBlock';
import MediaReviewsBlock from './MediaReviewsBlock';
import JournalBlock from './JournalBlock';
import SpecsGridBlock from './SpecsGridBlock';
import ServicesBlock from './ServicesBlock';
import GalleryBlock from './GalleryBlock';
import EventsBlock from './EventsBlock';
import FeaturedVideoBlock from './FeaturedVideoBlock';
import VideoGalleryBlock from './VideoGalleryBlock';
import GitHubHeatmapBlock from './GitHubHeatmapBlock';
import MusicPlayerBlock from './MusicPlayerBlock';
import MilestonesBlock from './MilestonesBlock';
import './Blocks.css';

const blockComponentMap = {
  hero: HeroBlock,
  cards_grid: CardsGridBlock,
  stacked_deck: StackedDeckBlock,
  skills: SkillsBlock,
  timeline: TimelineBlock,
  media_reviews: MediaReviewsBlock,
  journal: JournalBlock,
  specs_grid: SpecsGridBlock,
  services: ServicesBlock,
  commission: ServicesBlock,
  gallery: GalleryBlock,
  events: EventsBlock,
  calendar: EventsBlock,
  featured_video: FeaturedVideoBlock,
  video: FeaturedVideoBlock,
  video_gallery: VideoGalleryBlock,
  github_heatmap: GitHubHeatmapBlock,
  music_player: MusicPlayerBlock,
  milestones: MilestonesBlock,
};

const blockIconMap = {
  hero: User,
  cards_grid: Layers,
  stacked_deck: Layers,
  skills: Code2,
  timeline: Briefcase,
  media_reviews: Gamepad2,
  journal: BookOpen,
  specs_grid: Cpu,
  services: Sparkles,
  commission: Sparkles,
  gallery: Layers,
  events: Activity,
  calendar: Activity,
  featured_video: Video,
  video: Video,
  video_gallery: Film,
  github_heatmap: Activity,
  music_player: Music,
  milestones: Star,
};

const iconLibrary = {
  Sparkles,
  Code2,
  Briefcase,
  Layers,
  Cpu,
  Gamepad2,
  BookOpen,
  Film,
  Music,
  Video,
  Play,
  Star,
  Heart,
  Zap,
  Globe,
  Award,
  Terminal,
  Folder,
  Coffee,
  Shield,
  Activity,
  Flame,
  Rocket,
  User,
};

function renderBlockIcon(iconName, blockType) {
  if (iconName === 'none' || iconName === false || iconName === 'text-only') {
    return null;
  }
  if (iconName && iconLibrary[iconName]) {
    const IconComponent = iconLibrary[iconName];
    return <IconComponent size={18} />;
  }
  const DefaultIcon = blockIconMap[blockType] || Sparkles;
  return <DefaultIcon size={18} />;
}

const blockVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function BlockRenderer({
  block,
  index,
  totalBlocks,
  isEditing = false,
  onEditBlock,
  onMoveBlock,
  onDeleteBlock,
  onUpdateBlock,
}) {
  if (!block || block.hidden) return null;

  const BlockComponent = blockComponentMap[block.type];

  if (!BlockComponent) {
    return (
      <div className="block-wrapper">
        <div style={{ padding: '24px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '12px' }}>
          Unknown block type: <code>{block.type}</code>
        </div>
      </div>
    );
  }

  const showHeader = block.title && block.type !== 'hero';
  const iconElement = renderBlockIcon(block.icon, block.type);

  return (
    <motion.section
      className={`block-wrapper ${isEditing ? 'is-editing' : ''}`}
      variants={blockVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {/* Editor Controls Bar (when in edit mode) */}
      {isEditing && (
        <div className="block-edit-controls">
          <span style={{ fontSize: '0.68rem', color: '#777', paddingRight: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
            {block.type.replace('_', ' ')}
          </span>
          <button
            type="button"
            className="block-edit-btn"
            onClick={() => onEditBlock(block)}
            title="Edit block content"
          >
            <Edit3 size={13} /> Edit
          </button>
          {index > 0 && (
            <button
              type="button"
              className="block-edit-btn"
              onClick={() => onMoveBlock(index, index - 1)}
              title="Move block up"
            >
              <ArrowUp size={13} />
            </button>
          )}
          {index < totalBlocks - 1 && (
            <button
              type="button"
              className="block-edit-btn"
              onClick={() => onMoveBlock(index, index + 1)}
              title="Move block down"
            >
              <ArrowDown size={13} />
            </button>
          )}
          <button
            type="button"
            className="block-edit-btn btn-delete"
            onClick={() => onDeleteBlock(block)}
            title="Delete block"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}

      {/* Block Header (Title & Subtitle with optional Icon or pure text) */}
      {showHeader && (
        <div className="block-header">
          <div className="block-title-wrap">
            {iconElement && (
              <div className="block-title-icon">
                {iconElement}
              </div>
            )}
            <div>
              <h2 className="block-title">{block.title}</h2>
              {block.subtitle && <p className="block-subtitle">{block.subtitle}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Render Component */}
      <BlockComponent
        data={block.data || {}}
        block={block}
        isEditing={isEditing}
        onUpdateData={(newData) => {
          if (onUpdateBlock) {
            onUpdateBlock({
              ...block,
              data: {
                ...(block.data || {}),
                ...newData,
              },
            });
          }
        }}
        onUpdateBlock={onUpdateBlock}
      />
    </motion.section>
  );
}
