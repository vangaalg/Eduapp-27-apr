import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, ChevronUp, X, Send, Sparkles, Volume as VolumeUp } from 'lucide-react';
import VoiceInterface from '../voice/VoiceInterface';

type Message = {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
};

const ChatbotInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'bot',
      text: "Hi there! I'm your personal IIT-JEE tutor. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleVoiceClick = (text: string) => {
    setSelectedMessage(text);
    setIsVoiceOpen(true);
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputMessage.trim() === '') return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: getBotResponse(inputMessage),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };
  
  // Simple response logic (would be replaced by actual AI)
  const getBotResponse = (message: string): string => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      return "Hello! How can I help with your IIT-JEE preparation today?";
    } else if (lowerMsg.includes('physics') || lowerMsg.includes('mechanics')) {
      return "Physics, especially mechanics, is a fundamental area in IIT-JEE. Would you like me to explain a specific concept or suggest some practice problems?";
    } else if (lowerMsg.includes('chemistry')) {
      return "Chemistry is divided into physical, organic, and inorganic sections in IIT-JEE. Which area would you like help with?";
    } else if (lowerMsg.includes('math') || lowerMsg.includes('mathematics')) {
      return "Mathematics requires regular practice. Would you like me to generate some practice problems based on your current level?";
    } else if (lowerMsg.includes('test') || lowerMsg.includes('assessment')) {
      return "Taking regular assessments is crucial for IIT-JEE prep. I can help you set up a mock test or analyze your recent performance. What would you prefer?";
    } else {
      return "That's an interesting question about your IIT-JEE preparation. Would you like me to elaborate on this topic or suggest relevant study materials?";
    }
  };
  
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <>
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className={`fixed z-50 bottom-4 right-4 p-4 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isOpen ? <X className="text-white" size={24} /> : <MessageCircle className="text-white" size={24} />}
      </button>
      
      {/* Chat window */}
      <div
        className={`fixed z-40 bottom-20 right-4 w-full max-w-sm bg-white rounded-xl shadow-xl transition-all duration-300 overflow-hidden transform ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
        }`}
      >
        {/* Chat header */}
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles size={20} />
            <h3 className="font-medium">Your AI Tutor</h3>
          </div>
          <button onClick={toggleChat} className="text-white hover:text-blue-200">
            <ChevronUp size={20} />
          </button>
        </div>
        
        {/* Chat messages */}
        <div className="p-4 h-96 overflow-y-auto bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-lg p-3 max-w-[80%] ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                <p>{message.text}</p>
                <div className="flex items-center justify-between mt-2">
                  <p
                    className={`text-xs ${
                      message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                  {message.sender === 'bot' && (
                    <button
                      onClick={() => handleVoiceClick(message.text)}
                      className={`ml-2 p-1 rounded-full ${
                        message.sender === 'user' ? 'text-blue-200 hover:text-blue-100' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <VolumeUp size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about IIT-JEE..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Send size={20} />
          </button>
        </form>
      </div>

      <VoiceInterface
        text={selectedMessage}
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
      />
    </>
  );
};

export default ChatbotInterface;