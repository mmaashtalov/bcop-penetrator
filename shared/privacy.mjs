const REDACTION_RULES = [
  {
    key: 'email',
    label: 'адрес электронной почты',
    replacement: '[ЭЛЕКТРОННАЯ_ПОЧТА]',
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  },
  {
    key: 'phone',
    label: 'номер телефона',
    replacement: '[ТЕЛЕФОН]',
    pattern: /(?<!\d)(?:(?:\+7|8)[\s()-]*\d{3}[\s()-]*\d{3}[\s-]*\d{2}[\s-]*\d{2}|9\d{9})(?!\d)/g,
  },
  {
    key: 'snils',
    label: 'СНИЛС',
    replacement: '[СНИЛС]',
    pattern: /(?<!\d)\d{3}[- ]?\d{3}[- ]?\d{3}[- ]?\d{2}(?!\d)/g,
  },
  {
    key: 'card',
    label: 'номер банковской карты',
    replacement: '[БАНКОВСКАЯ_КАРТА]',
    pattern: /(?<!\d)(?:\d[ -]?){15}\d(?!\d)/g,
  },
  {
    key: 'account',
    label: 'номер счёта',
    replacement: '[БАНКОВСКИЙ_СЧЁТ]',
    pattern: /(?<!\d)(?:\d[ -]?){19}\d(?!\d)/g,
  },
  {
    key: 'identity_number',
    label: 'номер документа или ИНН',
    replacement: '[НОМЕР_ДОКУМЕНТА]',
    pattern: /(?<!\d)\d{10}(?:\d{2})?(?!\d)/g,
  },
  {
    key: 'name_with_initials',
    label: 'ФИО с инициалами',
    replacement: '[ФИО]',
    pattern: /(?<![\p{L}\p{N}_])[А-ЯЁ][а-яё-]{1,}\s+[А-ЯЁ]\.\s*[А-ЯЁ]\.(?![\p{L}\p{N}_])/gu,
  },
  {
    key: 'full_name',
    label: 'полное ФИО',
    replacement: '[ФИО]',
    pattern: /(?<![\p{L}\p{N}_])[А-ЯЁ][а-яё-]{1,}\s+[А-ЯЁ][а-яё-]{1,}\s+[А-ЯЁ][а-яё-]{1,}(?![\p{L}\p{N}_])/gu,
  },
];

export const REDACTION_LABELS = Object.fromEntries(
  REDACTION_RULES.map(({ key, label }) => [key, label]),
);

function textValue(value) {
  return typeof value === 'string' ? value : String(value ?? '');
}

export function anonymizeText(value) {
  let text = textValue(value);
  const redactions = {};

  for (const rule of REDACTION_RULES) {
    text = text.replace(rule.pattern, () => {
      redactions[rule.key] = (redactions[rule.key] || 0) + 1;
      return rule.replacement;
    });
  }

  return {
    text,
    redactions,
    totalRedactions: Object.values(redactions).reduce((total, count) => total + count, 0),
  };
}

export function anonymizeDialogueContext(context) {
  const incoming = anonymizeText(context?.incomingMessage);
  const redactions = { ...incoming.redactions };
  const history = Array.isArray(context?.history) ? context.history.map((message) => {
    const result = anonymizeText(message?.originalText);
    for (const [key, count] of Object.entries(result.redactions)) {
      redactions[key] = (redactions[key] || 0) + count;
    }
    return { ...message, originalText: result.text };
  }) : [];

  return {
    value: { ...context, incomingMessage: incoming.text, history },
    redactions,
    totalRedactions: Object.values(redactions).reduce((total, count) => total + count, 0),
  };
}

export function describeRedactions(redactions) {
  return Object.entries(redactions)
    .filter(([, count]) => Number(count) > 0)
    .map(([key, count]) => `${REDACTION_LABELS[key] || key}: ${count}`);
}
