import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, BookOpen, Target, Sparkles, BarChart2 } from 'lucide-react';
import useAnalytics from '../hooks/useAnalytics';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { 'agent-id': string };
    }
  }
}

// LoginModal placeholder
const LoginModal = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {/* Your login form here */}
      <p className="text-gray-600">Please log in to continue.</p>
    </div>
  </div>
);

const HomePage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { logEvent } = useAnalytics();

  const handleVoiceAgentFinish = () => setShowLogin(true);

  useEffect(() => {
    // Dynamically add the ElevenLabs convai widget script
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    logEvent('page_view', { page: 'Home' });
  }, [logEvent]);

  return (
    <main className="overflow-hidden">
      {showLogin && <LoginModal />}
      {/* ElevenLabs Convai Widget */}
      <div style={{ margin: '2rem 0' }}>
        <elevenlabs-convai agent-id="4t8cXDZRjIvWYzOmji5s"></elevenlabs-convai>
      </div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
        <div className="absolute inset-0 bg-grid-pattern"></div>
        <div className="container-custom relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0 animate-slide-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Your AI-Powered <span className="text-blue-300">Personal Tutor</span> for IIT-JEE Success
              </h1>
              <p className="text-lg mb-8 text-blue-100 max-w-xl">
                Get personalized coaching, adaptive learning paths, and real-time progress tracking to maximize your IIT-JEE preparation.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/assessment" className="btn bg-white text-blue-700 hover:bg-blue-50" onClick={() => logEvent('cta_click', { button: 'Start Free Assessment' })}>
                  Start Free Assessment
                </Link>
                <Link to="/dashboard" className="btn border border-white text-white hover:bg-white/10" onClick={() => logEvent('cta_click', { button: 'Explore Features' })}>
                  Explore Features
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl w-full max-w-md">
                <div className="absolute -top-3 -left-3 bg-purple-500 text-white rounded-full px-4 py-1 text-sm font-medium">
                  AI-Powered
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Sparkles className="text-purple-300 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h3 className="font-semibold">Personalized Learning</h3>
                      <p className="text-sm text-blue-200">Study plan adapts to your strengths and weaknesses</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <BarChart2 className="text-purple-300 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h3 className="font-semibold">Performance Analytics</h3>
                      <p className="text-sm text-blue-200">Track your progress with detailed insights</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Target className="text-purple-300 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h3 className="font-semibold">Targeted Practice</h3>
                      <p className="text-sm text-blue-200">Focus on areas that need improvement</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <BookOpen className="text-purple-300 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h3 className="font-semibold">Comprehensive Resources</h3>
                      <p className="text-sm text-blue-200">Access to quality study materials and practice tests</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>
      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">How EduPrepAI Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform creates a personalized learning experience tailored to your specific needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="card p-6 transition-transform hover:translate-y-[-5px]">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Comprehensive Assessment</h3>
              <p className="text-gray-600 mb-4">
                Take an initial diagnostic test to identify your current knowledge level and areas for improvement.
              </p>
              <Link to="/assessment" className="text-blue-600 font-medium inline-flex items-center hover:text-blue-800">
                Start Assessment <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            {/* Feature 2 */}
            <div className="card p-6 transition-transform hover:translate-y-[-5px]">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Personalized Study Plan</h3>
              <p className="text-gray-600 mb-4">
                Get a customized learning path tailored to your goals, strengths, and areas needing improvement.
              </p>
              <Link to="/dashboard" className="text-purple-600 font-medium inline-flex items-center hover:text-purple-800">
                View Your Plan <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            {/* Feature 3 */}
            <div className="card p-6 transition-transform hover:translate-y-[-5px]">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Adaptive Learning</h3>
              <p className="text-gray-600 mb-4">
                Access interactive lessons that adapt to your learning pace and preferences.
              </p>
              <Link to="/study-materials" className="text-green-600 font-medium inline-flex items-center hover:text-green-800">
                Explore Resources <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            {/* Feature 4 */}
            <div className="card p-6 transition-transform hover:translate-y-[-5px]">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart2 className="text-orange-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Progress Tracking</h3>
              <p className="text-gray-600 mb-4">
                Monitor your improvement with detailed analytics and performance insights.
              </p>
              <Link to="/dashboard" className="text-orange-600 font-medium inline-flex items-center hover:text-orange-800">
                Check Progress <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Success Stories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from students who have achieved their goals with EduPrepAI.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">RK</span>
                </div>
                <div>
                  <h4 className="font-semibold">Rahul Kumar</h4>
                  <p className="text-sm text-gray-500">IIT Bombay, Computer Science</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "The personalized study plan helped me focus on my weak areas in Physics. The AI tutor was available whenever I needed help, which was crucial in the final months of preparation."
              </p>
              <div className="flex text-yellow-400">
                {/* ... star icons ... */}
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-semibold">AS</span>
                </div>
                <div>
                  <h4 className="font-semibold">Anjali Singh</h4>
                  <p className="text-sm text-gray-500">IIT Delhi, Electrical Engineering</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "The mock tests were incredibly helpful in building my speed and accuracy. The detailed analysis after each test helped me understand exactly what I needed to work on."
              </p>
              <div className="flex text-yellow-400">
                {/* ... star icons ... */}
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <span className="text-green-600 font-semibold">VP</span>
                </div>
                <div>
                  <h4 className="font-semibold">Vikram Patel</h4>
                  <p className="text-sm text-gray-500">IIT Madras, Mechanical Engineering</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "As someone from a small town, I didn't have access to good coaching. EduPrepAI bridged that gap. The AI tutor answered my doubts any time of day, which was a game changer."
              </p>
              <div className="flex text-yellow-400">
                {/* ... star icons ... */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your IIT-JEE Preparation?</h2>
            <p className="text-lg mb-8 text-blue-100">
              Join thousands of students who have improved their scores and achieved their goals with EduPrepAI.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/assessment" className="btn bg-white text-blue-700 hover:bg-blue-50" onClick={() => logEvent('cta_click', { button: 'Start Free Assessment' })}>
                Start Free Assessment
              </Link>
              <Link to="/dashboard" className="btn border border-white text-white hover:bg-white/10" onClick={() => logEvent('cta_click', { button: 'Explore Features' })}>
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;