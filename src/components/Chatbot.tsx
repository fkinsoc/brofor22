import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Settings2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Hello! I am your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelType, setModelType] = useState('general');
  const [useSearch, setUseSearch] = useState(false);
  const [systemInstruction, setSystemInstruction] = useState('You are a helpful AI assistant for the Bro Foresee application.');
  const [showSettings, setShowSettings] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          modelType,
          useSearch,
          systemInstruction
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'model', content: data.text }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', content: `Error: ${data.error}` }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', content: 'Failed to connect to the server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-xl transition-all z-40 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] max-h-[80vh] bg-background-primary dark:bg-[#0A0A0A] border border-border-subtle dark:border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex flex-col border-b border-border-subtle dark:border-white/10 bg-background-secondary dark:bg-white/5">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold text-text-primary dark:text-white">Gemini Assistant</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setShowSettings(!showSettings)} className="p-1.5 text-text-secondary hover:text-text-primary dark:text-zinc-400 dark:hover:text-white rounded-lg transition-colors">
                    <Settings2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-1.5 text-text-secondary hover:text-text-primary dark:text-zinc-400 dark:hover:text-white rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Settings Panel */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4 overflow-hidden border-t border-border-subtle dark:border-white/10"
                  >
                    <div className="space-y-3 pt-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary dark:text-zinc-500">Model Priority</label>
                        <select 
                          value={modelType}
                          onChange={(e) => setModelType(e.target.value)}
                          className="mt-1 w-full text-xs p-2 rounded-lg bg-background-primary dark:bg-black border border-border-subtle dark:border-white/10 text-text-primary dark:text-white outline-none"
                        >
                          <option value="fast">Fast (Flash Lite)</option>
                          <option value="general">General (Flash)</option>
                          <option value="complex">Complex (Pro)</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary dark:text-zinc-500">Search Grounding</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={useSearch} onChange={(e) => setUseSearch(e.target.checked)} className="sr-only peer" />
                          <div className="w-9 h-5 bg-border-subtle dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                      
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary dark:text-zinc-500">System Role</label>
                        <input 
                          type="text" 
                          value={systemInstruction}
                          onChange={(e) => setSystemInstruction(e.target.value)}
                          placeholder="You are a helpful assistant..."
                          className="mt-1 w-full text-xs p-2 rounded-lg bg-background-primary dark:bg-black border border-border-subtle dark:border-white/10 text-text-primary dark:text-white outline-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-background-secondary dark:bg-[#111111] border border-border-subtle dark:border-white/10 text-text-primary dark:text-zinc-200 rounded-tl-none'
                  }`}>
                    <div className="prose prose-sm dark:prose-invert prose-zinc max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-background-secondary dark:bg-[#111111] border border-border-subtle dark:border-white/10 rounded-tl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border-subtle dark:border-white/10 bg-background-primary dark:bg-[#0A0A0A]">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Gemini..."
                  disabled={isLoading}
                  className="w-full bg-background-secondary dark:bg-white/5 border border-border-subtle dark:border-white/10 rounded-full py-2.5 pl-4 pr-12 text-sm text-text-primary dark:text-white placeholder-text-secondary dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500/50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-full transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
