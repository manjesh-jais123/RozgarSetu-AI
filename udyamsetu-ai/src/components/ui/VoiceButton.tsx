import { forwardRef, useState, useRef, useEffect } from 'react';
import { classNames } from '../../utils/helpers';
import { Mic, MicOff, Loader2, Volume2, X } from 'lucide-react';

interface VoiceButtonProps {
  onStartListening: () => void;
  onStopListening: () => void;
  onError?: (error: Error) => void;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  className?: string;
}

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

export const VoiceButton = forwardRef<HTMLButtonElement, VoiceButtonProps>(
  ({ onStartListening, onStopListening, onError, size = 'md', showStatus = true, className = '', ...props }: VoiceButtonProps, ref) => {
    const [voiceState, setVoiceState] = useState<VoiceState>('idle');
    const [permission, setPermission] = useState<PermissionState>('prompt');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const sizeClasses = {
      sm: 'w-10 h-10',
      md: 'w-14 h-14',
      lg: 'w-16 h-16',
    };

    const iconSizes = {
      sm: 'w-5 h-5',
      md: 'w-6 h-6',
      lg: 'w-7 h-7',
    };

    useEffect(() => {
      navigator.permissions.query({ name: 'microphone' as PermissionName }).then((result) => {
        setPermission(result.state);
        result.onchange = () => setPermission(result.state);
      });
    }, []);

    const startListening = async () => {
      try {
        if (permission === 'denied') {
          throw new Error('Microphone permission denied');
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = () => {
          void new Blob(audioChunksRef.current, { type: 'audio/webm' });
          setVoiceState('processing');
          onStopListening();
          setTimeout(() => setVoiceState('idle'), 1000);
        };
        mediaRecorderRef.current.start(100);
        setVoiceState('listening');
        onStartListening();
      } catch (error) {
        setVoiceState('error');
        onError?.(error as Error);
        setTimeout(() => setVoiceState('idle'), 3000);
      }
    };

    const stopListening = () => {
      if (mediaRecorderRef.current && voiceState === 'listening') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }
    };

    const handleClick = () => {
      if (voiceState === 'idle' || voiceState === 'error') {
        startListening();
      } else if (voiceState === 'listening') {
        stopListening();
      }
    };

    const iconForState = () => {
      switch (voiceState) {
        case 'listening': return <MicOff className={iconSizes[size]} />;
        case 'processing': return <Loader2 className={`${iconSizes[size]} animate-spin`} />;
        case 'speaking': return <Volume2 className={iconSizes[size]} />;
        case 'error': return <X className={iconSizes[size]} />;
        default: return <Mic className={iconSizes[size]} />;
      }
    };

    const statusText = () => {
      switch (voiceState) {
        case 'idle': return <p className="text-xs text-gray-500">Tap and hold or press Space to speak</p>;
        case 'listening': return <p className="text-xs text-red-600 font-medium animate-pulse">Listening... Release to stop</p>;
        case 'processing': return <p className="text-xs text-yellow-600">Processing your voice...</p>;
        case 'speaking': return <p className="text-xs text-green-600">AI is responding...</p>;
        case 'error': return <p className="text-xs text-red-600">Error: Microphone access denied. Tap to retry.</p>;
      }
    };

    const isDisabled = voiceState === 'processing' || voiceState === 'speaking';

    return (
      <div className="relative flex flex-col items-center gap-2">
        <button
          ref={ref}
          onClick={handleClick}
          className={classNames(
            'relative flex items-center justify-center rounded-full transition-all duration-300 touch-target',
            sizeClasses[size],
            voiceState === 'idle' && 'bg-primary-100 text-primary-600 hover:bg-primary-200',
            voiceState === 'listening' && 'bg-red-100 text-red-600 animate-pulse ring-4 ring-red-100',
            voiceState === 'processing' && 'bg-yellow-100 text-yellow-600',
            voiceState === 'speaking' && 'bg-green-100 text-green-600 animate-pulse ring-4 ring-green-100',
            voiceState === 'error' && 'bg-red-100 text-red-600',
            className
          )}
          aria-label={voiceState === 'listening' ? 'Stop listening' : 'Start voice input'}
          aria-pressed={voiceState === 'listening'}
          disabled={isDisabled}
          {...props}
        >
          {iconForState()}
        </button>
        {showStatus && (
          <div className="text-center min-h-[40px] w-full max-w-xs px-2">
            {statusText()}
          </div>
        )}
      </div>
    );
  }
);

VoiceButton.displayName = 'VoiceButton';