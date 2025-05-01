import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InitialSurvey from '../components/InitialSurvey';
import StudyPlan from '../components/StudyPlan';
import { StudentSurvey } from '../types/survey';
import { examService } from '../services/examDates';
import { supabase } from '../lib/supabaseClient';

// Define types for our state
interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  has_completed_survey: boolean;
  last_survey_date?: string;
}

const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [survey, setSurvey] = useState<StudentSurvey | null>(null);
  const [generatedPath, setGeneratedPath] = useState<any>(null);
  const [step, setStep] = useState<'survey' | 'plan'>('survey');
  const [showSurvey, setShowSurvey] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await checkAuthAndProfile();
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
      } else if (event === 'USER_UPDATED') {
        await checkAuthAndProfile();
      }
    });

    // Initial auth check
    checkAuthAndProfile();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuthAndProfile = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        setAuthError(authError.message);
        throw authError;
      }

      if (user) {
        // Fetch user profile from Supabase
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          setAuthError(`Profile error: ${profileError.message}`);
          throw profileError;
        }

        // If no profile exists, create one
        if (!profile) {
          const newProfile: UserProfile = {
            id: user.id,
            email: user.email || undefined,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name,
            has_completed_survey: false
          };

          const { error: insertError } = await supabase
            .from('user_profiles')
            .upsert([newProfile]);

          if (insertError) {
            setAuthError(`Profile creation error: ${insertError.message}`);
            throw insertError;
          }

          setUserProfile(newProfile);
        } else {
          setUserProfile(profile);
          if (profile.has_completed_survey) {
            const { data: path } = await supabase
              .from('learning_programs')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();

            if (path) {
              setGeneratedPath(path.program_data);
              setStep('plan');
              setShowSurvey(false);
            }
          }
        }
      }
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSurveyComplete = async (survey: StudentSurvey) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate learning path
      const generatedPath = examService.generateLearningPath(survey);
      setGeneratedPath(generatedPath);
      setStep('plan');
      setShowSurvey(false);

      // Store survey response and learning path
      await Promise.all([
        supabase.from('survey_responses').insert([{
          user_id: user.id,
          ...survey,
          created_at: new Date().toISOString()
        }]),
        supabase.from('learning_programs').insert([{
          user_id: user.id,
          program_data: generatedPath,
          created_at: new Date().toISOString()
        }]),
        supabase.from('user_profiles').upsert([{
          id: user.id,
          has_completed_survey: true,
          last_survey_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
      ]);

    } catch (error: any) {
      setAuthError('Error saving survey. Please try again.');
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
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/assessment`
        }
      });
      
      if (error) {
        setAuthError(`Login error: ${error.message}`);
      }
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
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
            
            <div className="mt-6">
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <img src="/google-icon.svg" alt="Google" className="h-5 w-5 mr-2" />
                {loading ? 'Signing in...' : 'Sign in with Google'}
              </button>
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
      
      {userProfile && step === 'plan' && generatedPath && (
        <StudyPlan 
          learningPath={generatedPath} 
          onStart={handleStartLearning}
          userProfile={userProfile}
        />
      )}
    </div>
  );
};

export default Assessment; 