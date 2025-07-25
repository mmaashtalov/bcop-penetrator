import { SYSTEM_PROMPT_ANALYSIS } from '@/prompts/systemPrompt';
import { callGPTWithSystem } from '@/lib/openai';
import { logError } from '@/utils/logger';

export async function analyzeMessage(text: string) {
  const userPrompt = SYSTEM_PROMPT_ANALYSIS.replace(
    '[ВСТАВЬ СЮДА ОДНО ИЛИ НЕСКОЛЬКО СООБЩЕНИЙ СО СТОРОНЫ ОПЕРАТОРА]',
    text
  );

  try {
    const raw = await callGPTWithSystem(
      'Ты — аналитик банковских коммуникаций. Отвечай JSON-объектом.',
      userPrompt,
      { response_format: { type: 'json_object' } }
    );

    return JSON.parse(raw as string);
  } catch (e: any) {
    logError(e, { text });
    throw e;
  }
}
