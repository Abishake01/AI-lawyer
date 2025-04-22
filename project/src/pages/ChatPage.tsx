import React from 'react';
import { Info } from 'lucide-react';
import ChatInterface from '../components/chat/ChatInterface';

const ChatPage = () => {
  return (
    <div className="pt-16">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ChatInterface />
        
        <div className="mt-4 text-sm text-slate-600 text-center">
          <p className="flex items-center justify-center">
            <Info className="h-4 w-4 mr-1" />
            AI Lawyer provides legal information, not legal advice. 
            Always consult with a qualified attorney for specific legal situations.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;