export interface LLMOptions {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    model?: string;
    stop?: string[];
}
export interface LLMUsage {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
}
export interface LLMResponse {
    content: string;
    usage?: LLMUsage;
}
export interface LLMProvider {
    generateText(prompt: string, options?: LLMOptions): Promise<LLMResponse>;
    generateJSON<T>(prompt: string, options?: LLMOptions): Promise<T>;
}
export declare class MockLLMProvider implements LLMProvider {
    generateText(_prompt: string, _options?: LLMOptions): Promise<LLMResponse>;
    generateJSON<T>(_prompt: string, _options?: LLMOptions): Promise<T>;
}
export declare class OpenAIProvider implements LLMProvider {
    private apiKey;
    private baseURL;
    constructor(apiKey: string);
    generateText(prompt: string, options?: LLMOptions): Promise<LLMResponse>;
    generateJSON<T>(prompt: string, options?: LLMOptions): Promise<T>;
    private parseJSON;
}
export declare class AnthropicProvider implements LLMProvider {
    private apiKey;
    private baseURL;
    constructor(apiKey: string);
    generateText(prompt: string, options?: LLMOptions): Promise<LLMResponse>;
    generateJSON<T>(prompt: string, options?: LLMOptions): Promise<T>;
}
export declare class LLMProviderFactory {
    static create(): LLMProvider;
}
//# sourceMappingURL=llmProviders.d.ts.map