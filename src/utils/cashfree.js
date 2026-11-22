// Cashfree checkout helpers shared by every payment page.
// Flow: backend creates the order -> openCashfreeCheckout(paymentSessionId) -> backend verify({ orderId }).
// The backend always checks the order status with Cashfree; the browser result is only a hint.
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { load } from "@cashfreepayments/cashfree-js";

let cashfreePromise = null;

const getCashfree = () => {
  if (!cashfreePromise) {
    const mode =
      String(import.meta.env.VITE_CASHFREE_MODE || "").trim().toLowerCase() === "production"
        ? "production"
        : "sandbox";
    cashfreePromise = load({ mode }).catch((error) => {
      cashfreePromise = null; // allow a retry after a network failure
      throw error;
    });
  }
  return cashfreePromise;
};

// Opens the Cashfree checkout popup.
// Resolves { status: "done" } when the buyer finished checkout (verify next),
// or { status: "error", message } when the popup was closed or the payment failed.
export const openCashfreeCheckout = async (paymentSessionId) => {
  if (!paymentSessionId) {
    return { status: "error", message: "Payment session missing. Please try again." };
  }

  let cashfree;
  try {
    cashfree = await getCashfree();
  } catch {
    cashfree = null;
  }
  if (!cashfree) {
    return {
      status: "error",
      message: "Payment gateway failed to load. Please check your connection and try again.",
    };
  }

  const result = await cashfree.checkout({ paymentSessionId, redirectTarget: "_modal" });

  if (result?.error) {
    return {
      status: "error",
      message: result.error.message || "Payment was cancelled or failed.",
    };
  }
  // result.paymentDetails (popup) or result.redirect (redirect-based method, page will reload)
  return { status: "done" };
};

// Some payment methods (UPI apps, bank pages) redirect back to the page with ?cf_order_id=...
// Calls onOrderId(orderId) once, then removes the parameter from the URL.
export const useCashfreeReturn = (onOrderId) => {
  const location = useLocation();
  const navigate = useNavigate();
  const handled = useRef(false);
  const callback = useRef(onOrderId);
  callback.current = onOrderId;

  useEffect(() => {
    if (handled.current) return;
    const params = new URLSearchParams(location.search);
    const orderId = params.get("cf_order_id");
    if (!orderId) return;

    handled.current = true;
    params.delete("cf_order_id");
    const search = params.toString();
    navigate(
      { pathname: location.pathname, search: search ? `?${search}` : "" },
      { replace: true, state: location.state },
    );
    callback.current(orderId);
  }, [location.pathname, location.search, location.state, navigate]);
};
