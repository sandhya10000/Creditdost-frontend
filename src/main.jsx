import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ReactGA from "react-ga4";
import ErrorFallback from "./ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
// import ErrorFallback from "./ErrorFallback";

window.onerror = function (message, source, lineno, colno, error) {
  console.error("Global Error:", error);
};

window.onunhandledrejection = function (event) {
  console.error("Unhandled Promise:", event.reason);
};

// Initialize Google Analytics 4
ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID || "G-XXXXXXXXXX");

createRoot(document.getElementById("root")).render(
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => {
      window.location.reload();
    }}
  >
    <StrictMode>
      <App />
    </StrictMode>
  </ErrorBoundary>,
);
