import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InitialSurvey from '../components/InitialSurvey';
import StudyPlan from '../components/StudyPlan';
import { StudentSurvey } from '../types/survey';
import { examService } from '../services/examDates';
import { supabase, checkAuthStatus } from '../lib/supabaseClient';
import { clearAllAuthData, checkCookiesEnabled, clearSchemaCache } from '../lib/authUtils';
import ElevenLabsWidget from '../components/ElevenLabsWidget';

// Define types for our debug info
interface DebugInfo {
  lastAuthEvent?: string;
  hasSession?: boolean;
  isAuthenticated?: boolean;
  hasUser?: boolean;
  userId?: string;
  [key: string]: any; // Allow other properties
}

const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'survey' | 'plan'>('survey');
  const [learningPath, setLearningPath] = useState<any>(null);
  const [showSurvey, setShowSurvey] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});

  useEffect(() => {
    // Check for cookie issues
    const cookieStatus = checkCookiesEnabled();
    if (!cookieStatus.enabled) {
      setAuthError(cookieStatus.message);
    }
    
    // Extract auth hash from URL to debug issues
    const hash = window.location.hash;
    const authParams = new URLSearchParams(hash.replace('#', ''));
    
    // Log detailed information about the URL state
    console.log('========= AUTH DEBUG =========');
    console.log('Current URL:', window.location.href);
    console.log('Has hash:', hash.length > 0);
    console.log('Hash contains error:', hash.includes('error'));
    console.log('Hash contains access_token:', hash.includes('access_token'));

    if (hash.includes('error')) {
      const error = authParams.get('error_description') || authParams.get('error');
      console.error('Auth error in URL:', error);
      setAuthError(`Authentication error: ${error}`);
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      console.log('Session exists:', !!session);
      setDebugInfo((prev: DebugInfo) => ({...prev, lastAuthEvent: event, hasSession: !!session}));
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log('User signed in, fetching profile...');
        await checkAuthAndProfile();
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUserProfile(null);
      } else if (event === 'USER_UPDATED') {
        console.log('User updated');
        await checkAuthAndProfile();
      }
    });

    // Initial auth check
    console.log('Performing initial auth check...');
    checkCurrentAuthState();
    console.log('================================');

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // New function to explicitly check auth state
  const checkCurrentAuthState = async () => {
    const { isAuthenticated, user, error } = await checkAuthStatus();
    console.log('Auth check result:', { isAuthenticated, hasUser: !!user });
    setDebugInfo((prev: DebugInfo) => ({...prev, isAuthenticated, hasUser: !!user}));
    
    if (isAuthenticated && user) {
      console.log('User is authenticated, checking profile');
      await checkAuthAndProfile();
    } else {
      setLoading(false);
      if (error) {
        console.error('Auth check error:', error);
        const errorMessage = typeof error === 'object' && error !== null && 'message' in error 
          ? error.message as string 
          : 'Unknown error';
        setAuthError(errorMessage);
      }
    }
  };

  const checkAuthAndProfile = async () => {
    try {
      console.log('Checking user authentication...');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError.message);
        setAuthError(authError.message);
        throw authError;
      }

      console.log('Current user:', user ? `ID: ${user.id}` : 'No user authenticated');
      setDebugInfo((prev: DebugInfo) => ({...prev, userId: user?.id}));

      if (user) {
        console.log('User authenticated, checking for profile...');
        console.log('User email:', user.email);
        console.log('User metadata:', JSON.stringify(user.user_metadata));
        
        // Validate that tables exist and are accessible
        await validateDatabaseTables(user.id);
        
        // Fetch user profile from Supabase
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            console.log('No profile found, will create one');
          } else {
            console.error('Profile fetch error:', profileError.message);
            setAuthError(`Profile error: ${profileError.message}`);
            throw profileError;
          }
        }

        // If no profile exists, create one
        if (!profile) {
          console.log('Creating new user profile...');
          
          // Check if user_profiles table has required columns
          try {
            // First, check the table structure to determine available columns
            const { data: tableInfo, error: tableError } = await supabase
              .from('user_profiles')
              .select('*')
              .limit(1);
            
            if (tableError) {
              console.warn('Error checking table structure:', tableError.message);
            }
            
            // Build profile object with only the ID which is always required
            const newProfile: any = {
              id: user.id
            };
            
            // Get all columns from the user_profiles table
            let availableColumns: string[] = [];
            try {
              const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'user_profiles' });
              if (!error && data) {
                availableColumns = data.map((col: any) => col.column_name);
                console.log('Available columns:', availableColumns);
              }
            } catch (e) {
              console.log('Could not fetch columns via RPC, using fallback method');
              
              // Fallback: Let's assume common columns
              availableColumns = ['id', 'email', 'full_name', 'avatar_url'];
              
              // Try to infer columns from error messages
              if (tableError && tableError.message.includes('column')) {
                const missingCol = tableError.message.match(/column ['"]([^'"]+)['"]/);
                if (missingCol && missingCol[1]) {
                  const colToRemove = missingCol[1];
                  availableColumns = availableColumns.filter(col => col !== colToRemove);
                }
              }
            }
            
            // Only add fields that exist in the database
            if (user.email && availableColumns.includes('email')) {
              newProfile.email = user.email;
            }
            
            if ((user.user_metadata?.full_name || user.user_metadata?.name) && 
                availableColumns.includes('full_name')) {
              newProfile.full_name = user.user_metadata?.full_name || user.user_metadata?.name;
            }
            
            if (user.user_metadata?.avatar_url && availableColumns.includes('avatar_url')) {
              newProfile.avatar_url = user.user_metadata?.avatar_url;
            }
            
            // Handle has_completed_survey specially since it's causing issues
            if (availableColumns.includes('has_completed_survey')) {
              newProfile.has_completed_survey = false;
            }

            console.log('New profile data:', JSON.stringify(newProfile));

            // Use upsert instead of insert to be safer
            const { error: insertError } = await supabase
              .from('user_profiles')
              .upsert([newProfile]);

            if (insertError) {
              console.error('Profile creation error:', insertError.message);
              
              // Special handling for schema cache errors
              if (insertError.message.includes('column') && insertError.message.includes('not found')) {
                setAuthError(`Schema error: ${insertError.message}. Try clearing cache and refreshing.`);
                
                // Auto-clear schema cache on this error
                await clearSchemaCache();
              } else {
                setAuthError(`Profile creation error: ${insertError.message}`);
              }
              throw insertError;
            }
            
            console.log('Profile created successfully');
            setUserProfile(newProfile);
          } catch (profileError: any) {
            console.error('Error creating profile:', profileError);
            throw profileError;
          }
        } else {
          console.log('Existing profile found:', profile.id);
          setUserProfile(profile);
          // If user has completed survey, fetch their learning path
          if (profile.has_completed_survey) {
            console.log('User has completed survey, fetching learning path...');
            const { data: path, error: pathError } = await supabase
              .from('learning_programs')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();

            if (pathError) {
              console.error('Learning path fetch error:', pathError.message);
            }

            if (path && !pathError) {
              console.log('Learning path found');
              setLearningPath(path.program_data);
              setStep('plan');
              setShowSurvey(false);
            }
          }
        }
      } else {
        console.log('No authenticated user found');
        setAuthError('No authenticated user found');
      }
    } catch (error: any) {
      console.error('Error in checkAuthAndProfile:', error.message);
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to validate database tables are accessible
  const validateDatabaseTables = async (userId: string) => {
    try {
      console.log('Validating database tables...');
      
      // Check user_profiles table
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);
      
      if (profilesError) {
        console.error('Error accessing user_profiles table:', profilesError.message);
        alert('Error accessing user profiles table. Please check Supabase configuration.');
        return false;
      }
      
      // Check user_profiles table structure using RPC if available
      try {
        const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'user_profiles' });
        if (!error && data) {
          console.log('user_profiles table columns:', data);
          const hasEmailColumn = Array.isArray(data) && data.some(col => col.column_name === 'email');
          if (!hasEmailColumn) {
            console.warn('Email column not found in user_profiles table. This might cause issues.');
            setAuthError('Schema warning: Email column may be missing from user_profiles table');
          }
        }
      } catch (e) {
        console.log('Could not verify table structure, RPC may not be available');
      }
      
      // Check user_interactions table
      const { error: interactionsError } = await supabase
        .from('user_interactions')
        .select('id')
        .limit(1);
      
      if (interactionsError) {
        console.error('Error accessing user_interactions table:', interactionsError.message);
        alert('Error accessing user interactions table. Please check Supabase configuration.');
        return false;
      }
      
      // Check RLS policies by trying to access another user's data (should fail)
      const { data: otherUserData, error: rlsError } = await supabase
        .from('user_profiles')
        .select('id')
        .neq('id', userId)
        .limit(1);
      
      if (otherUserData && otherUserData.length > 0) {
        console.warn('RLS Warning: User can view other users data - policies may not be configured correctly');
      }
      
      console.log('Database tables validated successfully');
      return true;
    } catch (error: any) {
      console.error('Error validating database tables:', error.message);
      return false;
    }
  };

  const handleSurveyComplete = async (survey: StudentSurvey) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate learning path
      const generatedPath = examService.generateLearningPath(survey);
      setLearningPath(generatedPath);
      setStep('plan');
      setShowSurvey(false);

      // Store survey response
      const { error: surveyError } = await supabase
        .from('survey_responses')
        .insert([{
          user_id: user.id,
          ...survey,
          created_at: new Date().toISOString()
        }]);

      if (surveyError) {
        console.error('Error storing survey response:', surveyError);
      }

      // Store learning path
      const { error: pathError } = await supabase
        .from('learning_programs')
        .insert([{
          user_id: user.id,
          program_data: generatedPath,
          created_at: new Date().toISOString()
        }]);

      if (pathError) {
        console.error('Error storing learning path:', pathError);
      }

      // Get available columns for user_profiles
      let availableColumns: string[] = [];
      try {
        const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'user_profiles' });
        if (!error && data) {
          availableColumns = data.map((col: any) => col.column_name);
        }
      } catch (e) {
        console.log('Could not fetch columns via RPC, using fallback method');
        // Fallback to common columns
        availableColumns = ['id', 'has_completed_survey', 'last_survey_date', 'updated_at'];
      }

      // Build update object with only available columns
      const updateObj: any = { id: user.id };
      
      if (availableColumns.includes('has_completed_survey')) {
        updateObj.has_completed_survey = true;
      }
      
      if (availableColumns.includes('last_survey_date')) {
        updateObj.last_survey_date = new Date().toISOString();
      }
      
      if (availableColumns.includes('updated_at')) {
        updateObj.updated_at = new Date().toISOString();
      }
      
      // Update user profile if we have fields to update
      if (Object.keys(updateObj).length > 1) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert(updateObj);

        if (profileError) {
          console.error('Error updating user profile:', profileError);
          
          // If the error is schema-related, try to auto-fix it
          if (profileError.message.includes('column') && profileError.message.includes('not found')) {
            await clearSchemaCache();
          }
        }
      }

      // Store user interaction
      const { error: interactionError } = await supabase
        .from('user_interactions')
        .insert([{
          user_id: user.id,
          interaction_type: 'survey_completion',
          interaction_data: {
            survey_data: survey,
            learning_path: generatedPath
          },
          created_at: new Date().toISOString()
        }]);

      if (interactionError) {
        console.error('Error storing user interaction:', interactionError);
      }

    } catch (error) {
      console.error('Error handling survey completion:', error);
      alert('There was an error saving your survey. Please try again.');
    }
  };

  const handleSurveyClose = () => {
    setShowSurvey(false);
    navigate('/');
  };

  const handleStartLearning = () => {
    navigate('/dashboard');
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUserProfile(null);
      console.log('User signed out successfully');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      console.log('Starting Google sign in...');
      
      // First, clear the schema cache to prevent issues
      await clearSchemaCache();
      
      // Clear any existing sessions first
      await supabase.auth.signOut();
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      // Use a small delay to ensure session is cleared
      setTimeout(async () => {
        try {
          // Important: Make sure the redirect URL matches what's in Supabase
          const redirectUrl = `${window.location.origin}/assessment`;
          console.log('Google auth redirect URL:', redirectUrl);
          
          // Additional logging for debugging
          console.log('Current origin:', window.location.origin);
          console.log('Current hostname:', window.location.hostname);
          console.log('Current port:', window.location.port);
          
          // Make sure the provider is spelled correctly and configured in Supabase
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: redirectUrl,
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
              },
              // Disable pkce for debugging if needed
              // skipBrowserRedirect: false,
            }
          });
          
          if (error) {
            console.error('Google sign in error:', error);
            setAuthError(`Login error: ${error.message}`);
            setLoading(false);
            return;
          }
          
          console.log('Sign in initiated, URL:', data?.url);
          // Open URL in current window to avoid popup blockers
          if (data?.url) {
            window.location.href = data.url;
          } else {
            console.error('No redirect URL returned from Supabase');
            setAuthError('Authentication error: No redirect URL provided');
            setLoading(false);
          }
        } catch (innerErr: any) {
          console.error('Error during OAuth redirect:', innerErr);
          setAuthError(`OAuth error: ${innerErr.message || 'Unknown error'}`);
          setLoading(false);
        }
      }, 500);
    } catch (err: any) {
      console.error('Unexpected error during sign in:', err);
      setAuthError(`Error: ${err.message || 'Unknown error'}`);
      setLoading(false);
    }
  };

  // For testing direct login with email/password if OAuth isn't working
  const handleDirectTestLogin = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      
      // Use your test account credentials here
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com', // Replace with your test user
        password: 'testpassword123' // Replace with your test password
      });
      
      if (error) {
        console.error('Test login error:', error);
        setAuthError(`Test login error: ${error.message}`);
        setLoading(false);
        return;
      }
      
      console.log('Test login successful:', data);
      await checkAuthAndProfile();
    } catch (err: any) {
      console.error('Unexpected error during test login:', err);
      setAuthError(`Error: ${err.message}`);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!userProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to Continue</h2>
            <p className="text-gray-600 mb-6">Please sign in to take the initial assessment and create your personalized study plan.</p>
            
            {authError && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {authError}
              </div>
            )}
            
            <button
              onClick={handleSignIn}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors"
              disabled={loading}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9895 10.1871C19.9895 9.36767 19.9214 8.76973 19.7742 8.14966H10.1992V11.848H15.8195C15.7062 12.7671 15.0943 14.1512 13.7346 15.0813L13.7155 15.2051L16.7429 17.4969L16.9527 17.5174C18.8789 15.7789 19.9895 13.2212 19.9895 10.1871Z" fill="#4285F4"/>
                <path d="M10.1993 19.9313C12.9527 19.9313 15.2643 19.0454 16.9527 17.5174L13.7346 15.0813C12.8734 15.6682 11.7176 16.0779 10.1993 16.0779C7.50243 16.0779 5.21352 14.3395 4.39759 11.9366L4.27799 11.9466L1.13003 14.3273L1.08887 14.4391C2.76588 17.6945 6.21061 19.9313 10.1993 19.9313Z" fill="#34A853"/>
                <path d="M4.39748 11.9366C4.18219 11.3166 4.05759 10.6521 4.05759 9.96565C4.05759 9.27909 4.18219 8.61473 4.38615 7.99466L4.38045 7.8626L1.19304 5.44366L1.08875 5.49214C0.397576 6.84305 0.000976562 8.36008 0.000976562 9.96565C0.000976562 11.5712 0.397576 13.0882 1.08875 14.4391L4.39748 11.9366Z" fill="#FBBC05"/>
                <path d="M10.1993 3.85336C12.1142 3.85336 13.406 4.66168 14.1425 5.33717L17.0207 2.59107C15.253 0.985496 12.9527 0 10.1993 0C6.2106 0 2.76588 2.23672 1.08887 5.49214L4.38626 7.99466C5.21352 5.59183 7.50242 3.85336 10.1993 3.85336Z" fill="#EB4335"/>
              </svg>
              <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
            </button>
            
            <div className="mt-4">
              <button 
                onClick={handleDirectTestLogin}
                className="text-xs text-indigo-600 hover:text-indigo-800"
              >
                Use test account (for debugging)
              </button>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col space-y-2">
              <p className="text-sm text-gray-500">Having trouble signing in?</p>
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={async () => {
                    setLoading(true);
                    await clearAllAuthData();
                    setAuthError('All sessions cleared, try signing in again');
                    setLoading(false);
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Clear all sessions
                </button>
                <button 
                  onClick={async () => {
                    setLoading(true);
                    await clearSchemaCache();
                    setAuthError('Schema cache cleared, try signing in again');
                    setLoading(false);
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Clear schema cache
                </button>
                <a 
                  href="https://app.supabase.com/project/_/auth/providers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Check Supabase settings
                </a>
                <button
                  onClick={() => checkCurrentAuthState()}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Check auth status
                </button>
                <a
                  href="/"
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Return to home
                </a>
                <a
                  href="/supabase-setup"
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Database setup &amp; diagnostics
                </a>
                <a
                  href="https://app.supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Go to Supabase Dashboard
                </a>
              </div>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              {Object.keys(debugInfo).length > 0 && (
                <pre className="text-left bg-gray-100 p-2 rounded text-xs overflow-auto max-h-20">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}

      {userProfile && step === 'survey' && showSurvey && (
        <InitialSurvey 
          onComplete={handleSurveyComplete} 
          onClose={handleSurveyClose}
          userProfile={userProfile}
        />
      )}
      
      {userProfile && step === 'plan' && learningPath && (
        <StudyPlan 
          learningPath={learningPath} 
          onStart={handleStartLearning}
          userProfile={userProfile}
        />
      )}
      
      <ElevenLabsWidget />
    </div>
  );
};

export default Assessment; 