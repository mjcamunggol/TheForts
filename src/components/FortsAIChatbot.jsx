import { useState } from 'react';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { QUICK_CHAT_QUESTIONS, RESORT_SYSTEM_PROMPT } from '../data/chatbotData.js';
import { GEMINI_API_KEY } from '../config.js';
import { getLocalFallbackAnswer } from '../utils/chatbotUtils.js';

export default function FortsAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! 👋 Welcome to The Forts Riverside Private Resort. Ask me anything about our Staycation Rooms, Exclusive Packages, Event Rentals, or add-ons!'
    }
  ]);

  const sendMessage = async (customQuestion = null) => {
    const textToSend = (customQuestion ?? input).trim();
    if (!textToSend || isLoading) return;

    const updatedMessages = [...messages, { role: 'user', text: textToSend }];
    setMessages(updatedMessages);
    if (!customQuestion) setInput('');
    setIsLoading(true);

    try {
      if (!GEMINI_API_KEY) {
        await new Promise((r) => setTimeout(r, 450));
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', text: getLocalFallbackAnswer(textToSend) }
        ]);
        setIsLoading(false);
        return;
      }

      let targetModel = 'models/gemini-flash-latest';
      const listRes = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models',
        {
          headers: { 'x-goog-api-key': GEMINI_API_KEY }
        }
      );

      if (listRes.ok) {
        const listData = await listRes.json();
        const availableModels = (listData.models || [])
          .filter(
            (m) =>
              m.supportedGenerationMethods?.includes('generateContent') &&
              m.name.includes('gemini') &&
              !m.name.includes('image') &&
              !m.name.includes('tts') &&
              !m.name.includes('live')
          )
          .map((m) => m.name);

        const preferredOrder = [
          'models/gemini-3.5-flash-lite',
          'models/gemini-3.1-flash-lite',
          'models/gemini-flash-lite-latest',
          'models/gemini-flash-latest',
          'models/gemini-3.6-flash',
          'models/gemini-3.8-flash'
        ];

        const matched =
          preferredOrder.find((p) => availableModels.includes(p)) ||
          availableModels.find((m) => m.includes('flash')) ||
          availableModels[0];

        if (matched) targetModel = matched;
      }

      const contents = updatedMessages.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${targetModel}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: RESORT_SYSTEM_PROMPT }]
            },
            contents
          }),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          `API Error ${response.status}: ${data?.error?.message || 'Unknown Error'}`
        );
      }

      const aiReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        getLocalFallbackAnswer(textToSend);

      setMessages((prev) => [...prev, { role: 'assistant', text: aiReply }]);
    } catch (error) {
      console.error('Chatbot Failed:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: getLocalFallbackAnswer(textToSend) }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="w-[340px] sm:w-[380px] h-[510px] bg-white rounded-3xl border border-[#E6DBC8] shadow-2xl flex flex-col overflow-hidden animate-modal-pop origin-bottom-right">
          <div className="p-4 bg-[#0B3553] text-white border-b-2 border-[#C8AD7F] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#F5EFE6] text-[#0B3553] flex items-center justify-center font-bold shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">The Forts AI Concierge</h4>
                <span className="text-[11px] text-[#E6DBC8] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Instant Resort Support
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all cursor-pointer"
              aria-label="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF8F5]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex animate-step-enter ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm whitespace-pre-line leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#0B3553] text-white rounded-br-xs shadow-2xs'
                      : 'bg-white text-slate-800 border border-[#E6DBC8] rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white border border-[#E6DBC8] text-slate-500 rounded-2xl rounded-bl-xs px-3.5 py-2 text-xs italic">
                  Typing a reply...
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-wrap gap-1.5">
              {QUICK_CHAT_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendMessage(q)}
                  className="text-[11px] font-semibold bg-[#F5EFE6] hover:bg-[#ebe1d1] active:scale-95 text-[#0B3553] border border-[#E6DBC8] px-2.5 py-1 rounded-full transition-all cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-3 bg-white border-t border-[#E6DBC8] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about rooms, rates, or rules..."
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B3553] transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-[#0B3553] hover:bg-[#16486B] active:scale-95 disabled:bg-slate-200 text-white transition-all cursor-pointer"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-[#0B3553] hover:bg-[#16486B] active:scale-95 text-white font-bold text-xs sm:text-sm px-4 py-3.5 rounded-full shadow-xl border-2 border-[#C8AD7F] transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 text-[#F5EFE6]" />
          <span>Ask AI Concierge</span>
        </button>
      )}
    </div>
  );
}
