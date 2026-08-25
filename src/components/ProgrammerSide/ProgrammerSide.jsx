import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  GitBranch,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Star,
  Coffee,
  Globe,
  Layers,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Code2,
} from 'lucide-react';
import {
  SiLaravel,
  SiReact,
  SiTailwindcss,
  SiNodedotjs,
  SiDocker,
  SiMysql,
  SiPhp,
  SiTypescript,
  SiJavascript,
  SiGit,
  SiPython,
  SiPostgresql,
  SiMongodb,
  SiLinux,
  SiVuedotjs,
  SiNextdotjs,
} from 'react-icons/si';
import {
  FaJava,
  FaDocker,
  FaGitAlt,
  FaJs,
  FaPython,
  FaPhp,
  FaReact,
  FaNodeJs,
  FaLaravel,
} from 'react-icons/fa6';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import './ProgrammerSide.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Map tech stack icon string names to brand vector components
const brandIconMap = {
  SiLaravel: <SiLaravel />,
  FaLaravel: <FaLaravel />,
  SiReact: <SiReact />,
  FaReact: <FaReact />,
  SiTailwindcss: <SiTailwindcss />,
  SiNodedotjs: <SiNodedotjs />,
  FaNodeJs: <FaNodeJs />,
  FaJava: <FaJava />,
  SiDocker: <SiDocker />,
  FaDocker: <FaDocker />,
  SiMysql: <SiMysql />,
  SiPhp: <SiPhp />,
  FaPhp: <FaPhp />,
  SiTypescript: <SiTypescript />,
  SiJavascript: <SiJavascript />,
  FaJs: <FaJs />,
  SiGit: <SiGit />,
  FaGitAlt: <FaGitAlt />,
  SiPython: <SiPython />,
  FaPython: <FaPython />,
  SiPostgresql: <SiPostgresql />,
  SiMongodb: <SiMongodb />,
  SiLinux: <SiLinux />,
  SiVuedotjs: <SiVuedotjs />,
  SiNextdotjs: <SiNextdotjs />,
  Code2: <Code2 />,
  Globe: <Globe />,
  Layers: <Layers />,
  Terminal: <Terminal />,
};

// Social icon mapping
const socialIconMap = {
  Github: <Github size={20} />,
  Linkedin: <Linkedin size={20} />,
  Mail: <Mail size={20} />,
};

// Stacked Image Deck Component (looks like a book / stacked photo deck)
function StackedImageDeck({ images, title, onOpenModal }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const total = images.length;

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // Single Image Display
  if (total === 1) {
    return (
      <div
        className="experience-single-image"
        onClick={() => onOpenModal && onOpenModal(images, 0, title)}
        title="Click to view full image"
      >
        <OptimizedImage
          src={images[0]}
          alt={title || 'Experience preview'}
          className="experience-img"
          width={320}
          height={190}
        />
        <div className="image-expand-overlay">
          <Maximize2 size={16} />
        </div>
      </div>
    );
  }

  // Multi-image Stacked Book Deck
  return (
    <div
      className="experience-book-stack"
      onClick={() => onOpenModal && onOpenModal(images, currentIndex, title)}
      title="Click to expand gallery"
    >
      {/* Background stacked layer cards mimicking pages / book thickness */}
      <div className="book-layer layer-back" />
      <div className="book-layer layer-mid" />

      {/* Main Top Card */}
      <div className="book-main-card">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="book-card-inner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.25 }}
          >
            <OptimizedImage
              src={images[currentIndex]}
              alt={`${title || 'Experience'} ${currentIndex + 1}`}
              className="experience-img"
              width={320}
              height={190}
            />
          </motion.div>
        </AnimatePresence>

        {/* Stack pill badge */}
        <div className="book-page-badge">
          <Layers size={12} />
          <span>
            {currentIndex + 1} / {total}
          </span>
        </div>

        {/* Navigation controls */}
        <div className="book-controls">
          <button
            type="button"
            className="book-nav-btn prev"
            onClick={handlePrev}
            aria-label="Previous image"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            className="book-nav-btn next"
            onClick={handleNext}
            aria-label="Next image"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="image-expand-overlay">
          <Maximize2 size={16} />
        </div>
      </div>
    </div>
  );
}

export default function ProgrammerSide({ profile, contact, skills, projects, experience }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalData, setModalData] = useState(null);

  // ⚠️ CRITICAL: Gate on ALL data props, not just profile.
  // Framer Motion's containerVariants (staggerChildren) fires once on mount.
  // If any section data is still null, its <motion.section> won't exist in the DOM,
  // and when the data arrives later the animation has already completed → sections stay invisible.
  // FIX: Block the entire animated tree until every data dependency is present.
  const isReady = profile && skills && projects && experience;
  if (!isReady) {
    return (
      <div className="programmer-side">
        <div className="dev-bg-grid" />
        <div className="dev-bg-glow" />
      </div>
    );
  }

  // Extract categories for tech stack filter
  const categories = ['All', ...new Set((skills || []).map((s) => s.category).filter(Boolean))];
  const filteredSkills =
    selectedCategory === 'All'
      ? skills || []
      : (skills || []).filter((s) => s.category === selectedCategory);

  const handleOpenModal = (images, index, title) => {
    setModalData({ images, index, title });
  };

  const handleCloseModal = () => {
    setModalData(null);
  };

  return (
    <motion.div
      key="programmer-loaded"
      className="programmer-side"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Ambient background effects */}
      <div className="dev-bg-grid" />
      <div className="dev-bg-glow" />

      {/* Hero Section */}
      <motion.section className="dev-hero" variants={itemVariants}>
        <div className="dev-hero-content">
          <div className="dev-avatar-wrapper">
            <div className="dev-avatar-placeholder">
              <OptimizedImage src={profile.avatar} alt="Profile" className="dev-avatar-img" width={160} height={160} />
            </div>
            <div className="dev-status-indicator">
              <span className="dev-status-dot" />
              <span>{profile.status}</span>
            </div>
          </div>
          <div className="dev-hero-text">
            <motion.p className="dev-greeting" variants={itemVariants}>
              <span className="dev-comment">{profile.greeting}</span>
            </motion.p>
            <motion.h1 className="dev-name" variants={itemVariants}>
              <span className="dev-bracket">{'<'}</span>
              {profile.name}
              <span className="dev-bracket">{' />'}</span>
            </motion.h1>
            <motion.p className="dev-title" variants={itemVariants}>
              {profile.title}
            </motion.p>
            <motion.p className="dev-bio" variants={itemVariants}>
              {profile.bio}
            </motion.p>
            <motion.div className="dev-socials" variants={itemVariants}>
              {profile.socials?.map((social) => (
                <a key={social.platform} href={social.url} className="dev-social-link" aria-label={social.platform}>
                  {socialIconMap[social.icon] || <Globe size={20} />}
                </a>
              ))}
            </motion.div>
          </div>
        </div>
        {profile.terminal && (
          <motion.div className="dev-terminal-widget" variants={itemVariants}>
            <div className="terminal-header">
              <span className="terminal-dot red" />
              <span className="terminal-dot yellow" />
              <span className="terminal-dot green" />
              <span className="terminal-title">{profile.terminal.title}</span>
            </div>
            <div className="terminal-body">
              {profile.terminal.lines.map((line, i) => (
                <div key={i}>
                  {line.command && (
                    <p>
                      <span className="terminal-prompt">$</span> {line.command}
                    </p>
                  )}
                  <p className="terminal-output">{line.output}</p>
                </div>
              ))}
              <p>
                <span className="terminal-prompt">$</span>
                <span className="terminal-cursor">_</span>
              </p>
            </div>
          </motion.div>
        )}
      </motion.section>

      {/* Tech Stack Section with Brand Logos & Enhanced Layout */}
      {skills && (
        <motion.section className="dev-section" variants={itemVariants}>
          <div className="dev-section-header">
            <h2 className="dev-section-title">
              <Terminal size={24} />
              <span>Tech Stack & Technologies</span>
            </h2>

            {/* Category Filter Pills */}
            {categories.length > 2 && (
              <div className="skills-filter-pills">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`skills-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="dev-skills-brand-grid">
            {filteredSkills.map((skill) => {
              const brandColor = skill.color || '#64ffda';
              return (
                <motion.div
                  key={skill.name}
                  className="dev-skill-brand-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{
                    y: -6,
                    borderColor: brandColor,
                    boxShadow: `0 8px 24px -6px ${brandColor}33`,
                  }}
                  style={{
                    '--skill-color': brandColor,
                  }}
                >
                  <div className="skill-brand-icon-wrap" style={{ color: brandColor }}>
                    {brandIconMap[skill.icon] || <Code2 size={28} />}
                  </div>
                  <div className="skill-brand-body">
                    <div className="skill-brand-title-row">
                      <h4 className="skill-brand-name">{skill.name}</h4>
                      <span className={`dev-skill-tier tier-${(skill.tier || 'intermediate').toLowerCase()}`}>
                        {skill.tier}
                      </span>
                    </div>
                    <div className="skill-brand-meta">
                      {skill.category && <span className="skill-category-tag">{skill.category}</span>}
                      {skill.experience && <span className="skill-exp-tag">{skill.experience}</span>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* Projects Section */}
      {projects && (
        <motion.section className="dev-section" variants={itemVariants}>
          <h2 className="dev-section-title">
            <GitBranch size={24} />
            <span>Featured Projects</span>
          </h2>
          <div className="dev-projects-grid">
            {projects.map((project) => (
              <motion.div
                key={project.title}
                className="dev-project-card"
                variants={itemVariants}
                whileHover={{ y: -6, borderColor: '#64ffda55' }}
              >
                <div className="dev-project-image-placeholder">
                  <OptimizedImage src={project.image} alt={project.title} className="dev-project-img" width={480} height={180} />
                </div>
                <div className="dev-project-body">
                  <div className="dev-project-header">
                    <h3>{project.title}</h3>
                    <a href="#" className="dev-project-link">
                      <ExternalLink size={16} />
                    </a>
                  </div>
                  <p className="dev-project-desc">{project.description}</p>
                  <div className="dev-project-footer">
                    <div className="dev-project-tech">
                      {project.tech.map((t) => (
                        <span key={t} className="dev-tech-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="dev-project-stars">
                      <Star size={14} />
                      <span>{project.stars}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Experience Section with Stacked Image Book Decks */}
      {experience && (
        <motion.section className="dev-section" variants={itemVariants}>
          <h2 className="dev-section-title">
            <Coffee size={24} />
            <span>Experience & Career Journey</span>
          </h2>
          <div className="dev-timeline">
            {experience.map((exp, i) => (
              <motion.div
                key={i}
                className="dev-timeline-item"
                variants={itemVariants}
              >
                <div className="dev-timeline-marker" />
                <div className="dev-timeline-card">
                  <div className="dev-timeline-header-info">
                    <span className="dev-timeline-period">{exp.period}</span>
                    <h3 className="dev-timeline-role">{exp.role}</h3>
                    <p className="dev-timeline-company">{exp.company}</p>
                    <p className="dev-timeline-desc">{exp.description}</p>
                  </div>

                  {/* Multi-Image Stacked Book Deck */}
                  {exp.images && exp.images.length > 0 && (
                    <div className="dev-timeline-media">
                      <StackedImageDeck
                        images={exp.images}
                        title={exp.company}
                        onOpenModal={handleOpenModal}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Contact Section */}
      {contact && (
        <motion.section className="dev-section dev-contact" variants={itemVariants}>
          <h2 className="dev-section-title">
            <Mail size={24} />
            <span>{contact.heading}</span>
          </h2>
          <p className="dev-contact-text">{contact.text}</p>
          <a href={`mailto:${contact.email}`} className="dev-contact-btn">
            <Mail size={18} />
            {contact.buttonText}
          </a>
        </motion.section>
      )}

      {/* Fullscreen Image Preview Lightbox Modal */}
      <AnimatePresence>
        {modalData && (
          <motion.div
            className="experience-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="experience-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCloseModal}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="modal-image-container">
                <OptimizedImage
                  src={modalData.images[modalData.index]}
                  alt={modalData.title || 'Experience image full'}
                  className="modal-full-img"
                  width={960}
                  height={540}
                />
              </div>

              {modalData.images.length > 1 && (
                <div className="modal-gallery-footer">
                  <div className="modal-counter">
                    <span>{modalData.title}</span> • {modalData.index + 1} of {modalData.images.length}
                  </div>
                  <div className="modal-thumbnails">
                    {modalData.images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`modal-thumb-item ${modalData.index === idx ? 'active' : ''}`}
                        onClick={() => setModalData({ ...modalData, index: idx })}
                      >
                        <OptimizedImage src={img} alt="Thumbnail" width={60} height={40} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
