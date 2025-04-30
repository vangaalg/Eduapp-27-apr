import React from 'react';
import { Clock, Book, Target, Calendar, CheckCircle } from 'lucide-react';

interface StudyPlanProps {
  learningPath: {
    examDate: Date;
    applicationDeadline: Date;
    weeksRemaining: number;
    recommendedHoursPerDay: number;
    subjectDistribution: {
      physics: number;
      chemistry: number;
      mathematics: number;
    };
    weakTopics: {
      physics: string[];
      chemistry: string[];
      mathematics: string[];
    };
    dailySchedule: {
      preferredTimeSlot: {
        start: string;
        end: string;
      };
      sessions: {
        duration: number;
        type: string;
      }[];
    };
    weeklyAssessments: {
      week: number;
      quizzes: {
        subject: string;
        duration: number;
      }[];
      mockTest: {
        subject: string;
        duration: number;
      } | null;
    }[];
  };
  onStart: () => void;
}

const StudyPlan: React.FC<StudyPlanProps> = ({ learningPath, onStart }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Personalized Study Plan</h1>
          <p className="text-gray-600">
            Based on your assessment and preferences, we've created a customized study plan to help you
            achieve your IIT-JEE goals.
          </p>
        </div>

        {/* Key Dates and Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Exam Date</h3>
            </div>
            <p className="text-blue-800">{formatDate(learningPath.examDate)}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Weeks Remaining</h3>
            </div>
            <p className="text-purple-800">{learningPath.weeksRemaining} weeks</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Book className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Daily Study Hours</h3>
            </div>
            <p className="text-green-800">{learningPath.recommendedHoursPerDay} hours</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Target className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-gray-900">Next Assessment</h3>
            </div>
            <p className="text-yellow-800">Week 1 Quizzes</p>
          </div>
        </div>

        {/* Subject Distribution */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recommended Focus Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(learningPath.subjectDistribution).map(([subject, percentage]) => (
              <div key={subject} className="border rounded-lg p-4">
                <h3 className="font-medium capitalize mb-2">{subject}</h3>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      subject === 'physics'
                        ? 'bg-blue-500'
                        : subject === 'chemistry'
                        ? 'bg-green-500'
                        : 'bg-purple-500'
                    }`}
                    style={{ width: `${Math.round(percentage * 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {Math.round(percentage * 100)}% of study time
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Schedule */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Daily Study Schedule</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-4">
              Preferred study time: {learningPath.dailySchedule.preferredTimeSlot.start} -{' '}
              {learningPath.dailySchedule.preferredTimeSlot.end}
            </p>
            <div className="space-y-3">
              {learningPath.dailySchedule.sessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        session.type === 'Focus Session' ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                    />
                    <span className="font-medium">{session.type}</span>
                  </div>
                  <span className="text-gray-600">{session.duration} hours</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Focus Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(learningPath.weakTopics).map(([subject, topics]) => (
              <div key={subject} className="border rounded-lg p-4">
                <h3 className="font-medium capitalize mb-3">{subject}</h3>
                <ul className="space-y-2">
                  {topics.map((topic) => (
                    <li key={topic} className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment Schedule */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Assessment Schedule</h2>
          <div className="space-y-4">
            {learningPath.weeklyAssessments.slice(0, 4).map((week) => (
              <div key={week.week} className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">Week {week.week}</h3>
                <div className="space-y-2">
                  {week.quizzes.map((quiz) => (
                    <div key={quiz.subject} className="flex items-center justify-between text-sm">
                      <span>{quiz.subject} Quiz</span>
                      <span className="text-gray-600">{quiz.duration} minutes</span>
                    </div>
                  ))}
                  {week.mockTest && (
                    <div className="flex items-center justify-between text-sm font-medium text-blue-600">
                      <span>Full Mock Test</span>
                      <span>{week.mockTest.duration} minutes</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={onStart}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Start Your Learning Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyPlan; 