import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Minimize2, User } from 'lucide-react';
import { ChatMessage } from '../types';
import clsx from 'clsx';

const AIChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Merhaba! Ben Akademi Asistan. Size dersleriniz, kariyer planlamanız veya teknik konularla ilgili nasıl yardımcı olabilirim?',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Mock AI Response simulation
    setTimeout(() => {
      let responseText = "Bunu anladım, ancak şu an demo modundayım.";
      const lowerInput = userMsg.text.toLowerCase();

      if (lowerInput.includes('sertifika')) {
        responseText = "Sertifikalarınız kursu %100 tamamladığınızda ve bitirme sınavından en az 70 puan aldığınızda otomatik olarak üretilir. Profilinizden 'Rozetler ve Sertifikalar' sekmesinden indirebilirsiniz.";
      } else if (lowerInput.includes('yks') || lowerInput.includes('sınav')) {
        responseText = "YKS hazırlık modülleri Ümraniye Akademi altında mevcuttur. Haftalık deneme sınavları Cumartesi saat 10:00'da yapılmaktadır.";
      } else if (lowerInput.includes('staj') || lowerInput.includes('iş')) {
        responseText = "Kariyer Merkezi modülümüzde şu an size uygun 3 staj ilanı var. Özellikle İBB Veri Laboratuvarı ilanı profilinize çok uygun görünüyor.";
      } else {
        responseText = "Bu konuda ilgili eğitim modülünü bulup size yönlendirebilirim. Lütfen anahtar kelimeyi daha spesifik belirtin.";
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all hover:scale-110 z-50 group flex items-center gap-2"
      >
        <Bot className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-medium">
          Asistana Sor
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
      {/* Header */}
      <div className="bg-indigo-600 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Akademi Asistan</h3>
            <p className="text-xs text-indigo-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Çevrimiçi
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded text-white/80 hover:text-white">
            <Minimize2 className="w-4 h-4" />
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded text-white/80 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="h-96 bg-slate-50 p-4 overflow-y-auto flex flex-col gap-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx(
              "flex gap-3 max-w-[85%]",
              msg.sender === 'user' ? "self-end flex-row-reverse" : "self-start"
            )}
          >
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.sender === 'user' ? "bg-indigo-100 text-indigo-600" : "bg-green-100 text-green-600"
            )}>
              {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={clsx(
              "p-3 rounded-2xl text-sm shadow-sm",
              msg.sender === 'user' 
                ? "bg-indigo-600 text-white rounded-tr-none" 
                : "bg-white text-slate-700 border border-gray-100 rounded-tl-none"
            )}>
              {msg.text}
              <div className={clsx(
                "text-[10px] mt-1 opacity-70 text-right",
                msg.sender === 'user' ? "text-indigo-200" : "text-slate-400"
              )}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Bir soru sorun..."
          className="flex-1 text-sm bg-gray-100 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0 rounded-xl px-4 py-2.5 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AIChatAssistant;