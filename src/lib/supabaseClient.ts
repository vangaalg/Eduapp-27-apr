import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Detailed environment variable logging
console.log('================ SUPABASE CONFIG ================');
console.log(`Supabase URL: ${supabaseUrl || 'MISSING - Authentication will fail'}`);
console.log(`Supabase Anon Key: ${supabaseAnonKey ? 'Present' : 'MISSING - Authentication will fail'}`);

// Warn about missing variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ CRITICAL: Supabase environment variables are missing! Authentication will NOT work.');
  console.error('Please ensure your .env file contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  
  // Add fallbacks for development to prevent crashes
  if (!supabaseUrl) console.warn('Using placeholder URL to prevent crashes - authentication will still fail');
  if (!supabaseAnonKey) console.warn('Using placeholder key to prevent crashes - authentication will still fail');
}

// Create Supabase client with comprehensive auth options
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: window.localStorage
    }
  }
);

// Log initialization status
console.log('Supabase client initialized');
console.log('=================================================');

// Export a helper function to check auth status
export const checkAuthStatus = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error checking auth status:', error.message);
      return { isAuthenticated: false, error };
    }
    return { 
      isAuthenticated: !!data.session, 
      session: data.session,
      user: data.session?.user
    };
  } catch (err) {
    console.error('Unexpected error checking auth status:', err);
    return { isAuthenticated: false, error: err };
  }
}; 