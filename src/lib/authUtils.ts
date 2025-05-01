import { supabase } from './supabaseClient';

/**
 * Helper function to completely clear all authentication data
 * Use this when you're having persistent authentication issues
 */
export const clearAllAuthData = async (): Promise<void> => {
  try {
    console.log('Clearing all authentication data...');
    
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear localStorage items related to Supabase
    const localStorageKeys = Object.keys(localStorage);
    localStorageKeys.forEach(key => {
      if (key.includes('supabase') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear sessionStorage items
    const sessionStorageKeys = Object.keys(sessionStorage);
    sessionStorageKeys.forEach(key => {
      if (key.includes('supabase') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // Clear cookies related to authentication
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.trim().split('=');
      if (name.includes('supabase') || name.includes('sb-')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      }
    });
    
    console.log('Authentication data cleared successfully');
    
  } catch (error) {
    console.error('Error clearing authentication data:', error);
  }
};

/**
 * Check if Google is blocking third-party cookies
 * Many authentication issues happen because of cookie blocking
 */
export const checkCookiesEnabled = (): { enabled: boolean; message: string } => {
  try {
    // Try to set a test cookie
    document.cookie = "test_cookie=1; SameSite=None; Secure";
    const cookiesEnabled = document.cookie.indexOf("test_cookie") !== -1;
    
    // Try to detect if we're in Chrome's Incognito mode or similar
    const isIncognito = !window.localStorage || !window.indexedDB;
    
    if (!cookiesEnabled) {
      return { 
        enabled: false, 
        message: "Cookies are disabled in your browser. Please enable cookies for authentication to work."
      };
    }
    
    if (isIncognito) {
      return {
        enabled: true,
        message: "You appear to be in private/incognito mode. Third-party cookies might be blocked by default."
      };
    }
    
    return { enabled: true, message: "Cookies appear to be enabled." };
  } catch (error) {
    console.error('Error checking cookies:', error);
    return { 
      enabled: false, 
      message: "Error checking cookie status. Some browsers block cookies by default."
    };
  }
};

/**
 * Helper function to attempt clearing Supabase schema cache
 * Use this when encountering schema cache errors
 */
export const clearSchemaCache = async (): Promise<void> => {
  try {
    console.log('Attempting to clear schema cache...');
    
    // Clear localStorage items that might contain schema cache
    const localStorageKeys = Object.keys(localStorage);
    let cacheCleared = false;
    
    // More aggressive schema cache clearing - clear ALL Supabase related items
    localStorageKeys.forEach(key => {
      if (key.includes('supabase') || key.includes('sb-')) {
        console.log('Clearing localStorage item:', key);
        localStorage.removeItem(key);
        cacheCleared = true;
      }
    });
    
    // Also clear sessionStorage items that might contain schema cache
    const sessionStorageKeys = Object.keys(sessionStorage);
    sessionStorageKeys.forEach(key => {
      if (key.includes('supabase') || key.includes('sb-')) {
        console.log('Clearing sessionStorage item:', key);
        sessionStorage.removeItem(key);
        cacheCleared = true;
      }
    });
    
    // Force recreate the Supabase client
    try {
      // @ts-ignore - accessing internal property to force reconnection
      if (supabase && supabase.rest && typeof supabase.rest.reset === 'function') {
        // @ts-ignore
        supabase.rest.reset();
      }
    } catch (e) {
      console.log('Could not reset Supabase client:', e);
    }
    
    // Force a refresh of schema by making dummy queries to tables
    try {
      // Try to refresh schema for user_profiles
      await supabase.from('user_profiles').select('id').limit(1);
      
      // Try to refresh schema for other tables
      await supabase.from('user_interactions').select('id').limit(1);
      await supabase.from('survey_responses').select('id').limit(1);
      await supabase.from('learning_programs').select('id').limit(1);
      
      console.log('Schema refresh attempts completed');
    } catch (e) {
      // This might fail, but that's okay as it can still trigger a schema refresh
      console.log('Error during schema refresh attempts:', e);
    }
    
    if (cacheCleared) {
      console.log('Schema cache items cleared successfully');
    } else {
      console.log('No schema cache items found to clear');
    }
    
    // Return a promise that resolves after a small delay to ensure cache clearing completes
    return new Promise(resolve => setTimeout(resolve, 500));
    
  } catch (error) {
    console.error('Error clearing schema cache:', error);
  }
}; 