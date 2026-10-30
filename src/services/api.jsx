import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL:
    import.meta.env.VITE_REACT_APP_API_URL ||
    "https://reactbackend.creditdost.co.in/api",
  withCredentials: true,
});

// Attachments are served from the backend origin (/uploads/...), not under /api
export const getAttachmentUrl = (url) => {
  const base = (
    import.meta.env.VITE_REACT_APP_API_URL ||
    "https://reactbackend.creditdost.co.in/api"
  ).replace(/\/api\/?$/, "");
  return `${base}${url}`;
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - remove token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth API functions
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  requestPasswordReset: (data) =>
    api.post("/auth/request-password-reset", data),
  resetPassword: (data) => api.post("/auth/reset-password", data),
};

// Franchise API functions
export const franchiseAPI = {
  //Profile get and update
  getProfile: () => api.get("/franchises/profile"),
  updateProfile: (data) => api.put("/franchises/profile", data),
  getKycStatus: () => api.get("/kyc/status"),
  submitKyc: (data) => {
    // Check if data contains file uploads or just links
    const isFormData = data instanceof FormData;

    if (isFormData) {
      // For file uploads
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      return api.post("/kyc/submit", data, config);
    } else {
      // For Google Drive links
      return api.post("/kyc/submit", data);
    }
  },
  // Add the new function for DigiLocker initialization
  initDigiLocker: () => api.post("/kyc/digilocker/init"),
  getCreditPackages: () => api.get("/dashboard/packages"),
  initiatePayment: (packageId) =>
    api.post("/payments/create-order", { packageId }),
  verifyPayment: (data) => api.post("/payments/verify-payment", data),
  getCreditReport: (data) => api.post("/credit/check", data),
  getCreditReports: (params) => api.get("/credit/reports", { params }),
  getCreditReportById: (id) => api.get(`/credit/reports/${id}`),
  generateExperianReport: (data) =>
    api.post("/credit/generate-experian-report", data),
  getDashboardStats: () => api.get("/dashboard"),

  getFranchiseLeads: () => api.get("/leads/franchise"),
  updateLeadStatus: (leadId, data) => api.put(`/leads/${leadId}/status`, data),
  // Business form functions
  submitBusinessForm: (data) => api.post("/business/submit", data),
  lookupConsultant: (q) => api.get("/business/consultant-lookup", { params: { q } }),
  getAssignableRms: () => api.get("/business/rms"),
  verifyBusinessPayment: (data) => api.post("/business/verify-payment", data),
  getBusinessForms: () => api.get("/business/franchise"),
  getAmcCustomers: (params) => api.get("/business/franchise/amc", { params }),

  // Transactions
  getTransactions: () => api.get("/dashboard/transactions"),
  // Referrals
  getReferrals: () => api.get("/dashboard/referrals"),
  createReferral: (data) => api.post("/dashboard/referrals", data),
  // Payouts
  getFranchisePayouts: () => api.get("/dashboard/payouts"),
  // Certificate
  getCertificateData: () => api.get("/franchises/certificate"),
  requestCertificateNameUpdate: (data) =>
    api.put("/franchises/certificate/name", data),
  // PAN Details
  getPanDetails: () => api.get("/franchises/pan"),
  updatePanDetails: (data) => api.put("/franchises/pan", data),
  fetchPanComprehensive: (data) => api.post("/franchises/pan/fetch", data),
  // Bank Details
  getBankDetails: () => api.get("/franchises/bank"),
  updateBankDetails: (data) => api.put("/franchises/bank", data),
  verifyBankDetails: (data) => api.post("/franchises/bank/verify", data),
  // Digital Agreement endpoints
  getDigitalAgreement: () => api.get("/digital-agreements"),
  downloadDigitalAgreement: () =>
    api.get("/digital-agreements/download", { responseType: "blob" }),
  submitSignedDigitalAgreement: (data) =>
    api.post("/digital-agreements/submit", data),
  initiateEsign: (data) => api.post("/digital-agreements/esign/initiate", data),
  // AI Analysis endpoints
  uploadAIAnalysisDocument: (formData) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    return api.post("/ai-analysis/upload", formData, config);
  },
  getAIAnalysisDocuments: () => api.get("/ai-analysis/franchise/documents"),
  getAIAnalysisUsage: () => api.get("/ai-analysis/franchise/usage"),
  analyzeWithClaude: (docId, data = {}) =>
    api.post(`/ai-analysis/franchise/analyze/${docId}`, data),
  downloadClaudeAnalysis: (docId) =>
    api.get(`/ai-analysis/franchise/download-analysis/${docId}`, {
      responseType: "blob",
    }),
  //api for mobiled prefilled data
  getfetchPrefillData: (mobile) => api.post("/prefill", { mobile }),
  savePrefillFailure: (data) => api.post("/save-prefill-failure", data),
  getPrefillFailedLog: (params) => api.get("/prefill-failed-logs", { params }),
  //get marketing material
  getMarketingMaterials: (language) =>
    api.get("/marketing", {
      params: { language },
    }),
  // fetch the language master list (drives sidebar sub-items dynamically)
  getMarketingLanguages: () => api.get("/marketing/languages"),
  //get reward from admin
  getRewards: () => api.get("/franchise/reward"),
  //get case studies
  getCaseStudies: () => api.get("/franchise-case-studie"),

  uploaddocBusiness: (formData) =>
    api.post("/franchise/uploadDocBusiness", formData),
  getfranchiseList: () => api.get("/franchises/admin/allFranchises-Namelist"),
  getBusinessFormsByFranchise: (_id) => api.get(`/business/franchise/${_id}`),
  updateCustomer: (customerId, formData) =>
    api.put(`/admin/business/update-form/${customerId}`, formData),
  customerSupport: (formData) => api.post("/support/create-ticket", formData),
  getTickets: () => api.get("/support/my-tickets"),
  getTicket: (id) => api.get(`/support/tickets/${id}`),
  replyTicket: (id, formData) =>
    api.post(`/support/tickets/${id}/reply`, formData),
};

// Blog API functions
export const blogAPI = {
  getAllBlogs: (params) => api.get("/blogs", { params }),
  getBlogBySlug: (slug) => api.get(`/blogs/${slug}`),
  getBlogCategories: () => api.get("/blogs/categories"),
  getRecentBlogs: (params) => api.get("/blogs/recent", { params }),
  getBlogTags: () => api.get("/blogs/tags"),
};

// Admin API functions
export const adminAPI = {
  getDashboardStats: (params) => api.get("/admin/dashboard", { params }),
  getRecentActivities: () => api.get("/admin/dashboard/activities"),
  getPerformanceOverview: (params) =>
    api.get("/admin/dashboard/performance", { params }),
  // Analytics functions
  getVisitorStats: (params) => api.get("/analytics/visitors", { params }),
  getRealTimeVisitors: () => api.get("/analytics/visitors/realtime"),
  getVisitorTrends: (params) =>
    api.get("/analytics/visitors/trends", { params }),
  // Franchise management
  getAllFranchises: (params) => api.get("/franchises", { params }),
  /**
   * Export ALL matching franchise records as a streamed CSV.
   * Pass the same `search` / `kycStatus` params that are active in the list view
   * so the exported data matches what the admin sees on screen.
   */
  exportFranchisesCSV: (params) =>
    api.get("/franchises/export-csv", { params, responseType: "blob" }),
  getFranchiseList: () => api.get("/franchises/list"),
  getFranchiseById: (id) => api.get(`/franchises/${id}`),
  updateFranchise: (id, data) => api.put(`/franchises/${id}`, data),
  activateFranchise: (id) => api.put(`/franchises/${id}/activate`),
  deactivateFranchise: (id) => api.put(`/franchises/${id}/deactivate`),
  createFranchiseUser: (data) => api.post("/admin/franchises", data),
  approveRegistration: (id, data) =>
    api.put(`/admin/franchises/${id}/approve-registration`, data),
  rejectRegistration: (id, rejectionReason) =>
    api.put(`/admin/franchises/${id}/reject-registration`, { rejectionReason }),
  deleteFranchise: (id) => api.delete(`/admin/franchises/${id}`),
  restoreFranchise: (id) => api.put(`/admin/franchises/${id}/restore`),
  resendFranchiseInvite: (id) =>
    api.post(`/admin/franchises/${id}/resend-invite`),
  changeFranchiseEmail: (id, data) =>
    api.put(`/admin/franchises/${id}/email`, data),
  // Credit recharge functions
  getAllFranchisesWithCredits: () => api.get("/admin/franchises/credits"),
  rechargeFranchiseCredits: (data) =>
    api.post("/admin/franchises/recharge", data),
  getCreditRechargeHistory: () => api.get("/admin/credits/history"),
  // Payout functions
  calculateFranchisePayouts: (data) =>
    api.post("/admin/payouts/calculate", data),
  getFranchisePayouts: (franchiseId) =>
    api.get(`/admin/payouts/franchise/${franchiseId}`),
  getAllPayouts: () => api.get("/admin/payouts"),
  updatePayout: (id, data) => api.put(`/admin/payouts/${id}`, data),
  // KYC management
  getPendingKycRequests: () => api.get("/kyc/pending"),
  getKycByFranchiseId: (franchiseId) =>
    api.get(`/kyc/franchise/${franchiseId}`),
  approveKyc: (id) => api.put(`/kyc/approve/${id}`),
  rejectKyc: (id, rejectionReason) =>
    api.put(`/kyc/reject/${id}`, { rejectionReason }),
  // Package management
  getAllPackages: () => api.get("/packages/all"),
  getPackageOptions: () => api.get("/packages/options"),
  getPackageById: (id) => api.get(`/packages/${id}`),
  createPackage: (packageData) => api.post("/packages", packageData),
  updatePackage: (id, packageData) => api.put(`/packages/${id}`, packageData),
  deletePackage: (id) => api.delete(`/packages/${id}`),
  // Customer package management
  getAllCustomerPackages: () => api.get("/customer-packages/all"),
  getCustomerPackageById: (id) => api.get(`/customer-packages/${id}`),
  createCustomerPackage: (packageData) =>
    api.post("/customer-packages", packageData),
  updateCustomerPackage: (id, packageData) =>
    api.put(`/customer-packages/${id}`, packageData),
  deleteCustomerPackage: (id) => api.delete(`/customer-packages/${id}`),
  // Lead management
  getAllLeads: (params) => api.get("/admin/leads", { params }),
  getLeadById: (id) => api.get(`/admin/leads/${id}`),
  createLead: (leadData) => api.post("/admin/leads", leadData),
  updateLead: (id, data) => api.put(`/admin/leads/${id}`, data),
  deleteLead: (id) => api.delete(`/admin/leads/${id}`),

  bulkUploadLeads: (formData) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    return api.post("/admin/leads/bulk-upload", formData, config);
  },
  // Business forms
  getAllBusinessForms: (params) => api.get("/business/all", { params }),
  //business form close case
  closeBusinessCase: (id) =>
    api.put(`/admin/business/${id}/close`, {
      adminRemark: "Case completed",
    }),
  // Surepass settings
  getSurepassApiKey: () => api.get("/credit/settings/api-key"),
  updateSurepassApiKey: (apiKey) =>
    api.put("/credit/settings/api-key", { apiKey }),
  // IndiConnect settings (CIBIL)
  getIndiconnectKeys: () => api.get("/credit/settings/indiconnect-keys"),
  updateIndiconnectKeys: (data) =>
    api.put("/credit/settings/indiconnect-keys", data),
  // Credit reports
  getAllCreditReports: (params) => api.get("/credit/reports/all", { params }),
  downloadCreditReport: (id) =>
    api.get(`/credit/reports/${id}/download`, { responseType: "blob" }),
  // Certificate name update
  updateFranchiseCertificateName: (data) =>
    api.put("/admin/franchises/certificate-name", data),
  // Credit Repair Enquiries
  getCreditRepairEnquiries: (params) =>
    api.get("/admin/credit-repair", { params }),
  updateCreditRepairEnquiryStatus: (id, status) =>
    api.put(`/admin/credit-repair/${id}/status`, { status }),
  deleteCreditRepairEnquiry: (id) => api.delete(`/admin/credit-repair/${id}`),
  markCreditRepairRead: (id) => api.put(`/admin/credit-repair/${id}/read`),
  // Website Franchise Leads
  getFranchiseLeads: (params) => api.get("/admin/franchise-leads", { params }),
  updateFranchiseLeadStatus: (id, status) =>
    api.put(`/admin/franchise-leads/${id}/status`, { status }),
  markFranchiseLeadRead: (id) => api.put(`/admin/franchise-leads/${id}/read`),
  deleteFranchiseLead: (id) => api.delete(`/admin/franchise-leads/${id}`),
  // New, unread lead counts (sidebar badge + tabs)
  getLeadUnreadCounts: () => api.get("/admin/leads/unread-counts"),
  // Blogs
  getAllBlogs: (params) => api.get("/blogs/admin", { params }),
  createBlog: (blogData) => api.post("/blogs/admin", blogData),
  updateBlog: (id, blogData) => api.put(`/blogs/admin/${id}`, blogData),
  deleteBlog: (id) => api.delete(`/blogs/admin/${id}`),
  uploadBlogImage: (formData) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    return api.post("/blogs/admin/upload-image", formData, config);
  },
  // Digital Agreement endpoints (Admin)
  getAllDigitalAgreements: () => api.get("/digital-agreements/admin"),
  getDigitalAgreementById: (id) => api.get(`/digital-agreements/admin/${id}`),
  approveDigitalAgreement: (id) =>
    api.put(`/digital-agreements/admin/${id}/approve`),
  rejectDigitalAgreement: (id, data) =>
    api.put(`/digital-agreements/admin/${id}/reject`, data),
  downloadSignedDigitalAgreement: (id) =>
    api.get(`/digital-agreements/admin/${id}/download`, {
      responseType: "blob",
    }),
  // AI Analysis endpoints (Admin)
  getAIAnalysisDocuments: (params) =>
    api.get("/ai-analysis/admin/documents", { params }),
  getAIAnalysisDocumentById: (id) =>
    api.get(`/ai-analysis/admin/documents/${id}`),
  respondToAIAnalysisDocument: (id, formData) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    return api.post(`/ai-analysis/admin/respond/${id}`, formData, config);
  },
  downloadClaudeAnalysis: (id) =>
    api.get(`/ai-analysis/admin/download-analysis/${id}`, {
      responseType: "blob",
    }),
  downloadOriginalDocument: (id, params = {}) =>
    api.get(`/ai-analysis/admin/original/${id}`, {
      params,
      responseType: "blob",
    }),
  //admin upload marketing materials post method
  UploadDocument: (formData) => api.post("/admin/marketing/upload", formData),
  updateMarketingMaterial: (id, formData) =>
    api.put(`/admin/marketing-material/${id}`, formData),

  deleteMarketingMaterial: (id) => api.delete(`/admin/marketing/${id}`),
  //admin case study post api
  createCaseStudy: (formData) => api.post("/admin/case-studies", formData),
  updateCaseStudy: (editingId, formData) =>
    api.put(`/admin/case-studies/${editingId}`, formData),
  deleteCaseStudy: (id) => api.delete(`/admin/case-studies/${id}`),

  //admin upload contest reward post
  createReward: (formData) => api.post("/admin/reward/upload", formData),
  getDownloadStats: () => api.get("/admin/download-stats"),
  //Bureau save for mini crm
  getSinglebusinessform: (customerId) =>
    api.get(`/business/customer/${customerId}`),
  getSingleFranchise: (franchiseCode) =>
    api.get(`/franchises/single-data/${franchiseCode}`),
  //get franhcise report data
  getFranchiseReport: (franchiseId) =>
    api.get(`/credit/reports/franchise/${franchiseId}`),
  //get franchise ai report data
  getFranchiseAIDocuments: (franchiseId) =>
    api.get(`/ai-analysis/documents/${franchiseId}`),

  //get single report data using userId
  getSingleCreditReport: (pan) => api.get(`/report/${pan}`),
  saveBureauData: (customerId, bureauData) =>
    api.post(`/customer/bureau/${customerId}`, bureauData),
  getBureauData: (customerId) => api.get(`/bureau-data/${customerId}`),
  checkCreditV2: (payload) => api.post("/credit/credit-check-v2", payload),
  addRemarksforCustomer: (payload) =>
    api.post("/admin/addremark/customer", payload),
  getCustomerRemarks: (customerId) => api.get(`/addRemark/${customerId}`),
  // closeBusinessCaseadmin: (id) => api.post(`/business/close-case/${id}`),
  updateBusinessWorkStatus: (id, data) =>
    api.put(`/admin/business-forms/${id}/work-status`, data),
  assignBusinessRm: (id, rmId) =>
    api.patch(`/business/admin/business-forms/${id}/rm`, { rmId }),
  // Staff & roles (full administrators only)
  getPermissionCatalog: () => api.get("/admin/permissions"),
  getStaffRoles: () => api.get("/admin/roles"),
  createStaffRole: (data) => api.post("/admin/roles", data),
  updateStaffRole: (id, data) => api.put(`/admin/roles/${id}`, data),
  deleteStaffRole: (id) => api.delete(`/admin/roles/${id}`),
  getStaffMembers: () => api.get("/admin/staff"),
  getStaffProfile: (id) => api.get(`/admin/staff/${id}`),
  assignBusinessManagersToPartners: () => api.post("/franchises/assign-business-managers"),
  reassignFranchiseManager: (franchiseId, businessManagerId) =>
    api.put(`/franchises/${franchiseId}/business-manager`, { businessManagerId }),
  assignStaffMember: (data) => api.post("/admin/staff", data),
  changeStaffMemberRole: (id, roleId) =>
    api.patch(`/admin/staff/${id}/role`, { roleId }),
  updateStaffMemberDetails: (id, data) => api.patch(`/admin/staff/${id}`, data),
  setStaffMemberStatus: (id, isActive) =>
    api.patch(`/admin/staff/${id}/status`, { isActive }),
  resendStaffMemberCredentials: (id) =>
    api.post(`/admin/staff/${id}/resend-credentials`),
  getAllTickets: (params) =>
    api.get("/admin/support/all-tickets", { params }),
  getTicket: (id) => api.get(`/admin/support/tickets/${id}`),
  replyTicket: (id, formData) =>
    api.post(`/admin/support/tickets/${id}/reply`, formData),
  updateTicketStatus: (id, status) =>
    api.patch(`/admin/support/tickets/${id}/status`, { status }),
  updateTicketMeta: (id, data) =>
    api.patch(`/admin/support/tickets/${id}/meta`, data),
  deleteBusinessForm: (id) => api.delete(`/admin/business-forms/${id}`),
  // AMC (Annual Maintenance Contract)
  getAmcCustomers: (params) => api.get("/business/amc", { params }),
  upsertAmc: (id, data) => api.put(`/admin/business-forms/${id}/amc`, data),
  renewAmc: (id, data) => api.post(`/admin/business-forms/${id}/amc/renew`, data),
  cancelAmc: (id, data) =>
    api.delete(`/admin/business-forms/${id}/amc`, { data }),
  // Manual Payments (Razorpay payment links created by admin)
  getManualPayments: (params) => api.get("/admin/manual-payments", { params }),
  createManualPayment: (data) => api.post("/admin/manual-payments", data),
  refreshManualPayment: (id) => api.post(`/admin/manual-payments/${id}/refresh`),
  cancelManualPayment: (id) => api.post(`/admin/manual-payments/${id}/cancel`),
  // Follow-ups
  getBusinessFollowUps: (params) => api.get("/business/follow-ups", { params }),
  setBusinessFollowUp: (id, data) =>
    api.put(`/business/admin/business-forms/${id}/follow-up`, data),
  clearBusinessFollowUp: (id) =>
    api.delete(`/business/admin/business-forms/${id}/follow-up`),
  // Admin document upload (formData: one file per document key)
  uploadBusinessDocuments: (id, formData) =>
    api.put(`/business/admin/business-forms/${id}/documents`, formData),
};

// Credit API functions
export const creditAPI = {
  checkCreditScorePublic: (data) => api.post("/credit/check-public", data),
  submitCreditRepairEnquiry: (data) => api.post("/credit/repair-enquiry", data),
};

// EMI API functions
export const emiAPI = {
  calculateEMI: (data) => api.post("/emi/calculate", data),
  generateEmiSchedule: (data) => api.post("/emi/schedule", data),
};

// IFSC API functions
export const ifscAPI = {
  getBankDetails: (ifscCode) =>
    axios.get(`https://ifsc.razorpay.com/${ifscCode}`),
};

// SMS API functions
export const smsAPI = {
  sendOTP: (data) => api.post("/sms/send-otp", data),
  verifyOTP: (data) => api.post("/sms/verify-otp", data),
  resendOTP: (data) => api.post("/sms/resend-otp", data),
};

// Careers API functions
export const careersAPI = {
  submitApplication: (formData) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    return api.post("/careers/apply", formData, config);
  },
};

export default api;
