import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Target,
  Trophy,
  Calendar,
  ChevronDown,
  ChevronRight,
  Flame,
  Star,
  Rocket,
  Heart,
  Globe,
  Briefcase,
  BookOpen,
  Plane,
  Palette,
  Zap,
  Award,
} from 'lucide-react';

const CATEGORY_ICONS = {
  Career: Briefcase,
  Travel: Plane,
  Personal: Heart,
  Creative: Palette,
  Learning: BookOpen,
  Fitness: Flame,
  Adventure: Globe,
  Achievement: Award,
  Tech: Zap,
  Goals: Target,
};

const CATEGORY_COLORS = {
  Career: '#a78bfa',
  Travel: '#38bdf8',
  Personal: '#f472b6',
  Creative: '#fb923c',
  Learning: '#34d399',
  Fitness: '#ef4444',
  Adventure: '#06b6d4',
  Achievement: '#fbbf24',
  Tech: '#818cf8',
  Goals: '#00f0aa',
};

function ProgressRing({ completed, total, size = 80, strokeWidth = 6 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = total > 0 ? completed / total : 0;
  const offset = circumference * (1 - percent);

  return (
    <div className="milestones-progress-ring">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent-color, #00f0aa)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        />
      </svg>
      <div className="progress-ring-text">
        <span className="progress-ring-percent">{Math.round(percent * 100)}%</span>
      </div>
    </div>
  );
}

function MilestoneItem({ item, index }) {
  const [expanded, setExpanded] = useState(false);
  const hasSubTasks = item.subTasks && item.subTasks.length > 0;
  const completedSubs = hasSubTasks
    ? item.subTasks.filter((s) => s.completed).length
    : 0;
  const totalSubs = hasSubTasks ? item.subTasks.length : 0;

  const catColor = CATEGORY_COLORS[item.category] || 'var(--accent-color, #00f0aa)';
  const CatIcon = CATEGORY_ICONS[item.category] || Target;

  return (
    <motion.div
      className={`milestone-item ${item.completed ? 'completed' : ''}`}
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      style={{ '--milestone-color': catColor }}
    >
      <div className="milestone-item-main" onClick={hasSubTasks ? () => setExpanded(!expanded) : undefined}>
        {/* Completion indicator */}
        <div className="milestone-check">
          {item.completed ? (
            <CheckCircle2 size={20} className="milestone-check-done" />
          ) : (
            <Circle size={20} className="milestone-check-pending" />
          )}
        </div>

        {/* Content */}
        <div className="milestone-item-body">
          <div className="milestone-item-top">
            <h4 className={`milestone-item-title ${item.completed ? 'done' : ''}`}>
              {item.title}
            </h4>
            {item.category && (
              <span className="milestone-category-pill" style={{ color: catColor, borderColor: `${catColor}44` }}>
                <CatIcon size={11} />
                {item.category}
              </span>
            )}
          </div>
          {item.date && (
            <span className="milestone-date">
              <Calendar size={11} />
              {item.date}
            </span>
          )}

          {/* Sub-tasks progress */}
          {hasSubTasks && (
            <div className="milestone-subtask-summary">
              <div className="milestone-subtask-bar">
                <div
                  className="milestone-subtask-fill"
                  style={{ width: `${totalSubs > 0 ? (completedSubs / totalSubs) * 100 : 0}%` }}
                />
              </div>
              <span className="milestone-subtask-count">
                {completedSubs}/{totalSubs}
              </span>
            </div>
          )}
        </div>

        {/* Expand toggle for sub-tasks */}
        {hasSubTasks && (
          <button type="button" className="milestone-expand-btn" aria-label="Toggle sub-tasks">
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
      </div>

      {/* Nested Sub-tasks */}
      <AnimatePresence>
        {expanded && hasSubTasks && (
          <motion.div
            className="milestone-subtasks"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {item.subTasks.map((sub, si) => (
              <div key={sub.id || si} className={`milestone-subtask-item ${sub.completed ? 'completed' : ''}`}>
                {sub.completed ? (
                  <CheckCircle2 size={14} className="milestone-check-done" />
                ) : (
                  <Circle size={14} className="milestone-check-pending" />
                )}
                <span className={sub.completed ? 'done' : ''}>{sub.title}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MilestonesBlock({ data }) {
  const items = data?.items || [];
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract categories
  const categories = useMemo(() => {
    const cats = new Set();
    for (const item of items) {
      if (item.category) cats.add(item.category);
    }
    return ['All', ...Array.from(cats)];
  }, [items]);

  // Filter
  const filtered = useMemo(() => {
    if (selectedCategory === 'All') return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  // Stats — count including sub-task completion
  const { totalItems, completedItems } = useMemo(() => {
    let total = 0;
    let completed = 0;

    for (const item of items) {
      if (item.subTasks && item.subTasks.length > 0) {
        total += item.subTasks.length;
        completed += item.subTasks.filter((s) => s.completed).length;
      } else {
        total++;
        if (item.completed) completed++;
      }
    }

    return { totalItems: total, completedItems: completed };
  }, [items]);

  if (!items.length) {
    return (
      <div className="milestones-empty">
        <Target size={32} />
        <p>Add milestones and goals to track your progress</p>
      </div>
    );
  }

  return (
    <div className="milestones-block">
      {/* Header with progress */}
      <div className="milestones-header">
        <ProgressRing completed={completedItems} total={totalItems} />
        <div className="milestones-header-info">
          <div className="milestones-counter">
            <span className="milestones-counter-done">{completedItems}</span>
            <span className="milestones-counter-sep">/</span>
            <span className="milestones-counter-total">{totalItems}</span>
            <span className="milestones-counter-label">completed</span>
          </div>
          {completedItems === totalItems && totalItems > 0 && (
            <div className="milestones-all-done">
              <Trophy size={14} />
              <span>All goals achieved</span>
            </div>
          )}
        </div>
      </div>

      {/* Category filter pills */}
      {categories.length > 2 && (
        <div className="milestones-filters">
          {categories.map((cat) => {
            const catColor = CATEGORY_COLORS[cat] || 'var(--accent-color)';
            return (
              <button
                key={cat}
                type="button"
                className={`milestones-filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                style={selectedCategory === cat ? { borderColor: catColor, color: catColor } : {}}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Milestone items list */}
      <div className="milestones-list">
        {filtered.map((item, i) => (
          <MilestoneItem key={item.id || i} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
