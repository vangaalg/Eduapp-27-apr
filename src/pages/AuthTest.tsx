import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { clearAllAuthData, clearSchemaCache } from '../lib/authUtils';

interface AuthState {
  session: any;
  user: any;
  provider: string;
  error: string | null;
}

const AuthTest: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    user: null,
    provider: '',
    error: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      checkAuthState();
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const checkAuthState = async () => {
    try {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      let user = null;
      let provider = '';
      
      if (session) {
        const { data: { user: userData } } = await supabase.auth.getUser();
        user = userData;
        
        // Try to determine provider
        if (user?.app_metadata?.provider) {
          provider = user.app_metadata.provider;
        }
      }
      
      setAuthState({
        session,
        user,
        provider,
        error: null
      });
    } catch (error: any) {
      console.error('Error checking auth state:', error);
      setAuthState({
        session: null,
        user: null,
        provider: '',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      
      // First, sign out to clear any existing sessions
      await clearAllAuthData();
      
      // Then sign in with Google
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth-test`,
        }
      });
      
      if (error) throw error;
      
      // If URL is provided, redirect to it
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message
      }));
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      setLoading(true);
      await clearAllAuthData();
      setAuthState({
        session: null,
        user: null,
        provider: '',
        error: null
      });
    } catch (error: any) {
      console.error('Error signing out:', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message
      }));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6">Authentication Test Page</h1>
          
          {authState.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              <h3 className="font-semibold">Error:</h3>
              <p>{authState.error}</p>
            </div>
          )}
          
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Authentication Actions</h2>
              <div className="space-y-4">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 rounded-md font-medium bg-white hover:bg-gray-50 shadow-sm transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.9895 10.1871C19.9895 9.36767 19.9214 8.76973 19.7742 8.14966H10.1992V11.848H15.8195C15.7062 12.7671 15.0943 14.1512 13.7346 15.0813L13.7155 15.2051L16.7429 17.4969L16.9527 17.5174C18.8789 15.7789 19.9895 13.2212 19.9895 10.1871Z" fill="#4285F4"/>
                    <path d="M10.1993 19.9313C12.9527 19.9313 15.2643 19.0454 16.9527 17.5174L13.7346 15.0813C12.8734 15.6682 11.7176 16.0779 10.1993 16.0779C7.50243 16.0779 5.21352 14.3395 4.39759 11.9366L4.27799 11.9466L1.13003 14.3273L1.08887 14.4391C2.76588 17.6945 6.21061 19.9313 10.1993 19.9313Z" fill="#34A853"/>
                    <path d="M4.39748 11.9366C4.18219 11.3166 4.05759 10.6521 4.05759 9.96565C4.05759 9.27909 4.18219 8.61473 4.38615 7.99466L4.38045 7.8626L1.19304 5.44366L1.08875 5.49214C0.397576 6.84305 0.000976562 8.36008 0.000976562 9.96565C0.000976562 11.5712 0.397576 13.0882 1.08875 14.4391L4.39748 11.9366Z" fill="#FBBC05"/>
                    <path d="M10.1993 3.85336C12.1142 3.85336 13.406 4.66168 14.1425 5.33717L17.0207 2.59107C15.253 0.985496 12.9527 0 10.1993 0C6.2106 0 2.76588 2.23672 1.08887 5.49214L4.38626 7.99466C5.21352 5.59183 7.50242 3.85336 10.1993 3.85336Z" fill="#EB4335"/>
                  </svg>
                  <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
                </button>
                
                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="w-full px-6 py-3 border border-red-300 rounded-md font-medium text-red-700 bg-white hover:bg-red-50 shadow-sm transition-colors"
                >
                  Sign Out & Clear All Sessions
                </button>
                
                <button
                  onClick={checkAuthState}
                  disabled={loading}
                  className="w-full px-6 py-3 border border-blue-300 rounded-md font-medium text-blue-700 bg-white hover:bg-blue-50 shadow-sm transition-colors"
                >
                  Refresh Auth State
                </button>
                
                <button
                  onClick={async () => {
                    setLoading(true);
                    await clearSchemaCache();
                    alert('Schema cache cleared');
                    setLoading(false);
                  }}
                  disabled={loading}
                  className="w-full px-6 py-3 border border-purple-300 rounded-md font-medium text-purple-700 bg-white hover:bg-purple-50 shadow-sm transition-colors"
                >
                  Clear Schema Cache
                </button>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Current Auth State</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="mb-3">
                  <p className="font-semibold">Status:</p>
                  <p className={`text-sm ${authState.session ? 'text-green-600' : 'text-red-600'}`}>
                    {authState.session ? 'Authenticated' : 'Not authenticated'}
                  </p>
                </div>
                
                {authState.session && (
                  <>
                    <div className="mb-3">
                      <p className="font-semibold">Provider:</p>
                      <p className="text-sm">{authState.provider || 'Unknown'}</p>
                    </div>
                    
                    <div className="mb-3">
                      <p className="font-semibold">User:</p>
                      <p className="text-sm">{authState.user?.email || 'No email'}</p>
                    </div>
                    
                    <div>
                      <p className="font-semibold">Session Expires:</p>
                      <p className="text-sm">
                        {authState.session?.expires_at
                          ? new Date(authState.session.expires_at * 1000).toLocaleString()
                          : 'Unknown'
                        }
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Debug Information</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-xs overflow-auto max-h-96">
                {JSON.stringify(
                  {
                    session: authState.session,
                    user: authState.user,
                    localStorage: Object.keys(localStorage)
                      .filter(key => key.includes('supabase') || key.includes('sb-'))
                      .reduce((obj, key) => ({...obj, [key]: localStorage.getItem(key)}), {})
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
          
          <div className="mt-6">
            <a
              href="/assessment"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
            >
              Return to Assessment
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTest; 