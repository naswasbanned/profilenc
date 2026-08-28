import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  ArrowRight,
  Globe,
  Code2,
  Gamepad2,
  BookOpen,
  Calendar as CalendarIcon,
  Layers,
  Cpu,
  User,
  Check,
  ChevronRight,
  Clock,
  Briefcase,
  ArrowUpRight,
  Plus,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import OptimizedImage from '../components/OptimizedImage/OptimizedImage';
import './LandingPage.css';

gsap.registerPlugin(ScrollTrigger);

const API_BASE = import.meta.env.VITE_API_URL || '';

// Clean, friendly showcase personas
const SHOWCASE_PERSONAS = [
  {
    id: 'dev',
    index: '01',
    role: 'SOFTWARE_ENGINEER',
    name: 'Alex Rivers',
    handle: '@alexrivers',
    location: 'BERLIN, DE',
    accentColor: '#00f0aa',
    bio: 'Frontend engineer building web apps, interactive components, and developer tools.',
    status: 'OPEN FOR WORK',
    tabs: ['SKILLS', 'EXPERIENCE', 'PROJECTS'],
    highlights: [
      { name: 'React', tag: 'UI' },
      { name: 'TypeScript', tag: 'LANG' },
      { name: 'Node.js', tag: 'BACKEND' },
      { name: 'Docker', tag: 'DEVOPS' },
    ],
    experience: {
      role: 'Frontend Architect',
      company: 'Vortex Labs',
      period: '2023 — Present',
      desc: 'Built fast interactive dashboards, responsive component systems, and web apps.',
    },
  },
  {
    id: 'artist',
    index: '02',
    role: 'UI_UX_DESIGNER',
    name: 'Elena Rostova',
    handle: '@elenadesign',
    location: 'TOKYO, JP',
    accentColor: '#ff5500',
    bio: 'Product designer creating websites, Figma prototypes, and 3D digital art.',
    status: 'AVAILABLE FOR FREELANCE',
    tabs: ['SERVICES', 'GALLERY', 'ABOUT'],
    service: {
      title: 'Website Design & Development',
      price: '$1,200',
      period: 'PROJECT',
      features: [
        'Custom UI/UX Design in Figma',
        'Interactive Mobile & Desktop Prototype',
        'Production Ready Web Development',
        'Direct Revisions & Hand-off',
      ],
    },
    galleryPhotos: [
      { title: 'Tokyo Neon Alley', tag: '3D Render' },
      { title: 'Abstract Glass Shapes', tag: 'UI Concept' },
    ],
  },
  {
    id: 'creator',
    index: '03',
    role: 'CONTENT_CREATOR',
    name: 'Kai Takahashi',
    handle: '@kaicodes',
    location: 'SAN FRANCISCO, CA',
    accentColor: '#ff2a5f',
    bio: 'Streaming live coding sessions, indie product builds, and video game reviews.',
    status: 'STREAMING TODAY',
    tabs: ['SCHEDULE', 'REVIEWS', 'GEAR'],
    event: {
      title: 'Live Coding: Building a Web App from Scratch',
      date: 'AUG 28',
      time: '19:00 UTC',
      status: 'UPCOMING STREAM',
      desc: 'Live tutorial covering React, animations, and clean CSS styling. Bring your questions!',
    },
    review: {
      title: 'Cyberpunk 2077: Phantom Liberty',
      rating: '5/5 STARS',
      notes: 'Incredible graphics, immersive city design, and deeply memorable story missions.',
    },
  },
  {
    id: 'writer',
    index: '04',
    role: 'ESSAYIST_&_WRITER',
    name: 'Marcus Vance',
    handle: '@marcusvance',
    location: 'LONDON, UK',
    accentColor: '#e8e6df',
    bio: 'Writing essays about technology, design philosophy, and simple digital tools.',
    status: 'NEW POST PUBLISHED',
    tabs: ['ARTICLES', 'READING LIST', 'SETUP'],
    journal: {
      title: 'Designing Websites That Stand the Test of Time',
      date: 'AUGUST 2026',
      readTime: '4 MIN READ',
      excerpt: 'Why clean typography, simplicity, and fast load times will always beat noisy visual trends on the web...',
    },
  },
];

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
      { type: 'NEW', text: 'Custom Profile URLs: Get your unique profile link at gnc.web.id/@yourname.' },
      { type: 'NEW', text: 'Visual Live Editor: Edit your profile blocks and see changes instantly in real-time.' },
    ],
  },
];

// Human-friendly block taxonomy
const MODULAR_BLOCKS = [
  { code: '01', name: 'HERO PROFILE', desc: 'Avatar, bio, social links, status badges, and action buttons in center or split layouts.' },
  { code: '02', name: 'SERVICES & RATES', desc: 'Pricing tier cards, deliverables checklist, turnaround time, and booking buttons.' },
  { code: '03', name: 'PHOTO GALLERY', desc: 'Responsive photo grids with aspect ratio control and a full-screen image viewer.' },
  { code: '04', name: 'EVENTS & CALENDAR', desc: 'Live stream badges and 1-click Google Calendar / Apple .ICS sync for events.' },
  { code: '05', name: 'JOURNAL & BLOG', desc: 'Rich markdown writer with live preview, word stats, and an elegant reader modal.' },
  { code: '06', name: 'EXPERIENCE & CAREER', desc: 'Milestones, company history, and multi-image project galleries.' },
  { code: '07', name: 'SKILLS & BADGES', desc: 'Categorized technology badges with brand icons and proficiency ratings.' },
  { code: '08', name: 'REVIEWS & FAVORITES', desc: 'Share your favorite games, movies, books, and anime with 5-star ratings.' },
  { code: '09', name: 'GEAR & SETUP', desc: 'Show off your computer hardware, desk setup, camera, and audio equipment.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [featuredProfiles, setFeaturedProfiles] = useState([]);

  const horizontalSectionRef = useRef(null);
  const horizontalTrackRef = useRef(null);
  const marquee1Ref = useRef(null);

  useEffect(() => {
    // 1. Lenis Smooth Scroll Integration
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

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

    // 3. Pinned Horizontal Showcase Slide
    const track = horizontalTrackRef.current;
    const horizontalSec = horizontalSectionRef.current;

    if (track && horizontalSec) {
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 80);

      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
      });

      ScrollTrigger.create({
        trigger: horizontalSec,
        start: 'top top',
        end: () => `+=${track.scrollWidth - window.innerWidth + 400}`,
        pin: true,
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true,
      });
    }

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerCb);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/templates/featured/profiles`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setFeaturedProfiles)
      .catch(() => {});
  }, []);

  return (
    <div className="landing-raw-root">
      {/* Background Structural Matrix Grid */}
      <div className="raw-grid-matrix" aria-hidden="true" />

      {/* Top Navbar */}
      <header className="raw-header">
        <div className="raw-header-container">
          <Link to="/" className="raw-brand">
            <span className="brand-bracket">[</span>
            <span className="brand-name">GNC.PROFILER</span>
            <span className="brand-bracket">]</span>
          </Link>

          <div className="raw-nav-actions">
            {isAuthenticated ? (
              <>
                <Link to={`/@${user.username}`} className="raw-btn-outline">
                  MY PROFILE
                </Link>
                <Link to={`/@${user.username}/edit`} className="raw-btn-solid">
                  STUDIO EDITOR <ArrowUpRight size={14} />
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="raw-btn-outline">
                  LOG IN
                </Link>
                <Link to="/register" className="raw-btn-solid">
                  GET STARTED <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="raw-hero-section">
        {/* Top Info Bar */}
        <div className="raw-hero-meta-bar">
          <div className="meta-col">
            <span className="meta-num">01</span>
            <span className="meta-txt">SIMPLE PERSONAL WEBSITE BUILDER</span>
          </div>
          <div className="meta-col right">
            <span className="meta-txt">EASY • MODULAR • NO CODE REQUIRED</span>
          </div>
        </div>

        {/* Masthead */}
        <div className="raw-masthead">
          <div className="masthead-line-wrap">
            <h1 className="masthead-title">CREATE YOUR</h1>
          </div>
          <div className="masthead-line-wrap">
            <h1 className="masthead-title outline-text">PERSONAL PAGE.</h1>
          </div>
        </div>

        {/* Sub-Manifesto & CTA Block */}
        <div className="raw-hero-manifesto-grid">
          <div className="manifesto-left">
            <p className="manifesto-lead">
              The easiest way to build a clean, customizable profile website.
              Choose your blocks, customize colors and fonts, and share your link with the world.
            </p>
            <div className="manifesto-actions">
              <button
                type="button"
                className="raw-cta-btn-primary"
                onClick={() => navigate(isAuthenticated ? `/@${user.username}/edit` : '/register')}
              >
                <span>{isAuthenticated ? 'OPEN STUDIO EDITOR' : 'CREATE YOUR PROFILE'}</span>
                <ArrowUpRight size={18} />
              </button>

              <a href="#showcase" className="raw-cta-btn-secondary">
                <span>SEE EXAMPLES</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div className="manifesto-right">
            <div className="spec-dossier-box">
              <div className="dossier-header">
                <span className="dossier-tag">YOUR PERSONAL LINK</span>
                <span className="dossier-indicator">FREE</span>
              </div>
              <div className="dossier-url-row">
                <span className="dossier-host">gnc.web.id/</span>
                <span className="dossier-user">@yourname</span>
              </div>
              <div className="dossier-footer">
                <span>EASY TO SHARE</span>
                <span>CUSTOMIZABLE BLOCKS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ENGINE PATCH NOTES & RELEASE TIMELINE SECTION */}
      <section className="raw-patch-notes-section">
        <div className="patch-notes-container">
          <div className="patch-notes-header">
            <div className="patch-badge">[ENGINE_UPDATES]</div>
            <h2 className="patch-title">WHAT'S NEW IN GNC PROFILER</h2>
            <p className="patch-desc">
              Changelog and latest features added to the profile builder.
            </p>
          </div>

          <div className="patch-timeline-ledger">
            {ENGINE_PATCH_NOTES.map((patch, pIdx) => (
              <div key={patch.version} className={`patch-node-card ${pIdx === 0 ? 'is-current' : ''}`}>
                <div className="patch-node-sidebar">
                  <div className="patch-ver-box">
                    <span className="patch-ver-num">{patch.version}</span>
                    <span className="patch-ver-tag">{patch.status}</span>
                  </div>
                  <div className="patch-timestamp">
                    <span>RELEASE: {patch.date}</span>
                    <span>TITLE: {patch.codename}</span>
                  </div>
                </div>

                <div className="patch-node-content">
                  <h3 className="patch-node-headline">{patch.title}</h3>
                  <div className="patch-changes-list">
                    {patch.changes.map((c, cIdx) => (
                      <div key={cIdx} className="patch-change-item">
                        <span className={`change-tag ${c.type.toLowerCase()}`}>[{c.type}]</span>
                        <span className="change-text">{c.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTINUOUS INDUSTRIAL MARQUEE */}
      <section className="raw-marquee-section">
        <div className="marquee-track-wrap">
          <div ref={marquee1Ref} className="marquee-track left-stream">
            <span>CREATE YOUR PROFILE // 10 MODULAR BLOCKS // NO CODING REQUIRED // SHARE ANYWHERE //</span>
            <span>CREATE YOUR PROFILE // 10 MODULAR BLOCKS // NO CODING REQUIRED // SHARE ANYWHERE //</span>
          </div>
        </div>
      </section>

      {/* HORIZONTAL SHOWCASE SECTION */}
      <section id="showcase" ref={horizontalSectionRef} className="raw-showcase-section">
        <div className="raw-showcase-topbar">
          <div className="showcase-index-tag">
            <span className="tag-bracket">[</span>
            <span>SECTION: SHOWCASE</span>
            <span className="tag-bracket">]</span>
          </div>
          <h2 className="showcase-heading">TEMPLATE SHOWCASE</h2>
          <div className="showcase-scroll-hint">
            <span>SCROLL TO SEE MORE</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* Horizontal Sliding Track */}
        <div className="raw-track-viewport">
          <div ref={horizontalTrackRef} className="raw-specimen-track">
            {SHOWCASE_PERSONAS.map((p) => (
              <div
                key={p.id}
                className="specimen-card"
                style={{ '--accent': p.accentColor }}
              >
                {/* Card Header */}
                <div className="specimen-card-header">
                  <div className="specimen-meta-left">
                    <span className="specimen-index">EXAMPLE {p.index}</span>
                    <span className="specimen-role">{p.role}</span>
                  </div>
                  <div className="specimen-location">{p.location}</div>
                </div>

                {/* Core Canvas */}
                <div className="specimen-inner-canvas">
                  <div className="specimen-masthead">
                    <div className="specimen-identity">
                      <h3 className="specimen-name">{p.name}</h3>
                      <div className="specimen-handle">{p.handle}</div>
                    </div>
                    <div className="specimen-status-badge">
                      <span className="status-ping" />
                      <span>{p.status}</span>
                    </div>
                  </div>

                  <p className="specimen-bio">{p.bio}</p>

                  {/* Persona Specific Content */}
                  {p.id === 'dev' && (
                    <div className="specimen-body-grid">
                      <div className="specimen-block-box">
                        <div className="block-box-title">SKILLS & TOOLS</div>
                        <div className="specimen-pills-row">
                          {p.highlights.map((h, hIdx) => (
                            <span key={hIdx} className="specimen-pill">
                              <strong>{h.name}</strong> <small>[{h.tag}]</small>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="specimen-block-box">
                        <div className="block-box-title">WORK EXPERIENCE</div>
                        <div className="specimen-role-title">{p.experience.role}</div>
                        <div className="specimen-company">{p.experience.company} • {p.experience.period}</div>
                        <p className="specimen-desc">{p.experience.desc}</p>
                      </div>
                    </div>
                  )}

                  {p.id === 'artist' && (
                    <div className="specimen-body-grid">
                      <div className="specimen-block-box accent-border">
                        <div className="block-box-title">SERVICES & RATES</div>
                        <div className="specimen-service-title">{p.service.title}</div>
                        <div className="specimen-price">{p.service.price} <small>/ {p.service.period}</small></div>
                        <ul className="specimen-checklist">
                          {p.service.features.map((f, fIdx) => (
                            <li key={fIdx}><Plus size={11} color="var(--accent)" /> {f}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="specimen-block-box">
                        <div className="block-box-title">PHOTO GALLERY</div>
                        <div className="specimen-gallery-grid">
                          {p.galleryPhotos.map((g, gIdx) => (
                            <div key={gIdx} className="gallery-box-item">
                              <span className="g-title">{g.title}</span>
                              <span className="g-tag">{g.tag}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {p.id === 'creator' && (
                    <div className="specimen-body-grid">
                      <div className="specimen-block-box live-box">
                        <div className="block-box-title live-title">
                          <span className="live-dot-pulse" /> LIVE STREAM SCHEDULE
                        </div>
                        <div className="specimen-event-title">{p.event.title}</div>
                        <div className="specimen-event-meta">{p.event.date} • {p.event.time}</div>
                        <p className="specimen-desc">{p.event.desc}</p>
                        <div className="specimen-cal-tag">✓ 1-Click Google Calendar Sync</div>
                      </div>

                      <div className="specimen-block-box">
                        <div className="block-box-title">RECENT REVIEW</div>
                        <div className="specimen-role-title">{p.review.title}</div>
                        <div className="specimen-rating">RATING: {p.review.rating}</div>
                        <p className="specimen-desc">{p.review.notes}</p>
                      </div>
                    </div>
                  )}

                  {p.id === 'writer' && (
                    <div className="specimen-body-grid single-col">
                      <div className="specimen-block-box journal-box">
                        <div className="journal-header-row">
                          <span>{p.journal.date}</span>
                          <span>{p.journal.readTime}</span>
                        </div>
                        <div className="specimen-journal-title">{p.journal.title}</div>
                        <p className="specimen-journal-excerpt">{p.journal.excerpt}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="specimen-card-footer">
                  <span className="footer-code">PROFILE PREVIEW</span>
                  <span className="footer-link">gnc.web.id/{p.handle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9-BLOCK CATALOG */}
      <section id="blocks" className="raw-catalog-section">
        <div className="raw-catalog-container">
          <div className="catalog-header">
            <span className="catalog-badge">[AVAILABLE_BLOCKS]</span>
            <h2 className="catalog-title">CHOOSE FROM 10 MODULAR BLOCKS</h2>
            <p className="catalog-sub">
              Mix and match any blocks to create the perfect page for your portfolio, freelance work, or hobbies.
            </p>
          </div>

          <div className="catalog-spec-grid">
            {MODULAR_BLOCKS.map((m) => (
              <div key={m.code} className="catalog-item-card">
                <div className="catalog-item-top">
                  <span className="item-code">[{m.code}]</span>
                  <span className="item-name">{m.name}</span>
                </div>
                <p className="item-desc">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY REGISTRY */}
      {featuredProfiles.length > 0 && (
        <section className="raw-community-section">
          <div className="raw-catalog-container">
            <div className="catalog-header">
              <span className="catalog-badge">[COMMUNITY]</span>
              <h2 className="catalog-title">PROFILES MADE BY CREATORS</h2>
            </div>

            <div className="raw-community-grid">
              {featuredProfiles.map((p) => (
                <Link
                  key={p.username}
                  to={`/@${p.username}`}
                  className="raw-profile-link-card"
                >
                  <div className="profile-num-col">
                    <span className="avatar-init">{(p.displayName || p.username)[0].toUpperCase()}</span>
                  </div>
                  <div className="profile-detail-col">
                    <div className="profile-p-name">{p.displayName || p.username}</div>
                    <div className="profile-p-handle">@{p.username}</div>
                    {p.bio && <p className="profile-p-bio">{p.bio}</p>}
                  </div>
                  <ArrowUpRight size={18} className="profile-p-arrow" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA SECTION */}
      <section className="raw-cta-section">
        <div className="raw-cta-container">
          <div className="raw-cta-box">
            <div className="cta-meta-tag">[GET_STARTED]</div>
            <h2 className="cta-big-title">READY TO BUILD YOUR PAGE?</h2>
            <p className="cta-text">
              Create a clean, customizable personal page in minutes. It's free and easy to set up.
            </p>
            <div className="cta-action-wrap">
              <button
                type="button"
                className="raw-cta-btn-primary big"
                onClick={() => navigate(isAuthenticated ? `/@${user.username}/edit` : '/register')}
              >
                <span>{isAuthenticated ? 'OPEN STUDIO EDITOR' : 'START BUILDING NOW'}</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="raw-footer">
        <div className="raw-footer-container">
          <div className="footer-left">
            <span className="footer-logo">GNC.PROFILER</span>
            <span className="footer-copy">// SIMPLE & MODULAR PERSONAL PROFILES</span>
          </div>
          <div className="footer-right">
            <span>© 2026 GNC — FREE & OPEN.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
