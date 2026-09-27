"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voiceService = exports.VoiceService = void 0;
const logger_1 = require("../../utils/logger");
const providers_1 = require("./providers");
class VoiceService {
    sttProvider = null;
    ttsProvider = null;
    constructor() {
        this.initializeProviders();
    }
    initializeProviders() {
        try {
            this.sttProvider = providers_1.VoiceProviderFactory.createSTT();
            this.ttsProvider = providers_1.VoiceProviderFactory.createTTS();
        }
        catch (error) {
            logger_1.logger.error({ error }, 'Failed to initialize voice providers');
            this.sttProvider = null;
            this.ttsProvider = null;
        }
    }
    setSTTProvider(provider) {
        this.sttProvider = provider;
    }
    setTTSProvider(provider) {
        this.ttsProvider = provider;
    }
    async transcribe(audioBuffer, options) {
        if (!this.sttProvider) {
            throw new Error('No STT provider configured');
        }
        return this.sttProvider.transcribe(audioBuffer, options);
    }
    async synthesize(text, options) {
        if (!this.ttsProvider) {
            throw new Error('No TTS provider configured');
        }
        return this.ttsProvider.synthesize(text, options);
    }
    isSTTAvailable() {
        return this.sttProvider !== null;
    }
    isTTSAvailable() {
        return this.ttsProvider !== null;
    }
    getProviderInfo() {
        return {
            stt: this.sttProvider?.constructor.name || 'none',
            tts: this.ttsProvider?.constructor.name || 'none',
        };
    }
}
exports.VoiceService = VoiceService;
exports.voiceService = new VoiceService();
//# sourceMappingURL=types.js.map