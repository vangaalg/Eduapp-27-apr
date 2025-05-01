import React from 'react';
import { Clock, Book, Target, Calendar, CheckCircle, ArrowRight } from 'lucide-react';

interface StudyPlanProps {
  learningPath: any;
  onStart: () => void;
  userProfile?: {
    email?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

const StudyPlan: React.FC<StudyPlanProps> = ({ learningPath, onStart, userProfile }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center mb-6">
          {userProfile?.avatar_url && (
            <img 
              src={userProfile.avatar_url} 
              alt={userProfile.full_name || 'User'} 
              className="w-12 h-12 rounded-full mr-4"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {userProfile?.full_name || 'Student'}!
            </h1>
            <p className="text-gray-600">Your personalized study plan is ready</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Learning Path</h2>
            <div className="space-y-4">
              {learningPath.subjects?.map((subject: any, index: number) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium text-gray-900">{subject.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{subject.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Study Schedule</h2>
            <div className="space-y-4">
              {learningPath.schedule?.map((day: any, index: number) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium text-gray-900">{day.day}</h3>
                  <ul className="mt-2 space-y-2">
                    {day.tasks.map((task: any, taskIndex: number) => (
                      <li key={taskIndex} className="text-sm text-gray-600">
                        • {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onStart}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            Start Learning
            <ArrowRight className="ml-2" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyPlan; 