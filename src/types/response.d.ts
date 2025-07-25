export interface GeneratedResponses {
  legal: string;
  professional: string;
  sarcastic: string;
}

export interface AnalysisMessage {
  id: string;
  timestamp: number;
  /** Кто отправил сообщение */
  author?: 'user' | 'assistant';
  originalText: string;
  analysis: unknown; // результат из analyzeMessage
  responses?: GeneratedResponses;
  selectedResponse?: string;
}

export interface ResponseGeneratorParams {
  goal: string;
  analysisResult: unknown;
}

export interface ResponseOption { style: string; text: unknown; }
