import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, X, Minimize2, Maximize2 } from 'lucide-react';
import { askGemini } from '../utils/geminiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your agricultural assistant. I can help you with crop recommendations, farming techniques, pest control, market prices, and government schemes. What would you like to know?',
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
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
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      // Create a farming-focused prompt
      const farmingPrompt = `You are an expert agricultural advisor helping Indian farmers. Please provide helpful, practical advice for this farming question: "${inputMessage}"

Please respond in a conversational, helpful manner. Keep your response concise but informative. Focus on practical solutions that small and marginal farmers can implement. Include relevant information about:
- Crop recommendations
- Farming techniques
- Pest and disease management
- Soil health
- Market information
- Government schemes (if relevant)
- Weather considerations
- Cost-effective solutions

Question: ${inputMessage}`;

      const response = await askGemini(farmingPrompt);

      // Remove typing indicator and add bot response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing');
        const botMessage: Message = {
          id: Date.now().toString(),
          text: response,
          sender: 'bot',
          timestamp: new Date(),
        };
        return [...filtered, botMessage];
      });

    } catch (error) {
      console.error('Chatbot error:', error);
      
      // Remove typing indicator and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing');
        const errorMessage: Message = {
          id: Date.now().toString(),
          text: 'Sorry, I\'m having trouble connecting right now. Here are some general farming tips: \n\n• Ensure proper soil preparation before sowing\n• Use organic fertilizers when possible\n• Monitor weather conditions regularly\n• Practice crop rotation for better soil health\n• Check government schemes like PM-KISAN for financial support\n\nPlease try asking your question again in a moment.',
          sender: 'bot',
          timestamp: new Date(),
        };
        return [...filtered, errorMessage];
      });
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

  const quickQuestions = [
    'What crops should I grow this season?',
    'How to control pest attacks?',
    'Government schemes for farmers?',
    'Best fertilizers for wheat?',
    'When to harvest my crops?',
    'How to improve soil health?'
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          aria-label="Open farming assistant chat"
        >
          <MessageCircle size={24} />
        </button>
        <div className="absolute -top-12 right-0 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Ask farming questions
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 ${isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'} flex flex-col transition-all duration-300`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Farming Assistant</h3>
            <p className="text-xs text-emerald-100">Ask me anything about farming</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white/80 hover:text-white transition-colors"
            aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-start space-x-2 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'user' ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                      {message.sender === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-gray-600" />}
                    </div>
                    <div className={`px-3 py-2 rounded-lg ${message.sender === 'user' ? 'bg-emerald-500 text-white' : 'bg-white border border-gray-200'}`}>
                      {message.isTyping ? (
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      ) : (
                        <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                      )}
                    </div>
                  </div>
                  <div className={`text-xs text-gray-500 mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="p-4 border-t border-gray-200 bg-white">
              <p className="text-sm text-gray-600 mb-3">Quick questions to get started:</p>
              <div className="grid grid-cols-1 gap-2">
                {quickQuestions.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-left text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors duration-200 text-gray-700"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about crops, diseases, weather..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;
