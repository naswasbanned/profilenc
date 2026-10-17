import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Folder, LayoutDashboard, Settings } from 'lucide-react';
import BlockRenderer from '../Blocks/BlockRenderer';
import ProfileBackgroundLayer from './ProfileBackgroundLayer';
import AccountSettingsModal from '../Editor/AccountSettingsModal';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { getIcon, isIconDisabled } from '../../lib/icons';
import { getCanvasBackground, getCanvasStyleAttributes } from '../../lib/canvasStyle';
import { resolveNav } from '../../lib/navStyle';
import { isTabEmpty } from '../../lib/blockEmpty';
import { clickTarget, track } from '../../lib/stats';
import '../../styles/app.css';
import '../Blocks/Blocks.css';

function renderTabIcon(icon) {
  if (isIconDisabled(icon)) return null;
  const IconComponent = icon ? getIcon(icon) : Folder;
  if (!IconComponent) return null;
  return <IconComponent size={14} />;
}

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

function ProfileTabsNav({ tabs, currentTabId, onSelectTab, isEditing, navBackground, navAttrs }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();
    window.addEventListener('resize', checkScroll);
    el.addEventListener('scroll', checkScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', checkScroll);
      el.removeEventListener('scroll', checkScroll);
    };
  }, [checkScroll, tabs]);

  // Center active tab on mount or change
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const activeBtn = el.querySelector('.profile-tab-btn.active');
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentTabId]);

  const handleScroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 220, behavior: 'smooth' });
  };

  const handleWheel = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
    }
  };

  return (
    <nav
      className="profile-tabs-nav"
      {...navAttrs}
      style={{
        top: isEditing ? '58px' : 0,
        backgroundColor: navBackground || undefined,
      }}
    >
      <div className="profile-tabs-nav-container">
        {canScrollLeft && (
          <button
            type="button"
            className="profile-tab-arrow profile-tab-arrow-left"
            onClick={() => handleScroll(-1)}
            aria-label="Scroll tabs left"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        <div
          ref={scrollRef}
          className={`profile-tabs-scroll ${canScrollLeft ? 'has-scroll-left' : ''} ${canScrollRight ? 'has-scroll-right' : ''}`}
          onWheel={handleWheel}
        >
          {tabs.map((tab) => {
            const isActive = tab.id === currentTabId;
            const tabIcon = renderTabIcon(tab.icon);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`profile-tab-btn ${isActive ? 'active' : ''}`}
              >
                {tabIcon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {canScrollRight && (
          <button
            type="button"
            className="profile-tab-arrow profile-tab-arrow-right"
            onClick={() => handleScroll(1)}
            aria-label="Scroll tabs right"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </nav>
  );
}

export default function ProfileCanvas({
  username,
  content,
  isEditing = false,
  activeTabId,
  setActiveTabId,
  onEditBlock,
  onMoveBlock,
  onDeleteBlock,
  onUpdateBlock,
}) {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { theme } = useTheme();
  const isOwner = authUser?.username?.toLowerCase() === username?.toLowerCase();
  const [showAccountSettings, setShowAccountSettings] = useState(false);

  // Visitors skip tabs with nothing to show; the editor keeps every tab so it can be filled
  const tabs = (content?.tabs || []).filter((t) => t.enabled !== false && (isEditing || !isTabEmpty(t)));
  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const blocks = currentTab?.blocks || [];

  // Shared with the editor preview so a block looks the same in both places
  const canvasAttributes = getCanvasStyleAttributes(theme);
  const background = getCanvasBackground(theme, currentTab?.id);

  const tabBgColor = background.backgroundColor;
  const tabBgGradient = background.backgroundGradient;
  const tabNavBg = background.tabNavBackground;

  return (
    <div
      className="app"
      {...canvasAttributes}
      onClickCapture={isEditing || isOwner ? undefined : (e) => {
        const target = clickTarget(e.target);
        if (target) track(username, 'click', target);
      }}
      style={{
        backgroundColor: tabBgColor,
        backgroundImage: tabBgGradient || undefined,
        minHeight: isEditing ? 'calc(100vh - 58px)' : '100vh',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background-color 0.35s ease, background-image 0.35s ease',
      }}
    >
      {/* Custom Background Image Layer with Glass Effect */}
      <ProfileBackgroundLayer background={background} />

      {/* Settings + Edit FABs for profile owner */}
      {isOwner && !isEditing && (
        <div className="profile-fab-stack">
          <Link to="/dashboard" className="profile-settings-fab" title="Back to your dashboard">
            <LayoutDashboard size={15} />
            Dashboard
          </Link>
          <button
            type="button"
            className="profile-settings-fab"
            onClick={() => setShowAccountSettings(true)}
            title="Profile Settings & Logout"
          >
            <Settings size={15} />
            Settings
          </button>
          <button
            type="button"
            className="profile-edit-fab"
            onClick={() => navigate(`/@${username}/edit`)}
            title="Open Visual Editor"
          >
            Edit Profile
          </button>
        </div>
      )}

      {/* Account Settings Modal (accessible from profile view) */}
      <AnimatePresence>
        {isOwner && showAccountSettings && (
          <AccountSettingsModal
            onClose={() => setShowAccountSettings(false)}
            onUsernameChanged={(newUsername) => {
              setShowAccountSettings(false);
              if (newUsername && newUsername !== username) {
                navigate(`/@${newUsername}`, { replace: true });
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Dynamic Tab Navigation Bar (if more than 1 tab) */}
      {tabs.length > 1 && (
        <ProfileTabsNav
          tabs={tabs}
          currentTabId={currentTab?.id}
          onSelectTab={setActiveTabId}
          isEditing={isEditing}
          navBackground={tabNavBg}
          navAttrs={resolveNav(theme).attrs}
        />
      )}

      {/* Blocks Canvas */}
      <main
        className={`profile-canvas-main ${isEditing ? 'is-editing' : ''}`}
        style={{ flex: 1, minHeight: '50vh', padding: isEditing ? '36px 0 40px' : '20px 0 40px' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab?.id || 'main'}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {blocks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
                <p style={{ fontSize: '1.05rem', marginBottom: '8px' }}>
                  {isEditing ? 'This tab is currently empty.' : 'Nothing here yet.'}
                </p>
                {isEditing && (
                  <p style={{ fontSize: '0.85rem', color: '#888' }}>
                    Click <strong>"+ Add Block"</strong> in the top toolbar to insert content.
                  </p>
                )}
              </div>
            ) : (
              blocks.map((block, idx) => (
                <BlockRenderer
                  key={block.id || idx}
                  block={block}
                  index={idx}
                  totalBlocks={blocks.length}
                  isEditing={isEditing}
                  onEditBlock={onEditBlock}
                  onMoveBlock={onMoveBlock}
                  onDeleteBlock={onDeleteBlock}
                  onUpdateBlock={onUpdateBlock}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Profile Footer */}
      <footer className="app-footer dev">
        <p>© {new Date().getFullYear()} {username}</p>
        <Link to="/" className="app-footer-brand">
          <img src="/logo.svg" alt="" />
          Made with Profilenc
        </Link>
      </footer>
    </div>
  );
}
