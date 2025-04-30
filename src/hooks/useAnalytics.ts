import { useCallback } from 'react';

// Usage: const { logEvent } = useAnalytics();
const useAnalytics = () => {
  const logEvent = useCallback(async (event: string, data: Record<string, any> = {}) => {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, data, timestamp: new Date().toISOString() })
      });
    } catch (err) {
      // Optionally handle errors (e.g., log to console)
      // console.error('Analytics error:', err);
    }
  }, []);

  return { logEvent };
};

export default useAnalytics; 