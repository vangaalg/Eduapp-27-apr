import { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';

// TypeScript declaration for the custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { 'agent-id': string };
    }
  }
}

const ElevenLabsWidget = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    const loadScript = () => {
      // Remove any existing script first
      const existingScript = document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }

      script = document.createElement('script');
      script.src = 'https://elevenlabs.io/convai-widget/index.js';
      script.async = true;
      script.type = 'text/javascript';
      
      script.onload = () => {
        setScriptLoaded(true);
        setScriptError(null);
      };

      script.onerror = (error) => {
        console.error('Error loading ElevenLabs script:', error);
        setScriptError('Failed to load AI Assistant');
        setScriptLoaded(false);
      };

      document.body.appendChild(script);
    };

    if (isVisible) {
      loadScript();
    }

    return () => {
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [isVisible]);

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
    if (!isVisible) {
      setScriptLoaded(false);
      setScriptError(null);
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={handleToggleVisibility}
        className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-all duration-200 z-50 flex items-center gap-2"
        aria-label="Open AI Assistant"
      >
        <MessageCircle size={24} />
        <span className="text-sm font-medium">AI Assistant</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={handleToggleVisibility}
          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 z-50 transition-colors duration-200"
          aria-label="Close ElevenLabs widget"
        >
          <X size={20} className="text-gray-600" />
        </button>
        {scriptError ? (
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-red-600">{scriptError}</p>
          </div>
        ) : scriptLoaded ? (
          <elevenlabs-convai agent-id="4t8cXDZRjIvWYzOmji5s"></elevenlabs-convai>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElevenLabsWidget; 