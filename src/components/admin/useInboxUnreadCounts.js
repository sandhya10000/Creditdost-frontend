import { useCallback, useEffect, useState } from "react";
import { adminAPI } from "../../services/api";

const COUNTS_CHANGED_EVENT = "inbox-unread-counts-changed";

const EMPTY_COUNTS = {
  support: 0,
  business: { individual: 0, business: 0, total: 0 },
};

// Call after opening a ticket or business customer so the badges refresh straight away
export const notifyInboxCountsChanged = () => window.dispatchEvent(new Event(COUNTS_CHANGED_EVENT));

// Unread counts for Support Tickets and Business MIS, refreshed on an interval
export const useInboxUnreadCounts = (pollMs = 30000) => {
  const [counts, setCounts] = useState(EMPTY_COUNTS);

  const load = useCallback(async () => {
    try {
      const [support, business] = await Promise.all([
        adminAPI.getSupportUnreadCount(),
        adminAPI.getBusinessUnreadCounts(),
      ]);
      setCounts({ support: support.data.unread, business: business.data });
    } catch {
      // Keep the last known counts if the request fails
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

  return counts;
};
