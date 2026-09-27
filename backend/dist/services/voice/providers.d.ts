import { SpeechToTextProvider, TextToSpeechProvider, SpeechToTextOptions, TextToSpeechOptions } from './types';
export declare class MockSpeechToTextProvider implements SpeechToTextProvider {
    transcribe(_audioBuffer: Buffer, options?: SpeechToTextOptions): Promise<string>;
}
export declare class MockTextToSpeechProvider implements TextToSpeechProvider {
    synthesize(text: string, options?: TextToSpeechOptions): Promise<Buffer>;
}
export declare class OpenAISTTProvider implements SpeechToTextProvider {
    private apiKey;
    constructor(apiKey: string);
    transcribe(audioBuffer: Buffer, options?: SpeechToTextOptions): Promise<string>;
}
export declare class OpenAITTSProvider implements TextToSpeechProvider {
    private apiKey;
    constructor(apiKey: string);
    synthesize(text: string, options?: TextToSpeechOptions): Promise<Buffer>;
}
export declare class GoogleSTTProvider implements SpeechToTextProvider {
    private apiKey;
    constructor(apiKey: string);
    transcribe(audioBuffer: Buffer, options?: SpeechToTextOptions): Promise<string>;
}
export declare class GoogleTTSProvider implements TextToSpeechProvider {
    private apiKey;
    constructor(apiKey: string);
    synthesize(text: string, options?: TextToSpeechOptions): Promise<Buffer>;
}
export declare class VoiceProviderFactory {
    static createSTT(): SpeechToTextProvider;
    static createTTS(): TextToSpeechProvider;
    static initializeVoiceService(): void;
}
//# sourceMappingURL=providers.d.ts.map