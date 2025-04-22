import React from 'react';
import { motion } from 'framer-motion';

interface SpeechWaveformProps {
  isActive: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const SpeechWaveform: React.FC<SpeechWaveformProps> = ({ 
  isActive, 
  size = 'md', 
  color = 'currentColor' 
}) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return 'h-8';
      case 'lg': return 'h-16';
      case 'md':
      default: return 'h-12';
    }
  };

  const bars = 5;
  const barWidth = size === 'sm' ? 2 : (size === 'md' ? 3 : 4);
  const gap = size === 'sm' ? 2 : 3;

  return (
    <div className={`flex items-center justify-center ${getSize()} px-1`}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            backgroundColor: color,
            width: barWidth,
            marginLeft: i > 0 ? gap : 0
          }}
          animate={{
            height: isActive 
              ? [
                  "40%", 
                  `${Math.random() * 60 + 40}%`, 
                  "40%", 
                  `${Math.random() * 80 + 20}%`, 
                  "40%"
                ]
              : "40%"
          }}
          transition={{
            duration: isActive ? 1.5 : 0.3,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut",
            times: isActive ? [0, 0.25, 0.5, 0.75, 1] : [0, 1]
          }}
        />
      ))}
    </div>
  );
};

export default SpeechWaveform;