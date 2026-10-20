import { describe, expect, it } from 'vitest';
import { resolveLlmConfig } from '@/lib/agent/llm';

const env = (values: Record<string, string>) => values as unknown as NodeJS.ProcessEnv;

describe('resolveLlmConfig', () => {
  it('uses the DeepSeek preset and its provider key', () => {
    expect(resolveLlmConfig(env({ DEEPSEEK_API_KEY: 'sk-ds' }))).toMatchObject({
      provider: 'deepseek',
      apiKey: 'sk-ds',
      baseUrl: 'https://api.deepseek.com/v1',
      model: 'deepseek-flash',
      protocol: 'chat-completions',
    });
  });

  it('uses the Kimi preset and its provider key', () => {
    expect(
      resolveLlmConfig(env({ AGENT_LLM_PROVIDER: 'kimi', MOONSHOT_API_KEY: 'sk-kimi' })),
    ).toMatchObject({
      provider: 'kimi',
      apiKey: 'sk-kimi',
      baseUrl: 'https://api.moonshot.ai/v1',
      model: 'kimi-k3',
      protocol: 'chat-completions',
    });
  });

  it('uses the OpenAI preset', () => {
    expect(
      resolveLlmConfig(env({ AGENT_LLM_PROVIDER: 'openai', OPENAI_API_KEY: 'sk-openai' })),
    ).toMatchObject({
      provider: 'openai',
      model: 'gpt-5.1',
      protocol: 'chat-completions',
    });
  });

  it('routes Codex through the Responses API', () => {
    expect(
      resolveLlmConfig(env({ AGENT_LLM_PROVIDER: 'codex', OPENAI_API_KEY: 'sk-openai' })),
    ).toMatchObject({
      provider: 'codex',
      apiKey: 'sk-openai',
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-5.1-codex-max',
      protocol: 'responses',
    });
  });

  it('supports custom OpenAI-compatible gateways', () => {
    expect(
      resolveLlmConfig(
        env({
          AGENT_LLM_PROVIDER: 'custom',
          AGENT_LLM_API_KEY: 'sk-custom',
          AGENT_LLM_BASE_URL: 'https://gateway.example.com/v1',
          AGENT_LLM_MODEL: 'my-model',
        }),
      ),
    ).toMatchObject({
      provider: 'custom',
      apiKey: 'sk-custom',
      baseUrl: 'https://gateway.example.com/v1',
      model: 'my-model',
      protocol: 'chat-completions',
    });
  });

  it('lets explicit model, base URL and protocol overrides win', () => {
    expect(
      resolveLlmConfig(
        env({
          AGENT_LLM_PROVIDER: 'kimi',
          MOONSHOT_API_KEY: 'sk-kimi',
          AGENT_LLM_BASE_URL: 'https://proxy.example.com/v1/',
          AGENT_LLM_MODEL: 'kimi-k2.6',
          AGENT_LLM_PROTOCOL: 'responses',
        }),
      ),
    ).toMatchObject({
      baseUrl: 'https://proxy.example.com/v1',
      model: 'kimi-k2.6',
      protocol: 'responses',
    });
  });

  it('returns null without a key or with an unknown provider', () => {
    expect(resolveLlmConfig(env({}))).toBeNull();
    expect(
      resolveLlmConfig(env({ AGENT_LLM_PROVIDER: 'unknown', DEEPSEEK_API_KEY: 'x' })),
    ).toBeNull();
    expect(resolveLlmConfig(env({ AGENT_LLM_PROVIDER: 'custom' }))).toBeNull();
  });
});
