import { SYSTEM_PROMPT_ANALYSIS } from '../prompts/systemPrompt';
import { callGPTWithSystem } from '../lib/openai';

export async function analyzeMessage(text: string) {
  const userPrompt = SYSTEM_PROMPT_ANALYSIS.replace(
    '[ВСТАВЬ СЮДА ОДНО ИЛИ НЕСКОЛЬКО СООБЩЕНИЙ СО СТОРОНЫ ОПЕРАТОРА]',
    text
  );

  const raw = await callGPTWithSystem(
    'Ты — аналитик банковских коммуникаций. Отвечай JSON-объектом.',
    userPrompt,
    { response_format: { type: 'json_object' } }
  );

  return JSON.parse(raw as string);
}
