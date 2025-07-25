export function sanitize(text: string) {
    if (!text) return "";
    return text
      .replace(/\d{10,}/g, "[REDACTED]")  // телефоны, карты
      .replace(/\b[А-ЯЁ][а-яё]+ [А-ЯЁ]\.[А-ЯЁ]\./g, "[NAME]"); // ФИО (Иванов И.И.)
  }