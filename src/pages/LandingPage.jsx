import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Plus,
  Send,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Sun,
  Moon,
  Lock,
  Calendar,
  Code2,
  Briefcase,
  Layers,
  Cpu,
  Gamepad2,
  BookOpen,
  Music,
  Activity,
  ExternalLink,
  Play,
  Clock,
  Github,
  Monitor,
  Headphones,
  Video,
  Radio,
  Star,
  Globe,
  MessageSquare,
  ArrowUp,
} from 'lucide-react';
import { motion, useTransform } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { ContainerScroll } from '../components/ui/container-scroll-animation';
import HowItWorks from '../components/ui/how-it-works';
import ThreeDTestimonials from '../components/ui/3d-testimonials';
import LandingBottomNav from '../components/Landing/LandingBottomNav';
import WinnerCelebration from '../components/Landing/WinnerEvent/WinnerCelebration';
import WinnerSection from '../components/Landing/WinnerEvent/WinnerSection';
import { useWinnerCelebration } from '../components/Landing/WinnerEvent/useWinnerCelebration';
import { WINNER_EVENT } from '../components/Landing/WinnerEvent/winnerEvent.config';
import { apiFetch } from '../lib/api';
import './LandingPage.css';
import { useUiTheme } from '../hooks/useUiTheme';

gsap.registerPlugin(ScrollTrigger);


// Comprehensive showcase profile featuring all core modular blocks
const MAIN_SHOWCASE_PROFILE = {
  role: 'SOFTWARE_ENGINEER',
  name: 'Alex Rivers',
  handle: '@alexrivers',
  avatarInitials: 'AR',
  location: 'BERLIN, DE',
  accentColor: '#00f0aa',
  bio: 'Frontend architect and open-source engineer building reactive web apps, high-throughput component systems, and developer tools.',
  status: 'OPEN FOR WORK',
  socials: [
    { label: 'GitHub', url: 'https://github.com/alexrivers' },
    { label: 'Twitter', url: 'https://twitter.com/alexrivers' },
    { label: 'Email', url: 'mailto:alex@rivers.dev' },
    { label: 'Resume', url: '#' },
  ],
  skills: [
    { category: 'LANGUAGES', items: ['TypeScript', 'JavaScript (ESNext)', 'Go', 'Python'] },
    { category: 'FRONTEND', items: ['React 19', 'Next.js', 'Tailwind CSS', 'Framer Motion'] },
    { category: 'BACKEND & CLOUD', items: ['Node.js', 'PostgreSQL', 'Docker', 'Redis', 'Kubernetes'] },
  ],
  github: {
    total: 1842,
    currentStreak: 48,
    longestStreak: 126,
    bestDay: '28 commits',
  },
  projects: [
    {
      title: 'Hyperion UI',
      category: 'OPEN SOURCE',
      desc: 'A headless, accessible React component library built for modern high-velocity design systems.',
      tags: ['React', 'TypeScript', 'Radix UI'],
      link: 'https://github.com/alexrivers/hyperion',
    },
    {
      title: 'DevPulse Telemetry',
      category: 'DEVELOPER TOOL',
      desc: 'Real-time distributed tracing, telemetry, and error monitoring dashboard for cloud microservices.',
      tags: ['Go', 'Redis', 'WebSockets'],
      link: 'https://devpulse.io',
    },
  ],
  services: [
    {
      title: 'Frontend Architecture Consulting',
      price: '$1,800',
      period: 'audit',
      delivery: '3-5 days',
      desc: 'Deep audit of codebase scalability, bundle size, React 19 migration, and state management optimization.',
      features: [
        'Full AST architecture & dependency audit',
        'Runtime performance bottleneck profiling',
        'Step-by-step prioritized modernization roadmap',
      ],
      featured: true,
    },
    {
      title: 'Fullstack MVP Development',
      price: '$4,500',
      period: 'sprint',
      delivery: '2-3 weeks',
      desc: 'End-to-end design system and web application development from Figma specs to production deployment.',
      features: [
        'Modern React 19 & Next.js fullstack build',
        'PostgreSQL schema, Auth & Stripe integration',
        'Automated CI/CD testing & edge deployment',
      ],
      featured: false,
    },
  ],
  video: {
    title: 'Building a Zero-Dependency Reactive State Engine in Rust & WebAssembly',
    topic: 'SYSTEMS ARCHITECTURE',
    duration: '24:18',
    views: '48.2K views',
  },
  events: [
    {
      date: 'OCT 12, 2026',
      time: '18:00 UTC',
      status: 'KEYNOTE SPEAKER',
      title: 'Next-Gen Frontend Architectures // Berlin Tech Summit',
      desc: 'Live keynote talk exploring reactive DOM diffing algorithms, server components, and edge rendering architectures.',
    },
    {
      date: 'NOV 04, 2026',
      time: '15:30 UTC',
      status: 'LIVE WORKSHOP',
      title: 'Building Modular Micro-Frontends with React 19',
      desc: 'Interactive 3-hour deep dive workshop covering shared component registries, isolation patterns, and module federation.',
    },
  ],
  journal: [
    {
      date: 'SEPTEMBER 14, 2026',
      readTime: '6 min read',
      title: 'The Hidden Cost of JavaScript Hydration and How We Solved It',
      excerpt: 'Analyzing real-world CPU time during client-side hydration and why partial island architectures outperform monolithic SPAs.',
    },
    {
      date: 'AUGUST 28, 2026',
      readTime: '8 min read',
      title: 'Designing Deterministic State Machines for Complex Web UIs',
      excerpt: 'Why finite state machines eliminate impossible UI states, race conditions, and phantom re-renders across large teams.',
    },
  ],
  timeline: [
    {
      role: 'Frontend Architect',
      company: 'Vortex Labs',
      period: '2023 — Present',
      desc: 'Leading frontend architecture for real-time telemetry dashboards and component design systems.',
      tags: ['Architecture', 'React 19', 'Performance'],
    },
    {
      role: 'Senior Software Engineer',
      company: 'Monolith Systems',
      period: '2021 — 2023',
      desc: 'Engineered high-throughput GraphQL APIs and modernized core legacy client applications.',
      tags: ['TypeScript', 'Node.js', 'Docker'],
    },
  ],
  specs: [
    { category: 'WORKSTATION', name: 'MacBook Pro M3 Max', detail: '64GB Unified Memory' },
    { category: 'DISPLAY', name: 'Apple Studio Display 27"', detail: '5K Retina 600 nits' },
    { category: 'PERIPHERAL', name: 'ZSA Moonlander Split', detail: 'Kailh Box Silent Pinks' },
  ],
};

// Human-friendly patch notes / updates
const ENGINE_PATCH_NOTES = [
  {
    version: 'v1.0.0',
    status: 'LATEST UPDATE',
    date: 'August 28, 2026',
    codename: 'RELEASE 1.0',
    title: 'Photo Gallery, Events Calendar & Smooth Scroll',
    changes: [
      { type: 'NEW', text: 'Photo Gallery Block: Display images in clean grid layouts with full-screen lightbox zoom.' },
      { type: 'NEW', text: 'Events & Calendar Block: Share your schedule with 1-click Google Calendar & Apple .ICS sync.' },
      { type: 'IMPROVED', text: 'Smooth Scroll Showcase: Ultra-smooth scrolling experience powered by GSAP and Lenis.' },
      { type: 'IMPROVED', text: 'Independent Card Colors: Customize text colors inside cards without affecting headlines.' },
    ],
  },
  {
    version: 'v0.9.0',
    status: 'UPDATE',
    date: 'August 27, 2026',
    codename: 'BLOCK EXPANSION',
    title: 'Services & Rates, Hero Alignments & Multi-Image Uploads',
    changes: [
      { type: 'NEW', text: 'Services & Commissions Block: Create pricing tiers with deliverables checklist and booking buttons.' },
      { type: 'NEW', text: 'Hero Layout Options: Choose between center, left-aligned, or split-side layouts for your header.' },
      { type: 'NEW', text: 'Journal Cover Photos: Add card cover images and format articles with a visual markdown editor.' },
      { type: 'NEW', text: 'Multi-Image Gallery: Attach multiple project images to your career and timeline milestones.' },
    ],
  },
  {
    version: 'v0.8.0',
    status: 'UPDATE',
    date: 'August 26, 2026',
    codename: 'THEME ENGINE',
    title: 'Custom Theme Colors & Dynamic Page Backgrounds',
    changes: [
      { type: 'IMPROVED', text: 'Color Customization: Set custom theme colors, button styles, and border radius.' },
      { type: 'NEW', text: 'Page Backgrounds: Choose unique background styles dynamically for each tab.' },
    ],
  },
  {
    version: 'v0.5.0',
    status: 'INITIAL LAUNCH',
    date: 'August 20, 2026',
    codename: 'BETA RELEASE',
    title: 'Visual Live Editor & Custom Profile URLs',
    changes: [
      { type: 'NEW', text: 'Custom Profile URLs: Get your unique profile link at profilenc.my.id/@yourname.' },
      { type: 'NEW', text: 'Visual Live Editor: Edit your profile blocks and see changes instantly in real-time.' },
    ],
  },
];

function ShowcaseBrowserPreview({ profile, scrollYProgress }) {
  const windowRef = useRef(null);
  const contentRef = useRef(null);
  const maxScrollRef = useRef(0);
  const [, setForceUpdate] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      if (contentRef.current && windowRef.current) {
        const scrollable = contentRef.current.scrollHeight - windowRef.current.clientHeight;
        const val = Math.max(0, scrollable + 24);
        maxScrollRef.current = val;
        setForceUpdate((prev) => prev + 1);
      }
    };

    updateScroll();

    let ro;
    if (window.ResizeObserver && contentRef.current) {
      ro = new ResizeObserver(updateScroll);
      ro.observe(contentRef.current);
      if (windowRef.current) ro.observe(windowRef.current);
    }

    window.addEventListener('resize', updateScroll);
    return () => {
      window.removeEventListener('resize', updateScroll);
      ro?.disconnect();
    };
  }, []);

  // Phase 1 (0.00 -> 0.12): Card tilts from 18deg to 0deg into full viewport focus
  // Phase 2 (0.12 -> 0.88): Card is pinned flat in viewport. Inner content scrolls from 0 to -maxScroll!
  // Phase 3 (0.88 -> 1.00): Inner content remains at -maxScroll (at bottom), card unpins with page
  const innerY = useTransform(scrollYProgress, (val) => {
    const max = maxScrollRef.current;
    if (max <= 0) return 0;
    if (val <= 0.12) return 0;
    if (val >= 0.88) return -max;
    const progress = (val - 0.12) / (0.88 - 0.12);
    return -progress * max;
  });

  const progressBarScale = useTransform(scrollYProgress, (val) => {
    if (val <= 0.12) return 0;
    if (val >= 0.88) return 1;
    return (val - 0.12) / (0.88 - 0.12);
  });

  return (
    <div className="fn-showcase-browser-window">
      {/* Browser Window Chrome */}
      <div className="fn-browser-chrome">
        <div className="fn-browser-dots">
          <span className="fn-dot close" />
          <span className="fn-dot minimize" />
          <span className="fn-dot zoom" />
        </div>
        <div className="fn-browser-url-bar">
          <Lock size={12} className="fn-url-icon" />
          <span className="fn-url-text">profilenc.my.id/{profile.handle}</span>
        </div>
        <div className="fn-browser-badge">
          <span className="fn-live-pulse-dot" />
          <span>SCROLLING PREVIEW</span>
        </div>
      </div>

      {/* Browser Scroll Progress Indicator */}
      <div className="fn-browser-progress-track">
        <motion.div
          className="fn-browser-progress-bar"
          style={{
            scaleX: progressBarScale,
            transformOrigin: 'left',
          }}
        />
      </div>

      {/* Specimen Content Window */}
      <div
        className="fn-browser-body"
        ref={windowRef}
        style={{ '--accent': profile.accentColor }}
      >
        <motion.div
          ref={contentRef}
          style={{ y: innerY }}
          className="fn-specimen-scroll-track"
        >
          <article className="fn-specimen fn-specimen-featured">
            {/* Top Identity Header */}
            <div className="fn-specimen-head">
              <div className="fn-specimen-meta">
                <span className="fn-specimen-index">PROFILE SPECIMEN</span>
                <span className="fn-specimen-role">{profile.role}</span>
              </div>
              <div className="fn-specimen-loc">{profile.location}</div>
            </div>

            <div className="fn-specimen-body">
              {/* 1. HERO BLOCK */}
              <div className="fn-preview-hero">
                <div className="fn-preview-hero-top">
                  <div className="fn-preview-avatar">
                    <span>{profile.avatarInitials}</span>
                  </div>
                  <div className="fn-preview-hero-info">
                    <div className="fn-preview-name-row">
                      <h3 className="fn-specimen-name">{profile.name}</h3>
                      <span className="fn-specimen-status">
                        <span className="fn-status-dot" />
                        <span>{profile.status}</span>
                      </span>
                    </div>
                    <div className="fn-specimen-handle">{profile.handle} &bull; {profile.location}</div>
                  </div>
                </div>

                <p className="fn-specimen-bio">{profile.bio}</p>

                <div className="fn-preview-socials">
                  {profile.socials?.map((s, sIdx) => (
                    <span key={sIdx} className="fn-preview-social-pill">
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* 2. SKILLS BLOCK */}
              <div className="fn-preview-block">
                <div className="fn-preview-block-header">
                  <div className="fn-preview-block-icon"><Code2 size={15} /></div>
                  <div>
                    <span className="fn-preview-block-tag">BLOCK // SKILLS</span>
                    <h4 className="fn-preview-block-title">Core Technologies &amp; Stack</h4>
                  </div>
                </div>
                <div className="fn-preview-skills-grid">
                  {profile.skills.map((cat, cIdx) => (
                    <div key={cIdx} className="fn-preview-skill-group">
                      <div className="fn-preview-group-label">{cat.category}</div>
                      <div className="fn-pills">
                        {cat.items.map((item, iIdx) => (
                          <span key={iIdx} className="fn-pill">
                            <strong>{item}</strong>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. GITHUB HEATMAP BLOCK */}
              <div className="fn-preview-block">
                <div className="fn-preview-block-header">
                  <div className="fn-preview-block-icon"><Github size={15} /></div>
                  <div>
                    <span className="fn-preview-block-tag">BLOCK // GITHUB_HEATMAP</span>
                    <h4 className="fn-preview-block-title">Open Source Contributions</h4>
                  </div>
                </div>
                <div className="fn-preview-heatmap-card">
                  <div className="fn-preview-heatmap-stats">
                    <div className="fn-preview-stat-item">
                      <span className="stat-num">{profile.github.total}</span>
                      <span className="stat-lbl">Contributions in 2026</span>
                    </div>
                    <div className="fn-preview-stat-item">
                      <span className="stat-num">{profile.github.currentStreak}d</span>
                      <span className="stat-lbl">Current Streak</span>
                    </div>
                    <div className="fn-preview-stat-item">
                      <span className="stat-num">{profile.github.bestDay}</span>
                      <span className="stat-lbl">Best Day Record</span>
                    </div>
                  </div>
                  <div className="fn-preview-heatmap-matrix" aria-hidden="true">
                    {Array.from({ length: 28 }).map((_, dIdx) => (
                      <span
                        key={dIdx}
                        className={`fn-heatmap-cell lvl-${(dIdx % 4) + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. CARDS_GRID (PROJECTS) BLOCK */}
              <div className="fn-preview-block">
                <div className="fn-preview-block-header">
                  <div className="fn-preview-block-icon"><Layers size={15} /></div>
                  <div>
                    <span className="fn-preview-block-tag">BLOCK // CARDS_GRID</span>
                    <h4 className="fn-preview-block-title">Featured Projects</h4>
                  </div>
                </div>
                <div className="fn-preview-cards-grid">
                  {profile.projects.map((proj, pIdx) => (
                    <div key={pIdx} className="fn-preview-card-item">
                      <div className="fn-preview-card-tag">{proj.category}</div>
                      <h5 className="fn-preview-card-title">{proj.title}</h5>
                      <p className="fn-preview-card-desc">{proj.desc}</p>
                      <div className="fn-pills">
                        {proj.tags.map((t, tIdx) => (
                          <span key={tIdx} className="fn-pill small">{t}</span>
                        ))}
                      </div>
                      <div className="fn-preview-card-foot">
                        <span className="fn-card-btn">
                          <span>View Project</span>
                          <ExternalLink size={12} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. SERVICES & COMMISSION RATES BLOCK */}
              <div className="fn-preview-block">
                <div className="fn-preview-block-header">
                  <div className="fn-preview-block-icon"><Sparkles size={15} /></div>
                  <div>
                    <span className="fn-preview-block-tag">BLOCK // SERVICES</span>
                    <h4 className="fn-preview-block-title">Services &amp; Commission Rates</h4>
                  </div>
                </div>
                <div className="fn-preview-services-grid">
                  {profile.services.map((srv, sIdx) => (
                    <div key={sIdx} className={`fn-preview-service-card ${srv.featured ? 'featured' : ''}`}>
                      <div className="fn-service-top">
                        {srv.featured && <span className="fn-featured-badge">Featured Tier</span>}
                        <span className="fn-delivery-pill"><Clock size={11} /> {srv.delivery}</span>
                      </div>
                      <h5 className="fn-service-title">{srv.title}</h5>
                      <div className="fn-price">
                        {srv.price} <small>/ {srv.period}</small>
                      </div>
                      <p className="fn-desc">{srv.desc}</p>
                      <ul className="fn-checklist">
                        {srv.features.map((f, fIdx) => (
                          <li key={fIdx}><Check size={12} /> {f}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. FEATURED_VIDEO BLOCK */}
              <div className="fn-preview-block">
                <div className="fn-preview-block-header">
                  <div className="fn-preview-block-icon"><Video size={15} /></div>
                  <div>
                    <span className="fn-preview-block-tag">BLOCK // FEATURED_VIDEO</span>
                    <h4 className="fn-preview-block-title">Latest Deep Dive Video</h4>
                  </div>
                </div>
                <div className="fn-preview-video-card">
                  <div className="fn-video-mockup">
                    <div className="fn-video-play-btn"><Play size={20} /></div>
                    <span className="fn-video-duration">{profile.video.duration}</span>
                  </div>
                  <div className="fn-video-info">
                    <span className="fn-video-topic">{profile.video.topic}</span>
                    <h5 className="fn-video-title">{profile.video.title}</h5>
                    <span className="fn-video-views">{profile.video.views}</span>
                  </div>
                </div>
              </div>

              {/* 7. EVENTS BLOCK */}
              <div className="fn-preview-block">
                <div className="fn-preview-block-header">
                  <div className="fn-preview-block-icon"><Radio size={15} /></div>
                  <div>
                    <span className="fn-preview-block-tag">BLOCK // EVENTS</span>
                    <h4 className="fn-preview-block-title">Upcoming Talks &amp; Live Streams</h4>
                  </div>
                </div>
                <div className="fn-preview-events-list">
                  {profile.events.map((ev, eIdx) => (
                    <div key={eIdx} className="fn-preview-event-card">
                      <div className="fn-event-date-box">
                        <span className="fn-event-date-text">{ev.date}</span>
                        <span className="fn-event-time-text">{ev.time}</span>
                      </div>
                      <div className="fn-event-info">
                        <div className="fn-event-status-badge">{ev.status}</div>
                        <h5 className="fn-event-title">{ev.title}</h5>
                        <p className="fn-desc">{ev.desc}</p>
                        <span className="fn-cal-tag">
                          <Calendar size={11} /> Sync to Calendar
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8. JOURNAL BLOCK */}
              <div className="fn-preview-block">
                <div className="fn-preview-block-header">
                  <div className="fn-preview-block-icon"><BookOpen size={15} /></div>
                  <div>
                    <span className="fn-preview-block-tag">BLOCK // JOURNAL</span>
                    <h4 className="fn-preview-block-title">Engineering Essays &amp; Journal</h4>
                  </div>
                </div>
                <div className="fn-preview-journal-list">
                  {profile.journal.map((j, jIdx) => (
                    <div key={jIdx} className="fn-preview-journal-card">
                      <div className="fn-journal-meta">
                        <span>{j.date}</span>
                        <span className="fn-journal-read-time">{j.readTime}</span>
                      </div>
                      <h5 className="fn-journal-title">{j.title}</h5>
                      <p className="fn-journal-excerpt">{j.excerpt}</p>
                      <span className="fn-read-link">
                        <span>Read Essay</span>
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 9. TIMELINE BLOCK */}
              <div className="fn-preview-block">
                <div className="fn-preview-block-header">
                  <div className="fn-preview-block-icon"><Briefcase size={15} /></div>
                  <div>
                    <span className="fn-preview-block-tag">BLOCK // TIMELINE</span>
                    <h4 className="fn-preview-block-title">Experience &amp; Career</h4>
                  </div>
                </div>
                <div className="fn-preview-timeline">
                  {profile.timeline.map((t, tIdx) => (
                    <div key={tIdx} className="fn-preview-timeline-item">
                      <div className="fn-preview-timeline-dot" />
                      <div className="fn-preview-timeline-content">
                        <div className="fn-timeline-head">
                          <h5 className="fn-role-title">{t.role}</h5>
                          <span className="fn-timeline-date">
                            <Calendar size={11} /> {t.period}
                          </span>
                        </div>
                        <div className="fn-company">{t.company}</div>
                        <p className="fn-desc">{t.desc}</p>
                        <div className="fn-pills">
                          {t.tags.map((tag, tagIdx) => (
                            <span key={tagIdx} className="fn-pill small">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 10. SPECS_GRID BLOCK */}
              <div className="fn-preview-block">
                <div className="fn-preview-block-header">
                  <div className="fn-preview-block-icon"><Cpu size={15} /></div>
                  <div>
                    <span className="fn-preview-block-tag">BLOCK // SPECS_GRID</span>
                    <h4 className="fn-preview-block-title">Workstation Gear</h4>
                  </div>
                </div>
                <div className="fn-preview-specs-grid">
                  {profile.specs.map((sp, sIdx) => (
                    <div key={sIdx} className="fn-preview-spec-item">
                      <div className="fn-spec-cat">{sp.category}</div>
                      <div className="fn-spec-name">{sp.name}</div>
                      <div className="fn-spec-detail">{sp.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="fn-specimen-foot">
              <span>Profile preview</span>
              <span className="fn-foot-link">profilenc.my.id/{profile.handle}</span>
            </div>
          </article>
        </motion.div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { theme, toggleTheme } = useUiTheme();
  // First place event: entry popup state, once per session plus manual replay
  const celebration = useWinnerCelebration();



  const [featuredProfiles, setFeaturedProfiles] = useState([]);
  const [patchNotesList, setPatchNotesList] = useState(ENGINE_PATCH_NOTES);
  const [landingData, setLandingData] = useState({
    hero: {
      badge: 'PROFILENC // PERSONAL PROFILE BUILDER',
      mastheadTop: 'CREATE YOUR',
      mastheadMid: 'PERSONAL PAGE.',
      manifestoLead: 'The easiest way to build a clean, customizable profile website. Choose your blocks, customize colors and fonts, and share your link with the world.',
      claimLabel: 'YOUR PERSONAL LINK',
    },
    marquee: {
      text: 'CREATE YOUR PROFILE // 10 MODULAR BLOCKS // NO CODING REQUIRED // SHARE ANYWHERE //',
    },
    cta: {
      badge: '[GET_STARTED]',
      title: 'READY TO BUILD YOUR PAGE?',
      text: "Create a clean, customizable personal page in minutes. It's free and easy to set up.",
      btnLabel: 'START BUILDING NOW',
    },
  });

  // Open Suggestion Box Form State
  const [suggestionForm, setSuggestionForm] = useState({
    name: '',
    email: '',
    category: 'DESIGN',
    title: '',
    message: '',
  });
  const [suggestionFile, setSuggestionFile] = useState(null);
  const [suggestionPreview, setSuggestionPreview] = useState(null);
  const [suggestionSubmitting, setSuggestionSubmitting] = useState(false);
  const [suggestionSuccess, setSuggestionSuccess] = useState(false);
  const [suggestionError, setSuggestionError] = useState('');

  const handleSuggestionImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Matches MAX_PUBLIC_UPLOAD_BYTES in server/src/middleware/upload.js
      if (file.size > 2 * 1024 * 1024) {
        setSuggestionError('Image file is too large (max 2MB)');
        return;
      }
      setSuggestionFile(file);
      setSuggestionPreview(URL.createObjectURL(file));
      setSuggestionError('');
    }
  };

  const handleRemoveSuggestionImage = () => {
    setSuggestionFile(null);
    if (suggestionPreview) URL.revokeObjectURL(suggestionPreview);
    setSuggestionPreview(null);
  };

  const handleSuggestionSubmit = async (e) => {
    e.preventDefault();
    if (!suggestionForm.title.trim() || !suggestionForm.message.trim()) {
      setSuggestionError('Please enter a title and description for your suggestion');
      return;
    }

    setSuggestionSubmitting(true);
    setSuggestionError('');

    try {
      const formData = new FormData();
      formData.append('name', suggestionForm.name);
      formData.append('email', suggestionForm.email);
      formData.append('category', suggestionForm.category);
      formData.append('title', suggestionForm.title);
      formData.append('message', suggestionForm.message);
      if (suggestionFile) {
        formData.append('image', suggestionFile);
      }

      const res = await apiFetch('/api/site/suggestions', {
        method: 'POST',
        token: null,
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit suggestion');
      }

      setSuggestionSuccess(true);
      setSuggestionForm({ name: '', email: '', category: 'DESIGN', title: '', message: '' });
      handleRemoveSuggestionImage();
    } catch (err) {
      setSuggestionError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSuggestionSubmitting(false);
    }
  };

  const marquee1Ref = useRef(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    // Set document title
    document.title = 'Profilenc';

    // 1. Lenis Smooth Scroll Integration
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCb = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    // 2. Infinite Marquee
    if (marquee1Ref.current) {
      gsap.to(marquee1Ref.current, {
        xPercent: -50,
        ease: 'none',
        duration: 22,
        repeat: -1,
      });
    }

    // Refresh ScrollTrigger when fonts finish loading
    if (document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    const onResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);

    // Smooth anchor link clicks via Lenis
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a');
      const href = anchor?.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: 0 });
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('click', handleAnchorClick);
      lenisRef.current = null;
      lenis.destroy();
      gsap.ticker.remove(tickerCb);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Lenis owns the scroll position on pointer devices, so ask it first and fall
  // back to the native scroll on touch, where Lenis stays passive.
  const scrollToTop = () => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { duration: 0.9 });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Refresh ScrollTrigger when dynamic landing data finishes loading
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);
    return () => clearTimeout(timer);
  }, [featuredProfiles, patchNotesList, landingData]);

  // Fetch Live Site Data (Landing Config & Patch Notes & Featured Profiles)
  useEffect(() => {
    // Featured Profiles (with dynamic Account Bio / Headline)
    apiFetch('/api/templates/featured/profiles', { token: null })
      .then((r) => (r.ok ? r.json() : []))
      .then(async (profiles) => {
        if (!Array.isArray(profiles)) return;
        setFeaturedProfiles(profiles);

        // If any profile has not explicitly configured account bio yet, enrich with their profile hero bio/tagline
        const needsBio = profiles.filter((p) => !p.bio);
        if (needsBio.length > 0) {
          const enriched = await Promise.all(
            profiles.map(async (p) => {
              if (p.bio) return p;
              try {
                const cRes = await apiFetch(`/api/u/${p.username}/content`, { token: null });
                if (cRes.ok) {
                  const content = await cRes.json();
                  const profileData = content.modular_profile || content;
                  const tabs = profileData.tabs || [];
                  for (const tab of tabs) {
                    const hero = (tab.blocks || []).find((b) => b.type === 'hero');
                    if (hero?.data?.bio && typeof hero.data.bio === 'string' && hero.data.bio.trim()) {
                      return { ...p, bio: hero.data.bio.trim() };
                    }
                    if (hero?.data?.tagline && typeof hero.data.tagline === 'string' && hero.data.tagline.trim()) {
                      return { ...p, bio: hero.data.tagline.trim() };
                    }
                  }
                }
              } catch (e) {
                // Keep original profile object
              }
              return p;
            })
          );
          setFeaturedProfiles(enriched);
        }
      })
      .catch(() => { });

    // Patch Notes
    apiFetch('/api/site/patch-notes', { token: null })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.patchNotes && data.patchNotes.length > 0) {
          setPatchNotesList(data.patchNotes);
        }
      })
      .catch(() => { });

    // Landing CMS Settings
    apiFetch('/api/site/landing', { token: null })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.config) {
          setLandingData((prev) => ({
            hero: { ...prev.hero, ...(data.config.hero || {}) },
            marquee: { ...prev.marquee, ...(data.config.marquee || {}) },
            cta: { ...prev.cta, ...(data.config.cta || {}) },
          }));
        }
      })
      .catch(() => { });
  }, []);

  return (
    <div className="landing-raw-root">
      {/* Top Navbar */}
      <header className="fn-header">
        <div className="fn-container fn-nav">
          <Link to="/" className="fn-logo">
            <span className="fn-logo-mark">
              <img src="/logo.svg" alt="" aria-hidden="true" />
            </span>
            Profilenc
          </Link>

          <nav className="fn-nav-links" aria-label="Main navigation">
            <a href="#updates">Updates</a>
            <a href="#showcase">Showcase</a>
            <a href="#community">Community</a>
            <a href="#feedback">Feedback</a>
          </nav>

          <div className="fn-nav-actions">
            <button
              type="button"
              className="fn-theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              <span className="fn-theme-toggle-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            {user?.isAdmin && (
              <Link to="/admin" className="fn-btn fn-btn-ghost fn-btn-small">
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link to={`/@${user.username}`} className="fn-btn fn-btn-ghost fn-btn-small">
                  My profile
                </Link>
                <Link to={`/@${user.username}/edit`} className="fn-btn fn-btn-coral fn-btn-small">
                  Studio editor <ArrowUpRight size={14} />
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="fn-btn fn-btn-ghost fn-btn-small">
                  Log in
                </Link>
                <Link to="/register" className="fn-btn fn-btn-coral fn-btn-small">
                  Get started <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Centered brand, phone only. Static: the tab bar handles navigation. */}
      <div className="fn-mobile-brand">
        <span className="fn-logo-mark">
          <img src="/logo.svg" alt="" aria-hidden="true" />
        </span>
        <span className="fn-mobile-brand-name">Profilenc</span>
      </div>

      {/* HERO */}
      <section className="fn-hero">
        <div className="fn-container fn-hero-grid">
          <div>
            {/* No fallback on purpose: an admin who clears the CMS badge field
                gets no badge at all, rather than the seeded default back */}
            {landingData.hero?.badge?.trim() && (
              <p className="fn-eyebrow">{landingData.hero.badge}</p>
            )}

            <h1 className="fn-hero-title">
              {landingData.hero?.mastheadTop || 'Create your'}
              <br />
              <em>{landingData.hero?.mastheadMid || 'personal page.'}</em>
            </h1>

            <p className="fn-hero-lead">
              {landingData.hero?.manifestoLead || 'The easiest way to build a clean, customizable profile website. Choose your blocks, customize colors and fonts, and share your link with the world.'}
            </p>

            <div className="fn-hero-actions">
              <button
                type="button"
                className="fn-btn fn-btn-coral"
                onClick={() => navigate(isAuthenticated ? `/@${user.username}/edit` : '/register')}
              >
                {isAuthenticated ? 'Open studio editor' : 'Create your profile'}
                <ArrowUpRight size={18} />
              </button>

              <a href="#showcase" className="fn-btn fn-btn-ghost">
                See examples
                <ArrowRight size={16} />
              </a>
            </div>

          </div>

          <div className="fn-hero-art" aria-hidden="true">
            <div className="fn-poster fn-poster-back">
              <p className="fn-poster-eyebrow">Issue no. 04</p>
              <div className="fn-poster-circle is-lavender" />
              <div className="fn-poster-lines">
                <span />
                <span />
                <span />
              </div>
              <div className="fn-poster-foot">
                <span>Profilenc</span>
                <span>2026</span>
              </div>
            </div>

            <div className="fn-poster fn-poster-main">
              <p className="fn-poster-eyebrow">{landingData.hero?.claimLabel || 'Your personal link'}</p>
              <p className="fn-poster-url">
                profilenc.my.id/<em>@yourname</em>
              </p>
              <div className="fn-poster-circle" />
              <div className="fn-poster-lines">
                <span />
                <span />
                <span />
              </div>
              <div className="fn-poster-foot">
                <span>Easy to share</span>
                <span>Free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FIRST PLACE EVENT: certificate, team and special thanks.
          Toggle and content live in components/Landing/WinnerEvent/winnerEvent.config.js */}
      {WINNER_EVENT.enabled && (
        <WinnerSection onReplay={celebration.replay} lenisRef={lenisRef} />
      )}

      {/* ENGINE UPDATES / PATCH NOTES BOARD */}
      <section className="fn-section" id="updates">
        <div className="fn-container">
          <div className="fn-section-head">
            <div>
              <p className="fn-eyebrow">01 / Engine updates</p>
              <h2 className="fn-display">What&rsquo;s new in Profilenc.</h2>
            </div>
            <p className="fn-section-lead">
              Changelog and the latest features added to the profile builder.
              Every release makes it easier to shape a page that feels like yours.
            </p>
          </div>

          <HowItWorks patches={patchNotesList} />
        </div>
      </section>

      {/* MARQUEE */}
      <section className="fn-marquee" aria-hidden="true">
        <div ref={marquee1Ref} className="fn-marquee-track">
          <span>{landingData.marquee?.text || 'CREATE YOUR PROFILE // 10 MODULAR BLOCKS // NO CODING REQUIRED // SHARE ANYWHERE //'}</span>
          <span>{landingData.marquee?.text || 'CREATE YOUR PROFILE // 10 MODULAR BLOCKS // NO CODING REQUIRED // SHARE ANYWHERE //'}</span>
        </div>
      </section>

      {/* SHOWCASE WITH 3D CONTAINER SCROLL ANIMATION */}
      <section id="showcase" className="fn-showcase">
        <div className="fn-showcase-static-header">
          <div className="fn-container">
            <div className="fn-showcase-header-content">
              <span className="fn-showcase-tag">[ Section: Showcase ]</span>
              <h2 className="fn-showcase-title">Live profile preview</h2>
            </div>
          </div>
        </div>

        <ContainerScroll>
          {({ scrollYProgress }) => (
            <ShowcaseBrowserPreview
              profile={MAIN_SHOWCASE_PROFILE}
              scrollYProgress={scrollYProgress}
            />
          )}
        </ContainerScroll>
      </section>

      {/* COMMUNITY / CREATOR SHOWCASE */}
      {featuredProfiles.length > 0 && (
        <section className="fn-section fn-community-section" id="community">
          <div className="fn-container">
            <div className="fn-section-head">
              <div>
                <p className="fn-eyebrow">02 / Community</p>
                <h2 className="fn-display">Profiles made by creators.</h2>
              </div>
              <p className="fn-section-lead">
                Real pages built with Profilenc. Take a look, borrow an idea,
                and make it your own.
              </p>
            </div>
          </div>

          <div className="fn-community-stage-wrapper">
            <ThreeDTestimonials profiles={featuredProfiles} />
          </div>
        </section>
      )}

      {/* FEEDBACK */}
      <section className="fn-suggestion" id="feedback">
        <div className="fn-container">
          <div className="fn-suggestion-card">
            <div className="fn-suggestion-head">
              <div className="fn-suggestion-badges">
                <span className="fn-badge coral">[ Community input ]</span>
                <span className="fn-badge mint">Live feedback channel</span>
              </div>
              <h2 className="fn-suggestion-title">Open suggestion box</h2>
              <p className="fn-suggestion-desc">
                Help shape the future of Profilenc. Share design ideas, request
                new modular blocks, or report technical improvements with
                screenshots.
              </p>
            </div>

            {suggestionSuccess ? (
              <div className="fn-success">
                <div className="fn-success-icon">
                  <CheckCircle2 size={34} />
                </div>
                <h3>Suggestion dispatched</h3>
                <p>
                  Thank you. Your feedback has been sent directly to the
                  Profilenc admin dashboard.
                </p>
                <button
                  type="button"
                  onClick={() => setSuggestionSuccess(false)}
                  className="fn-btn fn-btn-ghost"
                >
                  <Plus size={14} /> Submit another suggestion
                </button>
              </div>
            ) : (
              <form onSubmit={handleSuggestionSubmit} className="fn-form">
                {suggestionError && (
                  <div className="fn-error">
                    <AlertCircle size={16} />
                    <span>{suggestionError}</span>
                  </div>
                )}

                <div className="fn-field">
                  <label className="fn-label">Select category</label>
                  <div className="fn-cats">
                    {[
                      { id: 'DESIGN', label: 'Design & UI/UX', desc: 'Aesthetics, layouts, animations, typography' },
                      { id: 'TECHNICALITY', label: 'Technicality & performance', desc: 'Core engine, speed, editor mechanics' },
                      { id: 'FEATURE', label: 'New feature / block', desc: 'Ideas for new blocks or custom widgets' },
                      { id: 'BUG', label: 'Bug / issue report', desc: 'Unexpected behavior or glitches' },
                    ].map((cat) => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setSuggestionForm({ ...suggestionForm, category: cat.id })}
                        className={`fn-cat ${suggestionForm.category === cat.id ? 'active' : ''}`}
                      >
                        <div className="fn-cat-top">
                          <span className="fn-cat-tag">[{cat.id}]</span>
                          {suggestionForm.category === cat.id && <Check size={14} className="fn-cat-check" />}
                        </div>
                        <span className="fn-cat-title">{cat.label}</span>
                        <span className="fn-cat-desc">{cat.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="fn-field">
                  <label className="fn-label" htmlFor="sug-title">
                    Suggestion headline <span className="req">*</span>
                  </label>
                  <input
                    id="sug-title"
                    type="text"
                    required
                    placeholder="e.g. Add a Spotify player embed block"
                    value={suggestionForm.title}
                    onChange={(e) => setSuggestionForm({ ...suggestionForm, title: e.target.value })}
                    className="fn-input"
                  />
                </div>

                <div className="fn-field">
                  <label className="fn-label" htmlFor="sug-msg">
                    Details &amp; explanation <span className="req">*</span>
                  </label>
                  <textarea
                    id="sug-msg"
                    rows={4}
                    required
                    placeholder="Describe your suggestion in detail. What problem does it solve? How should it look or behave?"
                    value={suggestionForm.message}
                    onChange={(e) => setSuggestionForm({ ...suggestionForm, message: e.target.value })}
                    className="fn-textarea"
                  />
                </div>

                <div className="fn-field">
                  <label className="fn-label">
                    Attach screenshot / mockup <span className="opt">(optional, max 10MB)</span>
                  </label>

                  {suggestionPreview ? (
                    <div className="fn-preview">
                      <div className="fn-preview-thumb">
                        <img src={suggestionPreview} alt="Upload preview" />
                      </div>
                      <div className="fn-preview-info">
                        <span className="fn-preview-name">{suggestionFile?.name}</span>
                        <span className="fn-preview-size">
                          {(suggestionFile?.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveSuggestionImage}
                        className="fn-preview-remove"
                        title="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="fn-upload">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
                        onChange={handleSuggestionImageChange}
                        className="fn-file-input"
                      />
                      <Upload size={20} className="fn-upload-icon" />
                      <div className="fn-upload-text">
                        <span className="fn-upload-main">Click or drag an image file here</span>
                        <span className="fn-upload-sub">PNG, JPG, WEBP, GIF up to 10MB</span>
                      </div>
                    </label>
                  )}
                </div>

                <div className="fn-form-row">
                  <div className="fn-field">
                    <label className="fn-label" htmlFor="sug-name">
                      Your name or @handle <span className="opt">(optional)</span>
                    </label>
                    <input
                      id="sug-name"
                      type="text"
                      placeholder="e.g. Alex or @alexcreator"
                      value={suggestionForm.name}
                      onChange={(e) => setSuggestionForm({ ...suggestionForm, name: e.target.value })}
                      className="fn-input"
                    />
                  </div>

                  <div className="fn-field">
                    <label className="fn-label" htmlFor="sug-email">
                      Email address <span className="opt">(optional, for updates)</span>
                    </label>
                    <input
                      id="sug-email"
                      type="email"
                      placeholder="e.g. alex@example.com"
                      value={suggestionForm.email}
                      onChange={(e) => setSuggestionForm({ ...suggestionForm, email: e.target.value })}
                      className="fn-input"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={suggestionSubmitting}
                  className="fn-btn fn-btn-coral fn-submit"
                >
                  {suggestionSubmitting ? (
                    <span>Dispatching suggestion&hellip;</span>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Submit suggestion</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="fn-cta">
        <div className="fn-container">
          <div className="fn-feature-grid">
            <article className="fn-feature">
              <div className="fn-arrow">
                <Sparkles size={22} />
              </div>
              <h2 className="fn-feature-title">
                {landingData.cta?.title || 'Ready to build your page?'}
              </h2>
              <p className="fn-feature-text">
                {landingData.cta?.text || "Create a clean, customizable personal page in minutes. It's free and easy to set up."}
              </p>
              <div className="fn-feature-actions">
                <button
                  type="button"
                  className="fn-btn fn-btn-coral"
                  onClick={() => navigate(isAuthenticated ? `/@${user.username}/edit` : '/register')}
                >
                  {isAuthenticated ? 'Open studio editor' : (landingData.cta?.btnLabel || 'Start building now')}
                  <ArrowRight size={18} />
                </button>
                <a href="#showcase" className="fn-btn fn-btn-ghost">
                  Browse examples
                </a>
              </div>
            </article>

            <article className="fn-feature secondary">
              <div>
                <div className="fn-arrow">
                  <ArrowUpRight size={22} />
                </div>
                <h2 className="fn-feature-title">Keep the useful. Remove the usual.</h2>
                <ul className="fn-benefits">
                  <li className="fn-benefit">
                    <span className="fn-benefit-num">01</span> Modular blocks
                  </li>
                  <li className="fn-benefit">
                    <span className="fn-benefit-num">02</span> Custom colors &amp; fonts
                  </li>
                  <li className="fn-benefit">
                    <span className="fn-benefit-num">03</span> Your own link
                  </li>
                </ul>
              </div>
              <div className="fn-feature-actions">
                <Link to="/register" className="fn-btn fn-btn-ghost">
                  Get started
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="fn-quote-section">
        <div className="fn-container">
          <div className="fn-quote">
            <span className="fn-quote-mark" aria-hidden="true">&ldquo;</span>
            <blockquote className="fn-quote-text">
              The best pages do not shout for attention. They invite people to
              stay a little longer.
            </blockquote>
            <cite className="fn-quote-cite">&mdash; A note from the Profilenc studio</cite>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="fn-footer">
        <div className="fn-container fn-footer-inner">
          {/* Row 1: brand on the left, round action buttons on the right */}
          <div className="fn-footer-top">
            <div className="fn-footer-brand">
              <span className="fn-logo-mark">
                <img src="/logo.svg" alt="" aria-hidden="true" />
              </span>
              <span className="fn-footer-wordmark">Profilenc</span>
            </div>

            <div className="fn-footer-actions">
              <a href="#feedback" className="fn-footer-icon-btn" aria-label="Send feedback">
                <MessageSquare size={17} />
              </a>
              <button
                type="button"
                className="fn-footer-icon-btn"
                onClick={scrollToTop}
                aria-label="Back to top"
              >
                <ArrowUp size={17} />
              </button>
            </div>
          </div>

          {/* Row 2: legal on the left, two right aligned link rows */}
          <div className="fn-footer-bottom">
            <div className="fn-footer-legal">
              <span>&copy; {new Date().getFullYear()} Profilenc</span>
              <span>All rights reserved</span>
            </div>

            <nav className="fn-footer-nav" aria-label="Footer">
              <div className="fn-footer-nav-row">
                <a href="#updates">Updates</a>
                <a href="#showcase">Showcase</a>
                <a href="#community">People</a>
                <a href="#feedback">Feedback</a>
              </div>
              <div className="fn-footer-nav-row is-secondary">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to={`/@${user.username}/edit`}>Studio</Link>
                  </>
                ) : (
                  <>
                    <Link to="/login">Log in</Link>
                    <Link to="/register">Get started</Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      </footer>

      {/* Phone tab bar — replaces the top header on small screens */}
      <LandingBottomNav lenisRef={lenisRef} theme={theme} onToggleTheme={toggleTheme} />

      {/* First place entry popup: trophy, confetti, then back to normal */}
      {WINNER_EVENT.enabled && (
        <WinnerCelebration
          open={celebration.open}
          onClose={celebration.close}
          lenisRef={lenisRef}
        />
      )}
    </div>
  );
}