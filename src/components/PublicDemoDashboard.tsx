import { useMemo, useState } from 'react';
import { InformationCircleIcon, LockClosedIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import type { AnalysisMessage, ResponseOption } from '../types/response';
import { PUBLIC_DEMO_SCENARIOS } from '../demo/publicScenarios';
import ControlPanel from './ControlPanel';
import ChatMessage from './ChatMessage';
import { Card } from './ui/Card';

function PublicResponseOptions({ responses }: { responses: ResponseOption[] }) {
  return (
    <Card className="space-y-3 bg-white p-3 shadow-sm dark:bg-slate-900" role="region" aria-labelledby="public-demo-responses">
      <div>
        <h2 id="public-demo-responses" className="text-base font-semibold">Три безопасных черновика</h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">В публичной версии они только показывают механику: копирование, сохранение и отправка отключены.</p>
      </div>
      {responses.map((response) => (
        <article key={response.id} className="space-y-2 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <h3 className="font-semibold">{response.label}</h3>
          <p className="whitespace-pre-wrap text-sm leading-6">{response.text}</p>
          <p className="text-xs leading-5 text-slate-500">Зачем: {response.why}</p>
        </article>
      ))}
    </Card>
  );
}

export default function PublicDemoDashboard() {
  const [scenarioId, setScenarioId] = useState(PUBLIC_DEMO_SCENARIOS[0].id);
  const scenario = useMemo(
    () => PUBLIC_DEMO_SCENARIOS.find((candidate) => candidate.id === scenarioId) ?? PUBLIC_DEMO_SCENARIOS[0],
    [scenarioId],
  );
  const demoMessage = useMemo<AnalysisMessage>(() => ({
    id: `public-demo-${scenario.id}`,
    timestamp: Date.UTC(2026, 0, 1, 10, 30),
    author: 'counterparty',
    originalText: scenario.incomingMessage,
    analysis: scenario.analysis,
  }), [scenario]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900 px-3 py-3 text-white shadow-lg sm:px-4">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <ShieldCheckIcon className="h-8 w-8 shrink-0 text-blue-300" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-200">Публичное read-only демо</p>
            <h1 className="truncate text-lg font-bold sm:text-xl">BCOP Dialogue Core</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-3 p-3 sm:p-4">
        <section className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm leading-6 text-blue-950 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100" role="alert">
          <div className="flex items-start gap-2">
            <LockClosedIcon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p><strong>Только вымышленные сценарии.</strong> Здесь нет формы ввода, хранения или отправки переписки: это статическая демонстрация интерфейса и логики результата.</p>
          </div>
        </section>

        <section className="grid gap-3 lg:grid-cols-[250px_minmax(0,1fr)_370px]">
          <aside className="order-1 space-y-3 lg:order-none" aria-label="Выбор сценария">
            <Card className="space-y-3 bg-white p-3 shadow-sm dark:bg-slate-900">
              <div>
                <h2 className="text-base font-semibold">Сценарии демо</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">Выберите один из трёх безопасных примеров.</p>
              </div>
              <div className="space-y-2" role="list">
                {PUBLIC_DEMO_SCENARIOS.map((candidate) => {
                  const active = candidate.id === scenario.id;
                  return (
                    <button
                      key={candidate.id}
                      type="button"
                      onClick={() => setScenarioId(candidate.id)}
                      className={`w-full rounded-lg border p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${active
                        ? 'border-blue-500 bg-blue-50 text-blue-950 dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-100'
                        : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-700 dark:hover:bg-slate-800'
                      }`}
                      aria-pressed={active}
                    >
                      <span className="block text-sm font-semibold">{candidate.title}</span>
                      <span className="mt-1 block text-xs leading-5 opacity-80">{candidate.description}</span>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card className="space-y-2 bg-white p-3 text-xs leading-5 text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                <InformationCircleIcon className="h-4 w-4" aria-hidden="true" />
                Как читать демо
              </div>
              <p>Слева — цель и пример сообщения. Справа — выделенные наблюдаемые признаки и безопасные варианты следующего ответа.</p>
              <p>Уверенность намеренно низкая: по одному сообщению нельзя устанавливать юридические факты.</p>
            </Card>
          </aside>

          <section className="order-2 flex min-h-[460px] flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900" aria-labelledby="demo-dialogue-title">
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Цель: {scenario.goalLabel}</p>
                <h2 id="demo-dialogue-title" className="mt-1 text-lg font-bold">{scenario.title}</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">ДАННЫЕ ВЫМЫШЛЕНЫ</span>
            </div>

            <div className="flex flex-1 items-center rounded-xl bg-slate-50 p-3 dark:bg-slate-950/40">
              <div className="w-full">
                <ChatMessage message={demoMessage} />
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300">
              В этой публичной версии поле ввода и отправка намеренно отключены. Реальные сообщения, пароли, коды из SMS и реквизиты сюда вводить не нужно и невозможно.
            </div>
          </section>

          <aside className="order-3 space-y-3" aria-label="Результат демонстрации">
            <ControlPanel analysis={scenario.analysis} isAnalyzing={false} mode="demo" />
            <PublicResponseOptions responses={scenario.analysis.response_options} />
          </aside>
        </section>

        <footer className="rounded-xl border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          BCOP помогает структурировать следующий шаг в переписке. Он не устанавливает нарушение, не подтверждает долг и не заменяет проверку документов специалистом.
        </footer>
      </main>
    </div>
  );
}
