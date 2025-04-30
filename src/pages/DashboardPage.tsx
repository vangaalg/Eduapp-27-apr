import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Book, Clock, Calendar, BarChart2, CheckCircle, AlertCircle, Star, Zap } from 'lucide-react';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for demonstration
  const subjects = [
    { id: 1, name: 'Physics', progress: 68, color: 'bg-blue-500', topics: 24, completed: 16 },
    { id: 2, name: 'Chemistry', progress: 42, color: 'bg-purple-500', topics: 28, completed: 12 },
    { id: 3, name: 'Mathematics', progress: 75, color: 'bg-green-500', topics: 30, completed: 22 },
  ];
  
  const upcomingTasks = [
    { id: 1, title: 'Complete Kinematics Quiz', subject: 'Physics', dueDate: '2 days left', priority: 'High' },
    { id: 2, title: 'Organic Chemistry Notes Review', subject: 'Chemistry', dueDate: 'Today', priority: 'Medium' },
    { id: 3, title: 'Integration Practice Problems', subject: 'Mathematics', dueDate: 'Tomorrow', priority: 'Medium' },
    { id: 4, title: 'Mock Test - Full Syllabus', subject: 'All Subjects', dueDate: '3 days left', priority: 'High' },
  ];
  
  const recentActivities = [
    { id: 1, title: 'Completed Thermodynamics Quiz', subject: 'Physics', score: '85%', time: '2 hours ago' },
    { id: 2, title: 'Watched 3 Video Lectures', subject: 'Chemistry', time: 'Yesterday' },
    { id: 3, title: 'Attempted Mock Test', subject: 'Mathematics', score: '72%', time: 'Yesterday' },
    { id: 4, title: 'Created New Study Notes', subject: 'Physics', time: '2 days ago' },
  ];
  
  const weakAreas = [
    { id: 1, topic: 'Electromagnetism', subject: 'Physics', score: '42%' },
    { id: 2, topic: 'Coordination Compounds', subject: 'Chemistry', score: '38%' },
    { id: 3, topic: 'Differential Equations', subject: 'Mathematics', score: '45%' },
  ];
  
  const formatDate = (date = new Date()) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-orange-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };
  
  return (
    <div className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Welcome back, Student!</h1>
            <p className="text-gray-600">Today is {formatDate()} | Your personalized dashboard for IIT-JEE preparation</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/assessment" className="inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500">Take New Assessment</Link>
          </div>
        </div>
        
        {/* Dashboard Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'performance'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Performance Analytics
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'schedule'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Study Schedule
              </button>
            </nav>
          </div>
        </div>
        
        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Study Streak</h3>
                  <div className="p-2 bg-blue-100 rounded-md">
                    <Zap size={20} className="text-blue-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">7 Days</p>
                <p className="text-sm text-gray-500 mt-1">Keep going! Your longest streak: 14 days</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Study Hours</h3>
                  <div className="p-2 bg-purple-100 rounded-md">
                    <Clock size={20} className="text-purple-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">32.5 hrs</p>
                <p className="text-sm text-gray-500 mt-1">This week (23% more than last week)</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Topics Mastered</h3>
                  <div className="p-2 bg-green-100 rounded-md">
                    <CheckCircle size={20} className="text-green-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">52</p>
                <p className="text-sm text-gray-500 mt-1">Out of 124 topics (42% complete)</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Weak Areas</h3>
                  <div className="p-2 bg-red-100 rounded-md">
                    <AlertCircle size={20} className="text-red-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">8</p>
                <p className="text-sm text-gray-500 mt-1">Topics that need improvement</p>
              </div>
            </div>
            
            {/* Progress by Subject */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Target className="mr-2 text-blue-600" size={20} />
                  Progress by Subject
            </h2>
            <div className="space-y-6">
              {subjects.map((subject) => (
                <div key={subject.id}>
                  <div className="flex justify-between items-center mb-2">
                        <div>
                    <span className="font-medium">{subject.name}</span>
                          <span className="text-sm text-gray-500 ml-2">{subject.completed} of {subject.topics} topics</span>
                        </div>
                        <span className="text-sm font-semibold">{subject.progress}%</span>
                  </div>
                      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div 
                          className={`h-full ${subject.color}`} 
                      style={{ width: `${subject.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
            </div>
            
            {/* Two-column layout for tasks and activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Tasks */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center">
                      <Calendar className="mr-2 text-blue-600" size={20} />
                      Upcoming Tasks
                    </h2>
                    <Link to="/tasks" className="text-blue-600 text-sm font-medium flex items-center hover:text-blue-800">
                      View All <ArrowRight size={16} className="ml-1" />
                    </Link>
          </div>
          
                  <div className="space-y-4">
                    {upcomingTasks.map((task) => (
                      <div key={task.id} className="p-4 rounded-lg border border-gray-200 transition-all hover:border-blue-200 hover:shadow-sm">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{task.title}</h3>
                            <p className="text-sm text-gray-500">{task.subject}</p>
                          </div>
                          <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        <div className="flex justify-between mt-3">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                            {task.dueDate}
                          </span>
                          <button className="text-xs text-blue-600 font-medium hover:text-blue-800">
                            Mark Complete
                          </button>
                        </div>
              </div>
                    ))}
            </div>
          </div>
        </div>
        
              {/* Recent Activities */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center">
                      <Clock className="mr-2 text-blue-600" size={20} />
                      Recent Activities
            </h2>
                    <Link to="/activities" className="text-blue-600 text-sm font-medium flex items-center hover:text-blue-800">
                      View All <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                  
            <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-gray-900">{activity.title}</h3>
                            <span className="text-xs text-gray-500">{activity.time}</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm text-gray-500">{activity.subject}</span>
                            {activity.score && (
                              <span className="text-sm font-medium text-green-600">{activity.score}</span>
                            )}
                    </div>
                    </div>
                  </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Areas for Improvement */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <AlertCircle className="mr-2 text-red-600" size={20} />
                    Areas for Improvement
                  </h2>
                  <Link to="/improvement-plan" className="text-blue-600 text-sm font-medium flex items-center hover:text-blue-800">
                    View Detailed Plan <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {weakAreas.map((area) => (
                    <div key={area.id} className="p-4 rounded-lg border border-red-100 bg-red-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{area.topic}</h3>
                          <p className="text-sm text-gray-600">{area.subject}</p>
          </div>
                        <span className="text-sm font-bold text-red-600">{area.score}</span>
                  </div>
                      <div className="mt-3">
                        <Link 
                          to={`/study-materials/${area.topic.toLowerCase().replace(/\s+/g, '-')}`} 
                          className="text-xs flex items-center text-blue-600 font-medium hover:text-blue-800"
                        >
                          Review Materials <ArrowRight size={14} className="ml-1" />
                        </Link>
                  </div>
                </div>
              ))}
            </div>
              </div>
            </div>
            
            {/* Recommended Resources */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Book className="mr-2 text-blue-600" size={20} />
                    Recommended Resources
                  </h2>
                  <Link to="/resources" className="text-blue-600 text-sm font-medium flex items-center hover:text-blue-800">
                    Browse Library <ArrowRight size={16} className="ml-1" />
              </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-200 transition-all">
                    <div className="bg-blue-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-3">
                      <Book size={24} className="text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">Electromagnetism: Complete Guide</h3>
                    <p className="text-sm text-gray-500 mt-1">Comprehensive study material for mastering electromagnetic concepts</p>
                    <div className="flex items-center mt-3">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill="#FBBF24" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">4.9 (128 reviews)</span>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-200 transition-all">
                    <div className="bg-purple-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-3">
                      <Book size={24} className="text-purple-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">Coordination Compounds Explained</h3>
                    <p className="text-sm text-gray-500 mt-1">Clear explanations and practice problems for coordination chemistry</p>
                    <div className="flex items-center mt-3">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} size={14} fill="#FBBF24" />
                        ))}
                        <Star size={14} stroke="#FBBF24" fill="none" />
                      </div>
                      <span className="text-xs text-gray-500">4.2 (95 reviews)</span>
            </div>
          </div>
          
                  <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-200 transition-all">
                    <div className="bg-green-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-3">
                      <Book size={24} className="text-green-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">Mastering Differential Equations</h3>
                    <p className="text-sm text-gray-500 mt-1">Step-by-step approach to solving differential equations with examples</p>
                    <div className="flex items-center mt-3">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill="#FBBF24" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">4.8 (157 reviews)</span>
                    </div>
                  </div>
                </div>
            </div>
            </div>
          </div>
        )}
        
        {/* Performance Analytics Tab Content */}
        {activeTab === 'performance' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <BarChart2 className="mr-2 text-blue-600" size={20} />
              Performance Analytics
            </h2>
            <div className="flex items-center justify-center h-64 border border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <BarChart2 size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Performance analytics charts will be displayed here</p>
                <p className="text-sm text-gray-500 mt-1">Showing test scores, time spent, and progress over time</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Study Schedule Tab Content */}
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Calendar className="mr-2 text-blue-600" size={20} />
              Study Schedule
            </h2>
            <div className="flex items-center justify-center h-64 border border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Your personalized study calendar will be displayed here</p>
                <p className="text-sm text-gray-500 mt-1">Plan your study sessions and track your progress</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;