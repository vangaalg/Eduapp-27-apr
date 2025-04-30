import { useEffect, useState } from 'react';
import { testSupabaseConnection } from '../utils/testConnection';
import InitialSurvey from '../components/InitialSurvey';
import { supabase } from '../lib/supabaseClient';
import { StudentSurvey } from '../types/survey';

export default function TestPage() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
  const [showSurvey, setShowSurvey] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await testSupabaseConnection();
      setConnectionStatus(isConnected ? 'Connected' : 'Connection Failed');
    };

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkConnection();
    checkUser();
  }, []);

  const handleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      
      if (error) {
        console.error('Sign in error:', error.message);
      }
    } catch (err) {
      console.error('Sign in error:', err);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleSurveyComplete = async (survey: StudentSurvey) => {
    console.log('Survey completed:', survey);
    setShowSurvey(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Supabase Connection:</h2>
          <p className={connectionStatus === 'Connected' ? 'text-green-600' : 'text-red-600'}>
            {connectionStatus}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Authentication:</h2>
          {user ? (
            <div className="space-y-2">
              <p className="text-green-600">Signed in as: {user.email}</p>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sign in with Google
            </button>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold">Survey Form:</h2>
          {user ? (
            <button
              onClick={() => setShowSurvey(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Open Survey
            </button>
          ) : (
            <p className="text-gray-600">Please sign in to access the survey</p>
          )}
        </div>
      </div>

      {showSurvey && (
        <InitialSurvey
          onComplete={handleSurveyComplete}
          onClose={() => setShowSurvey(false)}
        />
      )}
    </div>
  );
} 