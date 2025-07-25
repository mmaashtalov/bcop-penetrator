import { describe, it, expect } from 'vitest';
import { sanitize } from '@/lib/anonymizer';

describe('sanitize', () => {
  it('редактирует ФИО', () => {
    expect(sanitize('Иванов И.И.')).toContain('[NAME]');
  });

  it('скрывает номера', () => {
    expect(sanitize('Ваш телефон 89991112233')).toContain('[REDACTED]');
  });
});
