import React, { createContext, useContext, useState, ReactNode, useRef, useCallback } from 'react';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  id: string;
}

interface AIContextType {
  messages: Message[];
  isProcessing: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  error: string | null;
  sendMessage: (userInput: string, isVoice?: boolean) => Promise<void>;
  clearMessages: () => void;
  startListening: () => void;
  stopListening: () => void;
  toggleVoiceOutput: () => void;
  isVoiceOutputEnabled: boolean;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

export const AIProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(true);
  
  // Ref to store the speech synthesis instance
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize the speech synthesis on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthesisRef.current = window.speechSynthesis;
    }
    
    return () => {
      // Cancel any ongoing speech synthesis when unmounting
      if (speechSynthesisRef.current && speechUtteranceRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  // Generate a unique ID for messages
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Speech synthesis function
  const speakText = useCallback((text: string) => {
    if (!isVoiceOutputEnabled || !speechSynthesisRef.current) return;
    
    // Cancel any ongoing speech
    speechSynthesisRef.current.cancel();
    
    // Create a new SpeechSynthesisUtterance instance
    const utterance = new SpeechSynthesisUtterance(text);
    speechUtteranceRef.current = utterance;
    
    // Set properties
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Set a voice that sounds more natural (if available)
    const voices = speechSynthesisRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Daniel') || 
      voice.name.includes('Samantha') || 
      voice.name.includes('Google')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    // Event handlers
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setError('Speech synthesis failed. Please try again.');
    };
    
    // Start speaking
    speechSynthesisRef.current.speak(utterance);
  }, [isVoiceOutputEnabled]);

  // Start listening function
  const startListening = () => {
    setIsListening(true);
    // In a real app, this would start the speech recognition
  };

  // Stop listening function
  const stopListening = () => {
    setIsListening(false);
    // In a real app, this would stop the speech recognition
  };

  // Toggle voice output
  const toggleVoiceOutput = () => {
    setIsVoiceOutputEnabled(prev => !prev);
    
    // Stop speaking if we're turning voice off
    if (isVoiceOutputEnabled && speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // This is a mock implementation - in a real application, this would connect to a backend
  const sendMessage = async (userInput: string, isVoice: boolean = false) => {
    const userMessage: Message = {
      sender: 'user',
      text: userInput,
      timestamp: new Date(),
      id: generateId()
    };
  
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setError(null);
  
    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userInput })
      });
  
      const data = await response.json();
  
      const aiMessage: Message = {
        sender: 'ai',
        text: data.response,
        timestamp: new Date(),
        id: generateId()
      };
  
      setMessages(prev => [...prev, aiMessage]);
      if (isVoiceOutputEnabled || isVoice) {
        speakText(data.response);
      }
  
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Sorry, there was an issue. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  

  const clearMessages = () => {
    setMessages([]);
    setError(null);
    
    // Stop any ongoing speech
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <AIContext.Provider value={{ 
      messages, 
      isProcessing, 
      isListening,
      isSpeaking,
      error, 
      sendMessage, 
      clearMessages,
      startListening,
      stopListening,
      toggleVoiceOutput,
      isVoiceOutputEnabled
    }}>
      {children}
    </AIContext.Provider>
  );
};