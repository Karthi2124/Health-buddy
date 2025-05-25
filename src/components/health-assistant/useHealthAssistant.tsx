
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { symptomService } from "@/services/symptomService";
import { speechSynthesisService } from "@/services/speechSynthesisService";

export const useHealthAssistant = () => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([
    { role: "system", content: "I am a Virtual Health Assistant. How may I help you?" },
  ]);
  const [language, setLanguage] = useState("en");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingHealth, setIsLoadingHealth] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Monitor speech synthesis status
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const handleSpeakStart = () => setIsSpeaking(true);
      const handleSpeakEnd = () => setIsSpeaking(false);
      
      window.speechSynthesis.addEventListener('start', handleSpeakStart);
      window.speechSynthesis.addEventListener('end', handleSpeakEnd);
      window.speechSynthesis.addEventListener('pause', handleSpeakEnd);
      window.speechSynthesis.addEventListener('cancel', handleSpeakEnd);
      
      // Cleanup
      return () => {
        window.speechSynthesis.removeEventListener('start', handleSpeakStart);
        window.speechSynthesis.removeEventListener('end', handleSpeakEnd);
        window.speechSynthesis.removeEventListener('pause', handleSpeakEnd);
        window.speechSynthesis.removeEventListener('cancel', handleSpeakEnd);
      };
    }
  }, []);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    const greeting = speechSynthesisService.getGreeting(value);
    speechSynthesisService.speak(greeting, value);
  };

  const handleSendMessage = (text = message) => {
    if (!text.trim()) return;
    
    // Add user message to chat history
    const newHistory = [
      ...chatHistory,
      { role: "user", content: text }
    ];
    setChatHistory(newHistory);
    
    // Process the message
    processMessage(text);
    setMessage("");
  };

  const addBotMessage = (text: string) => {
    setChatHistory(prev => [...prev, { role: "system", content: text }]);
    
    // Speak the response if we're not already speaking
    if (!isSpeaking) {
      speechSynthesisService.speak(text, language);
    }
  };

  const processMessage = (text: string) => {
    setIsProcessing(true);
    
    // Simulate processing delay for better UX
    setTimeout(() => {
      const response = symptomService.processMessage(text);
      
      if (response.message === "heart_rate_check") {
        checkHeartRate();
      } else {
        addBotMessage(response.message);
      }
      setIsProcessing(false);
    }, 1000);
  };

  const checkHeartRate = () => {
    // Simulated heart rate check with loading state
    setIsLoadingHealth(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const randomRate = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
      
      let healthStatus = "normal";
      if (randomRate < 60) healthStatus = "below normal";
      if (randomRate > 100) healthStatus = "above normal";
      
      addBotMessage(`Your current heart rate is ${randomRate} BPM, which is ${healthStatus}. A normal resting heart rate for adults ranges from 60 to 100 beats per minute.`);
      setIsLoadingHealth(false);
    }, 2000);
  };

  return {
    message,
    setMessage,
    chatHistory,
    language,
    isListening,
    setIsListening,
    isProcessing,
    isLoadingHealth,
    isSpeaking,
    handleLanguageChange,
    handleSendMessage,
  };
};
