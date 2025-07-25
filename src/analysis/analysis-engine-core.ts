import { SYSTEM_PROMPT_ANALYSIS } from '../prompts/systemPrompt';
import { callGPTWithSystem } from '../lib/openai';
import { AnalysisResult } from '../types/response';

export async function analyzeMessage(text: string): Promise<AnalysisResult> {
  const userPrompt = SYSTEM_PROMPT_ANALYSIS.replace(
    '[ВСТАВЬ СЮДА ОДНО ИЛИ НЕСКОЛЬКО СООБЩЕНИЙ СО СТОРОНЫ ОПЕРАТОРА]',
    text
  );

  const raw = await callGPTWithSystem(
    'Ты — аналитик банковских коммуникаций. Отвечай JSON-объектом.',
    userPrompt,
    { response_format: { type: 'json_object' } }
  );

  if (!raw) {
    throw new Error('No response from OpenAI API');
  }

  return JSON.parse(raw) as AnalysisResult;
}
