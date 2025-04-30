import React, { useState } from 'react';
import { StudentSurvey } from '../types/survey';

interface InitialSurveyProps {
  onComplete: (survey: StudentSurvey) => void;
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

const InitialSurvey: React.FC<InitialSurveyProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<StudentSurvey>>({
    subjects: {
      physics: { confidence: 3, weakTopics: [] },
      chemistry: { confidence: 3, weakTopics: [] },
      mathematics: { confidence: 3, weakTopics: [] }
    },
    targetInstitutes: [],
    previousAttempts: 0,
    studyHoursPerDay: 6,
    hasPersonalTutor: false,
    preferredStudyTime: 'Morning'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else if (name.includes('confidence')) {
      const [subject] = name.split('.');
      setFormData(prev => ({
        ...prev,
        subjects: {
          ...prev.subjects,
          [subject]: {
            ...prev.subjects?.[subject as keyof typeof prev.subjects],
            confidence: parseInt(value) as 1 | 2 | 3 | 4 | 5
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleMultiSelect = (name: string, value: string) => {
    setFormData(prev => {
      const currentArray = prev[name as keyof typeof prev] as string[] || [];
      if (currentArray.includes(value)) {
        return {
          ...prev,
          [name]: currentArray.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [name]: [...currentArray, value]
        };
      }
    });
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(formData as StudentSurvey);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
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
              onChange={handleInputChange}
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
                    onChange={() => handleMultiSelect(`subjects.${subject}.weakTopics`, topic)}
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
                  onChange={() => handleMultiSelect('targetInstitutes', institute)}
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Student Survey</h1>
            <span className="text-sm text-gray-500">Step {currentStep} of 4</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          {currentStep === 1 && renderPersonalInfo()}
          {currentStep === 2 && renderExamPreferences()}
          {currentStep === 3 && renderSubjectPreferences()}
          {currentStep === 4 && renderStudyPreferences()}

          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBack}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              disabled={currentStep === 1}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {currentStep === 4 ? 'Complete' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InitialSurvey; 