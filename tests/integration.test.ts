import { describe, it, expect, vi } from 'vitest';
import { analyzeMessage } from '@/analysis/analysis-engine-core';
import { generateResponses } from '@/analysis/response-generator';
import * as openaiModule from '@/lib/openai';

vi.mock('@/lib/openai');

const mocked = vi.mocked(openaiModule);

describe('integration: анализ и ответы', () => {
  it('полный цикл без ошибок', async () => {
    mocked.callGPTWithSystem
      .mockResolvedValueOnce('{"tactics":"threat"}')
      .mockResolvedValueOnce('{"legal":"law","professional":"business","sarcastic":"joke"}');

    const msg = 'Если не оплатите — будет суд!';
    const analysis = await analyzeMessage(msg);
    expect(analysis.tactics).toContain('threat');
    const responses = await generateResponses({ goal: 'delay_time', analysisResult: analysis });
    expect(responses.legal).toMatch(/law/);
  });
});
