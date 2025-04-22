import React from 'react';
import { Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';
import SpeakingIndicator from '../voice/SpeakingIndicator';

interface MessageBubbleProps {
  sender: 'user' | 'ai';
  text: string;
  isSpeaking?: boolean;
  isTyping?: boolean;
  showAvatar?: boolean;
  animateEntrance?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  sender,
  text,
  isSpeaking = false,
  isTyping = false,
  showAvatar = true,
  animateEntrance = true
}) => {
  const variants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}
      initial={animateEntrance ? "hidden" : "visible"}
      animate="visible"
      variants={variants}
    >
      <div 
        className={`
          max-w-[80%] rounded-lg p-4 
          ${sender === 'user' 
            ? 'bg-navy-700 text-black' 
            : 'bg-white border border-slate-200 text-slate-800'
          }
          shadow-sm hover:shadow-md transition-shadow duration-300
        `}
      >
        <div className="flex items-start">
          {sender === 'ai' && showAvatar && (
            <Bot className="h-5 w-5 mr-2 mt-1 text-gold-600 flex-shrink-0" />
          )}
          
          <div className="flex-1">
            <div className="whitespace-pre-wrap">
              {isTyping ? (
                <TypewriterText key={text} text={text} />

              ) : (
                text
              )}
            </div>
            
            {sender === 'ai' && isSpeaking && (
              <div className="mt-2">
                <SpeakingIndicator isSpeaking={true} size="sm" />
              </div>
            )}
          </div>
          
          {sender === 'user' && showAvatar && (
            <User className="h-5 w-5 ml-2 mt-1 text-black flex-shrink-0" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface TypewriterTextProps {
  text: string;
  speed?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text, speed = 30 }) => {
  const [displayedText, setDisplayedText] = React.useState('');
  const [cursorVisible, setCursorVisible] = React.useState(true);

  React.useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    const cursorTimer = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(cursorTimer);
    };
  }, [text, speed]);

  return (
    <>
      {displayedText}
      {cursorVisible && (
        <span className="inline-block w-2 h-4 bg-gold-600 ml-1 animate-pulse"></span>
      )}
    </>
  );
};

export default MessageBubble;