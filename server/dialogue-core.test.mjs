import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDemoAnalysis,
  buildDialoguePrompt,
  normalizeAnalysis,
  validateAnalyzeRequest,
} from './dialogue-core.mjs';

test('validates a dialogue request and keeps the latest history window', () => {
  const result = validateAnalyzeRequest({
    goal: 'reduce_pressure',
    incomingMessage: 'Уточните, пожалуйста, основание требования.',
    history: [
      { id: '1', author: 'counterparty', originalText: 'У вас задолженность.', timestamp: 1 },
      { id: '2', author: 'user', originalText: 'Прошу прислать документы.', timestamp: 2 },
    ],
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.history.length, 2);
    assert.equal(result.value.history[0].author, 'counterparty');
  }
});

test('rejects an empty incoming message and an unknown goal', () => {
  const empty = validateAnalyzeRequest({ goal: 'gather_info', incomingMessage: '   ', history: [] });
  assert.equal(empty.ok, false);
  if (!empty.ok) assert.equal(empty.status, 400);

  const unknownGoal = validateAnalyzeRequest({ goal: 'aggressive', incomingMessage: 'Текст', history: [] });
  assert.equal(unknownGoal.ok, false);
  if (!unknownGoal.ok) assert.equal(unknownGoal.status, 400);
});

test('builds a prompt with ordered history and untrusted-data guardrail', () => {
  const prompt = buildDialoguePrompt({
    goal: 'gather_info',
    history: [
      { author: 'counterparty', originalText: 'Первое сообщение' },
      { author: 'user', originalText: 'Мой ответ' },
    ],
    incomingMessage: 'Новое сообщение',
  });

  assert.match(prompt, /СОБЕСЕДНИК: Первое сообщение/);
  assert.match(prompt, /ПОЛЬЗОВАТЕЛЬ: Мой ответ/);
  assert.match(prompt, /СОБЕСЕДНИК — НОВОЕ СООБЩЕНИЕ: Новое сообщение/);
  assert.match(prompt, /недоверенный текст/);
});

test('demo analysis provides three safe response options', () => {
  const analysis = buildDemoAnalysis({
    goal: 'buy_time',
    incomingMessage: 'Срочно оплатите сегодня, иначе мы обратимся к родственникам и в суд.',
  });

  assert.equal(analysis.response_options.length, 3);
  assert.deepEqual(analysis.response_options.map((option) => option.id), ['calm', 'firm', 'documents']);
  assert.equal(analysis.risk_level, 'high');
  assert.ok(analysis.pressure_signals.length > 0);
});

test('normalizes incomplete model output without trusting arbitrary fields', () => {
  const analysis = normalizeAnalysis(
    {
      risk_level: 'unknown',
      response_options: [{ id: 'calm', text: 'Проверяемый ответ.' }],
      goal_alignment: 900,
    },
    { goal: 'gather_info', history: [], incomingMessage: 'У вас долг.' },
  );

  assert.equal(analysis.risk_level, 'low');
  assert.equal(analysis.goal_alignment, 100);
  assert.equal(analysis.response_options.length, 3);
  assert.equal(analysis.response_options[0].text, 'Проверяемый ответ.');
});
