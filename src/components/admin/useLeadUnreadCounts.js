import { useCallback, useEffect, useState } from "react";
import { adminAPI } from "../../services/api";

const COUNTS_CHANGED_EVENT = "lead-unread-counts-changed";

const EMPTY_COUNTS = { creditRepair: 0, whatsapp: 0, franchise: 0, total: 0 };

// Call after marking a lead read so the sidebar badge and tab counts refresh
export const notifyLeadCountsChanged = () => window.dispatchEvent(new Event(COUNTS_CHANGED_EVENT));

// Unread counts, refreshed on an interval and whenever a lead is marked read
export const useLeadUnreadCounts = (pollMs = 30000) => {
  const [counts, setCounts] = useState(EMPTY_COUNTS);

  const load = useCallback(async () => {
    try {
      const res = await adminAPI.getLeadUnreadCounts();
      setCounts(res.data);
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
