import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '../../lib/api';
import {
  filterLoaded,
  mergeById,
  nextSelectionAfterRemoval,
  normalizeRecipient,
  unreadDelta,
} from '../../lib/inbox';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import InboxSidebar from './InboxSidebar';
import InboxReader from './InboxReader';
import InboxCompose, { MAX_LENGTH } from './InboxCompose';

const PAGE_SIZE = 20;

async function readError(res, fallback) {
  try {
    const data = await res.json();
    return data?.error || fallback;
  } catch {
    return fallback;
  }
}

/**
 * Dashboard inbox: an Outlook style two-pane mail client (list on the left, reader or
 * compose form on the right). It owns its data and renders its own loading, empty and
 * error states, so the parent mounts it unconditionally and it never uses motion.*
 * (see AGENTS.md, Framer Motion data-gating rule).
 */
export default function InboxSection({ onUnreadChange }) {
  const isDesktop = useMediaQuery('(min-width: 900px)');

  const [filter, setFilter] = useState('NEW');
  const [filterText, setFilterText] = useState('');
  const [items, setItems] = useState(null); // null while loading
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loadError, setLoadError] = useState('');
  const [banner, setBanner] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const [selectedId, setSelectedId] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [draft, setDraft] = useState({ to: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sentNote, setSentNote] = useState('');

  const loadId = useRef(0);
  const newButtonRef = useRef(null);

  const refreshUnread = useCallback(async () => {
    try {
      const res = await apiFetch('/api/inbox/unread-count');
      if (!res.ok) return;
      const data = await res.json();
      if (onUnreadChange) onUnreadChange(Number(data.unread) || 0);
    } catch {
      /* the badge keeps its previous value */
    }
  }, [onUnreadChange]);

  const adjustUnread = useCallback(
    (delta) => {
      if (!delta || !onUnreadChange) return;
      // The parent state can be null/false while loading or after a failure: leave it alone then.
      onUnreadChange((prev) => (typeof prev === 'number' ? Math.max(0, prev + delta) : prev));
    },
    [onUnreadChange]
  );

  const load = useCallback(
    async ({ pageToLoad = 1, append = false } = {}) => {
      const myId = ++loadId.current;
      const params = new URLSearchParams({ page: String(pageToLoad), limit: String(PAGE_SIZE) });
      if (filter === 'NEW') params.set('status', 'NEW');
      if (filter === 'ARCHIVED') params.set('status', 'ARCHIVED');
      try {
        const res = await apiFetch(`/api/inbox?${params.toString()}`);
        if (!res.ok) throw new Error(await readError(res, 'Could not load your inbox.'));
        const data = await res.json();
        if (myId !== loadId.current) return;
        const incoming = Array.isArray(data.items) ? data.items : [];
        setItems((prev) => (append ? mergeById(prev, incoming) : incoming));
        setTotal(Number(data.total) || 0);
        setPage(pageToLoad);
        setLoadError('');
      } catch (err) {
        if (myId !== loadId.current) return;
        setLoadError(err.message || 'Could not load your inbox.');
        setItems((prev) => prev ?? []);
      } finally {
        if (myId === loadId.current) {
          setLoadingMore(false);
          setRefreshing(false);
        }
      }
    },
    [filter]
  );

  useEffect(() => {
    load();
  }, [load]);

  const changeFilter = (next) => {
    if (next === filter) return;
    setFilter(next);
    setItems(null);
    setTotal(0);
    setPage(1);
    setSelectedId(null);
    setLoadError('');
    setBanner('');
  };

  const loadMore = () => {
    setLoadingMore(true);
    load({ pageToLoad: page + 1, append: true });
  };

  const refresh = () => {
    setRefreshing(true);
    setBanner('');
    load();
  };

  // --- Mutations (optimistic with rollback) -------------------------------------------

  const restoreItem = (original, index, selectedBefore) => {
    setItems((prev) => {
      if (!prev) return prev;
      if (prev.some((x) => x.id === original.id)) {
        return prev.map((x) => (x.id === original.id ? original : x));
      }
      const copy = prev.slice();
      copy.splice(Math.min(index, copy.length), 0, original);
      return copy;
    });
    if (selectedBefore) setSelectedId(original.id);
  };

  const removeLocally = (m) => {
    const wasSelected = selectedId === m.id;
    if (wasSelected) {
      setSelectedId(isDesktop ? nextSelectionAfterRemoval(items, m.id) : null);
    }
    setItems((prev) => (prev ? prev.filter((x) => x.id !== m.id) : prev));
    setTotal((t) => Math.max(0, t - 1));
    return wasSelected;
  };

  const setStatus = async (m, next) => {
    if (!m || m.status === next) return;
    const delta = unreadDelta(m.status, next);
    const index = items ? items.findIndex((x) => x.id === m.id) : -1;
    const leavesList = filter === 'ARCHIVED' ? next !== 'ARCHIVED' : next === 'ARCHIVED';
    const version = loadId.current;

    setBanner('');
    setBusyId(m.id);
    adjustUnread(delta);
    let wasSelected = false;
    if (leavesList) {
      wasSelected = removeLocally(m);
    } else {
      setItems((prev) => (prev ? prev.map((x) => (x.id === m.id ? { ...x, status: next } : x)) : prev));
    }

    try {
      const res = await apiFetch(`/api/inbox/${m.id}`, { method: 'PATCH', body: { status: next } });
      if (!res.ok) throw new Error(await readError(res, 'Could not update the message.'));
    } catch (err) {
      adjustUnread(-delta);
      // If the list was reloaded meanwhile it already reflects the server, so only restore otherwise.
      if (version === loadId.current) {
        if (leavesList) setTotal((t) => t + 1);
        restoreItem(m, index, wasSelected);
      }
      setBanner(err.message || 'Could not update the message.');
    } finally {
      setBusyId((id) => (id === m.id ? null : id));
      refreshUnread();
    }
  };

  const remove = async (m) => {
    if (!m) return;
    const delta = m.status === 'NEW' ? -1 : 0;
    const index = items ? items.findIndex((x) => x.id === m.id) : -1;
    const version = loadId.current;

    setBanner('');
    setBusyId(m.id);
    adjustUnread(delta);
    const wasSelected = removeLocally(m);

    try {
      const res = await apiFetch(`/api/inbox/${m.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await readError(res, 'Could not delete the message.'));
    } catch (err) {
      adjustUnread(-delta);
      if (version === loadId.current) {
        setTotal((t) => t + 1);
        restoreItem(m, index, wasSelected);
      }
      setBanner(err.message || 'Could not delete the message.');
    } finally {
      setBusyId((id) => (id === m.id ? null : id));
      refreshUnread();
    }
  };

  const openMessage = (m) => {
    setSelectedId(m.id);
    setComposeOpen(false);
    setSentNote('');
    if (m.status === 'NEW') setStatus(m, 'READ');
  };

  // --- Compose --------------------------------------------------------------------------

  const openCompose = () => {
    setComposeOpen(true);
    setSelectedId(null);
    setSentNote('');
    setSendError('');
  };

  const closePanes = () => {
    setComposeOpen(false);
    setSelectedId(null);
    requestAnimationFrame(() => newButtonRef.current?.focus());
  };

  const changeDraft = (next) => {
    setDraft(next);
    setSendError('');
  };

  const handleSend = async () => {
    const recipient = normalizeRecipient(draft.to);
    if (!recipient || !draft.message.trim() || draft.message.length > MAX_LENGTH) return;
    setSending(true);
    setSendError('');
    try {
      const res = await apiFetch('/api/inbox/send', {
        method: 'POST',
        body: { to: recipient, message: draft.message },
      });
      if (!res.ok) {
        setSendError(await readError(res, 'Could not send your message.'));
        return;
      }
      setDraft({ to: '', message: '' });
      setComposeOpen(false);
      setSelectedId(null);
      setSentNote(`Message sent to @${recipient}.`);
      requestAnimationFrame(() => newButtonRef.current?.focus());
    } catch {
      setSendError('Could not send your message. Check your connection and try again.');
    } finally {
      setSending(false);
    }
  };

  const visibleItems = filterLoaded(items ?? [], filterText);
  const selected = items && selectedId != null ? items.find((m) => m.id === selectedId) ?? null : null;
  const pane = composeOpen || selected ? 'detail' : 'list';
  const hasMore = items !== null && items.length < total;
  const hasDraft = draft.to !== '' || draft.message !== '';

  return (
    <div className="inbox-shell" data-pane={pane}>
      <InboxSidebar
        filter={filter}
        onFilterChange={changeFilter}
        filterText={filterText}
        onFilterText={setFilterText}
        items={items}
        visibleItems={visibleItems}
        selectedId={composeOpen ? null : selected?.id ?? null}
        onOpen={openMessage}
        loadError={loadError}
        banner={banner}
        sentNote={sentNote}
        hasMore={hasMore}
        loadingMore={loadingMore}
        onLoadMore={loadMore}
        onRefresh={refresh}
        refreshing={refreshing}
        composeOpen={composeOpen}
        hasDraft={hasDraft}
        onNew={openCompose}
        newButtonRef={newButtonRef}
      />
      <section className="inbox-detail" aria-label={composeOpen ? 'Compose' : 'Reading pane'}>
        {composeOpen ? (
          <InboxCompose
            draft={draft}
            onDraftChange={changeDraft}
            onSend={handleSend}
            onCancel={closePanes}
            sending={sending}
            error={sendError}
            autoFocus
          />
        ) : (
          <InboxReader
            message={selected}
            busy={selected ? busyId === selected.id : false}
            onBack={closePanes}
            onSetStatus={setStatus}
            onDelete={remove}
          />
        )}
      </section>
    </div>
  );
}
