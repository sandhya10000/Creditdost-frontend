// Maps admin page paths to permission keys from the backend catalog
// (CreditDot-backend/config/permissions.js). Used to hide sidebar items and
// block pages for staff. The backend still enforces every API call.
const PATH_PERMISSIONS = [
  ["/admin/credit-report-leads", "leads"],
  ["/admin/customer", "business"],
  ["/admin/franchise-pending", "franchises"],
  ["/admin/franchise-approved", "franchises"],
  ["/admin/franchise-rejected", "franchises"],
  ["/admin/franchises", "franchises"],
  ["/admin/manage-franchise", "franchises"],
  ["/admin/franchise", "franchises"],
  ["/admin/packages", "packages"],
  ["/admin/customer-packages", "packages"],
  ["/admin/credit-check", "credit"],
  ["/admin/prefill-failed-logs", "credit"],
  ["/admin/reports", "reports"],
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
  ["/admin/ai-analysis", "ai_analysis"],
  ["/admin/surepass-settings", "settings"],
  ["/admin/marketing-materials", "marketing"],
  ["/admin/reward", "marketing"],
  ["/admin/case-study", "marketing"],
];

// Full administrators only, regardless of permissions
const FULL_ADMIN_PATHS = ["/admin/staff"];

const matches = (path, prefix) => path === prefix || path.startsWith(`${prefix}/`);

export const permissionForPath = (path) => {
  if (path === "/admin") return "dashboard";
  const hit = PATH_PERMISSIONS.find(([prefix]) => matches(path, prefix));
  return hit ? hit[1] : null;
};

// Full admins have no staffRoleName; staff carry their role's permissions
export const canAccess = (user, path) => {
  if (!user) return false;
  const isStaff = Boolean(user.staffRoleName) || Array.isArray(user.permissions);
  if (!isStaff) return true;
  if (FULL_ADMIN_PATHS.some((prefix) => matches(path, prefix))) return false;
  const key = permissionForPath(path);
  return Boolean(key) && (user.permissions || []).includes(key);
};
