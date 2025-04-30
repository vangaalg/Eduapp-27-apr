import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-blue-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <BookOpen size={24} className="text-blue-600" />
              </div>
              <span className="font-bold text-xl text-white">EduPrep<span className="text-purple-400">AI</span></span>
            </div>
            <p className="text-blue-200 mb-6">
              Personalized AI-powered education platform helping students prepare effectively for IIT-JEE exams.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-blue-200 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-blue-200 hover:text-white transition-colors">Dashboard</Link>
              </li>
              <li>
                <Link to="/assessment" className="text-blue-200 hover:text-white transition-colors">Assessment</Link>
              </li>
              <li>
                <Link to="/study-materials" className="text-blue-200 hover:text-white transition-colors">Study Materials</Link>
              </li>
              <li>
                <Link to="/mock-tests" className="text-blue-200 hover:text-white transition-colors">Mock Tests</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-blue-200 hover:text-white transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/faq" className="text-blue-200 hover:text-white transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/webinars" className="text-blue-200 hover:text-white transition-colors">Webinars</Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-blue-200 hover:text-white transition-colors">Success Stories</Link>
              </li>
              <li>
                <Link to="/support" className="text-blue-200 hover:text-white transition-colors">Support</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone size={20} className="text-blue-300 flex-shrink-0 mt-1" />
                <span className="text-blue-200">+91 98765 43210</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={20} className="text-blue-300 flex-shrink-0 mt-1" />
                <span className="text-blue-200">support@eduprepai.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-blue-300 flex-shrink-0 mt-1" />
                <span className="text-blue-200">
                  1234 Education Avenue, <br />
                  Bangalore, Karnataka 560001
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-300 text-sm">&copy; {currentYear} EduPrepAI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-blue-300 text-sm hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-blue-300 text-sm hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookie-policy" className="text-blue-300 text-sm hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;