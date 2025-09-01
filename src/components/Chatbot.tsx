import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader } from 'lucide-react';
import { askGemini } from '../utils/geminiService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen: controlledOpen, onToggle }) => {
  const [isOpen, setIsOpen] = useState(controlledOpen || false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your KhetSetu agricultural assistant. I can help you with crop advice, pest management, weather concerns, and farming best practices. How can I assist you today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (controlledOpen !== undefined) {
      setIsOpen(controlledOpen);
    }
  }, [controlledOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setIsOpen(!isOpen);
    }
  };

  const generateChatResponse = async (userMessage: string): Promise<string> => {
    try {
      const agriculturalContext = `You are KhetSetu's expert agricultural assistant helping farmers with crop management, pest control, weather advice, and farming best practices. 
      
User question: "${userMessage}"

Please provide a helpful, practical response focused on agricultural guidance. Keep responses concise but informative. If the question is not related to agriculture, politely redirect to farming topics and mention that you're part of the KhetSetu platform.`;

      const response = await askGemini(agriculturalContext);
      return response;
    } catch (error) {
      console.error('Chat AI error:', error);
      return "I apologize, but I'm having trouble connecting to my knowledge base right now. However, I can suggest checking our other tools like Crop Advisory or Pest Watch for immediate assistance. Please try again in a moment.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const aiResponse = await generateChatResponse(userMessage.text);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error. Please try asking your question again, or check our other agricultural tools for assistance.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  const getSuggestedQuestions = () => [
    "What crops are best for my soil type?",
    "How do I identify pest problems?",
    "When should I plant for the current season?",
    "What government schemes can I apply for?",
    "How do I improve soil health naturally?"
  ];

  if (!isOpen) {
    return (
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
        aria-label="Open chat assistant"
      >
        <MessageCircle size={24} />
        <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          ?
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1 bg-white/20 rounded-full">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">KhetSetu Assistant</h3>
            <p className="text-xs text-emerald-100">Online • Ready to help</p>
          </div>
        </div>
        <button
          onClick={handleToggle}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${
              message.isUser ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                message.isUser 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {message.isUser ? <User size={12} /> : <Bot size={12} />}
              </div>
              <div className={`px-3 py-2 rounded-lg text-sm ${
                message.isUser
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
              }`}>
                <p className="whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.isUser ? 'text-emerald-100' : 'text-gray-400'
                }`}>
                  {formatTimestamp(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-[80%]">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs">
                <Bot size={12} />
              </div>
              <div className="bg-white text-gray-800 border border-gray-200 rounded-lg rounded-bl-none px-3 py-2">
                <div className="flex items-center space-x-1">
                  <Loader size={14} className="animate-spin text-emerald-600" />
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.length === 1 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 text-center">Quick questions:</p>
            <div className="space-y-1">
              {getSuggestedQuestions().map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputText(question)}
                  className="w-full text-left p-2 text-xs bg-white border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about crops, pests, weather..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
