import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Volume2, VolumeX } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import MessageBubble from './MessageBubble';
import VoiceButton from '../voice/VoiceButton';

const ChatInterface = () => {
  const {
    messages,
    isProcessing,
    isListening,
    isSpeaking,
    error,
    sendMessage,
    startListening,
    stopListening,
    toggleVoiceOutput,
    isVoiceOutputEnabled
  } = useAI();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    sendMessage(input);
    setInput('');
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-navy-800 text-black p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Bot className="h-6 w-6 text-gold-400 mr-2" />
          <h2 className="font-serif text-xl font-semibold">AI Legal Assistant</h2>
        </div>
        <button
          onClick={toggleVoiceOutput}
          className="p-2 rounded-full hover:bg-navy-700 transition-colors"
          title={isVoiceOutputEnabled ? "Disable voice output" : "Enable voice output"}
        >
          {isVoiceOutputEnabled ? (
            <Volume2 className="h-5 w-5 text-gold-400" />
          ) : (
            <VolumeX className="h-5 w-5 text-slate-400" />
          )}
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 bg-slate-50">
        {messages.length === 0 && showSuggestions ? (
          <div className="text-center py-8">
            <Bot className="mx-auto h-12 w-12 text-navy-700 mb-4" />
            <h3 className="text-xl font-semibold text-navy-900 mb-2">
              How can I assist you with legal information?
            </h3>
            <p className="text-slate-700 mb-8">
              Ask me about your rights, legal procedures, or select from common topics below.
            </p>
            
            <div className="grid gap-4 max-w-2xl mx-auto">
              {commonQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(question)}
                  className="p-4 text-left rounded-lg bg-white border border-slate-200 hover:border-navy-500 hover:shadow-md transition-all duration-200 text-slate-700"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, idx) => (
              <MessageBubble
                key={idx}
                sender={message.sender}
                text={message.text}
                isSpeaking={message.sender === 'ai' && isSpeaking}
                isTyping={idx === messages.length - 1 && message.sender === 'ai' && isProcessing}
              />
            ))}
            {isProcessing && (
              <MessageBubble
                sender="ai"
                text="..."
                isTyping={true}
              />
            )}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 p-4 bg-white">
        <div className="flex items-center gap-2">
          <VoiceButton
            isListening={isListening}
            toggleListening={() => isListening ? stopListening() : startListening()}
          />
          
          <div className="flex-grow relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about your legal rights..."
              className="w-full p-3 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 resize-none text-slate-700"
              rows={1}
              style={{ minHeight: '50px', maxHeight: '150px' }}
            />
            <button
              onClick={handleSendMessage}
              disabled={input.trim() === '' || isProcessing}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${
                input.trim() === '' || isProcessing
                  ? 'text-slate-400'
                  : 'text-navy-600 hover:text-navy-800'
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="mt-2 flex justify-between items-center text-xs text-slate-500">
          <span>Press Enter to send, Shift + Enter for new line</span>
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-navy-600 hover:underline"
          >
            {showSuggestions ? 'Hide suggestions' : 'Show suggestions'}
          </button>
        </div>
      </div>
    </div>
  );
};

const commonQuestions = [
  "Can I drive a bike under 18?",
  "Is it legal to record police officers in India?",
  "What are my rights if I get arrested in India?",
  "Can I get bail for a bailable offence?",
  "Is a driving license required for electric scooters?",
  "What are the rights of tenants in India?"
]

export default ChatInterface;