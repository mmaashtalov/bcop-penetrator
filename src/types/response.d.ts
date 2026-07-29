export type DialogueGoal = 'gather_info' | 'reduce_pressure' | 'buy_time' | 'end_contact';
export type MessageAuthor = 'counterparty' | 'user' | 'assistant';

export type RiskLevel = 'low' | 'medium' | 'high';
export type AnalysisConfidence = 'low' | 'medium' | 'high';
export type CounterpartyType = 'bank' | 'collector' | 'unknown';

export interface ResponseOption {
  id: 'calm' | 'firm' | 'documents';
  label: string;
  text: string;
  why: string;
}

export interface DialogueAnalysis {
  message_summary: string;
  counterparty_type: CounterpartyType;
  dialogue_state: string;
  detected_tactics: string[];
  pressure_signals: string[];
  risk_level: RiskLevel;
  goal_alignment: number;
  recommended_next_step: 'ask_for_documents' | 'set_boundary' | 'buy_time' | 'clarify' | 'pause_and_record';
  questions_to_clarify: string[];
  response_options: ResponseOption[];
  confidence: AnalysisConfidence;
  guardrails: string[];
}

export interface AnalyzeDialogueRequest {
  goal: DialogueGoal;
  incomingMessage: string;
  history: AnalysisMessage[];
}

export interface AnalyzeDialogueResponse {
  request_id: string;
  mode: 'ai' | 'demo';
  analysis: DialogueAnalysis;
}

export interface AnalysisMessage {
  id: string;
  timestamp: number;
  author: MessageAuthor;
  originalText: string;
  analysis: DialogueAnalysis | null;
  selectedResponse?: string;
}
