import React from 'react';
import { Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import SpeechWaveform from './SpeechWaveform';

interface SpeakingIndicatorProps {
  isSpeaking: boolean;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  color?: string;
}

const SpeakingIndicator: React.FC<SpeakingIndicatorProps> = ({
  isSpeaking,
  size = 'sm',
  showIcon = true,
  color = 'text-gold-600'
}) => {
  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'lg': return 'h-6 w-6';
      case 'md':
      default: return 'h-5 w-5';
    }
  };

  return (
    <div className={`flex items-center ${color}`}>
      {showIcon && (
        <motion.div
          animate={isSpeaking ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
          transition={{ 
            duration: 1, 
            repeat: isSpeaking ? Infinity : 0, 
            ease: "easeInOut" 
          }}
          className="mr-1"
        >
          <Volume2 className={getIconSize()} />
        </motion.div>
      )}
      
      {isSpeaking && <SpeechWaveform isActive={true} size={size} />}
    </div>
  );
};

export default SpeakingIndicator;