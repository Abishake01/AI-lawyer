import { createContext, useContext, useState, ReactNode, useRef, useCallback, useEffect } from 'react';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  id: string;
  sources?: string[];
  isError?: boolean;
  isFallback?: boolean;
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
  activeLegalTopic: string | null;
  setActiveLegalTopic: (topic: string | null) => void;
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
  const [activeLegalTopic, setActiveLegalTopic] = useState<string | null>(null);

  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthesisRef.current = window.speechSynthesis;
    }

    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  const generateId = () => crypto.randomUUID();

  const detectLanguage = (text: string): 'ta-IN' | 'te-IN' | 'hi-IN' | 'kn-IN' | 'en-IN' => {
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta-IN'; // Tamil
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te-IN'; // Telugu
    if (/[\u0900-\u097F]/.test(text)) return 'hi-IN'; // Hindi
    if (/[\u0C80-\u0CFF]/.test(text)) return 'kn-IN'; // Kannada
    return 'en-IN'; // Default to English
  };

  const getPreferredVoice = (lang: string, voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    return voices.find(voice => voice.lang === lang) || voices.find(voice => voice.lang.includes(lang.slice(0, 2))) || null;
  };

  const speakText = useCallback((text: string, userInput: string = '') => {
    if (!isVoiceOutputEnabled || !speechSynthesisRef.current) return;

    speechSynthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    speechUtteranceRef.current = utterance;

    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = speechSynthesisRef.current.getVoices();
    const lang = detectLanguage(userInput || text);
    const preferredVoice = getPreferredVoice(lang, voices);

    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setError('Voice output failed. Please try again.');
    };

    speechSynthesisRef.current.speak(utterance);
  }, [isVoiceOutputEnabled]);

  const startListening = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = (event) => {
          setIsListening(false);

          switch (event.error) {
            case 'network':
              setError('Network connection required for speech recognition');
              break;
            case 'not-allowed':
              setError('Please allow microphone access in your browser settings');
              break;
            case 'audio-capture':
              setError('No microphone detected or microphone is busy');
              break;
            case 'no-speech':
              setError('No speech was detected');
              break;
            default:
              setError('Speech recognition failed. Please try again.');
          }

          console.error('Speech recognition error:', event.error);
        };

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          if (transcript.trim()) {
            sendMessage(transcript, true);
          }
        };

        try {
          recognition.start();
        } catch (err) {
          setIsListening(false);
          setError('Failed to start speech recognition');
          console.error('Recognition start error:', err);
        }
      } else {
        setError('Speech recognition not supported in your browser');
      }
    } else {
      setError('Window object not available');
    }
  };

  const stopListening = () => setIsListening(false);

  const toggleVoiceOutput = () => {
    setIsVoiceOutputEnabled(prev => !prev);
    if (isVoiceOutputEnabled && speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const sendMessage = async (userInput: string, isVoice: boolean = false) => {
    const userMessage: Message = {
      sender: 'user',
      text: userInput,
      timestamp: new Date(),
      id: generateId(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('https://ai-lawyer-sja4.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const aiMessage: Message = {
        sender: 'ai',
        text: data.response,
        timestamp: new Date(),
        id: generateId(),
        isFallback: data.is_fallback || false
      };

      setMessages(prev => [...prev, aiMessage]);

      if (isVoiceOutputEnabled || isVoice) {
        speakText(data.response, userInput);
      }
    } catch (err) {
      const aiMessage: Message = {
        sender: 'ai',
        text: "Service temporarily unavailable. For legal advice in India:\n\n• Visit https://nalsa.gov.in\n• Contact a local attorney",
        timestamp: new Date(),
        id: generateId(),
        isError: true,
        isFallback: true
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
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
      isVoiceOutputEnabled,
      activeLegalTopic,
      setActiveLegalTopic
    }}>
      {children}
    </AIContext.Provider>
  );
};
