/**
 * Frontend Service Layer for AI Custom Branded Report
 *
 * Handles status retrieval, wallet payment, and Razorpay checkout initiation.
 * Currently uses localStorage to persist purchase state across page reloads until
 * the backend endpoints are connected.
 *
 * TODO: Connect to real backend endpoints:
 *   - GET  /api/branded-report/status -> { hasPurchased: boolean, status: 'idle'|'in_progress'|'active', purchasedAt, contactEmail, contactPhone }
 *   - POST /api/branded-report/purchase-wallet -> { success: boolean, transactionId: string }
 *   - POST /api/branded-report/create-order -> { success: boolean, orderId: string, amount: number }
 *   - POST /api/branded-report/verify-payment -> { success: boolean, status: 'in_progress' }
 */

import { BRANDED_REPORT_PRICE } from '../constants/brandedReport';
import { ensureRazorpay } from '../utils/razorpay';

const STORAGE_KEY = 'creditdost_branded_report_status';

/**
 * Retrieves the current purchase status for the franchise.
 * @returns {Promise<{
 *   hasPurchased: boolean,
 *   status: 'idle' | 'in_progress' | 'active',
 *   contactEmail?: string,
 *   contactPhone?: string,
 *   purchasedAt?: string,
 *   paymentMethod?: string
 * }>}
 */
export async function getBrandedReportStatus() {
  // Simulating async network delay
  await new Promise((resolve) => setTimeout(resolve, 250));

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed;
    }
  } catch (err) {
    console.warn('[BrandedReportService] Failed to read status from storage:', err);
  }

  return {
    hasPurchased: false,
    status: 'idle',
  };
}

/**
 * Initiates purchase using franchise wallet balance.
 * @param {{ email: string, phone: string, currentBalance: number }} params
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function purchaseWithWallet({ email, phone, currentBalance }) {
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (currentBalance < BRANDED_REPORT_PRICE) {
    throw new Error(
      `Insufficient wallet balance. You need ₹${BRANDED_REPORT_PRICE.toLocaleString('en-IN')}, but your balance is ₹${(currentBalance || 0).toLocaleString('en-IN')}.`
    );
  }

  // TODO: Connect to backend: await api.post('/branded-report/purchase-wallet', { email, phone, amount: BRANDED_REPORT_PRICE });
  const purchaseData = {
    hasPurchased: true,
    status: 'in_progress',
    contactEmail: email,
    contactPhone: phone,
    purchasedAt: new Date().toISOString(),
    paymentMethod: 'wallet',
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(purchaseData));

  return {
    success: true,
    message: 'Payment received via wallet. Our design team will contact you within 3 hours.',
  };
}

/**
 * Initiates purchase using Razorpay gateway.
 * @param {{
 *   email: string,
 *   phone: string,
 *   franchiseName: string,
 *   onSuccess: (res: any) => void,
 *   onError: (err: any) => void
 * }} params
 */
export async function purchaseWithRazorpay({ email, phone, franchiseName, onSuccess, onError }) {
  const ready = await ensureRazorpay();
  if (!ready) {
    onError(new Error('Razorpay gateway failed to load. Please check your internet connection and try again.'));
    return;
  }

  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  if (!razorpayKey) {
    console.warn('[BrandedReportService] VITE_RAZORPAY_KEY_ID is not configured in .env. Falling back to simulated checkout.');
    // Simulate successful checkout if test key is absent in local environment
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const purchaseData = {
      hasPurchased: true,
      status: 'in_progress',
      contactEmail: email,
      contactPhone: phone,
      purchasedAt: new Date().toISOString(),
      paymentMethod: 'razorpay',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(purchaseData));
    onSuccess({ simulated: true });
    return;
  }

  try {
    // TODO: Connect to backend to generate real order_id:
    // const orderRes = await api.post('/branded-report/create-order', { amount: BRANDED_REPORT_PRICE, email, phone });
    // const { orderId } = orderRes.data;

    const options = {
      key: razorpayKey,
      amount: BRANDED_REPORT_PRICE * 100, // paise
      currency: 'INR',
      name: 'Credit Dost',
      description: 'AI Custom Branded Report Setup (One-time)',
      prefill: {
        name: franchiseName || 'Franchise Partner',
        email: email || '',
        contact: phone || '',
      },
      theme: {
        color: '#1976d2',
      },
      handler: async function (response) {
        try {
          // TODO: Verify signature on backend:
          // await api.post('/branded-report/verify-payment', response);
          const purchaseData = {
            hasPurchased: true,
            status: 'in_progress',
            contactEmail: email,
            contactPhone: phone,
            purchasedAt: new Date().toISOString(),
            paymentMethod: 'razorpay',
            razorpayPaymentId: response.razorpay_payment_id,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(purchaseData));
          onSuccess(response);
        } catch (verifyErr) {
          onError(verifyErr);
        }
      },
      modal: {
        ondismiss: function () {
          onError(new Error('Payment window closed by user.'));
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    onError(err);
  }
}

