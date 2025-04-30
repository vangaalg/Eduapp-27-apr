import React, { useState } from 'react';
import { Calendar, Clock, BarChart2, Filter, ChevronDown, FileText, AlertTriangle } from 'lucide-react';

// Sample mock tests data
const mockTests = [
  {
    id: 1,
    title: 'JEE Main Full Mock Test 1',
    type: 'Full Length',
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    questions: 90,
    duration: '3 hours',
    difficulty: 'Hard',
    date: '2025-06-25',
  },
  {
    id: 2,
    title: 'Physics - Mechanics',
    type: 'Subject',
    subjects: ['Physics'],
    questions: 30,
    duration: '1 hour',
    difficulty: 'Medium',
    date: '2025-06-20',
  },
  {
    id: 3,
    title: 'Organic Chemistry - Quick Test',
    type: 'Topic',
    subjects: ['Chemistry'],
    questions: 15,
    duration: '30 minutes',
    difficulty: 'Medium',
    date: '2025-06-18',
  },
  {
    id: 4,
    title: 'Mathematics - Calculus',
    type: 'Topic',
    subjects: ['Mathematics'],
    questions: 20,
    duration: '45 minutes',
    difficulty: 'Hard',
    date: '2025-06-22',
  },
  {
    id: 5,
    title: 'JEE Advanced Style Test',
    type: 'Full Length',
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    questions: 54,
    duration: '3 hours',
    difficulty: 'Very Hard',
    date: '2025-06-30',
  },
  {
    id: 6,
    title: 'Chemistry - Physical Chemistry',
    type: 'Subject',
    subjects: ['Chemistry'],
    questions: 25,
    duration: '1 hour',
    difficulty: 'Medium',
    date: '2025-06-19',
  },
];

// Sample previous attempt data
const previousAttempts = [
  {
    id: 101,
    title: 'JEE Main Full Mock Test 1',
    date: '2025-06-10',
    score: 78,
    totalMarks: 360,
    scoreObtained: 280,
    percentile: 92.5,
    physics: { correct: 24, incorrect: 6, unattempted: 0, score: 96 },
    chemistry: { correct: 20, incorrect: 8, unattempted: 2, score: 80 },
    mathematics: { correct: 26, incorrect: 3, unattempted: 1, score: 104 },
  },
  {
    id: 102,
    title: 'Physics - Electromagnetism',
    date: '2025-06-08',
    score: 85,
    totalMarks: 120,
    scoreObtained: 102,
    percentile: 88.7,
    physics: { correct: 25, incorrect: 5, unattempted: 0, score: 102 },
  },
  {
    id: 103,
    title: 'Chemistry - Organic Chemistry',
    date: '2025-06-05',
    score: 62,
    totalMarks: 60,
    scoreObtained: 37,
    percentile: 76.3,
    chemistry: { correct: 12, incorrect: 5, unattempted: 3, score: 37 },
  },
];

const MockTestsPage = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'previous'>('upcoming');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Filter mock tests based on selected filters
  const filteredTests = mockTests.filter((test) => {
    const matchesType = selectedType ? test.type === selectedType : true;
    const matchesSubject = selectedSubject ? test.subjects.includes(selectedSubject) : true;
    const matchesDifficulty = selectedDifficulty ? test.difficulty === selectedDifficulty : true;
    
    return matchesType && matchesSubject && matchesDifficulty;
  });
  
  // Get unique values for filter dropdowns
  const types = Array.from(new Set(mockTests.map((test) => test.type)));
  const subjects = Array.from(new Set(mockTests.flatMap((test) => test.subjects)));
  const difficulties = Array.from(new Set(mockTests.map((test) => test.difficulty)));
  
  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Mock Tests</h1>
            <p className="text-gray-600">Practice tests to prepare for your IIT-JEE examination</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="btn btn-primary">Create Custom Test</button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upcoming'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Upcoming Tests
              </button>
              <button
                onClick={() => setActiveTab('previous')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'previous'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Previous Attempts
              </button>
            </nav>
          </div>
        </div>
        
        {activeTab === 'upcoming' && (
          <>
            {/* Filters */}
            <div className="mb-6">
              <div className="card p-4">
                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                  {/* Test Type Filter */}
                  <div className="relative inline-block text-left">
                    <div>
                      <button
                        type="button"
                        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        id="type-menu"
                        aria-expanded="true"
                        aria-haspopup="true"
                      >
                        {selectedType || 'Test Type'}
                        <ChevronDown className="-mr-1 ml-2 h-5 w-5" />
                      </button>
                    </div>
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="type-menu"
                      hidden={true} // This would be toggled in a real implementation
                    >
                      <div className="py-1" role="none">
                        <button
                          className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                          role="menuitem"
                          onClick={() => setSelectedType(null)}
                        >
                          All Types
                        </button>
                        {types.map((type) => (
                          <button
                            key={type}
                            className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                            role="menuitem"
                            onClick={() => setSelectedType(type)}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Subject Filter */}
                  <div className="relative inline-block text-left">
                    <div>
                      <button
                        type="button"
                        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        id="subject-menu"
                        aria-expanded="true"
                        aria-haspopup="true"
                      >
                        {selectedSubject || 'Subject'}
                        <ChevronDown className="-mr-1 ml-2 h-5 w-5" />
                      </button>
                    </div>
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="subject-menu"
                      hidden={true} // This would be toggled in a real implementation
                    >
                      <div className="py-1" role="none">
                        <button
                          className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                          role="menuitem"
                          onClick={() => setSelectedSubject(null)}
                        >
                          All Subjects
                        </button>
                        {subjects.map((subject) => (
                          <button
                            key={subject}
                            className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                            role="menuitem"
                            onClick={() => setSelectedSubject(subject)}
                          >
                            {subject}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Difficulty Filter */}
                  <div className="relative inline-block text-left">
                    <div>
                      <button
                        type="button"
                        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        id="difficulty-menu"
                        aria-expanded="true"
                        aria-haspopup="true"
                      >
                        {selectedDifficulty || 'Difficulty'}
                        <ChevronDown className="-mr-1 ml-2 h-5 w-5" />
                      </button>
                    </div>
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="difficulty-menu"
                      hidden={true} // This would be toggled in a real implementation
                    >
                      <div className="py-1" role="none">
                        <button
                          className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                          role="menuitem"
                          onClick={() => setSelectedDifficulty(null)}
                        >
                          All Difficulties
                        </button>
                        {difficulties.map((difficulty) => (
                          <button
                            key={difficulty}
                            className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                            role="menuitem"
                            onClick={() => setSelectedDifficulty(difficulty)}
                          >
                            {difficulty}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Filter Button */}
                  <button className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Filter className="h-5 w-5 mr-2" />
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
            
            {/* Tests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredTests.map((test) => (
                <div key={test.id} className="card overflow-hidden transition-transform hover:translate-y-[-5px]">
                  <div className="p-6 border-b">
                    <h3 className="font-semibold text-lg mb-3">{test.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {test.subjects.map((subject) => (
                        <span
                          key={subject}
                          className={`text-xs px-2 py-1 rounded-full ${
                            subject === 'Physics' ? 'bg-blue-100 text-blue-800' :
                            subject === 'Chemistry' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <div className="flex items-center">
                        <FileText size={16} className="mr-1" />
                        <span>{test.questions} Questions</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        <span>{test.duration}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className={`px-2 py-1 rounded-full ${
                        test.type === 'Full Length' ? 'bg-red-100 text-red-800' :
                        test.type === 'Subject' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {test.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full ${
                        test.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        test.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        test.difficulty === 'Hard' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {test.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="mr-1" />
                      <span>{formatDate(test.date)}</span>
                    </div>
                    <button className="btn btn-primary text-sm px-4">Start Test</button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Test Instructions */}
            <div className="card p-6 mb-8">
              <div className="flex items-start mb-4">
                <AlertTriangle className="text-amber-500 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Important Instructions for Mock Tests</h3>
                  <ul className="space-y-2 text-gray-600 list-disc pl-5">
                    <li>Ensure you have a stable internet connection before starting a test.</li>
                    <li>Once started, the test timer cannot be paused. Complete the test in one sitting.</li>
                    <li>For full-length tests, allocate the complete time without interruptions.</li>
                    <li>Answer all questions. There is no negative marking in practice tests.</li>
                    <li>After submission, you'll receive a detailed analysis of your performance.</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'previous' && (
          <div className="space-y-6">
            {previousAttempts.map((attempt) => (
              <div key={attempt.id} className="card overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{attempt.title}</h3>
                      <p className="text-sm text-gray-500">Attempted on {formatDate(attempt.date)}</p>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center">
                      <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                        <BarChart2 size={14} className="mr-1" />
                        Percentile: {attempt.percentile}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex flex-col sm:flex-row justify-between mb-4">
                      <div className="mb-3 sm:mb-0">
                        <p className="text-sm text-gray-500 mb-1">Your Score</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {attempt.scoreObtained} <span className="text-sm text-gray-500 font-normal">/ {attempt.totalMarks}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Percentage</p>
                        <p className="text-2xl font-bold text-green-600">{attempt.score}%</p>
                      </div>
                    </div>
                    
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          attempt.score >= 75 ? 'bg-green-500' :
                          attempt.score >= 50 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${attempt.score}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Subject-wise breakdown */}
                  {attempt.physics && attempt.chemistry && attempt.mathematics ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="p-3 border rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Physics</h4>
                        <div className="text-sm">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">Correct</span>
                            <span className="text-green-600 font-medium">{attempt.physics.correct}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">Incorrect</span>
                            <span className="text-red-600 font-medium">{attempt.physics.incorrect}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">Unattempted</span>
                            <span className="text-gray-500 font-medium">{attempt.physics.unattempted}</span>
                          </div>
                          <div className="border-t mt-2 pt-2 flex justify-between">
                            <span className="font-medium">Score</span>
                            <span className="font-medium">{attempt.physics.score}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h4 className="font-medium text-purple-800 mb-2">Chemistry</h4>
                        <div className="text-sm">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">Correct</span>
                            <span className="text-green-600 font-medium">{attempt.chemistry.correct}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">Incorrect</span>
                            <span className="text-red-600 font-medium">{attempt.chemistry.incorrect}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">Unattempted</span>
                            <span className="text-gray-500 font-medium">{attempt.chemistry.unattempted}</span>
                          </div>
                          <div className="border-t mt-2 pt-2 flex justify-between">
                            <span className="font-medium">Score</span>
                            <span className="font-medium">{attempt.chemistry.score}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2">Mathematics</h4>
                        <div className="text-sm">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">Correct</span>
                            <span className="text-green-600 font-medium">{attempt.mathematics.correct}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">Incorrect</span>
                            <span className="text-red-600 font-medium">{attempt.mathematics.incorrect}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">Unattempted</span>
                            <span className="text-gray-500 font-medium">{attempt.mathematics.unattempted}</span>
                          </div>
                          <div className="border-t mt-2 pt-2 flex justify-between">
                            <span className="font-medium">Score</span>
                            <span className="font-medium">{attempt.mathematics.score}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : attempt.physics ? (
                    <div className="p-3 border rounded-lg mb-4">
                      <h4 className="font-medium text-blue-800 mb-2">Physics</h4>
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Correct</span>
                          <span className="text-green-600 font-medium">{attempt.physics.correct}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Incorrect</span>
                          <span className="text-red-600 font-medium">{attempt.physics.incorrect}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Unattempted</span>
                          <span className="text-gray-500 font-medium">{attempt.physics.unattempted}</span>
                        </div>
                        <div className="border-t mt-2 pt-2 flex justify-between">
                          <span className="font-medium">Score</span>
                          <span className="font-medium">{attempt.physics.score}</span>
                        </div>
                      </div>
                    </div>
                  ) : attempt.chemistry ? (
                    <div className="p-3 border rounded-lg mb-4">
                      <h4 className="font-medium text-purple-800 mb-2">Chemistry</h4>
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Correct</span>
                          <span className="text-green-600 font-medium">{attempt.chemistry.correct}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Incorrect</span>
                          <span className="text-red-600 font-medium">{attempt.chemistry.incorrect}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Unattempted</span>
                          <span className="text-gray-500 font-medium">{attempt.chemistry.unattempted}</span>
                        </div>
                        <div className="border-t mt-2 pt-2 flex justify-between">
                          <span className="font-medium">Score</span>
                          <span className="font-medium">{attempt.chemistry.score}</span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  
                  <div className="flex justify-between">
                    <button className="btn btn-outline text-sm">View Answer Key</button>
                    <button className="btn btn-primary text-sm">Detailed Analysis</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MockTestsPage;