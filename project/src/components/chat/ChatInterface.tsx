import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Volume2, VolumeX, BookOpen, Scale } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import MessageBubble from './MessageBubble';
import VoiceButton from '../voice/VoiceButton';

const LEGAL_TOPICS = [
  { name: "Criminal Law", icon: <Scale size={18} /> },
  { name: "Property Rights", icon: <BookOpen size={18} /> },
  { name: "Family Law", icon: <BookOpen size={18} /> },
  { name: "Employment", icon: <BookOpen size={18} /> },
  { name: "Consumer Rights", icon: <BookOpen size={18} /> },
  { name: "Traffic Laws", icon: <BookOpen size={18} /> }
];

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
    isVoiceOutputEnabled,
    activeLegalTopic,
    setActiveLegalTopic
  } = useAI();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Auto-scroll and focus management
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    let finalInput = input;
    if (activeLegalTopic) {
      finalInput = `[${activeLegalTopic}] ${input}`;
      setActiveLegalTopic(null);
    }
    
    sendMessage(finalInput);
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

  const handleTopicSelect = (topic: string) => {
    setActiveLegalTopic(topic);
    setInput(`About ${topic}: `);
    setIsInputFocused(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-black rounded-lg shadow-lg overflow-hidden border border-slate-200">
      {/* Header with topic indicator */}
      <div className="bg-navy-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Bot className="h-6 w-6 text-gold-400 mr-2" />
          <h2 className="font-serif text-xl font-semibold">
            {activeLegalTopic ? `${activeLegalTopic} Assistant` : "AI Legal Assistant"}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {activeLegalTopic && (
            <button 
              onClick={() => setActiveLegalTopic(null)}
              className="text-xs bg-gold-500 text-navy-900 px-2 py-1 rounded"
            >
              Clear Topic
            </button>
          )}
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
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 bg-slate-100">
        {messages.length === 0 && showSuggestions ? (
          <div className="text-center py-8">
            <Bot className="mx-auto h-12 w-12 text-navy-700 mb-4" />
            <h3 className="text-xl font-semibold text-navy-900 mb-2">
              {activeLegalTopic 
                ? `Ask about ${activeLegalTopic} in India`
                : "How can I assist with Indian law today?"}
            </h3>
            <p className="text-slate-700 mb-8">
              {activeLegalTopic
                ? "Get information about rights, procedures, and relevant laws."
                : "Ask specific questions or select a legal topic below."}
            </p>
            
            {!activeLegalTopic && (
              <div className="mb-8">
                <h4 className="text-sm font-medium text-slate-500 mb-3">COMMON LEGAL TOPICS</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                  {LEGAL_TOPICS.map((topic, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTopicSelect(topic.name)}
                      className="flex items-center gap-2 p-3 text-left rounded-lg bg-white border border-slate-200 hover:border-navy-500 hover:shadow-md transition-all"
                    >
                      {topic.icon}
                      <span>{topic.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-4 max-w-2xl mx-auto">
              {commonQuestions
                .filter(q => !activeLegalTopic || q.includes(activeLegalTopic))
                .slice(0, 4)
                .map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(question)}
                    className="p-4 text-left rounded-lg bg-white border border-slate-200 hover:border-navy-500 hover:shadow-md transition-all text-slate-700"
                  >
                    {question}
                  </button>
                ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                sender={message.sender}
                text={message.text}
                isSpeaking={message.sender === 'ai' && isSpeaking}
                isTyping={false}
                timestamp={message.timestamp}
                isError={message.isError}
              />
            ))}
            {isProcessing && (
              <MessageBubble
                sender="ai"
                text="Researching Indian law..."
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

      {/* Input Area with topic indicator */}
      <div className="border-t border-slate-200 p-4 bg-black">
        {activeLegalTopic && (
          <div className="flex items-center gap-2 mb-2 text-sm text-navy-700">
            <BookOpen size={16} />
            <span>Topic: {activeLegalTopic}</span>
          </div>
        )}
        
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
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder={
                activeLegalTopic 
                  ? `Ask about ${activeLegalTopic}...` 
                  : "Ask about Indian law..."
              }
              className="w-full p-3 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 resize-none text-slate-700"
              rows={1}
              style={{ minHeight: '50px', maxHeight: '150px' }}
              autoFocus={isInputFocused}
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
  "Can I drive a bike under 18 in India?",
  "What are my rights if stopped by police in India?",
  "How do I file a consumer complaint in India?",
  "What is the process for divorce under Hindu Marriage Act?",
  "Is recording conversations legal in India?",
  "What are tenant rights regarding rent increases in India?",
  "How to register a property in Maharashtra?",
  "What constitutes sexual harassment at workplace under Indian law?",
  "Can I be arrested without warrant in India?",
  "What are the legal working hours in India?",
  "How to file an RTI application in India?",
  "What are the penalties for drunk driving in India?"
];

export default ChatInterface;