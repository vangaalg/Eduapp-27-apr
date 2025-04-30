import React, { useState, useEffect } from 'react';
import { openaiService } from '../services/openai';
import { testResultsService, AggregatedResults } from '../services/testResults';
import { supabase } from '../lib/supabaseClient';
import { Loader2 } from 'lucide-react';

interface LearningPlanFormData {
  strengths: string[];
  weaknesses: string[];
  learningStyle: string;
  pace: string;
  lastPerformance: {
    subject: string;
    score: number;
    date: Date;
  }[];
  timeframe: number;
}

const LearningPlanGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [testResults, setTestResults] = useState<AggregatedResults | null>(null);
  const [formData, setFormData] = useState<LearningPlanFormData>({
    strengths: [],
    weaknesses: [],
    learningStyle: '',
    pace: '',
    lastPerformance: [],
    timeframe: 12 // Default to 12 weeks for IIT-JEE preparation
  });

  useEffect(() => {
    loadTestResults();
  }, []);

  const loadTestResults = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const results = await testResultsService.getAggregatedResults(user.id);
        setTestResults(results);
        
        // Update form data with aggregated results
        const strengths: string[] = [];
        const weaknesses: string[] = [];
        const performance: { subject: string; score: number; date: Date }[] = [];

        Object.entries(results.subjects).forEach(([subject, data]) => {
          // Add subject strengths and weaknesses
          strengths.push(...data.strengths);
          weaknesses.push(...data.weaknesses);

          // Add most recent performance
          if (data.recentScores.length > 0) {
            const mostRecent = data.recentScores[0];
            performance.push({
              subject,
              score: mostRecent.score,
              date: new Date(mostRecent.date)
            });
          }
        });

        setFormData(prev => ({
          ...prev,
          strengths: [...new Set(strengths)], // Remove duplicates
          weaknesses: [...new Set(weaknesses)], // Remove duplicates
          lastPerformance: performance
        }));
      }
    } catch (error) {
      console.error('Error loading test results:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const learningPlan = await openaiService.generateLearningPlan(formData, formData.timeframe);
      setPlan(learningPlan);
    } catch (error) {
      console.error('Error generating learning plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArrayInput = (e: React.ChangeEvent<HTMLInputElement>, field: 'strengths' | 'weaknesses') => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value.split(',').map(item => item.trim())
    }));
  };

  const handlePerformanceAdd = () => {
    setFormData(prev => ({
      ...prev,
      lastPerformance: [
        ...prev.lastPerformance,
        { subject: '', score: 0, date: new Date() }
      ]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Generate Your IIT-JEE Learning Plan</h2>
      
      {testResults && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Your Test Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-lg border border-blue-100">
              <p className="text-sm text-gray-600">Overall Score</p>
              <p className="text-2xl font-bold text-blue-600">{Math.round(testResults.overallScore)}%</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-100">
              <p className="text-sm text-gray-600">Subjects Tested</p>
              <p className="text-2xl font-bold text-blue-600">{Object.keys(testResults.subjects).length}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-100">
              <p className="text-sm text-gray-600">Tests Taken</p>
              <p className="text-2xl font-bold text-blue-600">
                {Object.values(testResults.subjects).reduce((total, subject) => total + subject.recentScores.length, 0)}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Your Strengths (comma-separated)
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Physics Mechanics, Organic Chemistry, Calculus"
            value={formData.strengths.join(', ')}
            onChange={(e) => handleArrayInput(e, 'strengths')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Areas to Improve (comma-separated)
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Electromagnetic Theory, Physical Chemistry, Coordinate Geometry"
            value={formData.weaknesses.join(', ')}
            onChange={(e) => handleArrayInput(e, 'weaknesses')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Your Learning Style
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.learningStyle}
            onChange={(e) => setFormData(prev => ({ ...prev, learningStyle: e.target.value }))}
          >
            <option value="">Select your learning style</option>
            <option value="visual">Visual Learner</option>
            <option value="auditory">Auditory Learner</option>
            <option value="reading">Reading/Writing Preference</option>
            <option value="kinesthetic">Kinesthetic Learner</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Study Pace
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.pace}
            onChange={(e) => setFormData(prev => ({ ...prev, pace: e.target.value }))}
          >
            <option value="">Select your preferred pace</option>
            <option value="intensive">Intensive (8+ hours/day)</option>
            <option value="moderate">Moderate (4-6 hours/day)</option>
            <option value="relaxed">Relaxed (2-4 hours/day)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Weeks until IIT-JEE
          </label>
          <input
            type="number"
            min="1"
            max="52"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.timeframe}
            onChange={(e) => setFormData(prev => ({ ...prev, timeframe: parseInt(e.target.value) }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recent Performance
          </label>
          {formData.lastPerformance.map((perf, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 mt-2">
              <input
                type="text"
                placeholder="Subject"
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={perf.subject}
                onChange={(e) => {
                  const newPerf = [...formData.lastPerformance];
                  newPerf[index].subject = e.target.value;
                  setFormData(prev => ({ ...prev, lastPerformance: newPerf }));
                }}
              />
              <input
                type="number"
                placeholder="Score (%)"
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={perf.score}
                onChange={(e) => {
                  const newPerf = [...formData.lastPerformance];
                  newPerf[index].score = parseInt(e.target.value);
                  setFormData(prev => ({ ...prev, lastPerformance: newPerf }));
                }}
              />
              <input
                type="date"
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={perf.date.toISOString().split('T')[0]}
                onChange={(e) => {
                  const newPerf = [...formData.lastPerformance];
                  newPerf[index].date = new Date(e.target.value);
                  setFormData(prev => ({ ...prev, lastPerformance: newPerf }));
                }}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handlePerformanceAdd}
            className="mt-2 text-sm text-blue-600 hover:text-blue-500"
          >
            + Add Performance Record
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Generating Plan...
            </>
          ) : (
            'Generate Learning Plan'
          )}
        </button>
      </form>

      {plan && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Your Personalized Learning Plan</h3>
          <div className="space-y-6">
            {plan.weeks.map((week: any) => (
              <div key={week.week} className="border rounded-lg p-4">
                <h4 className="font-medium text-lg mb-2">Week {week.week}</h4>
                <div className="space-y-4">
                  {week.topics.map((topic: any, index: number) => (
                    <div key={index}>
                      <h5 className="font-medium">{topic.subject}</h5>
                      <ul className="list-disc list-inside ml-4">
                        {topic.topics.map((t: string, i: number) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                      <p className="text-sm text-gray-600 mt-1">
                        Recommended study hours: {topic.recommendedHours}
                      </p>
                    </div>
                  ))}
                  <div className="mt-4">
                    <h5 className="font-medium">Goals for the week:</h5>
                    <ul className="list-disc list-inside ml-4">
                      {week.goals.map((goal: string, index: number) => (
                        <li key={index}>{goal}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPlanGenerator; 