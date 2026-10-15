import { query } from '../config/db.js';

const DAY = 24 * 60 * 60 * 1000;

/** Remove messages archived (and older than 90 days). Idempotent; touches only profile_messages. */
export async function purgeArchivedMessages() {
  await query(
    `DELETE FROM profile_messages
     WHERE status = 'ARCHIVED' AND created_at < NOW() - INTERVAL '90 days'`
  );
}

export function startInboxPurge() {
  const run = async () => {
    try {
      await purgeArchivedMessages();
    } catch (err) {
      console.error('Inbox purge error:', err);
    }
  };
  run();
  setInterval(run, DAY).unref();
}
