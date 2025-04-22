import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

// Add types for optional props like loading state and pulse duration
interface VoiceButtonProps {
  isListening: boolean;
  toggleListening: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  pulseDuration?: number; // New prop to control pulse duration
  loading?: boolean; // New prop for loading state
}

const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  toggleListening,
  disabled = false,
  size = 'md',
  className = '',
  pulseDuration = 2,  // Default to 2 seconds
  loading = false, // Default to false
}) => {
  // Memoize button size and icon size to avoid unnecessary recalculations
  const buttonSize = React.useMemo(() => {
    switch (size) {
      case 'sm': return 'p-2';
      case 'lg': return 'p-4 text-xl';
      default: return 'p-3';
    }
  }, [size]);

  const iconSize = React.useMemo(() => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'lg': return 'h-6 w-6';
      default: return 'h-5 w-5';
    }
  }, [size]);

  // Determine button style based on the listening state
  const buttonClass = isListening
    ? 'bg-crimson-600 text-white'
    : 'bg-slate-100 text-slate-600 hover:bg-slate-200';

  // Accessibility - aria-pressed for indicating the button's state
  return (
    <motion.button
      onClick={toggleListening}
      disabled={disabled || loading}
      aria-pressed={isListening}
      className={`rounded-full relative ${buttonSize} ${buttonClass} transition-colors duration-200 ${className}`}
      title={isListening ? 'Stop listening' : 'Start voice input'}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 1 }}
    >
      {loading ? (
        <div className="absolute inset-0 flex justify-center items-center">
          {/* Add a loading spinner or other indicator */}
          <div className="w-4 h-4 border-4 border-t-4 border-gray-600 border-solid rounded-full animate-spin"></div>
        </div>
      ) : isListening ? (
        <>
          <MicOff className={`${iconSize} z-10 relative`} />
          {/* Pulsing circle animation */}
          <motion.div
            className="absolute inset-0 rounded-full bg-crimson-600 opacity-75"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 0.5, 0.7],
            }}
            transition={{
              duration: pulseDuration,  // Using pulseDuration prop
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </>
      ) : (
        <Mic className={iconSize} />
      )}
    </motion.button>
  );
};

export default VoiceButton;
