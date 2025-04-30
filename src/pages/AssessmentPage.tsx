import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronRight, Clock, Info, ArrowLeft, ArrowRight, AlertCircle, Flag, Upload, FileText, X, Image } from 'lucide-react';
import { Question } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { testResultsService } from '../services/testResults';

// Sample questions for demonstration
const mockQuestions = [
  {
    id: 1,
    subject: 'Physics',
    topic: 'Mechanics',
    question: 'A particle moves in a straight line with constant acceleration. If the initial velocity is 5 m/s and the acceleration is 2 m/s², what will be the velocity after 10 seconds?',
    options: ['15 m/s', '20 m/s', '25 m/s', '30 m/s'],
    correctAnswer: '25 m/s',
  },
  {
    id: 2,
    subject: 'Chemistry',
    topic: 'Atomic Structure',
    question: 'Which of the following statements about Bohr\'s model of the atom is incorrect?',
    options: [
      'Electrons move in circular orbits around the nucleus',
      'Energy of electrons is quantized',
      'Angular momentum of electrons is quantized',
      'It accurately explains the spectrum of multi-electron atoms'
    ],
    correctAnswer: 'It accurately explains the spectrum of multi-electron atoms',
  },
  {
    id: 3,
    subject: 'Mathematics',
    topic: 'Calculus',
    question: 'Find the derivative of f(x) = x³ - 4x² + 7x - 9 with respect to x.',
    options: ['3x² - 8x + 7', '3x² - 4x + 7', '3x² - 8x', '3x - 8'],
    correctAnswer: '3x² - 8x + 7',
  },
  {
    id: 4,
    subject: 'Physics',
    topic: 'Electrostatics',
    question: 'Two point charges of +4μC and -2μC are placed at a distance of 3 meters. At what point on the line joining them is the electric field zero?',
    options: [
      '1 meter from the positive charge',
      '2 meters from the positive charge',
      '1 meter from the negative charge',
      'Electric field is never zero between opposite charges'
    ],
    correctAnswer: '2 meters from the positive charge',
  },
  {
    id: 5,
    subject: 'Chemistry',
    topic: 'Chemical Bonding',
    question: 'Which of the following molecules has a dipole moment of zero?',
    options: ['CO₂', 'H₂O', 'NH₃', 'CHCl₃'],
    correctAnswer: 'CO₂',
  },
];

const AssessmentPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'intro' | 'assessment' | 'results' | 'upload'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes in seconds
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleStartAssessment = () => {
    setCurrentStep('assessment');
  };
  
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: answer });
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentStep('results');
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleSubmitAssessment = async () => {
    const score = calculateScore();
    const analysis = generateSubjectAnalysis();
    
    // Save results for each subject
    try {
      for (const subject of analysis) {
        await testResultsService.saveTestResult({
          subject: subject.subject,
          score: subject.percentage,
          date: new Date(),
          source: 'built-in',
          strengths: mockQuestions
            .filter(q => q.subject === subject.subject && selectedAnswers[q.id] === q.correctAnswer)
            .map(q => q.topic),
          weaknesses: mockQuestions
            .filter(q => q.subject === subject.subject && selectedAnswers[q.id] !== q.correctAnswer)
            .map(q => q.topic)
        });
      }
    } catch (error) {
      console.error('Error saving assessment results:', error);
    }

    setCurrentStep('results');
  };
  
  // Format time remaining (mm:ss)
  const formatTime = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate score for results page
  const calculateScore = () => {
    let correctCount = 0;
    Object.keys(selectedAnswers).forEach((questionIdx) => {
      const idx = parseInt(questionIdx);
      if (selectedAnswers[idx] === mockQuestions[idx].correctAnswer) {
        correctCount++;
      }
    });
    return {
      correct: correctCount,
      total: mockQuestions.length,
      percentage: Math.round((correctCount / mockQuestions.length) * 100),
    };
  };
  
  // Generate subject-wise analysis for results page
  const generateSubjectAnalysis = () => {
    const subjects: Record<string, { correct: number; total: number }> = {};
    
    mockQuestions.forEach((question, idx) => {
      if (!subjects[question.subject]) {
        subjects[question.subject] = { correct: 0, total: 0 };
      }
      
      subjects[question.subject].total++;
      
      if (selectedAnswers[idx] === question.correctAnswer) {
        subjects[question.subject].correct++;
      }
    });
    
    return Object.entries(subjects).map(([subject, data]) => ({
      subject,
      correct: data.correct,
      total: data.total,
      percentage: Math.round((data.correct / data.total) * 100),
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files);
      const validFiles = fileArray.filter(file => 
        file.type === 'application/pdf' || 
        file.type.startsWith('image/')
      );
      setFiles(prev => [...prev, ...validFiles]);
    }
  };
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileArray = Array.from(e.dataTransfer.files);
      const validFiles = fileArray.filter(file => 
        file.type === 'application/pdf' || 
        file.type.startsWith('image/')
      );
      setFiles(prev => [...prev, ...validFiles]);
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate file upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      // Simulate AI analysis of mock test results
      // In a real application, this would be an actual API call to process the files
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Sample mock test results - in production this would come from actual file analysis
      const mockResults = {
        physics: { score: 58, strengths: ['Mechanics', 'Thermodynamics'], weaknesses: ['Electromagnetism', 'Optics'] },
        chemistry: { score: 72, strengths: ['Organic Chemistry', 'Periodic Table'], weaknesses: ['Chemical Equilibrium'] },
        mathematics: { score: 52, strengths: ['Algebra', 'Coordinate Geometry'], weaknesses: ['Calculus', 'Trigonometry'] }
      };

      // Save results for each subject
      for (const [subject, data] of Object.entries(mockResults)) {
        await testResultsService.saveTestResult({
          subject: subject,
          score: data.score,
          date: new Date(),
          source: 'mock-test',
          strengths: data.strengths,
          weaknesses: data.weaknesses
        });
      }

      clearInterval(interval);
      setUploadProgress(100);
      setAnalysisComplete(true);
    } catch (error) {
      console.error('Error processing mock test results:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  const isValidFileType = (file: File) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    return allowedTypes.includes(file.type);
  };
  
  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText size={24} className="text-red-500" />;
    } else {
      return <Image size={24} className="text-blue-500" />;
    }
  };
  
  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return size + ' B';
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(1) + ' KB';
    } else {
      return (size / (1024 * 1024)).toFixed(1) + ' MB';
    }
  };
  
  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container-custom">
        {currentStep === 'intro' && (
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Assessment Center</h1>
            <p className="text-gray-600 mb-8">
              Choose how you want to evaluate your knowledge and progress. Take our built-in assessment or upload your recent mock test results for personalized analysis.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:shadow-md transition-all cursor-pointer" onClick={() => setCurrentStep('assessment')}>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <CheckCircle size={24} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Take Built-in Assessment</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Complete our guided assessment to test your knowledge across various IIT-JEE subjects.
                </p>
                <button className="text-blue-600 font-medium text-sm flex items-center">
                  Start Assessment <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 hover:shadow-md transition-all cursor-pointer" onClick={() => setCurrentStep('upload')}>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Upload size={24} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Mock Test Results</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Upload your recent mock test results (PDF or image) for AI-powered analysis and personalized feedback.
                </p>
                <button className="text-purple-600 font-medium text-sm flex items-center">
                  Upload Results <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {currentStep === 'assessment' && (
          <div className="max-w-3xl mx-auto animate-fade-in">
            {/* Timer and Progress */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <Clock className="text-red-500 mr-2" size={18} />
                <span className="font-medium">{formatTime()}</span>
              </div>
              
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <span className="font-medium">
                  Question {currentQuestionIndex + 1} of {mockQuestions.length}
                </span>
              </div>
            </div>
            
            {/* Question Card */}
            <div className="card p-6 md:p-8 mb-4">
              <div className="flex items-center mb-4">
                <span className={`text-xs px-2 py-1 rounded-full mr-2 ${
                  mockQuestions[currentQuestionIndex].subject === 'Physics' ? 'bg-blue-100 text-blue-800' :
                  mockQuestions[currentQuestionIndex].subject === 'Chemistry' ? 'bg-purple-100 text-purple-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {mockQuestions[currentQuestionIndex].subject}
                </span>
                <span className="text-xs px-2 py-1 rounded-full text-gray-600 bg-gray-100">
                  {mockQuestions[currentQuestionIndex].topic}
                </span>
              </div>
              
              <h2 className="text-xl font-medium mb-6">
                {mockQuestions[currentQuestionIndex].question}
              </h2>
              
              <div className="space-y-3 mb-6">
                {mockQuestions[currentQuestionIndex].options.map((option, index) => (
                  <div 
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors flex items-center ${
                      selectedAnswers[currentQuestionIndex] === option 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 border ${
                      selectedAnswers[currentQuestionIndex] === option 
                        ? 'border-blue-500 bg-blue-500 text-white' 
                        : 'border-gray-300'
                    }`}>
                      {['A', 'B', 'C', 'D'][index]}
                    </div>
                    <span>{option}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mb-8">
              <button 
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={`btn flex items-center ${
                  currentQuestionIndex === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'btn-outline'
                }`}
              >
                <ArrowLeft className="mr-2" size={16} />
                Previous
              </button>
              
              {currentQuestionIndex < mockQuestions.length - 1 ? (
                <button 
                  onClick={handleNextQuestion}
                  className="btn btn-primary flex items-center"
                >
                  Next
                  <ArrowRight className="ml-2" size={16} />
                </button>
              ) : (
                <button 
                  onClick={handleSubmitAssessment}
                  className="btn btn-secondary flex items-center"
                >
                  Submit Assessment
                  <ChevronRight className="ml-2" size={16} />
                </button>
              )}
            </div>
            
            {/* Question Navigation */}
            <div className="card p-4 mb-6">
              <div className="grid grid-cols-5 gap-2">
                {mockQuestions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium 
                      ${currentQuestionIndex === index 
                        ? 'bg-blue-600 text-white' 
                        : selectedAnswers[index] !== undefined
                          ? 'bg-green-100 text-green-800 border border-green-300' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {currentStep === 'results' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="card p-8 mb-6">
              <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-0">Assessment Results</h1>
                <button className="btn btn-primary">View Detailed Analysis</button>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-center mb-10">
                <div className="relative w-48 h-48 mb-6 md:mb-0 md:mr-8">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-gray-200 stroke-current" strokeWidth="10" cx="50" cy="50" r="40" fill="transparent" />
                    <circle 
                      className="text-blue-600 stroke-current" 
                      strokeWidth="10" 
                      strokeLinecap="round" 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 * (1 - calculateScore().percentage / 100)}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{calculateScore().percentage}%</span>
                    <span className="text-sm text-gray-500">Overall Score</span>
                  </div>
                </div>
                
                <div className="text-center md:text-left">
                  <p className="text-lg text-gray-700 mb-2">
                    You answered <span className="font-semibold text-green-600">{calculateScore().correct}</span> out of {calculateScore().total} questions correctly.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Based on your performance, we've created a personalized study plan to help you improve.
                  </p>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center md:justify-start">
                    <button className="btn btn-primary">View Study Plan</button>
                    <button className="btn btn-outline">Review Answers</button>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-8">
                <h2 className="text-xl font-semibold mb-6">Subject-wise Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {generateSubjectAnalysis().map((subject, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{subject.subject}</h3>
                        <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                          subject.percentage >= 70 ? 'bg-green-100 text-green-800' :
                          subject.percentage >= 40 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {subject.percentage}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            subject.percentage < 40 ? 'bg-red-500' : 
                            subject.percentage < 70 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`} 
                          style={{ width: `${subject.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {subject.correct} out of {subject.total} correct
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="card p-8">
              <h2 className="text-xl font-semibold mb-6">Recommended Next Steps</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <h3 className="text-lg font-medium text-green-800 mb-2">Strengths</h3>
                  <ul className="space-y-2 pl-5 list-disc text-green-700">
                    <li>Strong understanding of basic mechanics concepts</li>
                    <li>Good grasp of algebraic principles</li>
                    <li>Effective application of chemical formulas</li>
                  </ul>
                </div>
                
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <h3 className="text-lg font-medium text-red-800 mb-2">Areas for Improvement</h3>
                  <ul className="space-y-2 pl-5 list-disc text-red-700">
                    <li>Electrostatics concepts need more practice</li>
                    <li>Strengthen organic chemistry reactions</li>
                    <li>Work on complex calculus problems</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium mb-4">Your Personalized Study Plan</h3>
                <p className="text-gray-600 mb-6">
                  Based on your assessment results, we've created a customized study plan focusing on your areas for improvement while building on your strengths.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <Info className="text-blue-600 mr-3 flex-shrink-0 mt-1" />
                    <p className="text-blue-700 text-sm">
                      Your plan adapts as you progress. Complete more lessons and assessments to refine your learning path further.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button className="btn btn-primary px-8 py-3">
                    Start Your Personalized Study Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Upload Step */}
        {currentStep === 'upload' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900">Upload Mock Test Results</h1>
              <p className="text-gray-600 mt-2">
                Upload your recent mock test results for AI-powered analysis and personalized feedback.
              </p>
            </div>
            
            {!analysisComplete ? (
              <div className="p-6">
                {/* File Upload Area */}
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 ${
                    dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept=".pdf,.jpg,.jpeg,.png" 
                    onChange={handleFileChange}
                    multiple
                  />
                  
                  <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Upload size={28} className="text-blue-600" />
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-1">
                    {dragActive ? 'Drop files here' : 'Drag and drop files or click to browse'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Upload PDF or image files (JPEG, PNG) of your recent mock test results
                  </p>
                  <p className="text-xs text-gray-400 mt-2">Maximum file size: 10MB</p>
                </div>
                
                {/* File List */}
                {files.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Uploaded Files</h3>
                    <div className="space-y-3">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            {getFileIcon(file)}
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Upload Progress */}
                {isUploading && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-900">Uploading and Analyzing</h3>
                      <span className="text-sm text-gray-500">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {uploadProgress < 50 
                        ? 'Uploading files...' 
                        : 'Analyzing mock test results using AI...'}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setCurrentStep('intro')}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Back
                  </button>
                  
                  <button
                    onClick={handleUpload}
                    disabled={files.length === 0 || isUploading}
                    className={`px-6 py-2 rounded-lg font-medium ${
                      files.length === 0 || isUploading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isUploading ? 'Processing...' : 'Analyze Results'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="bg-green-50 rounded-xl p-6 border border-green-100 mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle size={24} className="text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">Analysis Complete</h3>
                      <p className="text-sm text-gray-600">
                        We've analyzed your mock test results and generated personalized insights.
                      </p>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-medium text-gray-900 mb-4">Performance Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <h4 className="font-medium text-gray-900 mb-1">Overall Score</h4>
                    <p className="text-3xl font-bold text-blue-600">62%</p>
                    <p className="text-sm text-gray-600 mt-1">Moderate performance</p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <h4 className="font-medium text-gray-900 mb-1">Questions Attempted</h4>
                    <p className="text-3xl font-bold text-purple-600">48/60</p>
                    <p className="text-sm text-gray-600 mt-1">80% attempt rate</p>
                  </div>
                  
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                    <h4 className="font-medium text-gray-900 mb-1">Time Management</h4>
                    <p className="text-3xl font-bold text-amber-600">Fair</p>
                    <p className="text-sm text-gray-600 mt-1">Needs improvement</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-medium text-gray-900 mb-4">Subject-wise Performance</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">Physics</h4>
                      <span className="font-medium text-blue-600">58%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600" style={{ width: '58%' }}></div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Strengths: Mechanics, Thermodynamics</p>
                      <p>Weaknesses: Electromagnetism, Optics</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">Chemistry</h4>
                      <span className="font-medium text-blue-600">72%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600" style={{ width: '72%' }}></div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Strengths: Organic Chemistry, Periodic Table</p>
                      <p>Weaknesses: Chemical Equilibrium</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">Mathematics</h4>
                      <span className="font-medium text-blue-600">52%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600" style={{ width: '52%' }}></div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Strengths: Algebra, Coordinate Geometry</p>
                      <p>Weaknesses: Calculus, Trigonometry</p>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-medium text-gray-900 mb-4">Next Steps</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="text-blue-600">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Study Plan Updated</p>
                      <p className="text-sm text-gray-600">Your personalized study plan has been updated based on your results</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-blue-600">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Practice Questions Added</p>
                      <p className="text-sm text-gray-600">We've added targeted practice questions for your weak areas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-blue-600">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Recommended Resources</p>
                      <p className="text-sm text-gray-600">Check your dashboard for recommended study materials</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between border-t border-gray-200 pt-6">
                  <button
                    onClick={() => {
                      setFiles([]);
                      setAnalysisComplete(false);
                      setCurrentStep('upload');
                    }}
                    className="px-4 py-2 text-blue-600 hover:text-blue-800"
                  >
                    Upload Another Test
                  </button>
                  
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentPage;