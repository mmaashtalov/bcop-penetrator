import OpenAI from 'openai';

export const openai = new OpenAI({ 
  apiKey: import.meta.env.VITE_OPENAI_KEY || process.env.OPENAI_API_KEY || 'your-api-key-here',
  dangerouslyAllowBrowser: true,
  timeout: 30 * 1000, // Увеличиваем таймаут до 30 секунд
  maxRetries: 2,      // Добавляем 2 повторные попытки
});

export async function callGPT(prompt: string) {
  const r = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }]
  });
  return r.choices[0].message.content;
}

export async function callGPTWithSystem(
  system: string,
  user: string,
  opts = {}
) {
  const r = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ],
    ...opts
  });
  return r.choices[0].message.content;
}
