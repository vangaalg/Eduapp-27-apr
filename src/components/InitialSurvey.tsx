import React, { useState, useEffect } from 'react';
import { StudentSurvey } from '../types/survey';
import { X } from 'lucide-react';
import { saveSurveyResponse, hasSurveyResponse } from '../utils/surveyStorage';
import { supabase } from '../lib/supabaseClient';
import OpenAI from 'openai';

interface InitialSurveyProps {
  onComplete: (survey: StudentSurvey) => void;
  onClose: () => void;
}

const STATES = [
  'Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Haryana',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab',
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
];

const PHYSICS_TOPICS = [
  'Kinematics', 'Laws of Motion', 'Work, Energy and Power',
  'Rotational Motion', 'Gravitation', 'Properties of Matter',
  'Thermodynamics', 'Oscillations', 'Waves', 'Electrostatics',
  'Current Electricity', 'Magnetic Effects', 'Electromagnetic Induction',
  'Optics', 'Modern Physics'
];

const CHEMISTRY_TOPICS = [
  'Atomic Structure', 'Chemical Bonding', 'States of Matter',
  'Thermodynamics', 'Chemical Equilibrium', 'Redox Reactions',
  'Organic Chemistry Basics', 'Hydrocarbons', 'Periodic Table',
  'Chemical Kinetics', 'Surface Chemistry', 'Electrochemistry',
  'Coordination Compounds', 'P-Block Elements', 'Biomolecules'
];

const MATHEMATICS_TOPICS = [
  'Sets and Functions', 'Complex Numbers', 'Matrices and Determinants',
  'Permutations and Combinations', 'Mathematical Induction',
  'Binomial Theorem', 'Sequences and Series', 'Limits and Derivatives',
  'Integrals', 'Differential Equations', 'Vectors', '3D Geometry',
  'Probability', 'Statistics', 'Mathematical Reasoning'
];

const TOP_INSTITUTES = [
  'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur',
  'IIT Kharagpur', 'IIT Roorkee', 'IIT Guwahati', 'IIT Hyderabad'
];

const InitialSurvey: React.FC<InitialSurveyProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState<StudentSurvey>({
    name: '',
    age: 0,
    class: '12',
    state: '',
    city: '',
    school: '',
    targetYear: '',
    targetSession: 'April',
    preferredLanguage: 'English',
    previousAttempts: 0,
    subjects: {
      physics: { confidence: 3, weakTopics: [] },
      chemistry: { confidence: 3, weakTopics: [] },
      mathematics: { confidence: 3, weakTopics: [] }
    },
    studyHoursPerDay: 6,
    hasPersonalTutor: false,
    preferredStudyTime: 'Morning',
    targetInstitutes: []
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
        
        if (user) {
          const hasResponse = await hasSurveyResponse();
          if (hasResponse) {
            setHasSubmitted(true);
            onClose();
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check authentication status');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [onClose]);

  useEffect(() => {
    const validateForm = () => {
      const isPersonalInfoValid = formData.name && formData.age > 0 && formData.class && formData.state;
      const isExamPrefsValid = formData.targetYear && formData.targetSession;
      const isSubjectsValid = Object.values(formData.subjects).every(subject => 
        subject.confidence >= 1 && subject.confidence <= 5 && subject.weakTopics.length > 0
      );
      const isStudyPrefsValid = formData.studyHoursPerDay > 0 && formData.preferredStudyTime && formData.targetInstitutes.length > 0;

      setIsFormValid(isPersonalInfoValid && isExamPrefsValid && isSubjectsValid && isStudyPrefsValid);
    };

    validateForm();
  }, [formData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to Continue</h2>
          <p className="text-gray-600 mb-6">Please sign in to take the initial assessment and create your personalized study plan.</p>
          <button
            onClick={() => supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: `${window.location.origin}/assessment`,
                queryParams: {
                  access_type: 'offline',
                  prompt: 'consent'
                }
              }
            })}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        {error}
      </div>
    );
  }

  if (hasSubmitted) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) || 0 : value
      }));
    }
  };

  const handleSubjectConfidence = (subject: keyof StudentSurvey['subjects'], value: number) => {
    setFormData(prev => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [subject]: {
          ...prev.subjects[subject],
          confidence: value as 1 | 2 | 3 | 4 | 5
        }
      }
    }));
  };

  const handleWeakTopics = (subject: keyof StudentSurvey['subjects'], topic: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [subject]: {
          ...prev.subjects[subject],
          weakTopics: prev.subjects[subject].weakTopics.includes(topic)
            ? prev.subjects[subject].weakTopics.filter(t => t !== topic)
            : [...prev.subjects[subject].weakTopics, topic]
        }
      }
    }));
  };

  const handleTargetInstitutes = (institute: string) => {
    setFormData(prev => ({
      ...prev,
      targetInstitutes: prev.targetInstitutes.includes(institute)
        ? prev.targetInstitutes.filter(i => i !== institute)
        : [...prev.targetInstitutes, institute]
    }));
  };

  const analyzeWithOpenAI = async (surveyData: StudentSurvey) => {
    try {
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      });

      const prompt = `
        Based on the following student survey data, create a personalized learning program:
        - Student Profile: ${surveyData.name}, Class ${surveyData.class}
        - Weak Topics in Physics: ${surveyData.subjects.physics.weakTopics.join(', ')}
        - Weak Topics in Chemistry: ${surveyData.subjects.chemistry.weakTopics.join(', ')}
        - Weak Topics in Mathematics: ${surveyData.subjects.mathematics.weakTopics.join(', ')}
        - Study Hours: ${surveyData.studyHoursPerDay} hours per day
        - Preferred Time: ${surveyData.preferredStudyTime}
        - Target Institutes: ${surveyData.targetInstitutes.join(', ')}
        
        Create a structured learning program that includes:
        1. Daily study schedule
        2. Topic-wise study plan
        3. Practice recommendations
        4. Test series schedule
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI Analysis Error:', error);
      throw new Error('Failed to analyze survey data');
    }
  };

  const handleSubmitSurvey = async () => {
    try {
      setIsLoading(true);
      
      // Save survey response to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error: surveyError } = await supabase
        .from('survey_responses')
        .insert([
          {
            user_id: user.id,
            ...formData,
            created_at: new Date().toISOString(),
          }
        ]);

      if (surveyError) throw surveyError;

      // Generate learning program using OpenAI
      const learningProgram = await analyzeWithOpenAI(formData);

      // Save learning program to Supabase
      const { error: programError } = await supabase
        .from('learning_programs')
        .insert([
          {
            user_id: user.id,
            program_data: learningProgram,
            created_at: new Date().toISOString(),
          }
        ]);

      if (programError) throw programError;

      await saveSurveyResponse(formData);
      setHasSubmitted(true);
      onComplete(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save survey');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      await handleSubmitSurvey();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Class</label>
          <select
            name="class"
            value={formData.class || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select Class</option>
            <option value="11">11th</option>
            <option value="12">12th</option>
            <option value="Dropper">Dropper</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <select
            name="state"
            value={formData.state || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select State</option>
            {STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderExamPreferences = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Exam Preferences</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Target Year</label>
          <select
            name="targetYear"
            value={formData.targetYear || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select Year</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Session</label>
          <select
            name="targetSession"
            value={formData.targetSession || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select Session</option>
            <option value="January">January</option>
            <option value="April">April</option>
            <option value="June">June</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Previous Attempts</label>
          <input
            type="number"
            name="previousAttempts"
            value={formData.previousAttempts || 0}
            onChange={handleInputChange}
            min="0"
            max="2"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Language</label>
          <select
            name="preferredLanguage"
            value={formData.preferredLanguage || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select Language</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSubjectPreferences = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Subject Preferences</h2>
      {['physics', 'chemistry', 'mathematics'].map((subject) => (
        <div key={subject} className="space-y-4">
          <h3 className="text-lg font-medium capitalize">{subject}</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confidence Level (1-5)</label>
            <input
              type="range"
              name={`${subject}.confidence`}
              min="1"
              max="5"
              value={formData.subjects?.[subject as keyof typeof formData.subjects]?.confidence || 3}
              onChange={(e) => handleSubjectConfidence(subject as keyof StudentSurvey['subjects'], parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5)}
              className="mt-1 block w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Not Confident</span>
              <span>Very Confident</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weak Topics</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {(subject === 'physics' ? PHYSICS_TOPICS :
                subject === 'chemistry' ? CHEMISTRY_TOPICS :
                MATHEMATICS_TOPICS).map((topic) => (
                <label key={topic} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.subjects?.[subject as keyof typeof formData.subjects]?.weakTopics.includes(topic)}
                    onChange={(e) => handleWeakTopics(subject as keyof StudentSurvey['subjects'], topic)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{topic}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderStudyPreferences = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Study Preferences</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Study Hours per Day</label>
          <input
            type="number"
            name="studyHoursPerDay"
            value={formData.studyHoursPerDay || ''}
            onChange={handleInputChange}
            min="1"
            max="16"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Study Time</label>
          <select
            name="preferredStudyTime"
            value={formData.preferredStudyTime || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Institutes</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {TOP_INSTITUTES.map((institute) => (
              <label key={institute} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.targetInstitutes?.includes(institute)}
                  onChange={() => handleTargetInstitutes(institute)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{institute}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="col-span-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="hasPersonalTutor"
              checked={formData.hasPersonalTutor || false}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">I have a personal tutor/coaching</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={handleCloseClick}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-50"
          type="button"
        >
          <X size={24} />
        </button>
        
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Student Survey</h1>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">Step {currentStep} of 4</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            {currentStep === 1 && renderPersonalInfo()}
            {currentStep === 2 && renderExamPreferences()}
            {currentStep === 3 && renderSubjectPreferences()}
            {currentStep === 4 && renderStudyPreferences()}

            <div className="mt-6 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Back
                </button>
              )}
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitSurvey}
                  disabled={!isFormValid || isLoading}
                  className={`ml-auto px-4 py-2 text-sm font-medium text-white rounded-md ${
                    isFormValid && !isLoading
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? 'Submitting...' : 'Complete'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InitialSurvey; 