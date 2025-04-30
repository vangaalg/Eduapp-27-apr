import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InitialSurvey from '../components/InitialSurvey';
import StudyPlan from '../components/StudyPlan';
import { StudentSurvey } from '../types/survey';
import { examService } from '../services/examDates';

const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'survey' | 'plan'>('survey');
  const [learningPath, setLearningPath] = useState<any>(null);

  const handleSurveyComplete = (survey: StudentSurvey) => {
    try {
      const generatedPath = examService.generateLearningPath(survey);
      setLearningPath(generatedPath);
      setStep('plan');
    } catch (error) {
      console.error('Error generating learning path:', error);
      // Handle error appropriately
    }
  };

  const handleStartLearning = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {step === 'survey' && <InitialSurvey onComplete={handleSurveyComplete} />}
      {step === 'plan' && learningPath && (
        <StudyPlan learningPath={learningPath} onStart={handleStartLearning} />
      )}
    </div>
  );
};

export default Assessment; 