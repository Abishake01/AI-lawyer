import React from 'react';
import { User, Bot } from 'lucide-react';

interface MessageBubbleProps {
  sender: 'user' | 'ai';
  text: string;
  isTyping?: boolean;
  isSpeaking?: boolean;
  timestamp?: Date | string | null; // Updated to accept multiple types
  isError?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  sender,
  text,
  isTyping = false,
  isSpeaking = false,
  timestamp,
  isError = false
}) => {
  // Format legal references (e.g., "IPC Section 302")
  const formatLegalText = (content: string) => {
    return content
      .split('\n')
      .map((paragraph, i) => {
        if (paragraph.trim() === '') return <br key={i} />;
        
        // Highlight legal codes
        const withLegalCodes = paragraph.replace(
          /(IPC|CrPC|CPA|IT Act|Constitution|Section)\s?\d+[A-Za-z]*/g,
          '<span class="text-gold-600 font-medium">$&</span>'
        );
        
        // Highlight important notes
        const withNotes = withLegalCodes.replace(
          /Note:|Important:|Warning:/g,
          '<span class="text-red-500 font-medium">$&</span>'
        );
        
        return (
          <p 
            key={i}
            className="mb-2"
            dangerouslySetInnerHTML={{ __html: withNotes }}
          />
        );
      });
  };

  // Safely format timestamp
  const formatTimestamp = (ts: Date | string | null | undefined) => {
    if (!ts) return null;
    
    try {
      const date = typeof ts === 'string' ? new Date(ts) : ts;
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      console.error('Error formatting timestamp:', e);
      return null;
    }
  };

  const formattedTime = formatTimestamp(timestamp);

  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[85%] rounded-lg p-4 relative
          ${sender === 'user'
            ? 'bg-navy-700 text-black'
            : isError
              ? 'bg-red-50 border border-red-200 text-red-800'
              : 'bg-white border border-slate-200 text-slate-800'
          }
          ${isSpeaking ? 'ring-2 ring-gold-400' : ''}
        `}
      >
        <div className="flex items-start gap-2">
          {sender === 'ai' && !isError && (
            <Bot className="h-5 w-5 mt-0.5 text-gold-600 flex-shrink-0" />
          )}
          
          <div className="flex-1">
            {isTyping ? (
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-navy-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-navy-400 animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-navy-400 animate-bounce delay-200" />
              </div>
            ) : (
              <>
                {formatLegalText(text)}
                {isSpeaking && (
                  <div className="absolute -top-2 -right-2 flex space-x-1">
                    <div className="w-1 h-1 rounded-full bg-gold-400 animate-pulse" />
                    <div className="w-1 h-1 rounded-full bg-gold-400 animate-pulse delay-100" />
                    <div className="w-1 h-1 rounded-full bg-gold-400 animate-pulse delay-200" />
                  </div>
                )}
              </>
            )}
          </div>
          
          {sender === 'user' && (
            <User className="h-5 w-5 mt-0.5 text-black flex-shrink-0" />
          )}
        </div>
        
        {formattedTime && (
          <div className={`text-xs mt-1 ${sender === 'user' ? 'text-navy-200' : 'text-slate-500'}`}>
            {formattedTime}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;