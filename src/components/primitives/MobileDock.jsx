import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './MobileDock.css';

/**
 * Phone bottom dock, the same shape the landing page uses: a floating pill with
 * a raised brand button in the middle. Hidden from 769px up, where each page
 * keeps its own header.
 *
 * On phones this dock is the only navigation a page has, so it carries two
 * layers:
 *   - `items`: up to four primary destinations or tab switches, always visible.
 *   - `sheet`: the secondary header actions (appearance, log out, cross links),
 *     in a drag dismissible bottom sheet opened by the raised brand button.
 *
 * Items are plain actions, so a page can use the dock for tab switching,
 * navigation, or opening a modal.
 *
 * @param {Array<{id: string, label: string, Icon: Function, active?: boolean,
 *                badge?: number|string, onClick: Function}>} items
 *        Four items read best: two land either side of the brand button.
 * @param {{label: string, Icon?: Function, onClick?: Function}} brand  Raised
 *        middle button. With `sheet` set and no `onClick`, it opens the sheet.
 *        `Icon` replaces the logo, so a sheet trigger can read as a gear.
 * @param {{title?: string, rows: Array<{id: string, label: string, Icon: Function,
 *          to?: string, href?: string, target?: string, onClick?: Function,
 *          variant?: 'primary'|'danger', keepOpen?: boolean}>}} [sheet]
 * @param {string} [ariaLabel]
 */
export default function MobileDock({ items = [], brand, sheet, ariaLabel = 'Quick navigation' }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const hasSheet = Boolean(sheet?.rows?.length);
  const sheetIsOpen = hasSheet && sheetOpen;

  // Lock the page and allow Escape while the sheet is open.
  useEffect(() => {
    if (!sheetIsOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSheetOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sheetIsOpen]);

  const half = Math.ceil(items.length / 2);
  const left = items.slice(0, half);
  const right = items.slice(half);

  const closeSheet = () => setSheetOpen(false);

  const renderItem = (item) => {
    const ItemIcon = item.Icon;
    // The sheet owns the highlight while it is open, so no tab reads as active.
    const isActive = item.active && !sheetIsOpen;
    return (
      <motion.button
        key={item.id}
        type="button"
        className={`app-dock-tab ${isActive ? 'is-active' : ''}`}
        onClick={() => {
          closeSheet();
          item.onClick?.();
        }}
        whileTap={{ scale: 0.9 }}
        aria-label={item.label}
        aria-current={isActive ? 'true' : undefined}
      >
        {isActive && (
          <motion.span
            layoutId="app-dock-active-pill"
            className="app-dock-active-pill"
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          />
        )}
        <span className="app-dock-tab-inner">
          <span className="app-dock-tab-icon">
            <ItemIcon size={19} />
            {Boolean(item.badge) && <span className="app-dock-badge">{item.badge}</span>}
          </span>
          <span className="app-dock-tab-label">{item.label}</span>
        </span>
      </motion.button>
    );
  };

  const renderSheetRow = (row) => {
    const RowIcon = row.Icon;
    const className = [
      'app-sheet-row',
      row.variant === 'primary' ? 'is-primary' : '',
      row.variant === 'danger' ? 'is-danger' : '',
    ].filter(Boolean).join(' ');

    const handleClick = (event) => {
      if (!row.keepOpen) closeSheet();
      row.onClick?.(event);
    };

    const body = (
      <>
        <RowIcon size={17} />
        <span>{row.label}</span>
      </>
    );

    if (row.to) {
      return (
        <Link key={row.id} to={row.to} target={row.target} className={className} onClick={handleClick}>
          {body}
        </Link>
      );
    }

    if (row.href) {
      return (
        <a
          key={row.id}
          href={row.href}
          target={row.target}
          rel={row.target === '_blank' ? 'noreferrer' : undefined}
          className={className}
          onClick={handleClick}
        >
          {body}
        </a>
      );
    }

    return (
      <button key={row.id} type="button" className={className} onClick={handleClick}>
        {body}
      </button>
    );
  };

  return (
    <>
      <AnimatePresence>
        {sheetIsOpen && (
          <motion.div
            className="app-sheet-backdrop"
            onClick={closeSheet}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <motion.div
              className="app-sheet"
              role="dialog"
              aria-modal="true"
              aria-label={sheet.title || 'More actions'}
              onClick={(event) => event.stopPropagation()}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.4 }}
              onDragEnd={(_event, info) => {
                if (info.offset.y > 90) closeSheet();
              }}
            >
              <span className="app-sheet-grabber" aria-hidden="true" />
              {sheet.title && <p className="app-sheet-title">{sheet.title}</p>}
              {sheet.rows.map(renderSheetRow)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.nav
        className="app-dock"
        aria-label={ariaLabel}
        initial={{ y: 110, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.2 }}
      >
        <div className="app-dock-bar" style={{ gridTemplateColumns: `repeat(${items.length + 1}, 1fr)` }}>
          {left.map(renderItem)}

          {/* The raise lives on the wrapper: framer-motion writes its own
              transform on the button while tapping, which would drop a
              translateY set in CSS. */}
          {brand && (
            <span className="app-dock-brand-slot">
              <motion.button
                type="button"
                className={`app-dock-brand ${sheetIsOpen ? 'is-open' : ''}`}
                onClick={() => {
                  if (brand.onClick) {
                    closeSheet();
                    brand.onClick();
                    return;
                  }
                  if (hasSheet) setSheetOpen((open) => !open);
                }}
                whileTap={{ scale: 0.92 }}
                aria-label={brand.label}
                title={brand.label}
                aria-expanded={hasSheet && !brand.onClick ? sheetIsOpen : undefined}
              >
                {brand.Icon ? (
                  <brand.Icon size={24} strokeWidth={2.2} />
                ) : (
                  <img src="/logo.svg" alt="" aria-hidden="true" />
                )}
              </motion.button>
            </span>
          )}

          {right.map(renderItem)}
        </div>
      </motion.nav>
    </>
  );
}
