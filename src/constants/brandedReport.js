/**
 * Constants for the AI Custom Branded Report add-on feature.
 *
 * NOTE: The access restriction (Platinum/Diamond only) must also be enforced
 * on the backend API once real endpoints are connected.
 */

export const BRANDED_REPORT_PRICE = 10000; // in INR (inclusive of GST)

export const BRANDED_REPORT_ALLOWED_PACKAGES = ['platinum', 'diamond'];

/**
 * Checks if a given package name qualifies for AI Custom Branded Report.
 * Compares case-insensitively and trims whitespace.
 * @param {string} packageName
 * @returns {boolean}
 */
export function isEligibleForBrandedReport(packageName) {
  if (!packageName || typeof packageName !== 'string') return false;
  const normalized = packageName.trim().toLowerCase();
  return BRANDED_REPORT_ALLOWED_PACKAGES.includes(normalized);
}

/**
 * Portfolio sample themes mapped to verified files in public/branded/
 */
export const SAMPLE_BRANDED_THEMES = [
  {
    id: 'northstar',
    firmName: 'Northstar Finserv',
    initials: 'NF',
    themeName: 'Navy & Royal Blue',
    palette: ['#0f172a', '#1e40af', '#60a5fa'],
    accentColor: '#1e40af',
    description: 'Tailored for corporate loan syndicates, wealth advisors, and prime retail DSA offices.',
    fileUrl: '/branded/credit-report-northstar-finserv.html',
    fileName: 'credit-report-northstar-finserv.html',
  },
  {
    id: 'greenleaf',
    firmName: 'GreenLeaf Loans',
    initials: 'GL',
    themeName: 'Teal & Green Theme',
    palette: ['#064e3b', '#0d9488', '#34d399'],
    accentColor: '#0d9488',
    description: 'Ideal for agri-fintech, green energy lending, MSME lenders, and mutual fund distributors.',
    fileUrl: '/branded/credit-report-greenleaf-loans.html',
    fileName: 'credit-report-greenleaf-loans.html',
  },
  {
    id: 'apex',
    firmName: 'Apex Capital',
    initials: 'AC',
    themeName: 'Charcoal & Bronze',
    palette: ['#18181b', '#78350f', '#d97706'],
    accentColor: '#b45309',
    description: 'Polished executive design for high-ticket mortgage consultants and Chartered Accountants.',
    fileUrl: '/branded/credit-report-apex-capital.html',
    fileName: 'credit-report-apex-capital.html',
  },
];

