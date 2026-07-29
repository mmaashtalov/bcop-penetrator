export type RedactionKey =
  | 'email'
  | 'snils'
  | 'card'
  | 'account'
  | 'phone'
  | 'identity_number'
  | 'name_with_initials'
  | 'full_name';

export interface AnonymizationResult {
  text: string;
  redactions: Partial<Record<RedactionKey, number>>;
  totalRedactions: number;
}

export interface AnonymizedDialogueContext<T> {
  value: T;
  redactions: Partial<Record<RedactionKey, number>>;
  totalRedactions: number;
}

export const REDACTION_LABELS: Record<RedactionKey, string>;

export function anonymizeText(value: unknown): AnonymizationResult;
export function anonymizeDialogueContext<T extends { incomingMessage?: unknown; history?: unknown[] }>(context: T): AnonymizedDialogueContext<T>;
export function describeRedactions(redactions: Partial<Record<RedactionKey, number>>): string[];
