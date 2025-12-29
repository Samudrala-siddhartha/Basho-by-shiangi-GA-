import { AnalyticsData } from '../types';

const ANALYTICS_KEY = 'basho_analytics';

// Default analytics state for initialization
const defaultAnalytics: AnalyticsData = {
  totalVisits: 0,
  productViews: 0,
  cartAdds: 0,
  wishlistAdds: 0,
  wishlistRemovals: 0,
  purchases: 0,
  workshopBookings: 0,
};

/**
 * Retrieves the current analytics data from localStorage.
 * Handles potential parsing errors and provides default values.
 * @returns {AnalyticsData} The current analytics data.
 */
export const getAnalyticsData = (): AnalyticsData => {
  try {
    const data = localStorage.getItem(ANALYTICS_KEY);
    // Merge with defaults to ensure all keys exist even if storage is old/corrupt
    return data ? { ...defaultAnalytics, ...JSON.parse(data) } : defaultAnalytics;
  } catch (e) {
    console.error("Failed to parse analytics from storage. Resetting.", e);
    return defaultAnalytics; // Return defaults on error
  }
};

/**
 * Saves the provided analytics data to localStorage.
 * @param {AnalyticsData} data The analytics data to save.
 */
export const saveAnalyticsData = (data: AnalyticsData): void => {
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
  // Dispatch a custom event to notify listeners (e.g., dashboard) of updates
  window.dispatchEvent(new Event('analytics-updated'));
};

/**
 * Increments a specific analytics counter and saves the updated data.
 * @param {keyof AnalyticsData} eventName The name of the analytics counter to increment.
 * @param {number} count The amount to increment by (default is 1).
 */
export const trackEvent = (eventName: keyof AnalyticsData, count: number = 1): void => {
  const data = getAnalyticsData();
  // Ensure the property is treated as a number
  (data[eventName] as number) = (data[eventName] as number) + count;
  saveAnalyticsData(data);
};

/**
 * Resets all analytics data in localStorage to default values.
 */
export const resetAnalytics = (): void => {
  if (window.confirm("Are you sure you want to reset all analytics data? This cannot be undone.")) {
    localStorage.removeItem(ANALYTICS_KEY);
    // Dispatch event for UI update
    window.dispatchEvent(new Event('analytics-updated'));
    console.log("[Analytics] All analytics data reset.");
  }
};
