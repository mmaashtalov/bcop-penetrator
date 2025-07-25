import OpenAI from 'openai';
import { sanitize } from "./anonymizer";

const apiKey = import.meta.env.VITE_OPENAI_KEY;
if (!apiKey || apiKey === 'your-api-key-here') {
  console.warn('⚠️ OpenAI API key not configured. Please set VITE_OPENAI_KEY in .env file');
}

export const openai = new OpenAI({ 
  apiKey: apiKey || 'sk-placeholder-key-for-development',
  baseURL: 'https://api.openai.com/v1',
  dangerouslyAllowBrowser: true,
  timeout: 30 * 1000,
  maxRetries: 0,
});

async function retryWithBackoff<T>(
  fn: () => Promise<T>, 
  maxRetries: number = 2, 
  backoffMs: number = 500
): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      if (error?.status) {
        console.log(`🔍 OpenAI API Error - Status: ${error.status}, Attempt: ${attempt + 1}/${maxRetries + 1}`);
      } else if (error?.message) {
        console.log(`🌐 Network Error: ${error.message}`);
      }
      if (attempt === maxRetries) throw lastError;
      await new Promise(resolve => setTimeout(resolve, backoffMs));
      backoffMs *= 2;
    }
  }
  throw lastError;
}

export async function callGPT(prompt: string, opts: any = {}) {
    return retryWithBackoff(async () => {
        const messages = opts.messages || [{ role: 'user', content: sanitize(prompt) }];
        const sanitizedMessages = messages.map((msg: any) => ({
            ...msg,
            content: sanitize(msg.content)
        }));

        const r = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            ...opts,
            messages: sanitizedMessages,
        });
        return r.choices[0].message.content;
    });
}

export async function callGPTWithSystem(system: string, user: string, opts = {}) {
  return retryWithBackoff(async () => {
    const r = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system }, // Системные промпты не санитайзим
        { role: 'user', content: sanitize(user) }
      ],
      ...opts
    });
    return r.choices[0].message.content;
  });
}