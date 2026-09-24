import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  LayoutGrid,
  LogIn,
  LogOut,
  MessageSquare,
  Moon,
  Shield,
  Sparkles,
  Sun,
  User,
  UserPlus,
  Users,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './LandingBottomNav.css';

/**
 * Phone-style bottom tab bar for the landing page.
 *
 * Three section tabs, a raised brand button that returns to the top, and an
 * account tab that opens a bottom sheet with the actions that used to live in
 * the top header (log in, profile, studio editor, admin, appearance, feedback).
 * Hidden from 769px up, where the top header takes over.
 */

const SECTION_TABS = [
  { id: 'updates', label: 'Updates', Icon: Bell },
  { id: 'showcase', label: 'Showcase', Icon: LayoutGrid },
  { id: 'community', label: 'People', Icon: Users },
];

const TAP = { scale: 0.9 };

export default function LandingBottomNav({ lenisRef, theme, onToggleTheme }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeId, setActiveId] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Track which section fills the middle of the viewport.
  useEffect(() => {
    let intersectionObserver = null;
    let observedKey = '';
    // id -> intersection ratio, 0 when the section left the middle band
    const visibility = new Map();

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      let bestId = null;
      let bestRatio = 0;
      visibility.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      });

      // Null clears the highlight once every tracked section is out of the band,
      // for example after scrolling past the community list.
      setActiveId(bestId);
    };

    const attach = () => {
      const sections = SECTION_TABS
        .map(({ id }) => document.getElementById(id))
        .filter(Boolean);

      const key = sections.map((section) => section.id).join(',');
      if (key === observedKey) return;
      observedKey = key;

      intersectionObserver?.disconnect();
      visibility.clear();
      if (sections.length === 0) return;

      intersectionObserver = new IntersectionObserver(handleIntersect, {
        rootMargin: '-45% 0px -45% 0px',
        threshold: [0, 0.05, 0.2, 0.5, 1],
      });
      sections.forEach((section) => intersectionObserver.observe(section));
    };

    attach();

    // The community section only renders once its featured profiles arrive, so
    // watch for late mounts and observe them when they appear.
    const mutationObserver = new MutationObserver(attach);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      intersectionObserver?.disconnect();
    };
  }, []);

  // Lock the page while the sheet is open.
  useEffect(() => {
    if (!sheetOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [sheetOpen]);

  const scrollTo = (target) => {
    // Lenis owns the scroll position on pointer devices, so ask it first and
    // fall back to the native scroll on touch (where Lenis stays passive).
    const lenis = lenisRef?.current;
    if (lenis) {
      lenis.scrollTo(target, { offset: -8, duration: 0.9 });
      return;
    }
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) scrollTo(target);
  };

  const scrollToTop = () => {
    setActiveId(null);
    scrollTo(0);
  };

  const openFeedback = () => {
    setSheetOpen(false);
    scrollToSection('feedback');
  };

  const renderTab = (tab) => {
    const { id, label } = tab;
    const TabIcon = tab.Icon;
    const isActive = activeId === id && !sheetOpen;
    return (
      <motion.button
        key={id}
        type="button"
        className={`fn-dock-tab ${isActive ? 'is-active' : ''}`}
        onClick={() => {
          setSheetOpen(false);
          scrollToSection(id);
        }}
        whileTap={TAP}
        aria-label={label}
        aria-current={isActive ? 'true' : undefined}
      >
        {isActive && (
          <motion.span
            layoutId="fn-dock-active-pill"
            className="fn-dock-active-pill"
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          />
        )}
        <span className="fn-dock-tab-inner">
          <TabIcon size={19} />
          <span className="fn-dock-tab-label">{label}</span>
        </span>
      </motion.button>
    );
  };

  return (
    <>
      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            className="fn-sheet-backdrop"
            onClick={() => setSheetOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <motion.div
              className="fn-sheet"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.4 }}
              onDragEnd={(_event, info) => {
                if (info.offset.y > 90) setSheetOpen(false);
              }}
            >
              <span className="fn-sheet-grabber" aria-hidden="true" />

              {isAuthenticated ? (
                <>
                  <p className="fn-sheet-title">@{user.username}</p>
                  <Link
                    to={`/@${user.username}`}
                    className="fn-sheet-row"
                    onClick={() => setSheetOpen(false)}
                  >
                    <User size={17} />
                    <span>My profile</span>
                  </Link>
                  <Link
                    to={`/@${user.username}/edit`}
                    className="fn-sheet-row is-primary"
                    onClick={() => setSheetOpen(false)}
                  >
                    <Sparkles size={17} />
                    <span>Studio editor</span>
                  </Link>
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      className="fn-sheet-row"
                      onClick={() => setSheetOpen(false)}
                    >
                      <Shield size={17} />
                      <span>Admin kernel</span>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <p className="fn-sheet-title">Account</p>
                  <Link
                    to="/register"
                    className="fn-sheet-row is-primary"
                    onClick={() => setSheetOpen(false)}
                  >
                    <UserPlus size={17} />
                    <span>Get started</span>
                  </Link>
                  <Link
                    to="/login"
                    className="fn-sheet-row"
                    onClick={() => setSheetOpen(false)}
                  >
                    <LogIn size={17} />
                    <span>Log in</span>
                  </Link>
                </>
              )}

              <span className="fn-sheet-divider" aria-hidden="true" />

              <button type="button" className="fn-sheet-row" onClick={openFeedback}>
                <MessageSquare size={17} />
                <span>Send feedback</span>
              </button>

              <button
                type="button"
                className="fn-sheet-row"
                onClick={(event) => onToggleTheme?.(event)}
              >
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                <span>{theme === 'dark' ? 'Light appearance' : 'Dark appearance'}</span>
              </button>

              {isAuthenticated && (
                <button
                  type="button"
                  className="fn-sheet-row is-danger"
                  onClick={() => {
                    setSheetOpen(false);
                    logout();
                  }}
                >
                  <LogOut size={17} />
                  <span>Log out</span>
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.nav
        className="fn-dock"
        aria-label="Section navigation"
        initial={{ y: 110, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.25 }}
      >
        <div className="fn-dock-bar">
          {SECTION_TABS.slice(0, 2).map(renderTab)}

          {/* The raise lives on this wrapper: framer-motion writes its own
              transform on the button while tapping, which would drop a
              translateY set in CSS. */}
          <span className="fn-dock-brand-slot">
            <motion.button
              type="button"
              className="fn-dock-brand"
              onClick={scrollToTop}
              whileTap={{ scale: 0.92 }}
              aria-label="Back to top"
            >
              <img src="/logo.svg" alt="" aria-hidden="true" />
            </motion.button>
          </span>

          {SECTION_TABS.slice(2).map(renderTab)}

          <motion.button
            type="button"
            className={`fn-dock-tab ${sheetOpen ? 'is-active' : ''}`}
            onClick={() => setSheetOpen((open) => !open)}
            whileTap={TAP}
            aria-label="Account and settings"
            aria-expanded={sheetOpen}
          >
            {sheetOpen && (
              <motion.span
                layoutId="fn-dock-active-pill"
                className="fn-dock-active-pill"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <span className="fn-dock-tab-inner">
              {isAuthenticated && user?.avatarUrl ? (
                <img className="fn-dock-avatar" src={user.avatarUrl} alt="" aria-hidden="true" />
              ) : (
                <User size={19} />
              )}
              <span className="fn-dock-tab-label">
                {isAuthenticated ? 'You' : 'Account'}
              </span>
            </span>
          </motion.button>
        </div>
      </motion.nav>
    </>
  );
}
