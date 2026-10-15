import { Loader2, RefreshCw, Search, SquarePen } from 'lucide-react';
import InboxMessageList from './InboxMessageList';
import { INBOX_FILTERS as FILTERS } from '../../lib/inbox';

const EMPTY_TEXT = {
  NEW: 'No new messages.',
  ALL: 'Your inbox is empty.',
  ARCHIVED: 'No archived messages.',
};

export default function InboxSidebar({
  filter,
  onFilterChange,
  filterText,
  onFilterText,
  items,
  visibleItems,
  selectedId,
  onOpen,
  loadError,
  banner,
  sentNote,
  hasMore,
  loadingMore,
  onLoadMore,
  onRefresh,
  refreshing,
  composeOpen,
  hasDraft,
  onNew,
  newButtonRef,
}) {
  const loading = items === null;
  const filteredOut = !loading && items.length > 0 && visibleItems.length === 0;

  return (
    <aside className="inbox-sidebar" aria-label="Inbox">
      <div className="inbox-sidebar-top">
        <button
          type="button"
          className="dash-btn-primary inbox-new-btn"
          onClick={onNew}
          aria-pressed={composeOpen}
          ref={newButtonRef}
        >
          <SquarePen size={16} aria-hidden="true" />
          <span>NEW MESSAGE</span>
          {hasDraft && (
            <>
              <span className="inbox-draft-dot" aria-hidden="true" />
              <span className="dash-visually-hidden">Draft in progress</span>
            </>
          )}
        </button>

        <div role="status">
          {sentNote && <p className="inbox-feedback success">{sentNote}</p>}
        </div>

        <div className="inbox-filter-row">
          <div className="inbox-toolbar" role="group" aria-label="Filter messages">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className="inbox-filter-btn"
                aria-pressed={filter === f.id}
                onClick={() => onFilterChange(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="inbox-icon-btn"
            onClick={onRefresh}
            disabled={refreshing || loading}
            aria-label="Refresh messages"
            title="Refresh"
          >
            <RefreshCw size={15} className={refreshing ? 'spin' : undefined} aria-hidden="true" />
          </button>
        </div>

        <div className="inbox-search">
          <Search size={14} aria-hidden="true" />
          <input
            type="search"
            className="inbox-search-input"
            value={filterText}
            onChange={(e) => onFilterText(e.target.value)}
            placeholder="Filter loaded messages"
            aria-label="Filter loaded messages"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="inbox-list-scroll">
        {banner && (
          <p className="inbox-feedback error inbox-banner" role="alert">
            {banner}
          </p>
        )}
        {loadError && (
          <p className="inbox-feedback error inbox-banner" role="alert">
            {loadError}
          </p>
        )}

        {loading && (
          <div className="inbox-skeleton" role="status" aria-label="Loading messages">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="inbox-skeleton-row" aria-hidden="true">
                <span className="inbox-skeleton-line short" />
                <span className="inbox-skeleton-line" />
                <span className="inbox-skeleton-line" />
              </div>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && !loadError && (
          <p className="inbox-empty-note">{EMPTY_TEXT[filter]}</p>
        )}
        {filteredOut && <p className="inbox-empty-note">No loaded messages match your filter.</p>}

        {!loading && visibleItems.length > 0 && (
          <InboxMessageList
            items={visibleItems}
            selectedId={selectedId}
            onOpen={onOpen}
            label="Messages"
          />
        )}

        {!loading && hasMore && (
          <div className="inbox-more">
            <button
              type="button"
              className="inbox-action-btn"
              onClick={onLoadMore}
              disabled={loadingMore}
            >
              {loadingMore && <Loader2 size={13} className="spin" aria-hidden="true" />}
              <span>{loadingMore ? 'Loading' : 'Load more'}</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
