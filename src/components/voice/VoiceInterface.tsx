import { useState } from "react";
import { Voicemail as Voice, Volume as VolumeUp, Pause, X } from "lucide-react";
import { Client } from "@11labs/client";

const VoiceInterface = ({ text, isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    try {
      setIsPlaying(true);
      const client = new Client();
      // Voice playback logic here
    } catch (error) {
      console.error('Error playing voice:', error);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    // Pause logic here
  };

  return (
    <div className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Voice Playback</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={isPlaying ? handlePause : handlePlay}
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
        >
          {isPlaying ? <Pause size={24} /> : <VolumeUp size={24} />}
        </button>
        <Voice className="text-blue-500" size={24} />
      </div>
    </div>
  );
};

export default VoiceInterface;