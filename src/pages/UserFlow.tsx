import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  Book, 
  Clock, 
  Award, 
  CheckCircle,
  AlertCircle,
  BarChart2
} from 'lucide-react';
import { mockTestResults, mockStudyActivities, mockAssessmentResults, mockLearningPlan } from '../data/mockData';
import InitialSurvey from '../components/InitialSurvey';
import { StudentSurvey } from '../types/survey';
import { examService } from '../services/examDates';

interface UserProgress {
  completedAssessments: number;
  totalStudyHours: number;
  weeklyGoalsCompleted: number;
  currentStreak: number;
  overallProgress: number;
  examDate: Date;
  weeksRemaining: number;
}

const UserFlow: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'onboarding' | 'survey' | 'assessment' | 'planning' | 'dashboard'>('survey');
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedAssessments: mockTestResults.length,
    totalStudyHours: mockStudyActivities.reduce((total, activity) => total + activity.timeSpent / 60, 0),
    weeklyGoalsCompleted: 2,
    currentStreak: 3,
    overallProgress: mockLearningPlan.overallProgress,
    examDate: mockLearningPlan.examDate,
    weeksRemaining: 0
  });

  const handleSurveyComplete = (survey: StudentSurvey) => {
    try {
      const learningPath = examService.generateLearningPath(survey);
      
      // Update user progress with exam information
      setUserProgress(prev => ({
        ...prev,
        examDate: learningPath.examDate,
        weeksRemaining: learningPath.weeksRemaining
      }));

      // Move to dashboard
      setCurrentStep('dashboard');
    } catch (error) {
      console.error('Error generating learning path:', error);
      // Handle error appropriately
    }
  };

  const handleSurveyClose = () => {
    // Change the current step to onboarding
    setCurrentStep('onboarding');
  };

  useEffect(() => {
    // Calculate weeks remaining until exam
    const today = new Date();
    const timeUntilExam = userProgress.examDate.getTime() - today.getTime();
    const weeksRemaining = Math.ceil(timeUntilExam / (1000 * 60 * 60 * 24 * 7));
    setUserProgress(prev => ({ ...prev, weeksRemaining }));
  }, []);

  const renderOnboarding = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Your IIT-JEE Journey</h1>
        
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Target className="text-blue-600 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Set Your Goal</h3>
              <p className="text-gray-600">Your journey starts with a clear goal. We'll help you create a personalized path to crack IIT-JEE.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="text-purple-600 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Track Your Progress</h3>
              <p className="text-gray-600">Regular assessments and progress tracking help you stay on course and identify areas for improvement.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Book className="text-green-600 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Personalized Learning</h3>
              <p className="text-gray-600">Get customized study materials and practice questions based on your performance.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Let's Begin Your Preparation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/assessment')}
              className="p-4 border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <h3 className="font-semibold text-blue-900">Take Initial Assessment</h3>
              <p className="text-sm text-blue-700">Evaluate your current preparation level</p>
            </button>
            <button
              onClick={() => navigate('/upload-results')}
              className="p-4 border border-purple-200 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
            >
              <h3 className="font-semibold text-purple-900">Upload Previous Results</h3>
              <p className="text-sm text-purple-700">Already have mock test results? Upload them</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSurvey = () => (
    <InitialSurvey onComplete={handleSurveyComplete} onClose={handleSurveyClose} />
  );

  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Study Plan */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Learning Path</h2>
              <div className="flex items-center space-x-2 text-blue-600">
                <Clock className="w-5 h-5" />
                <span>{userProgress.weeksRemaining} weeks until IIT-JEE</span>
              </div>
            </div>

            {/* Recent Test Results */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Test Results</h3>
              <div className="space-y-4">
                {mockTestResults.map(test => (
                  <div key={test.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{test.type === 'quiz' ? 'Quiz' : 'Mock Test'} - {test.subject}</h4>
                        <p className="text-sm text-gray-600">{test.date.toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        test.score >= 75 ? 'bg-green-100 text-green-800' :
                        test.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {test.score}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Correct: {test.correctAnswers}/{test.totalQuestions}</p>
                      <p>Time Spent: {test.timeSpent} minutes</p>
                      <p className="mt-2">Weak Areas: {test.weakAreas.join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockAssessmentResults.map(subject => (
                  <div key={subject.subject} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{subject.subject}</h4>
                      <span className={`text-${subject.score >= 75 ? 'green' : subject.score >= 60 ? 'yellow' : 'red'}-600 font-semibold`}>
                        {subject.score}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div 
                        className={`h-full ${
                          subject.score >= 75 ? 'bg-green-500' :
                          subject.score >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        } rounded-full`}
                        style={{ width: `${subject.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Progress</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completed Assessments</span>
                <span className="font-semibold">{userProgress.completedAssessments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Study Hours</span>
                <span className="font-semibold">{Math.round(userProgress.totalStudyHours)}h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Current Streak</span>
                <span className="font-semibold">{userProgress.currentStreak} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Overall Progress</span>
                <span className="font-semibold">{userProgress.overallProgress}%</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/assessment')}
                className="w-full p-3 text-left rounded-lg hover:bg-gray-50 flex items-center space-x-3"
              >
                <BarChart2 className="text-blue-600" />
                <span>Take Practice Test</span>
              </button>
              <button
                onClick={() => navigate('/study-materials')}
                className="w-full p-3 text-left rounded-lg hover:bg-gray-50 flex items-center space-x-3"
              >
                <Book className="text-green-600" />
                <span>Study Materials</span>
              </button>
              <button
                onClick={() => navigate('/performance')}
                className="w-full p-3 text-left rounded-lg hover:bg-gray-50 flex items-center space-x-3"
              >
                <TrendingUp className="text-purple-600" />
                <span>View Analytics</span>
              </button>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Achievements</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-yellow-100 flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-xs mt-2">5 Day Streak</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-xs mt-2">Top Score</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-xs mt-2">Chapter Master</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep === 'onboarding' && renderOnboarding()}
      {currentStep === 'survey' && renderSurvey()}
      {currentStep === 'dashboard' && renderDashboard()}
    </div>
  );
};

export default UserFlow; 