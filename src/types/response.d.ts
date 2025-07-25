export interface GeneratedResponses {
  legal: string;
  professional: string;
  sarcastic: string;
}

export interface AnalysisResult {
  originalMessage?: string;
  legalViolations?: unknown[];
  threats?: { detected: boolean };
  collectorInfo?: { company?: string };
  [key: string]: unknown;
}

export interface GoalAlignment {
  alignment: number;
  suggestions: string[];
  missedOpportunities: string[];
}

export interface AdaptedAnalysisResult extends AnalysisResult {
  goalStrategy: string;
  goalAlignment: GoalAlignment;
  recommendations: string[];
  strategicOpportunities: string[];
}

export interface AnalysisMessage {
  id: string;
  timestamp: number;
  /** Кто отправил сообщение */
  author?: 'user' | 'assistant';
  originalText: string;
  analysis: AdaptedAnalysisResult | AnalysisResult | null;
  responses?: GeneratedResponses;
  selectedResponse?: string;
}

export interface ResponseGeneratorParams {
  goal: string;
  analysisResult: AdaptedAnalysisResult;
}

export interface ResponseOption { style: string; text: unknown; }
