import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, BookOpen, BarChart2, CheckSquare, Home, ChevronDown, Settings, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdown(!profileDropdown);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <BarChart2 size={20} /> },
    { name: 'Assessment', path: '/assessment', icon: <CheckSquare size={20} /> },
    { name: 'Study Materials', path: '/study-materials', icon: <BookOpen size={20} /> },
    { name: 'Mock Tests', path: '/mock-tests', icon: <CheckSquare size={20} /> },
    { name: 'AI Chat', path: '/chat', icon: <MessageSquare size={20} /> },
    { name: 'Pricing', path: '/pricing', icon: <BarChart2 size={20} /> },
    { name: 'Admin', path: '/admin', icon: <Settings size={20} /> },
  ];

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen size={24} className="text-white" />
              </div>
              <span className="font-bold text-xl text-indigo-600">EduPrep<span className="text-purple-600">AI</span></span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-blue-600 py-2 ${
                  location.pathname === link.path ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:space-x-3">
            <div className="relative">
              <button 
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={18} className="text-blue-600" />
                </div>
                <span className="text-sm font-medium">Account</span>
                <ChevronDown size={16} className={`transition-transform ${profileDropdown ? 'rotate-180' : ''}`}/>
              </button>
              
              {profileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 animate-fade-in">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
            <div className="pt-4 flex flex-col space-y-3">
              <Link to="/profile" className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                <User size={20} />
                <span>Profile</span>
              </Link>
              <button className="text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Sign out</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;