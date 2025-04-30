import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AssessmentPage from './pages/AssessmentPage';
import PricingPage from './pages/PricingPage';
import StudyMaterialsPage from './pages/StudyMaterialsPage';
import { AdminPage } from './pages/AdminPage';
import { ChatbotPage } from './pages/ChatbotPage';
import UserFlow from './pages/UserFlow';
import Assessment from './pages/Assessment';
import ErrorBoundary from './components/ErrorBoundary';

// Placeholder components for Study Materials and Mock Tests
const MockTestsPage = () => (
  <div className="py-8 bg-gray-50 min-h-screen">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Mock Tests</h1>
      <p className="text-gray-600">Practice with realistic JEE-style mock tests to prepare for the actual exam.</p>
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p className="text-center text-gray-500">Mock tests content will be displayed here.</p>
      </div>
    </div>
  </div>
);

// TypeScript declaration for the custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { 'agent-id': string };
    }
  }
}

function App() {
  useEffect(() => {
    console.log('App component mounted');
    // Dynamically add the ElevenLabs convai widget script
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);

    // Add error handler for script loading
    script.onerror = (error) => {
      console.error('Error loading ElevenLabs script:', error);
    };

    return () => {
      console.log('App component unmounting');
      document.body.removeChild(script);
    };
  }, []);

  // Add some debug logging
  console.log('App rendering');

  return (
    <ErrorBoundary>
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
          {/* Debug element */}
          <div className="fixed bottom-0 right-0 bg-white p-2 text-xs z-50">
            App is running
          </div>
          
        {/* ElevenLabs Convai Widget (global) */}
        <elevenlabs-convai agent-id="4t8cXDZRjIvWYzOmji5s"></elevenlabs-convai>
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<UserFlow />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/study-materials" element={<StudyMaterialsPage />} />
            <Route path="/mock-tests" element={<MockTestsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/chat" element={<ChatbotPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
    </ErrorBoundary>
  );
}

export default App;