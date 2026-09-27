"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMProviderFactory = exports.AnthropicProvider = exports.OpenAIProvider = exports.MockLLMProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../config");
const logger_1 = require("../../utils/logger");
// ---------------------------------------------------------------------------
// Mock Provider
// ---------------------------------------------------------------------------
class MockLLMProvider {
    async generateText(_prompt, _options) {
        logger_1.logger.info('MockLLMProvider.generateText called');
        return {
            content: 'Mock response: I can help you build your livelihood. Set LLM_API_KEY and set USE_MOCK_LLM=false for real AI responses.',
            usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        };
    }
    async generateJSON(_prompt, _options) {
        logger_1.logger.info('MockLLMProvider.generateJSON called');
        return {};
    }
}
exports.MockLLMProvider = MockLLMProvider;
// ---------------------------------------------------------------------------
// OpenAI Provider
// ---------------------------------------------------------------------------
class OpenAIProvider {
    apiKey;
    baseURL;
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.openai.com/v1';
    }
    async generateText(prompt, options = {}) {
        const response = await axios_1.default.post(`${this.baseURL}/chat/completions`, {
            model: options.model || config_1.config.llm.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: options.temperature ?? 0.7,
            max_tokens: options.maxTokens ?? 2000,
            top_p: options.topP ?? 0.9,
            stop: options.stop,
        }, {
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            timeout: 30000,
        });
        const content = response.data.choices[0]?.message?.content || '';
        const usage = response.data.usage
            ? {
                promptTokens: response.data.usage.prompt_tokens,
                completionTokens: response.data.usage.completion_tokens,
                totalTokens: response.data.usage.total_tokens,
            }
            : undefined;
        return { content, usage };
    }
    async generateJSON(prompt, options = {}) {
        const result = await this.generateText(prompt, {
            ...options,
            temperature: options.temperature ?? 0.3,
        });
        return this.parseJSON(result.content);
    }
    parseJSON(content) {
        const cleaned = content
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();
        try {
            return JSON.parse(cleaned);
        }
        catch (error) {
            logger_1.logger.warn({ error, content: cleaned.slice(0, 500) }, 'Failed to parse JSON from LLM response');
            throw new Error('Invalid JSON response from LLM');
        }
    }
}
exports.OpenAIProvider = OpenAIProvider;
// ---------------------------------------------------------------------------
// Anthropic Provider
// ---------------------------------------------------------------------------
class AnthropicProvider {
    apiKey;
    baseURL;
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.anthropic.com/v1';
    }
    async generateText(prompt, options = {}) {
        const response = await axios_1.default.post(`${this.baseURL}/messages`, {
            model: options.model || config_1.config.llm.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: options.temperature ?? 0.7,
            max_tokens: options.maxTokens ?? 2000,
            top_p: options.topP ?? 0.9,
            stop_sequences: options.stop,
        }, {
            headers: {
                'x-api-key': this.apiKey,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01',
            },
            timeout: 30000,
        });
        const content = response.data.content[0]?.text || '';
        const usage = response.data.usage
            ? {
                promptTokens: response.data.usage.input_tokens,
                completionTokens: response.data.usage.output_tokens,
                totalTokens: response.data.usage.input_tokens + response.data.usage.output_tokens,
            }
            : undefined;
        return { content, usage };
    }
    async generateJSON(prompt, options = {}) {
        const result = await this.generateText(prompt, {
            ...options,
            temperature: options.temperature ?? 0.3,
        });
        const cleaned = result.content
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();
        try {
            return JSON.parse(cleaned);
        }
        catch (error) {
            logger_1.logger.warn({ error, content: cleaned.slice(0, 500) }, 'Failed to parse JSON from LLM response');
            throw new Error('Invalid JSON response from LLM');
        }
    }
}
exports.AnthropicProvider = AnthropicProvider;
// ---------------------------------------------------------------------------
// Provider Factory
// ---------------------------------------------------------------------------
class LLMProviderFactory {
    static create() {
        const useMock = config_1.config.llm.useMock;
        const apiKey = config_1.config.llm.apiKey;
        if (useMock || !apiKey) {
            logger_1.logger.info('Using MockLLMProvider — set LLM_API_KEY and USE_MOCK_LLM=false to enable a real provider');
            return new MockLLMProvider();
        }
        const provider = config_1.config.llm.provider;
        switch (provider) {
            case 'anthropic':
                logger_1.logger.info('Using AnthropicProvider');
                return new AnthropicProvider(apiKey);
            case 'openai':
            default:
                logger_1.logger.info('Using OpenAIProvider');
                return new OpenAIProvider(apiKey);
        }
    }
}
exports.LLMProviderFactory = LLMProviderFactory;
//# sourceMappingURL=llmProviders.js.map