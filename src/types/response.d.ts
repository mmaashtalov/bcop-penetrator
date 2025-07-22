export interface GeneratedResponses {
  legal: string;
  professional: string;
  sarcastic: string;
}

export interface AnalysisMessage {
  id: string;
  timestamp: number;
  originalText: string;
  analysis: any; // результат из analyzeMessage
  responses?: GeneratedResponses;
  selectedResponse?: string;
}

export interface ResponseGeneratorParams {
  goal: string;
  analysisResult: any;
}
