import axios from 'axios';
import { config } from '../../config';
import { logger } from '../../utils/logger';

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

// ---------------------------------------------------------------------------
// Mock Provider
// ---------------------------------------------------------------------------
export class MockLLMProvider implements LLMProvider {
  async generateText(_prompt: string, _options?: LLMOptions): Promise<LLMResponse> {
    logger.info('MockLLMProvider.generateText called');
    return {
      content:
        'Mock response: I can help you build your livelihood. Set LLM_API_KEY and set USE_MOCK_LLM=false for real AI responses.',
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
    };
  }

  async generateJSON<T>(_prompt: string, _options?: LLMOptions): Promise<T> {
    logger.info('MockLLMProvider.generateJSON called');
    return {} as T;
  }
}

// ---------------------------------------------------------------------------
// OpenAI Provider
// ---------------------------------------------------------------------------
export class OpenAIProvider implements LLMProvider {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.openai.com/v1';
  }

  async generateText(prompt: string, options: LLMOptions = {}): Promise<LLMResponse> {
    const response = await axios.post(
      `${this.baseURL}/chat/completions`,
      {
        model: options.model || config.llm.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2000,
        top_p: options.topP ?? 0.9,
        stop: options.stop,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

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

  async generateJSON<T>(prompt: string, options: LLMOptions = {}): Promise<T> {
    const result = await this.generateText(prompt, {
      ...options,
      temperature: options.temperature ?? 0.3,
    });
    return this.parseJSON<T>(result.content);
  }

  private parseJSON<T>(content: string): T {
    const cleaned = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    try {
      return JSON.parse(cleaned) as T;
    } catch (error) {
      logger.warn({ error, content: cleaned.slice(0, 500) }, 'Failed to parse JSON from LLM response');
      throw new Error('Invalid JSON response from LLM');
    }
  }
}

// ---------------------------------------------------------------------------
// Anthropic Provider
// ---------------------------------------------------------------------------
export class AnthropicProvider implements LLMProvider {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.anthropic.com/v1';
  }

  async generateText(prompt: string, options: LLMOptions = {}): Promise<LLMResponse> {
    const response = await axios.post(
      `${this.baseURL}/messages`,
      {
        model: options.model || config.llm.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2000,
        top_p: options.topP ?? 0.9,
        stop_sequences: options.stop,
      },
      {
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        timeout: 30000,
      }
    );

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

  async generateJSON<T>(prompt: string, options: LLMOptions = {}): Promise<T> {
    const result = await this.generateText(prompt, {
      ...options,
      temperature: options.temperature ?? 0.3,
    });

    const cleaned = result.content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    try {
      return JSON.parse(cleaned) as T;
    } catch (error) {
      logger.warn({ error, content: cleaned.slice(0, 500) }, 'Failed to parse JSON from LLM response');
      throw new Error('Invalid JSON response from LLM');
    }
  }
}

// ---------------------------------------------------------------------------
// Provider Factory
// ---------------------------------------------------------------------------
export class LLMProviderFactory {
  static create(): LLMProvider {
    const useMock = config.llm.useMock;
    const apiKey = config.llm.apiKey;

    if (useMock || !apiKey) {
      logger.info('Using MockLLMProvider — set LLM_API_KEY and USE_MOCK_LLM=false to enable a real provider');
      return new MockLLMProvider();
    }

    const provider = config.llm.provider;
    switch (provider) {
      case 'anthropic':
        logger.info('Using AnthropicProvider');
        return new AnthropicProvider(apiKey);
      case 'openai':
      default:
        logger.info('Using OpenAIProvider');
        return new OpenAIProvider(apiKey);
    }
  }
}
