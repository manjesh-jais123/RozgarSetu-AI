import { type HTMLAttributes } from 'react';
import { classNames } from '../../utils/helpers';
import { Bot, Copy, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';

interface AIMessageProps extends HTMLAttributes<HTMLDivElement> {
  content: string;
  isStreaming?: boolean;
  onCopy?: () => void;
  onRegenerate?: () => void;
  onFeedback?: (rating: 'positive' | 'negative') => void;
  showActions?: boolean;
  variant?: 'default' | 'bubble';
  className?: string;
}

export function AIMessage({ content, isStreaming = false, onCopy, onRegenerate, onFeedback, showActions = true, variant = 'default', className, ...props }: AIMessageProps) {
  return (
    <div className={classNames('flex gap-3', variant === 'bubble' && 'max-w-[85%]', className)} {...props}>
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
        <Bot className="w-4 h-4 text-primary-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className={classNames('rounded-xl px-4 py-3', variant === 'default' ? 'bg-gray-50' : 'bg-primary-600 text-white', variant === 'bubble' && 'rounded-2xl')}>
          <div className={classNames('prose prose-sm max-w-none', variant === 'bubble' && 'text-white')}>
            {isStreaming ? (
              <span className="relative inline-block">{content}<span className="animate-pulse ml-1">▌</span></span>
            ) : (
              content.split('\n').map((line, i) => <p key={i} className="whitespace-pre-wrap">{line}</p>)
            )}
          </div>
          {showActions && !isStreaming && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-current/20">
              {onFeedback && (
                <>
                  <button onClick={() => onFeedback('positive')} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-sm" aria-label="Helpful"><ThumbsUp className="w-4 h-4" /></button>
                  <button onClick={() => onFeedback('negative')} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-sm" aria-label="Not helpful"><ThumbsDown className="w-4 h-4" /></button>
                </>
              )}
              {onCopy && <button onClick={onCopy} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-sm ml-auto" aria-label="Copy"><Copy className="w-4 h-4" /></button>}
              {onRegenerate && <button onClick={onRegenerate} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-sm" aria-label="Regenerate"><RefreshCw className="w-4 h-4" /></button>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface UserMessageProps extends HTMLAttributes<HTMLDivElement> {
  content: string;
  variant?: 'default' | 'bubble';
  className?: string;
}

export function UserMessage({ content, variant = 'default', className, ...props }: UserMessageProps) {
  return (
    <div className={classNames('flex gap-3 justify-end', variant === 'bubble' && 'max-w-[85%]', className)} {...props}>
      <div className="flex-1 min-w-0 text-right">
        <div className={classNames('rounded-xl px-4 py-3 inline-block max-w-[85%]', variant === 'default' ? 'bg-primary-600 text-white' : 'bg-primary-600 text-white', variant === 'bubble' && 'rounded-2xl')}>
          <div className="prose prose-sm max-w-none text-white whitespace-pre-wrap">
            {content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
      </div>
    </div>
  );
}

interface AIChatInputProps {
  onSend: (message: string) => void;
  onVoiceStart?: () => void;
  onVoiceStop?: () => void;
  disabled?: boolean;
  placeholder?: string;
  voiceEnabled?: boolean;
}

import { useState } from 'react';

export function AIChatInput({ onSend, onVoiceStart, onVoiceStop, disabled = false, placeholder = 'Ask me anything...', voiceEnabled = true }: AIChatInputProps) {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) { onSend(message.trim()); setMessage(''); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 p-4 bg-white border-t border-gray-100">
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => { if (!isComposing) setMessage(e.target.value); }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={(e) => { setIsComposing(false); setMessage(e.currentTarget.value); }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none min-h-[48px] max-h-32"
          rows={1}
          aria-label="Chat input"
        />
        {voiceEnabled && (
          <button type="button" onMouseDown={onVoiceStart} onMouseUp={onVoiceStop} onMouseLeave={onVoiceStop} onTouchStart={onVoiceStart} onTouchEnd={onVoiceStop} disabled={disabled} className="absolute right-3 bottom-3 p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors touch-target" aria-label="Voice input">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </button>
        )}
      </div>
      <button type="submit" disabled={!message.trim() || disabled} className="p-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-target" aria-label="Send message">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
      </button>
    </form>
  );
}