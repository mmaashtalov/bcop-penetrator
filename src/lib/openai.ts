import OpenAI from 'openai';

// Проверяем наличие API ключа
const apiKey = import.meta.env.VITE_OPENAI_KEY;
// console.log('🔑 Loaded API Key:', apiKey); // Temporary debug log
if (!apiKey || apiKey === 'your-api-key-here') {
  console.warn('⚠️ OpenAI API key not configured. Please set VITE_OPENAI_KEY in .env file');
}

export const openai = new OpenAI({ 
  apiKey: apiKey || 'sk-placeholder-key-for-development',
  baseURL: 'https://api.openai.com/v1',
  dangerouslyAllowBrowser: true,
  timeout: 30 * 1000, // Увеличиваем таймаут до 30 секунд
  maxRetries: 0,      // Отключаем встроенные retry, используем свои
});

// Retry helper с логированием для диагностики ошибок
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
      
      // Логируем статус для диагностики (токены, лимиты, etc.)
      if (error?.status) {
        console.log(`🔍 OpenAI API Error - Status: ${error.status}, Attempt: ${attempt + 1}/${maxRetries + 1}`);
        
        if (error.status === 401) {
          console.error('🔑 Unauthorized (401) - неверный или отсутствующий API ключ');
        } else if (error.status === 429) {
          console.log('⚠️ Rate limit exceeded (429) - возможно закончились токены или превышен лимит запросов');
        } else if (error.status >= 500) {
          console.log('💥 Server error (5xx) - проблемы на стороне OpenAI');
        }
      } else if (error?.message) {
        console.log(`🌐 Network Error: ${error.message}`);
      }
      
      // Если это последняя попытка, выбрасываем ошибку
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Backoff перед следующей попыткой
      console.log(`⏳ Waiting ${backoffMs}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, backoffMs));
      backoffMs *= 2; // Экспоненциальный backoff
    }
  }
  
  throw lastError;
}

import { sanitize } from "./anonymizer";

export async function callGPT(prompt: string, opts:any={}) {
  return retryWithBackoff(async () => {
    const r = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: prompt.startsWith("[")
        ? opts.messages
        : [{ role:"user", content:sanitize(prompt) }],
      ...opts
    });
    return r.choices[0].message.content;
  });
}

export async function callGPTWithSystem(
  system: string,
  user: string,
  opts = {}
) {
  return retryWithBackoff(async () => {
    const r = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: sanitize(user) }
      ],
      ...opts
    });
    return r.choices[0].message.content;
  });
}