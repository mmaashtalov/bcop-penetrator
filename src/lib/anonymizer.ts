import {
  anonymizeDialogueContext,
  anonymizeText,
  describeRedactions,
} from '../../shared/privacy.mjs';
import { AnalyzeDialogueRequest } from '../types/response';

export { anonymizeText, describeRedactions };

export function prepareDialogueForAnalysis(request: AnalyzeDialogueRequest) {
  return anonymizeDialogueContext(request);
}

// Совместимость со старым именем: в новом контуре используем anonymizeText.
export function sanitize(text: string): string {
  return anonymizeText(text).text;
}
