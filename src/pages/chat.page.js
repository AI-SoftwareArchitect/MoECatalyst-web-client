import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Kullanıcı mesajını ekle
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Axios yerine fetch kullanıyoruz (axios artifact'ta mevcut değil)
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      // AI yanıtını ekle
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: data.response || 'Üzgünüm, bir yanıt alamadım.' 
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: 'Bağlantı hatası oluştu. Lütfen tekrar deneyin.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: 'radial-gradient(circle at center, #1e3a8a 0%, #000000 100%)'
    }}>
      {/* Header */}
      <div className="flex items-center justify-center py-8 px-4">
        <div className="flex items-center space-x-4">
          <img 
            src="/logo.png" 
            alt="MoECatalyst Logo" 
            className="w-12 h-12 rounded-full"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h1 className="text-4xl font-bold text-white">MoECatalyst</h1>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 mb-8">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-300 py-20">
              <h2 className="text-2xl mb-4">MoECatalyst'e Hoş Geldiniz!</h2>
              <p className="text-lg">Benimle sohbet etmek için aşağıdaki alana mesajınızı yazın.</p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white ml-auto' 
                  : 'bg-gray-700 text-white'
              }`}>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-white px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                  <span>Düşünüyor...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="max-w-4xl mx-auto w-full px-4 pb-8">
        <div className="relative">
          <div className="flex items-center bg-gray-800 rounded-full border border-gray-600 overflow-hidden">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Mesajınızı buraya yazın..."
              className="flex-1 px-6 py-4 bg-transparent text-white placeholder-gray-400 outline-none"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={`p-4 m-1 rounded-full transition-all duration-200 ${
                inputValue.trim() && !isLoading
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
        
        {/* Footer Text */}
        <p className="text-gray-400 text-center text-sm mt-4">
          MoECatalyst yapay zeka asistanınız
        </p>
      </div>
    </div>
  );
};

export default ChatApp;