import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import DashboardPage from './pages/DashboardPage';
import StudyMaterialsPage from './pages/StudyMaterialsPage';
import MockTestsPage from './pages/MockTestsPage';
import PricingPage from './pages/PricingPage';
import { AdminPage } from './pages/AdminPage';
import { ChatbotPage } from './pages/ChatbotPage';
import ElevenLabsWidget from './components/ElevenLabsWidget';
import AuthTest from './pages/AuthTest';
import SupabaseSetup from './pages/SupabaseSetup';

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          {/* Debug element */}
          <div className="fixed bottom-0 right-0 bg-white p-2 text-xs z-50">
            App is running
          </div>
          
          {/* ElevenLabs Widget */}
          <ElevenLabsWidget />
          
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/study-materials" element={<StudyMaterialsPage />} />
              <Route path="/mock-tests" element={<MockTestsPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/chat" element={<ChatbotPage />} />
              <Route path="/auth-test" element={<AuthTest />} />
              <Route path="/supabase-setup" element={<SupabaseSetup />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;