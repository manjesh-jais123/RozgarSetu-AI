import axios from 'axios';
import { config } from '../../config';
import { logger } from '../../utils/logger';
import { SpeechToTextProvider, TextToSpeechProvider, SpeechToTextOptions, TextToSpeechOptions } from './types';

// ---------------------------------------------------------------------------
// Mock STT Provider
// ---------------------------------------------------------------------------
export class MockSpeechToTextProvider implements SpeechToTextProvider {
  async transcribe(_audioBuffer: Buffer, options?: SpeechToTextOptions): Promise<string> {
    const lang = options?.language || 'en';
    logger.info('MockSpeechToTextProvider.transcribe called');
    if (lang === 'hi' || lang === 'hindi') {
      return 'मैंने आपकी आवाज़ सुनी। यह एक डेमो प्रतिकृति है।';
    }
    return 'I heard your voice. This is a mock transcription.';
  }
}

// ---------------------------------------------------------------------------
// Mock TTS Provider
// ---------------------------------------------------------------------------
export class MockTextToSpeechProvider implements TextToSpeechProvider {
  async synthesize(text: string, options?: TextToSpeechOptions): Promise<Buffer> {
    const lang = options?.language || 'en';
    const voice = options?.voice || (lang === 'hi' ? 'hi-IN' : 'en-IN');
    logger.info({ lang, voice }, 'MockTextToSpeechProvider.synthesize called');
    void text;
    void voice;
    return Buffer.from('mock-audio-data');
  }
}

// ---------------------------------------------------------------------------
// OpenAI STT Provider (Whisper)
// ---------------------------------------------------------------------------
export class OpenAISTTProvider implements SpeechToTextProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async transcribe(audioBuffer: Buffer, options?: SpeechToTextOptions): Promise<string> {
    const language = options?.language || 'en';
    const model = options?.model || 'whisper-1';

    const formData = new FormData();
    formData.append('file', new Blob([audioBuffer], { type: 'audio/wav' }), 'audio.wav');
    formData.append('model', model);
    formData.append('language', language === 'hi' || language === 'hindi' ? 'hi' : 'en');

    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });

    return response.data.text;
  }
}

// ---------------------------------------------------------------------------
// OpenAI TTS Provider
// ---------------------------------------------------------------------------
export class OpenAITTSProvider implements TextToSpeechProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async synthesize(text: string, options?: TextToSpeechOptions): Promise<Buffer> {
    const voice = options?.voice || 'alloy';
    const model = options?.model || 'tts-1';
    const speed = options?.speed || 1;

    const response = await axios.post(
      'https://api.openai.com/v1/audio/speech',
      {
        model,
        input: text,
        voice,
        speed,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
        timeout: 30000,
      }
    );

    return Buffer.from(response.data);
  }
}

// ---------------------------------------------------------------------------
// Google STT Provider
// ---------------------------------------------------------------------------
export class GoogleSTTProvider implements SpeechToTextProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async transcribe(audioBuffer: Buffer, options?: SpeechToTextOptions): Promise<string> {
    const language = options?.language || 'en-US';
    const langCode = language === 'hi' || language === 'hindi' ? 'hi-IN' : 'en-US';

    const response = await axios.post(
      `https://speech.googleapis.com/v1/speech:recognize?key=${this.apiKey}`,
      {
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: langCode,
        },
        interimResults: false,
        audio: {
          content: audioBuffer.toString('base64'),
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const results = response.data.results;
    if (results && results.length > 0 && results[0].alternatives && results[0].alternatives.length > 0) {
      return results[0].alternatives[0].transcript;
    }
    return '';
  }
}

// ---------------------------------------------------------------------------
// Google TTS Provider
// ---------------------------------------------------------------------------
export class GoogleTTSProvider implements TextToSpeechProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async synthesize(text: string, options?: TextToSpeechOptions): Promise<Buffer> {
    const languageCode = options?.language === 'hi' ? 'hi-IN' : 'en-IN';
    const voiceName = options?.voice || (languageCode === 'hi-IN' ? 'hi-IN-Wavenet-A' : 'en-IN-Standard-A');
    const speed = options?.speed || 1;

    const response = await axios.post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.apiKey}`,
      {
        input: { text },
        voice: {
          languageCode,
          name: voiceName,
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: speed,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const audioContent = response.data.audioContent;
    if (audioContent) {
      return Buffer.from(audioContent, 'base64');
    }
    return Buffer.from('');
  }
}

// ---------------------------------------------------------------------------
// Provider Factory
// ---------------------------------------------------------------------------
export class VoiceProviderFactory {
  static createSTT(): SpeechToTextProvider {
    const useMock = config.llm.useMock;
    const apiKey = config.llm.apiKey;

    if (useMock || !apiKey) {
      logger.info('Using MockSpeechToTextProvider');
      return new MockSpeechToTextProvider();
    }

    const provider = config.llm.provider;
    switch (provider) {
      case 'google':
        return new GoogleSTTProvider(apiKey);
      case 'anthropic':
      case 'openai':
      default:
        return new OpenAISTTProvider(apiKey);
    }
  }

  static createTTS(): TextToSpeechProvider {
    const useMock = config.llm.useMock;
    const apiKey = config.llm.apiKey;

    if (useMock || !apiKey) {
      logger.info('Using MockTextToSpeechProvider');
      return new MockTextToSpeechProvider();
    }

    const provider = config.llm.provider;
    switch (provider) {
      case 'google':
        return new GoogleTTSProvider(apiKey);
      case 'anthropic':
      case 'openai':
      default:
        return new OpenAITTSProvider(apiKey);
    }
  }

  // Initialize the voice service with appropriate providers
  static initializeVoiceService(): void {
    void this;
  }
}
