import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import '../styles/ChatbotBubble.css';

const GEMINI_API_KEY = "AIzaSyB6g9OleRTdwB-vLXiFhvD7ESGarPBvqkQ";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const ChatbotBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your Disaster & Emergency assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const getGeminiResponse = async (message) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      const result = await model.generateContent(`You are a helpful assistant specialized in disaster and emergency preparedness. Answer the following question:\n${message}`);
      const response = result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "Sorry, I am having trouble connecting to the AI service.";
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const botReply = await getGeminiResponse(input.trim());
    setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`chatbot-bubble ${isOpen ? 'open' : ''}`}>
      <div className="chatbot-header" onClick={toggleChat}>
        <span>Disaster Assistant</span>
        <button className="close-btn">{isOpen ? '×' : '💬'}</button>
      </div>
      {isOpen && (
        <div className="chatbot-content">
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chatbot-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <textarea
            className="chatbot-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about disaster preparedness..."
            disabled={loading}
          />
          <button className="send-btn" onClick={sendMessage} disabled={!input.trim() || loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatbotBubble;
