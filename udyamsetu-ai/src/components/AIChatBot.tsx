import { useEffect, useState, useRef } from 'react';
import { Bot, Sparkles, X } from 'lucide-react';
import { useAIChat } from '../hooks/useQueries';
import { useAuthStore, useUIStore } from '../hooks/useStores';
import { AIMessage, AIChatInput, UserMessage } from './ui/AIMessage';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const SUGGESTIONS = [
  'What business can I start?',
  'How can I get funding?',
  'What should I learn next?',
  'Find buyers for my products',
];

export function AIChatBot() {
  const { user } = useAuthStore();
  const { isChatOpen, setChatOpen } = useUIStore();
  const chatMutation = useAIChat();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Namaste${user?.name ? `, ${user.name}` : ''}! I am your RozgarSetu AI assistant. Ask me about opportunities, learning, funding, products, or buyers.`,
    },
  ]);

  type SpeechRecognition = {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
    start: () => void;
    stop: () => void;
    abort: () => void;
  };

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!isChatOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setChatOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isChatOpen, setChatOpen]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN';
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        void handleSend(transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startVoiceInput = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSend = async (content: string) => {
    const message = content.trim();
    if (!message || chatMutation.isPending) return;

    setMessages((current) => [...current, { role: 'user', content: message }]);
    try {
      const result = await chatMutation.mutateAsync({
        message,
        context: {
          name: user?.name,
          location: user?.location,
          skills: user?.profile?.skills.map((skill) => skill.name),
          goals: user?.profile?.goals.map((goal) => goal.name),
        },
      });
      setMessages((current) => [...current, { role: 'assistant', content: result.response }]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: 'assistant', content: 'I could not respond right now. Please try again in a moment.' },
      ]);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setChatOpen(!isChatOpen)}
        className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-xl shadow-primary-600/25 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 lg:bottom-6 lg:right-6"
        aria-label={isChatOpen ? 'Close AI chat assistant' : 'Open AI chat assistant'}
        aria-expanded={isChatOpen}
      >
        {isChatOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>

      {isChatOpen && (
        <section
          className="fixed bottom-24 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-gray-900/20 lg:bottom-24 lg:right-6"
          aria-label="RozgarSetu AI chat assistant"
        >
          <header className="flex items-center gap-3 bg-gradient-to-r from-primary-600 to-secondary-600 p-4 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <Bot className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold">RozgarSetu AI Assistant</h2>
              <p className="truncate text-xs text-primary-100">Personal guidance for your livelihood journey</p>
            </div>
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="max-h-[42vh] overflow-y-auto space-y-3 p-4 lg:max-h-[46vh]" aria-live="polite">
              {messages.map((message, index) => {
                const isLast = index === messages.length - 1;
                return message.role === 'assistant' ? (
                  <AIMessage
                    key={`${message.role}-${index}`}
                    content={message.content}
                    variant="bubble"
                    isStreaming={isLast && chatMutation.isPending}
                    showActions={false}
                  />
                ) : (
                  <UserMessage key={`${message.role}-${index}`} content={message.content} variant="bubble" />
                );
              })}
              {!messages.length && (
                <div className="flex h-full items-center justify-center text-center">
                  <div>
                    <Sparkles className="mx-auto h-8 w-8 text-primary-500" />
                    <p className="mt-3 text-sm font-medium text-gray-900">Start a conversation</p>
                    <p className="mt-1 text-xs text-gray-500">Ask anything about building your livelihood.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 bg-gray-50 p-3">
               <div className="flex flex-wrap gap-2 pb-3">
                 {SUGGESTIONS.map((suggestion) => (
                   <button
                     key={suggestion}
                     type="button"
                     onClick={() => void handleSend(suggestion)}
                     disabled={chatMutation.isPending}
                     className="rounded-full border border-primary-100 bg-white px-3 py-1.5 text-xs font-medium text-primary-700 transition-colors hover:border-primary-300 hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-50"
                   >
                     {suggestion}
                   </button>
                 ))}
               </div>
               <div className="flex items-center gap-2 pb-2">
                 {isListening && (
                   <>
                     <span className="flex h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
                     <span className="text-xs text-red-600">Listening... speak now</span>
                   </>
                 )}
               </div>
               <AIChatInput
                 onSend={(message) => void handleSend(message)}
                 onVoiceStart={startVoiceInput}
                 onVoiceStop={stopVoiceInput}
                 disabled={chatMutation.isPending || isListening}
                 placeholder="Ask about business, learning, funding..."
                 voiceEnabled={true}
               />
             </div>
          </div>
        </section>
      )}
    </>
  );
}
