import { useCallback, useEffect, useState } from "react";
import { adminAPI } from "../../services/api";

const COUNTS_CHANGED_EVENT = "support-unread-counts-changed";

// Call after marking a ticket read so the sidebar badge refreshes
export const notifySupportCountsChanged = () =>
  window.dispatchEvent(new Event(COUNTS_CHANGED_EVENT));

// Number of tickets not yet opened by an admin (sidebar badge)
export const useSupportUnreadCount = (pollMs = 30000) => {
  const [unread, setUnread] = useState(0);

  const load = useCallback(async () => {
    try {
      const res = await adminAPI.getSupportUnreadCount();
      setUnread(res.data?.unread ?? 0);
    } catch {
      // Keep the last known count if the request fails
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, pollMs);
    window.addEventListener(COUNTS_CHANGED_EVENT, load);
    return () => {
      clearInterval(timer);
      window.removeEventListener(COUNTS_CHANGED_EVENT, load);
    };
  }, [load, pollMs]);

  return unread;
};
