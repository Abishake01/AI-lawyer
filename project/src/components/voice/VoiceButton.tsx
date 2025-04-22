import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface VoiceButtonProps {
  isListening: boolean;
  toggleListening: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  toggleListening,
  disabled = false,
  size = 'md',
  className = ''
}) => {
  const getButtonSize = () => {
    switch (size) {
      case 'sm': return 'p-2';
      case 'lg': return 'p-4 text-xl';
      case 'md':
      default: return 'p-3';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'lg': return 'h-6 w-6';
      case 'md':
      default: return 'h-5 w-5';
    }
  };

  return (
    <motion.button
      onClick={toggleListening}
      disabled={disabled}
      className={`rounded-full relative ${getButtonSize()} ${
        isListening 
          ? 'bg-crimson-600 text-white' 
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      } transition-colors duration-200 ${className}`}
      title={isListening ? 'Stop listening' : 'Start voice input'}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 1 }}
    >
      {isListening ? (
        <>
          <MicOff className={`${getIconSize()} z-10 relative`} />
          {/* Pulsing circle animation */}
          <motion.div
            className="absolute inset-0 rounded-full bg-crimson-600 opacity-75"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 0.5, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </>
      ) : (
        <Mic className={getIconSize()} />
      )}
    </motion.button>
  );
};

export default VoiceButton;