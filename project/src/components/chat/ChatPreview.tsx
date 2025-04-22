import { useState, useEffect } from 'react';
import { User, Bot } from 'lucide-react';

const ChatPreview = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  
  const conversation = [
    {
      type: 'user',
      message: "I was pulled over by police. Do I have to answer all their questions?"
    },
    {
      type: 'ai',
      message: "You have the right to remain silent. You only need to provide your license, registration, and insurance when asked. For any other questions, you can politely state that you prefer not to answer without a lawyer present."
    },
    {
      type: 'user',
      message: "Can the police search my car without my permission?"
    },
    {
      type: 'ai',
      message: "Police need either your consent, a valid search warrant, or 'probable cause' to search your vehicle. You can clearly state: 'I do not consent to a search.' If they search anyway, don't resist physically, but note your objection."
    }
  ];

  const currentMessage = conversation[currentMessageIndex];

  useEffect(() => {
    if (currentMessage.type === 'ai') {
      setIsTyping(true);
      setDisplayedText('');
      
      const text = currentMessage.message;
      let i = 0;
      
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(prev => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          
          // Move to next message after a delay
          const timer = setTimeout(() => {
            setCurrentMessageIndex(prevIndex => 
              (prevIndex + 1) % conversation.length
            );
          }, 3000);
          
          return () => clearTimeout(timer);
        }
      }, 30);
      
      return () => clearInterval(typingInterval);
    }
  }, [currentMessageIndex, currentMessage.type, currentMessage.message]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200 max-w-md mx-auto">
      <div className="bg-navy-800 text-black p-4">
        <h3 className="font-medium flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          AI Lawyer Assistant
        </h3>
      </div>
      
      <div className="h-80 overflow-y-auto p-4 bg-slate-50">
        {conversation.slice(0, currentMessageIndex + 1).map((msg, idx) => (
          <div 
            key={idx} 
            className={`mb-4 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-[80%] rounded-lg p-3 
                ${msg.type === 'user' 
                  ? 'bg-navy-700 text-black' 
                  : 'bg-white border border-slate-200 text-slate-800'
                }
              `}
            >
              <div className="flex items-start">
                {msg.type === 'ai' && (
                  <Bot className="h-5 w-5 mr-2 mt-0.5 text-gold-600 flex-shrink-0" />
                )}
                <div>
                  {idx === currentMessageIndex && msg.type === 'ai' 
                    ? displayedText 
                    : msg.message
                  }
                  {idx === currentMessageIndex && msg.type === 'ai' && isTyping && (
                    <span className="inline-block w-2 h-4 bg-gold-600 ml-1 animate-pulse"></span>
                  )}
                </div>
                {msg.type === 'user' && (
                  <User className="h-5 w-5 ml-2 mt-0.5 text-black flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Ask a legal question..."
            className="flex-grow p-2 border border-slate-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-navy-500"
            disabled
          />
          <button 
            className="bg-navy-700 text-black p-2 rounded-r-md"
            disabled
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPreview;