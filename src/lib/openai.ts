import OpenAI from 'openai';
export const openai = new OpenAI({ 
  apiKey: import.meta.env.VITE_OPENAI_KEY || 'your-api-key-here',
  dangerouslyAllowBrowser: true,
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
