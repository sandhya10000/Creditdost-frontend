import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

/**
 * Custom hook to automatically track page views
 * Triggers on location changes to send pageview events to Google Analytics
 */
export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Send pageview event when location changes
    ReactGA.send({ 
      hitType: 'pageview', 
      page: location.pathname + location.search,
      title: document.title 
    });
  }, [location]);
};

/**
 * Function to track custom events
 * @param {string} category - Event category (e.g., 'User Interaction')
 * @param {string} action - Event action (e.g., 'Clicked Button')
 * @param {string} label - Optional event label for additional context
 * @param {number} value - Optional numeric value
 */
export const trackEvent = (category, action, label = '', value = null) => {
  ReactGA.event({
    category,
    action,
    label,
    value
  });
};

/**
 * Function to track exceptions/errors
 * @param {string} description - Error description
 * @param {boolean} fatal - Whether the error was fatal
 */
export const trackException = (description = '', fatal = false) => {
  ReactGA.event({
    category: 'Exception',
    action: description,
    label: fatal ? 'fatal' : 'non-fatal',
    nonInteraction: true
  });
};

export default useAnalytics;