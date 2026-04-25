import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL:
    import.meta.env.VITE_REACT_APP_API_URL ||
    "https://reactbackend.creditdost.co.in/api",
  withCredentials: true,
});

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
  getCreditReports: () => api.get("/credit/reports"),
  getDashboardStats: () => api.get("/dashboard"),
  //api for mobiled prefilled data
  getfetchPrefillData: (mobile) => api.post("/prefill", { mobile }),
  getFranchiseLeads: () => api.get("/leads/franchise"),
  updateLeadStatus: (leadId, data) => api.put(`/leads/${leadId}/status`, data),
  // Business form functions
  submitBusinessForm: (data) => api.post("/business/submit", data),
  verifyBusinessPayment: (data) => api.post("/business/verify-payment", data),
  getBusinessForms: () => api.get("/business/franchise"),
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
  analyzeWithClaude: (docId) =>
    api.post(`/ai-analysis/franchise/analyze/${docId}`),
  downloadClaudeAnalysis: (docId) =>
    api.get(`/ai-analysis/franchise/download-analysis/${docId}`, {
      responseType: "blob",
    }),
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
  getDashboardStats: () => api.get("/admin/dashboard"),
  getRecentActivities: () => api.get("/admin/dashboard/activities"),
  getPerformanceOverview: (params) =>
    api.get("/admin/dashboard/performance", { params }),
  // Analytics functions
  getVisitorStats: (params) => api.get("/analytics/visitors", { params }),
  getRealTimeVisitors: () => api.get("/analytics/visitors/realtime"),
  getVisitorTrends: (params) =>
    api.get("/analytics/visitors/trends", { params }),
  // Franchise management
  getAllFranchises: () => api.get("/franchises"),
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
  getAllLeads: () => api.get("/admin/leads"),
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
  getAllBusinessForms: () => api.get("/business/all"),
  // Surepass settings
  getSurepassApiKey: () => api.get("/credit/settings/api-key"),
  updateSurepassApiKey: (apiKey) =>
    api.put("/credit/settings/api-key", { apiKey }),
  // Credit reports
  getAllCreditReports: () => api.get("/credit/reports/all"),
  // Referrals
  getAllReferrals: () => api.get("/admin/referrals"),
  getReferralSettings: () => api.get("/admin/referral-settings"),
  updateReferralSettings: (data) => api.put("/admin/referral-settings", data),
  // Certificate name update
  updateFranchiseCertificateName: (data) =>
    api.put("/admin/franchises/certificate-name", data),
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
  getAIAnalysisDocuments: () => api.get("/ai-analysis/admin/documents"),
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
