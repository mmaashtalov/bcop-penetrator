import { DialogueAnalysis, ResponseOption } from '../types/response';

/**
 * Compatibility adapter for older imports. Response generation now happens in
 * the same server-side dialogue analysis request so the model sees the full
 * conversation and the selected user goal.
 */
export function getResponseOptions(analysis: DialogueAnalysis): ResponseOption[] {
  return analysis.response_options;
}
