// Maps admin page paths to permission keys from the backend catalog
// (CreditDot-backend/config/permissions.js). Used to hide sidebar items and
// block pages for staff. The backend still enforces every API call.
// A list means the page opens with any one of those keys; the page then shows
// only the tabs the role allows (see TabbedPage).
const PATH_PERMISSIONS = [
  ["/admin/credit-report-leads", "leads"],
  ["/admin/customer", "business"],
  ["/admin/franchise-pending", "franchises"],
  ["/admin/franchise-approved", "franchises"],
  ["/admin/franchise-rejected", "franchises"],
  ["/admin/franchises", "franchises"],
  ["/admin/manage-franchise", "franchises"],
  ["/admin/franchise", "franchises"],
  // AI Analysis page: AI Reports, White Label Partners, White Label Reports tabs
  ["/admin/ai-analysis", ["ai_analysis", "white_label_partners", "white_label_reports"]],
  ["/admin/white-label-partners", "white_label_partners"],
  ["/admin/white-label-reports", "white_label_reports"],
  ["/admin/packages", "packages"],
  ["/admin/customer-packages", "packages"],
  // Credit Check page: Credit Check, View Reports, Prefill Failed Logs tabs
  ["/admin/credit-check", ["credit", "reports", "prefill_logs"]],
  ["/admin/prefill-failed-logs", "prefill_logs"],
  ["/admin/reports", "reports"],
  ["/admin/business-mis", "business"],
  ["/admin/business-forms", "business"],
  // Hyphenated sibling of /admin/business-forms, so the prefix rule above doesn't cover it
  ["/admin/business-forms-pending", "business"],
  ["/admin/amc-customers", "business"],
  ["/admin/manual-business", "business"],
  ["/admin/digital-agreements", "business"],
  ["/admin/admin-tickets", "support_tickets"],
  ["/admin/payouts", "finance"],
  ["/admin/manual-payments", "manual_payments"],
  ["/admin/blogs", "blogs"],
  ["/admin/rms", "relationship_managers"],
  ["/admin/google-sheets", "google_sheets"],
  ["/admin/bsa-reports", "ai_analysis"],
  ["/admin/surepass-settings", "settings"],
  ["/admin/marketing-materials", "marketing"],
  ["/admin/reward", "marketing"],
  ["/admin/case-study", "marketing"],
  ["/admin/work-tracking", "work_tracking"],
];

// Full administrators only, regardless of permissions
const FULL_ADMIN_PATHS = ["/admin/staff"];

const matches = (path, prefix) => path === prefix || path.startsWith(`${prefix}/`);

// Full admins have no staffRoleName; staff carry their role's permissions
export const isStaff = (user) => Boolean(user?.staffRoleName) || Array.isArray(user?.permissions);

// Permission key(s) for a page path; a list for pages made of tabs
export const permissionForPath = (path) => {
  if (path === "/admin") return "dashboard";
  const hit = PATH_PERMISSIONS.find(([prefix]) => matches(path, prefix));
  return hit ? hit[1] : null;
};

// True when the user holds this permission key (full admins hold all of them)
export const hasPermission = (user, key) => {
  if (!user) return false;
  if (!isStaff(user)) return true;
  return (user.permissions || []).includes(key);
};

export const canAccess = (user, path) => {
  if (!user) return false;
  if (!isStaff(user)) return true;
  if (FULL_ADMIN_PATHS.some((prefix) => matches(path, prefix))) return false;
  const keys = [].concat(permissionForPath(path) ?? []);
  return keys.some((key) => hasPermission(user, key));
};
