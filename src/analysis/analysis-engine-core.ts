import { AnalyzeDialogueRequest, AnalyzeDialogueResponse } from '../types/response';

const API_URL = '/api/dialogue/analyze';

export async function analyzeDialogue(
  request: AnalyzeDialogueRequest,
): Promise<AnalyzeDialogueResponse> {
  const history = request.history.map(({ id, author, originalText, timestamp }) => ({
    id,
    author,
    originalText,
    timestamp,
  }));
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...request, history }),
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    throw new Error('Сервер вернул некорректный ответ.');
  }

  if (!response.ok) {
    const message = typeof payload === 'object' && payload !== null && 'error' in payload
      ? String(payload.error)
      : 'Не удалось выполнить анализ.';
    throw new Error(message);
  }

  if (!isAnalyzeResponse(payload)) {
    throw new Error('Сервер вернул неполный результат анализа.');
  }

  return payload;
}

function isAnalyzeResponse(value: unknown): value is AnalyzeDialogueResponse {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<AnalyzeDialogueResponse>;
  return (candidate.mode === 'ai' || candidate.mode === 'demo')
    && typeof candidate.request_id === 'string'
    && typeof candidate.analysis === 'object'
    && candidate.analysis !== null
    && Array.isArray(candidate.analysis.response_options);
}
