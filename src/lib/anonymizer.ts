export function sanitize(text: string): string {
  // simple phone number redaction
  const withoutPhones = text.replace(/\b\d{7,}\b/g, '[REDACTED]');

  // rudimentary Russian name with initials: "Surname I.I." or "Surname F."
  const namePattern = /[А-ЯA-Z][а-яa-z]+\s+[А-ЯA-Z]\.(?:[А-ЯA-Z]\.)?/g;
  return withoutPhones.replace(namePattern, '[NAME]');
}
