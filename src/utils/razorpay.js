// On-demand Razorpay loader (index.html no longer blocks homepage with checkout.js).
// Returns a promise that resolves to true when window.Razorpay is ready.
export function ensureRazorpay() {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  // Prefer the global lazy-loader defined in index.html
  if (typeof window.loadRazorpay === "function") {
    return new Promise((resolve) => {
      window.loadRazorpay(() => resolve(!!window.Razorpay));
      // Safety timeout in case onload never fires
      setTimeout(() => resolve(!!window.Razorpay), 8000);
    });
  }
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.defer = true;
    s.onload = () => resolve(!!window.Razorpay);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
    setTimeout(() => resolve(!!window.Razorpay), 8000);
  });
}
