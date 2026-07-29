import { useMemo, useState } from 'react';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  DocumentMagnifyingGlassIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  LockClosedIcon,
  NoSymbolIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import type { ResponseOption } from '../types/response';
import { PUBLIC_DEMO_SCENARIOS } from '../demo/publicScenarios';

const NEXT_STEP_LABELS = {
  ask_for_documents: 'Запросить документы и основания',
  set_boundary: 'Обозначить границы контакта',
  buy_time: 'Взять паузу на проверку',
  clarify: 'Уточнить обстоятельства',
  pause_and_record: 'Сделать паузу и зафиксировать сообщение',
} as const;

const COUNTERPARTY_LABELS = {
  bank: 'Банк',
  collector: 'Коллектор',
  unknown: 'Не определён',
} as const;

const RISK_LABELS = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
} as const;

const CONFIDENCE_LABELS = {
  low: 'Низкая',
  medium: 'Средняя',
  high: 'Высокая',
} as const;

const RESPONSE_SHORT_LABELS: Record<ResponseOption['id'], string> = {
  calm: 'Спокойно',
  firm: 'Твёрдо',
  documents: 'Документы',
};

const SCENARIO_VISUALS = {
  'deadline-pressure': {
    number: '01',
    tone: 'coral',
    Icon: ClockIcon,
  },
  'documents-request': {
    number: '02',
    tone: 'violet',
    Icon: DocumentMagnifyingGlassIcon,
  },
  'contact-boundary': {
    number: '03',
    tone: 'teal',
    Icon: NoSymbolIcon,
  },
} as const;

function ResponsePanel({
  responses,
  selectedId,
  onSelect,
}: {
  responses: ResponseOption[];
  selectedId: ResponseOption['id'];
  onSelect: (id: ResponseOption['id']) => void;
}) {
  const selectedResponse = responses.find((response) => response.id === selectedId) ?? responses[0];

  return (
    <aside className="demo-surface response-panel" aria-labelledby="public-demo-responses">
      <div className="panel-heading">
        <div className="panel-heading__icon panel-heading__icon--violet">
          <SparklesIcon aria-hidden="true" />
        </div>
        <div>
          <span className="panel-heading__eyebrow">Варианты ответа</span>
          <h2 id="public-demo-responses">Выберите тон</h2>
        </div>
      </div>

      <div className="response-tabs" role="tablist" aria-label="Тон ответа">
        {responses.map((response) => (
          <button
            key={response.id}
            type="button"
            role="tab"
            aria-selected={response.id === selectedId}
            className={response.id === selectedId ? 'response-tab is-active' : 'response-tab'}
            onClick={() => onSelect(response.id)}
          >
            {RESPONSE_SHORT_LABELS[response.id]}
          </button>
        ))}
      </div>

      {selectedResponse && (
        <article className="response-draft" role="tabpanel">
          <div className="response-draft__topline">
            <span>Черновик ответа</span>
            <span className="readonly-badge">read-only</span>
          </div>
          <p>{selectedResponse.text}</p>
        </article>
      )}

      {selectedResponse && (
        <div className="response-rationale">
          <InformationCircleIcon aria-hidden="true" />
          <div>
            <strong>Почему это безопаснее</strong>
            <p>{selectedResponse.why}</p>
          </div>
        </div>
      )}

      <div className="response-panel__footnote">
        Копирование, сохранение и отправка отключены в публичном демо.
      </div>
    </aside>
  );
}

export default function PublicDemoDashboard() {
  const [scenarioId, setScenarioId] = useState(PUBLIC_DEMO_SCENARIOS[0].id);
  const [selectedResponseId, setSelectedResponseId] = useState<ResponseOption['id']>('calm');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const scenario = useMemo(
    () => PUBLIC_DEMO_SCENARIOS.find((candidate) => candidate.id === scenarioId) ?? PUBLIC_DEMO_SCENARIOS[0],
    [scenarioId],
  );
  const riskTone = scenario.analysis.risk_level;

  const selectScenario = (id: string) => {
    setScenarioId(id);
    setSelectedResponseId('calm');
    setDetailsOpen(false);
  };

  return (
    <div className="public-demo">
      <div className="ambient ambient--violet" aria-hidden="true" />
      <div className="ambient ambient--cyan" aria-hidden="true" />

      <header className="demo-header">
        <div className="demo-container">
          <div className="brandbar">
            <div className="brand">
              <span className="brand__mark">
                <ShieldCheckIcon aria-hidden="true" />
              </span>
              <span className="brand__name">
                <strong>BCOP</strong>
                <small>Dialogue Core</small>
              </span>
            </div>
            <div className="privacy-pill">
              <LockClosedIcon aria-hidden="true" />
              <span>Без передачи данных</span>
            </div>
          </div>

          <div className="hero">
            <div className="hero__copy">
              <div className="demo-kicker">
                <span aria-hidden="true" />
                Публичное read-only демо
              </div>
              <h1>
                Понимай давление.
                <span>Отвечай по фактам.</span>
              </h1>
              <p className="hero__lead">
                BCOP выделяет тактики собеседника, показывает риск и предлагает следующий безопасный шаг — без догадок и лишних обещаний.
              </p>
              <div className="hero__facts" aria-label="Возможности демо">
                <span><CheckCircleIcon aria-hidden="true" />3 ситуации</span>
                <span><CheckCircleIcon aria-hidden="true" />3 тона ответа</span>
                <span><CheckCircleIcon aria-hidden="true" />Без регистрации</span>
              </div>
            </div>

            <div className="safety-card">
              <div className="safety-card__icon">
                <ShieldCheckIcon aria-hidden="true" />
              </div>
              <div>
                <span>Безопасный контур</span>
                <strong>Ничего не уходит с устройства</strong>
                <p>В демо нет поля ввода, API, сохранения истории или внешних запросов.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="demo-container demo-main">
        <section className="scenario-picker" aria-labelledby="scenario-picker-title">
          <div className="section-intro">
            <div>
              <span className="section-intro__number">01</span>
              <div>
                <h2 id="scenario-picker-title">Выберите ситуацию</h2>
                <p>Результат перестроится мгновенно.</p>
              </div>
            </div>
            <span className="scenario-counter">{PUBLIC_DEMO_SCENARIOS.findIndex((item) => item.id === scenario.id) + 1} / {PUBLIC_DEMO_SCENARIOS.length}</span>
          </div>

          <div className="scenario-picker__list" role="list">
            {PUBLIC_DEMO_SCENARIOS.map((candidate) => {
              const active = candidate.id === scenario.id;
              const visual = SCENARIO_VISUALS[candidate.id as keyof typeof SCENARIO_VISUALS] ?? SCENARIO_VISUALS['deadline-pressure'];
              const ScenarioIcon = visual.Icon;
              return (
                <button
                  key={candidate.id}
                  type="button"
                  onClick={() => selectScenario(candidate.id)}
                  className={active ? 'scenario-card is-active' : 'scenario-card'}
                  data-tone={visual.tone}
                  aria-pressed={active}
                >
                  <span className="scenario-card__icon"><ScenarioIcon aria-hidden="true" /></span>
                  <span className="scenario-card__copy">
                    <span className="scenario-card__number">{visual.number}</span>
                    <strong>{candidate.title}</strong>
                    <small>{candidate.description}</small>
                  </span>
                  {active && <CheckCircleIcon className="scenario-card__check" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </section>

        <div className="workspace">
          <div className="workspace__analysis">
            <section className="demo-surface message-panel" aria-labelledby="demo-dialogue-title">
              <div className="panel-heading panel-heading--spread">
                <div className="panel-heading__cluster">
                  <div className="panel-heading__icon panel-heading__icon--cyan">
                    <ArrowRightIcon aria-hidden="true" />
                  </div>
                  <div>
                    <span className="panel-heading__eyebrow">Входящее сообщение</span>
                    <h2 id="demo-dialogue-title">{scenario.title}</h2>
                  </div>
                </div>
                <span className="fiction-badge">Вымышленный кейс</span>
              </div>

              <div className="message-stage">
                <div className="counterparty-avatar" aria-hidden="true">
                  {COUNTERPARTY_LABELS[scenario.analysis.counterparty_type].slice(0, 1)}
                </div>
                <div className="message-stack">
                  <div className="message-meta">
                    <strong>{COUNTERPARTY_LABELS[scenario.analysis.counterparty_type]}</strong>
                    <span>10:30</span>
                  </div>
                  <div className="message-bubble">
                    <p>{scenario.incomingMessage}</p>
                  </div>
                  <span className="message-processed"><SparklesIcon aria-hidden="true" />Разобрано BCOP</span>
                </div>
              </div>
            </section>

            <section className="demo-surface analysis-panel" aria-labelledby="analysis-title">
              <div className="panel-heading">
                <div className="panel-heading__icon panel-heading__icon--coral">
                  <ExclamationTriangleIcon aria-hidden="true" />
                </div>
                <div>
                  <span className="panel-heading__eyebrow">Разбор ситуации</span>
                  <h2 id="analysis-title">{scenario.analysis.message_summary}</h2>
                </div>
              </div>

              <div className="analysis-stats">
                <div className="analysis-stat" data-risk={riskTone}>
                  <span>Уровень риска</span>
                  <strong><i aria-hidden="true" />{RISK_LABELS[scenario.analysis.risk_level]}</strong>
                  <small>{scenario.analysis.pressure_signals.length} сигнал(а) давления</small>
                </div>
                <div className="analysis-stat analysis-stat--alignment">
                  <span>Цель: {scenario.goalLabel}</span>
                  <strong>{scenario.analysis.goal_alignment}%</strong>
                  <div className="alignment-track" aria-hidden="true">
                    <span style={{ width: `${scenario.analysis.goal_alignment}%` }} />
                  </div>
                </div>
              </div>

              <div className="next-action">
                <div className="next-action__number">01</div>
                <div>
                  <span>Рекомендуемый следующий шаг</span>
                  <strong>{NEXT_STEP_LABELS[scenario.analysis.recommended_next_step]}</strong>
                  <p>{scenario.analysis.dialogue_state}</p>
                </div>
                <ArrowRightIcon aria-hidden="true" />
              </div>

              <div className="signals">
                <span className="signals__label">Что заметила система</span>
                <div>
                  {scenario.analysis.detected_tactics.map((tactic) => (
                    <span className="signal-chip signal-chip--violet" key={tactic}>{tactic}</span>
                  ))}
                  {scenario.analysis.pressure_signals.map((signal) => (
                    <span className="signal-chip signal-chip--coral" key={signal}>{signal}</span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="details-toggle"
                onClick={() => setDetailsOpen((value) => !value)}
                aria-expanded={detailsOpen}
              >
                <span>
                  <InformationCircleIcon aria-hidden="true" />
                  Методика и ограничения
                </span>
                {detailsOpen ? <ChevronUpIcon aria-hidden="true" /> : <ChevronDownIcon aria-hidden="true" />}
              </button>

              {detailsOpen && (
                <div className="analysis-details">
                  <div>
                    <strong>Что уточнить</strong>
                    <ul>
                      {scenario.analysis.questions_to_clarify.map((question) => <li key={question}>{question}</li>)}
                    </ul>
                  </div>
                  <div>
                    <strong>Ограничения вывода</strong>
                    <ul>
                      {scenario.analysis.guardrails.map((guardrail) => <li key={guardrail}>{guardrail}</li>)}
                    </ul>
                  </div>
                  <p>Уверенность оценки: <strong>{CONFIDENCE_LABELS[scenario.analysis.confidence].toLowerCase()}</strong>.</p>
                </div>
              )}
            </section>
          </div>

          <ResponsePanel
            responses={scenario.analysis.response_options}
            selectedId={selectedResponseId}
            onSelect={setSelectedResponseId}
          />
        </div>

        <section className="privacy-note" role="note">
          <div className="privacy-note__icon"><LockClosedIcon aria-hidden="true" /></div>
          <div>
            <strong>Только вымышленные сценарии.</strong>
            <p>Здесь нет формы ввода, хранения или отправки переписки. Реальные сообщения, пароли, коды из SMS и реквизиты в этот контур не попадают.</p>
          </div>
        </section>

        <footer className="demo-footer">
          <span>BCOP Dialogue Core</span>
          <p>Помогает структурировать следующий шаг, но не устанавливает нарушение, не подтверждает долг и не заменяет проверку документов специалистом.</p>
        </footer>
      </main>
    </div>
  );
}
