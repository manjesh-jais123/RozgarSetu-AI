import { config } from '../../config';
import { logger } from '../../utils/logger';
import { VoiceProviderFactory } from './providers';

export interface SpeechToTextOptions {
  language?: 'hi' | 'en' | string;
  model?: 'latest_long' | 'latest_short';
}

export interface TextToSpeechOptions {
  language?: 'hi' | 'en' | string;
  voice?: string;
  speed?: number;
  model?: string;
}

export interface SpeechToTextProvider {
  transcribe(audioBuffer: Buffer, options?: SpeechToTextOptions): Promise<string>;
}

export interface TextToSpeechProvider {
  synthesize(text: string, options?: TextToSpeechOptions): Promise<Buffer>;
}

export class VoiceService {
  private sttProvider: SpeechToTextProvider | null = null;
  private ttsProvider: TextToSpeechProvider | null = null;

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    try {
      this.sttProvider = VoiceProviderFactory.createSTT();
      this.ttsProvider = VoiceProviderFactory.createTTS();
    } catch (error) {
      logger.error({ error }, 'Failed to initialize voice providers');
      this.sttProvider = null;
      this.ttsProvider = null;
    }
  }

  setSTTProvider(provider: SpeechToTextProvider): void {
    this.sttProvider = provider;
  }

  setTTSProvider(provider: TextToSpeechProvider): void {
    this.ttsProvider = provider;
  }

  async transcribe(audioBuffer: Buffer, options?: SpeechToTextOptions): Promise<string> {
    if (!this.sttProvider) {
      throw new Error('No STT provider configured');
    }
    return this.sttProvider.transcribe(audioBuffer, options);
  }

  async synthesize(text: string, options?: TextToSpeechOptions): Promise<Buffer> {
    if (!this.ttsProvider) {
      throw new Error('No TTS provider configured');
    }
    return this.ttsProvider.synthesize(text, options);
  }

  isSTTAvailable(): boolean {
    return this.sttProvider !== null;
  }

  isTTSAvailable(): boolean {
    return this.ttsProvider !== null;
  }

  getProviderInfo(): { stt: string; tts: string } {
    return {
      stt: this.sttProvider?.constructor.name || 'none',
      tts: this.ttsProvider?.constructor.name || 'none',
    };
  }
}

export const voiceService = new VoiceService();
