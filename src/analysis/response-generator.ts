import { callGPTWithSystem } from '../lib/openai';
import { GeneratedResponses, ResponseGeneratorParams } from '../types/response';

export async function generateResponses(params: ResponseGeneratorParams): Promise<GeneratedResponses> {
  const { goal, analysisResult } = params;
  
  const systemPrompt = `Ты — эксперт по коммуникациям с коллекторами и банками. 
Генерируй ответы в трёх стилях: legal (юридически грамотный), professional (деловой), sarcastic (саркастичный, но в рамках приличий).
Отвечай ТОЛЬКО JSON-объектом с этими тремя полями.`;

  const userPrompt = `Цель: ${goal}. 
Вот анализ сообщения: ${JSON.stringify(analysisResult, null, 2)}. 

Сгенерируй три варианта ответа:
- legal: Юридически грамотный ответ со ссылками на законы
- professional: Деловой, вежливый ответ  
- sarcastic: Саркастичный, но корректный ответ

Формат ответа:
{ "legal": "...", "professional": "...", "sarcastic": "..." }`;

  try {
    const response = await callGPTWithSystem(
      systemPrompt,
      userPrompt,
      { response_format: { type: 'json_object' } }
    );

    return JSON.parse(response as string);
  } catch (error) {
    console.error('Error generating responses:', error);
    return {
      legal: 'Ошибка генерации юридического ответа',
      professional: 'Ошибка генерации профессионального ответа', 
      sarcastic: 'Ошибка генерации саркастичного ответа'
    };
  }
}
