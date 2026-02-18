import { motion } from 'framer-motion';
import {
  Code2,
  GitBranch,
  Terminal,
  Database,
  Globe,
  Layers,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Star,
  Coffee,
  Braces,
} from 'lucide-react';
import { imagePaths } from '../../imagePaths';
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

const skills = [
  { name: 'Laravel', tier: 'Expert', icon: <Globe size={16} /> },
  { name: 'React', tier: 'Mediocre', icon: <Layers size={16} /> },
  { name: 'Tailwind', tier: 'Mediocre', icon: <Braces size={16} /> },
  { name: 'Node.js', tier: 'Mediocre', icon: <Terminal size={16} /> },
  { name: 'Java', tier: 'Beginner', icon: <Code2 size={16} /> },
  { name: 'Docker', tier: 'Beginner', icon: <GitBranch size={16} /> },
];

const projects = [
  {
    title: 'Competitive Programming Module',
    description:
      'A module for competitive programming platforms with features like live coding sessions, test case management, and real-time feedback.',
    tech: ['Laravel', 'React', 'Wordpress', 'HTML Canvas'],
    stars: 891,
    image: imagePaths.project1,
  },
  {
    title: 'Advance Quiz Platform',
    description:
      'A real-time correction quiz platform with correction, many question types, and detailed analytics for educators and students.',
    tech: ['Laravel', 'JavaScript', 'JQuery', 'mySQL'],
    stars: 52,
    image: imagePaths.project2,
  },
  {
    title: 'HalalCraft, Minecraft Plugin',
    description:
      'A Minecraft plugin that adds using religiously compliant halal food items, prayer spaces, and educational content about Islamic culture within the game.',
    tech: ['Java', 'Spigot API', 'Maven'],
    stars: 214,
    image: imagePaths.project3,
  },
  {
    title: 'Company Profile Templating System',
    description:
      'A templating system for company profiles that allows users to create and customize their profiles with a drag-and-drop interface, and pre-designed templates.',
    tech: ['Laravel', 'React', 'Tailwind CSS', 'Figma API'],
    stars: 271,
    image: imagePaths.project4,
  },
];

const experience = [
  {
    role: 'Mentor & Coach for Competitive Programming',
    company: 'SMK Cyber Media Jakarta',
    period: '2023 — Present',
    description:
      'Mentoring high school students in competitive programming.',
  },
  {
    role: 'Freelance Web Developer',
    company: 'Bursa Umroh Haji Indonesia',
    period: 'Feb 2025 — Aug 2025',
    description:
      'Full-stack company profile website development with Laravel and React.',
  },
  {
    role: 'Full-stack Web Developer',
    company: 'PT. Lintas Teknologi Indonesia',
    period: 'Jul 2024 — Sep 2024',
    description:
      'Full-stack development with Laravel and Tailwind CSS.',
  },
  {
    role: 'Back-end Web Developer',
    company: 'PT. Parsaoran Global Datatrans',
    period: 'Mar 2024 — Jun 2024',
    description:
      'Back-end development with Laravel, API design, and database management.',
  },
  // {
  //   role: 'Open Source Contributor',
  //   company: 'Various Projects',
  //   period: '2019 — Present',
  //   description:
  //     '500+ contributions across major open source projects. Core maintainer of 3 popular npm packages.',
  // },
];

export default function ProgrammerSide() {
  return (
    <motion.div
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
              <OptimizedImage src={imagePaths.devAvatar} alt="Profile" className="dev-avatar-img" width={160} height={160} />
            </div>
            <div className="dev-status-indicator">
              <span className="dev-status-dot" />
              <span>Available for work</span>
            </div>
          </div>
          <div className="dev-hero-text">
            <motion.p className="dev-greeting" variants={itemVariants}>
              <span className="dev-comment">{'// Hello world, I am'}</span>
            </motion.p>
            <motion.h1 className="dev-name" variants={itemVariants}>
              <span className="dev-bracket">{'<'}</span>
              AQIL
              <span className="dev-bracket">{' />'}</span>
            </motion.h1>
            <motion.p className="dev-title" variants={itemVariants}>
              Web Developer | Open Source Enthusiast | Tech Blogger
            </motion.p>
            <motion.p className="dev-bio" variants={itemVariants}>
              I build performant, scalable applications with clean architecture.
              Passionate about open source, developer tooling, and pushing the
              boundaries of web technology. When I'm not coding, I'm probably
              exploring new frameworks or linux distro.
            </motion.p>
            <motion.div className="dev-socials" variants={itemVariants}>
              <a href="#" className="dev-social-link" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="#" className="dev-social-link" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="dev-social-link" aria-label="Email">
                <Mail size={20} />
              </a>
            </motion.div>
          </div>
        </div>
        <motion.div className="dev-terminal-widget" variants={itemVariants}>
          <div className="terminal-header">
            <span className="terminal-dot red" />
            <span className="terminal-dot yellow" />
            <span className="terminal-dot green" />
            <span className="terminal-title">aqil@portfolio:~</span>
          </div>
          <div className="terminal-body">
            <p>
              <span className="terminal-prompt">$</span> cat about.txt
            </p>
            <p className="terminal-output">
              Full-stack developer with 5+ years of experience.
            </p>
            <p className="terminal-output">
              Specializing in Laravel, React, and competitive modules.
            </p>
            <p>
              <span className="terminal-prompt">$</span> echo $CURRENT_STATUS
            </p>
            <p className="terminal-output">"Building something amazing..."</p>
            <p>
              <span className="terminal-prompt">$</span>
              <span className="terminal-cursor">_</span>
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* Skills Section */}
      <motion.section className="dev-section" variants={itemVariants}>
        <h2 className="dev-section-title">
          <Terminal size={24} />
          <span>Tech Stack</span>
        </h2>
        <div className="dev-skills-grid">
          {skills.map((skill) => (
            <motion.div
              key={skill.name}
              className="dev-skill-card"
              variants={itemVariants}
              whileHover={{ scale: 1.03, borderColor: '#64ffda' }}
            >
              <div className="dev-skill-header">
                {skill.icon}
                <span>{skill.name}</span>
                <span className={`dev-skill-tier tier-${skill.tier.toLowerCase()}`}>{skill.tier}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Projects Section */}
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

      {/* Experience Section */}
      <motion.section className="dev-section" variants={itemVariants}>
        <h2 className="dev-section-title">
          <Coffee size={24} />
          <span>Experience</span>
        </h2>
        <div className="dev-timeline">
          {experience.map((exp, i) => (
            <motion.div
              key={i}
              className="dev-timeline-item"
              variants={itemVariants}
              whileHover={{ x: 8 }}
            >
              <div className="dev-timeline-marker" />
              <div className="dev-timeline-content">
                <span className="dev-timeline-period">{exp.period}</span>
                <h3 className="dev-timeline-role">{exp.role}</h3>
                <p className="dev-timeline-company">{exp.company}</p>
                <p className="dev-timeline-desc">{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* GitHub Stats (placeholder) */}
      {/* <motion.section className="dev-section" variants={itemVariants}>
        <h2 className="dev-section-title">
          <Github size={24} />
          <span>GitHub Activity</span>
        </h2>
        <div className="dev-github-stats">
          <div className="dev-stat-card">
            <span className="dev-stat-number">2,847</span>
            <span className="dev-stat-label">Contributions (2025)</span>
          </div>
          <div className="dev-stat-card">
            <span className="dev-stat-number">156</span>
            <span className="dev-stat-label">Repositories</span>
          </div>
          <div className="dev-stat-card">
            <span className="dev-stat-number">4.2k</span>
            <span className="dev-stat-label">Total Stars</span>
          </div>
          <div className="dev-stat-card">
            <span className="dev-stat-number">89</span>
            <span className="dev-stat-label">Followers</span>
          </div>
        </div>
        <div className="dev-contribution-placeholder">
          <div className="dev-contrib-grid">
            {Array.from({ length: 52 * 7 }).map((_, i) => (
              <div
                key={i}
                className="dev-contrib-cell"
                style={{
                  opacity: Math.random() > 0.4 ? 0.15 + Math.random() * 0.85 : 0.08,
                }}
              />
            ))}
          </div>
          <p className="dev-contrib-label">Contribution Graph (placeholder)</p>
        </div>
      </motion.section> */}

      {/* Contact Section */}
      <motion.section className="dev-section dev-contact" variants={itemVariants}>
        <h2 className="dev-section-title">
          <Mail size={24} />
          <span>Get In Touch</span>
        </h2>
        <p className="dev-contact-text">
          Interested in working together? I'm always open to discussing new
          projects, creative ideas, or opportunities to be part of your vision.
        </p>
        <a href="mailto:naufalaqilnasrullah12@gmail.com" className="dev-contact-btn">
          <Mail size={18} />
          Say Hello
        </a>
      </motion.section>
    </motion.div>
  );
}
