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
export declare class VoiceService {
    private sttProvider;
    private ttsProvider;
    constructor();
    private initializeProviders;
    setSTTProvider(provider: SpeechToTextProvider): void;
    setTTSProvider(provider: TextToSpeechProvider): void;
    transcribe(audioBuffer: Buffer, options?: SpeechToTextOptions): Promise<string>;
    synthesize(text: string, options?: TextToSpeechOptions): Promise<Buffer>;
    isSTTAvailable(): boolean;
    isTTSAvailable(): boolean;
    getProviderInfo(): {
        stt: string;
        tts: string;
    };
}
export declare const voiceService: VoiceService;
//# sourceMappingURL=types.d.ts.map