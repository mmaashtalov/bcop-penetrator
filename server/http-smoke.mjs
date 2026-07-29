import assert from 'node:assert/strict';
import { once } from 'node:events';

process.env.DEMO_MODE = 'true';
process.env.OPENAI_API_KEY = 'smoke-test-key-must-not-be-used';

const { createAppServer } = await import('./index.mjs');

async function fetchJson(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json();
  return { response, body };
}

async function closeServer(server) {
  await new Promise((resolvePromise, reject) => {
    server.close((error) => (error ? reject(error) : resolvePromise()));
  });
}

const server = createAppServer();
server.listen(0, '127.0.0.1');
await once(server, 'listening');

const address = server.address();
assert.ok(address && typeof address !== 'string', 'Сервер не вернул TCP-адрес.');
const baseUrl = `http://127.0.0.1:${address.port}`;

try {
  const health = await fetchJson(baseUrl, '/api/health');
  assert.equal(health.response.status, 200);
  assert.deepEqual(health.body, {
    ok: true,
    service: 'bcop-dialogue-core',
    mode: 'demo',
  });

  const analysis = await fetchJson(baseUrl, '/api/dialogue/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      goal: 'reduce_pressure',
      incomingMessage: 'Оплатите сегодня, иначе обратимся к вашим родственникам и в суд.',
      history: [{
        id: 'counterparty-1',
        author: 'counterparty',
        originalText: 'У вас есть задолженность.',
        timestamp: 1,
      }],
    }),
  });

  assert.equal(analysis.response.status, 200);
  assert.equal(analysis.body.mode, 'demo');
  assert.equal(analysis.body.analysis.risk_level, 'high');
  assert.deepEqual(
    analysis.body.analysis.response_options.map((option) => option.id),
    ['calm', 'firm', 'documents'],
  );

  const privacy = await fetchJson(baseUrl, '/api/dialogue/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      goal: 'gather_info',
      incomingMessage: 'Мой телефон +7 (999) 123-45-67, email person@example.com, карта 4276 1234 5678 9012.',
      history: [],
    }),
  });
  const privacyBody = JSON.stringify(privacy.body);
  assert.equal(privacy.response.status, 200);
  assert.equal(privacy.response.headers.get('cache-control'), 'no-store');
  assert.ok(privacy.response.headers.get('x-request-id'));
  assert.match(privacyBody, /\[ТЕЛЕФОН\]/);
  assert.match(privacyBody, /\[ЭЛЕКТРОННАЯ_ПОЧТА\]/);
  assert.match(privacyBody, /\[БАНКОВСКАЯ_КАРТА\]/);
  assert.doesNotMatch(privacyBody, /999\) 123|person@example\.com|4276 1234/);

  const invalid = await fetchJson(baseUrl, '/api/dialogue/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal: 'unknown', incomingMessage: 'Тест', history: [] }),
  });
  assert.equal(invalid.response.status, 400);
  assert.equal(invalid.body.error, 'Неизвестная цель диалога.');

  console.log('HTTP smoke test passed: health, demo analysis, privacy masking, invalid request.');
} finally {
  await closeServer(server);
}
