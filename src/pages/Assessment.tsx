import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InitialSurvey from '../components/InitialSurvey';
import StudyPlan from '../components/StudyPlan';
import { StudentSurvey } from '../types/survey';
import { examService } from '../services/examDates';
import { supabase } from '../lib/supabaseClient';
import ElevenLabsWidget from '../components/ElevenLabsWidget';

const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'survey' | 'plan'>('survey');
  const [learningPath, setLearningPath] = useState<any>(null);
  const [showSurvey, setShowSurvey] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSurveyComplete = async (survey: StudentSurvey) => {
    try {
      const generatedPath = examService.generateLearningPath(survey);
      setLearningPath(generatedPath);
      setStep('plan');
      setShowSurvey(false);
    } catch (error) {
      console.error('Error generating learning path:', error);
      // Handle error appropriately
    }
  };

  const handleSurveyClose = () => {
    setShowSurvey(false);
    navigate('/');
  };

  const handleStartLearning = () => {
    navigate('/dashboard');
  };

  const handleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/assessment`,
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

  return (
    <div className="min-h-screen bg-gray-50">
      {step === 'survey' && showSurvey && (
        <InitialSurvey 
          onComplete={handleSurveyComplete} 
          onClose={handleSurveyClose}
        />
      )}
      {step === 'plan' && learningPath && (
        <StudyPlan learningPath={learningPath} onStart={handleStartLearning} />
      )}
      <ElevenLabsWidget />
    </div>
  );
};

export default Assessment; 