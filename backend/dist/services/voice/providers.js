"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceProviderFactory = exports.GoogleTTSProvider = exports.GoogleSTTProvider = exports.OpenAITTSProvider = exports.OpenAISTTProvider = exports.MockTextToSpeechProvider = exports.MockSpeechToTextProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../config");
const logger_1 = require("../../utils/logger");
// ---------------------------------------------------------------------------
// Mock STT Provider
// ---------------------------------------------------------------------------
class MockSpeechToTextProvider {
    async transcribe(_audioBuffer, options) {
        const lang = options?.language || 'en';
        logger_1.logger.info('MockSpeechToTextProvider.transcribe called');
        if (lang === 'hi' || lang === 'hindi') {
            return 'मैंने आपकी आवाज़ सुनी। यह एक डेमो प्रतिकृति है।';
        }
        return 'I heard your voice. This is a mock transcription.';
    }
}
exports.MockSpeechToTextProvider = MockSpeechToTextProvider;
// ---------------------------------------------------------------------------
// Mock TTS Provider
// ---------------------------------------------------------------------------
class MockTextToSpeechProvider {
    async synthesize(text, options) {
        const lang = options?.language || 'en';
        const voice = options?.voice || (lang === 'hi' ? 'hi-IN' : 'en-IN');
        logger_1.logger.info({ lang, voice }, 'MockTextToSpeechProvider.synthesize called');
        void text;
        void voice;
        return Buffer.from('mock-audio-data');
    }
}
exports.MockTextToSpeechProvider = MockTextToSpeechProvider;
// ---------------------------------------------------------------------------
// OpenAI STT Provider (Whisper)
// ---------------------------------------------------------------------------
class OpenAISTTProvider {
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    async transcribe(audioBuffer, options) {
        const language = options?.language || 'en';
        const model = options?.model || 'whisper-1';
        const formData = new FormData();
        formData.append('file', new Blob([audioBuffer], { type: 'audio/wav' }), 'audio.wav');
        formData.append('model', model);
        formData.append('language', language === 'hi' || language === 'hindi' ? 'hi' : 'en');
        const response = await axios_1.default.post('https://api.openai.com/v1/audio/transcriptions', formData, {
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                'Content-Type': 'multipart/form-data',
            },
            timeout: 30000,
        });
        return response.data.text;
    }
}
exports.OpenAISTTProvider = OpenAISTTProvider;
// ---------------------------------------------------------------------------
// OpenAI TTS Provider
// ---------------------------------------------------------------------------
class OpenAITTSProvider {
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    async synthesize(text, options) {
        const voice = options?.voice || 'alloy';
        const model = options?.model || 'tts-1';
        const speed = options?.speed || 1;
        const response = await axios_1.default.post('https://api.openai.com/v1/audio/speech', {
            model,
            input: text,
            voice,
            speed,
        }, {
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            responseType: 'arraybuffer',
            timeout: 30000,
        });
        return Buffer.from(response.data);
    }
}
exports.OpenAITTSProvider = OpenAITTSProvider;
// ---------------------------------------------------------------------------
// Google STT Provider
// ---------------------------------------------------------------------------
class GoogleSTTProvider {
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    async transcribe(audioBuffer, options) {
        const language = options?.language || 'en-US';
        const langCode = language === 'hi' || language === 'hindi' ? 'hi-IN' : 'en-US';
        const response = await axios_1.default.post(`https://speech.googleapis.com/v1/speech:recognize?key=${this.apiKey}`, {
            config: {
                encoding: 'LINEAR16',
                sampleRateHertz: 16000,
                languageCode: langCode,
            },
            interimResults: false,
            audio: {
                content: audioBuffer.toString('base64'),
            },
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 30000,
        });
        const results = response.data.results;
        if (results && results.length > 0 && results[0].alternatives && results[0].alternatives.length > 0) {
            return results[0].alternatives[0].transcript;
        }
        return '';
    }
}
exports.GoogleSTTProvider = GoogleSTTProvider;
// ---------------------------------------------------------------------------
// Google TTS Provider
// ---------------------------------------------------------------------------
class GoogleTTSProvider {
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    async synthesize(text, options) {
        const languageCode = options?.language === 'hi' ? 'hi-IN' : 'en-IN';
        const voiceName = options?.voice || (languageCode === 'hi-IN' ? 'hi-IN-Wavenet-A' : 'en-IN-Standard-A');
        const speed = options?.speed || 1;
        const response = await axios_1.default.post(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.apiKey}`, {
            input: { text },
            voice: {
                languageCode,
                name: voiceName,
            },
            audioConfig: {
                audioEncoding: 'MP3',
                speakingRate: speed,
            },
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 30000,
        });
        const audioContent = response.data.audioContent;
        if (audioContent) {
            return Buffer.from(audioContent, 'base64');
        }
        return Buffer.from('');
    }
}
exports.GoogleTTSProvider = GoogleTTSProvider;
// ---------------------------------------------------------------------------
// Provider Factory
// ---------------------------------------------------------------------------
class VoiceProviderFactory {
    static createSTT() {
        const useMock = config_1.config.llm.useMock;
        const apiKey = config_1.config.llm.apiKey;
        if (useMock || !apiKey) {
            logger_1.logger.info('Using MockSpeechToTextProvider');
            return new MockSpeechToTextProvider();
        }
        const provider = config_1.config.llm.provider;
        switch (provider) {
            case 'google':
                return new GoogleSTTProvider(apiKey);
            case 'anthropic':
            case 'openai':
            default:
                return new OpenAISTTProvider(apiKey);
        }
    }
    static createTTS() {
        const useMock = config_1.config.llm.useMock;
        const apiKey = config_1.config.llm.apiKey;
        if (useMock || !apiKey) {
            logger_1.logger.info('Using MockTextToSpeechProvider');
            return new MockTextToSpeechProvider();
        }
        const provider = config_1.config.llm.provider;
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
    static initializeVoiceService() {
        void this;
    }
}
exports.VoiceProviderFactory = VoiceProviderFactory;
//# sourceMappingURL=providers.js.map