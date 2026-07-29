import assert from 'node:assert/strict';
import test from 'node:test';
import { anonymizeDialogueContext, anonymizeText } from '../shared/privacy.mjs';
import { createAuditEvent, createRateLimiter } from './index.mjs';

test('anonymizer masks common personal identifiers without changing the source', () => {
  const source = 'Иванов И.И., телефон +7 (999) 123-45-67, почта mikhail@example.com, карта 4276 1234 5678 9012, СНИЛС 112-233-445 95, ИНН 7707083893.';
  const result = anonymizeText(source);

  assert.match(result.text, /\[ФИО\]/);
  assert.match(result.text, /\[ТЕЛЕФОН\]/);
  assert.match(result.text, /\[ЭЛЕКТРОННАЯ_ПОЧТА\]/);
  assert.match(result.text, /\[БАНКОВСКАЯ_КАРТА\]/);
  assert.match(result.text, /\[СНИЛС\]/);
  assert.match(result.text, /\[НОМЕР_ДОКУМЕНТА\]/);
  assert.doesNotMatch(result.text, /mikhail@example\.com|999\) 123|4276|112-233|7707083893|Иванов И\.И\./);
  assert.equal(result.totalRedactions, 6);
});

test('anonymizer protects both incoming message and history without mutating the original request', () => {
  const request = {
    goal: 'gather_info',
    incomingMessage: 'Перезвоните на 89991234567.',
    history: [{ id: 'one', originalText: 'Почта: person@example.com' }],
  };

  const result = anonymizeDialogueContext(request);

  assert.equal(request.incomingMessage, 'Перезвоните на 89991234567.');
  assert.equal(request.history[0].originalText, 'Почта: person@example.com');
  assert.equal(result.value.incomingMessage, 'Перезвоните на [ТЕЛЕФОН].');
  assert.equal(result.value.history[0].originalText, 'Почта: [ЭЛЕКТРОННАЯ_ПОЧТА]');
  assert.equal(result.totalRedactions, 2);
});

test('rate limiter denies only excess requests and recovers after its window', () => {
  let currentTime = 1_000;
  const limiter = createRateLimiter({
    maxRequests: 2,
    windowMs: 10_000,
    now: () => currentTime,
  });

  assert.equal(limiter.consume('client').allowed, true);
  assert.equal(limiter.consume('client').allowed, true);
  const denied = limiter.consume('client');
  assert.equal(denied.allowed, false);
  assert.equal(denied.retryAfterSeconds, 10);

  currentTime += 10_000;
  assert.equal(limiter.consume('client').allowed, true);
});

test('audit event carries technical metadata only', () => {
  const event = createAuditEvent({
    requestId: 'request-123',
    status: 200,
    durationMs: 12.4,
    mode: 'demo',
    outcome: 'ok',
    message: 'Секретная переписка не должна попасть в журнал',
  });

  assert.deepEqual(event, {
    event: 'bcop_api_request',
    request_id: 'request-123',
    route: '/api/dialogue/analyze',
    status: 200,
    duration_ms: 12,
    mode: 'demo',
    outcome: 'ok',
    content_logged: false,
  });
  assert.doesNotMatch(JSON.stringify(event), /Секретная переписка/);
});
