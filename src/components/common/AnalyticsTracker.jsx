import React from 'react';
import useAnalytics from '../../hooks/useAnalytics';

/**
 * Component wrapper for analytics tracking
 * Must be used inside Router context
 */
const AnalyticsTracker = () => {
  useAnalytics();
  return null; // This component doesn't render anything, just provides tracking
};

export default AnalyticsTracker;