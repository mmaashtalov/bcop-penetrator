import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Badge, SectionTitle, Progress } from '@/components/ui';
import { DialogueAnalysis } from '../types/response';

interface ControlPanelProps {
  analysis: DialogueAnalysis | null;
  isAnalyzing: boolean;
  mode: 'ai' | 'demo' | null;
}

const nextStepLabels: Record<DialogueAnalysis['recommended_next_step'], string> = {
  ask_for_documents: 'Запросить документы',
  set_boundary: 'Обозначить границы',
  buy_time: 'Выиграть время',
  clarify: 'Уточнить обстоятельства',
  pause_and_record: 'Пауза и фиксация',
};

const riskLabels: Record<DialogueAnalysis['risk_level'], string> = {
  low: 'низкий',
  medium: 'средний',
  high: 'высокий',
};

export default function ControlPanel({ analysis, isAnalyzing, mode }: ControlPanelProps) {
  const [open, setOpen] = useState(false);

  if (isAnalyzing) {
    return (
      <Card className="space-y-4 bg-white p-4 shadow-sm dark:bg-slate-900">
        <SectionTitle>Анализ диалога</SectionTitle>
        <p className="text-sm text-slate-500 animate-pulse">Сверяю новое сообщение с историей и целью…</p>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="space-y-4 bg-white p-4 shadow-sm dark:bg-slate-900">
        <SectionTitle>Анализ диалога</SectionTitle>
        <p className="text-sm text-slate-500">Здесь появятся тактики, состояние диалога и следующий шаг.</p>
      </Card>
    );
  }

  return (
    <Card className="space-y-4 bg-white p-3 shadow-sm dark:bg-slate-900" role="region" aria-labelledby="analysisTitle">
      <div className="flex items-center justify-between gap-2">
        <SectionTitle>Анализ диалога</SectionTitle>
        {mode && <Badge variant={mode === 'ai' ? 'success' : 'neutral'}>{mode === 'ai' ? 'AI' : 'ДЕМО'}</Badge>}
      </div>

      <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-semibold">Цель пользователя</h4>
          <span className="text-sm font-semibold">{analysis.goal_alignment}%</span>
        </div>
        <Progress value={analysis.goal_alignment} />
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{analysis.dialogue_state}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
          <span className="block text-xs text-slate-500">Собеседник</span>
          <span className="font-semibold">{analysis.counterparty_type}</span>
        </div>
        <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
          <span className="block text-xs text-slate-500">Риск</span>
          <span className="font-semibold">{riskLabels[analysis.risk_level]}</span>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-semibold">Тактики</h4>
        <div className="flex flex-wrap gap-1">
          {(analysis.detected_tactics.length ? analysis.detected_tactics : ['Не определены']).map((tactic) => (
            <Badge key={tactic} variant="medium">{tactic}</Badge>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-semibold">Следующий шаг</h4>
        <p className="rounded-lg bg-blue-50 p-2 text-sm text-blue-900 dark:bg-blue-950/40 dark:text-blue-100">
          {nextStepLabels[analysis.recommended_next_step]}
        </p>
      </div>

      {analysis.pressure_signals.length > 0 && (
        <div>
          <h4 className="mb-2 font-semibold">Сигналы давления</h4>
          <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
            {analysis.pressure_signals.map((signal) => <li key={signal}>• {signal}</li>)}
          </ul>
        </div>
      )}

      <button type="button" onClick={() => setOpen((value) => !value)} className="text-left text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">
        {open ? 'Скрыть детали' : 'Показать детали'}
      </button>
      {open && (
        <div className="space-y-3 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800">
          <div>
            <h4 className="font-semibold">Что уточнить</h4>
            <ul className="mt-1 space-y-1 text-slate-600 dark:text-slate-300">
              {analysis.questions_to_clarify.map((question) => <li key={question}>• {question}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Ограничения</h4>
            <ul className="mt-1 space-y-1 text-slate-600 dark:text-slate-300">
              {analysis.guardrails.map((guardrail) => <li key={guardrail}>• {guardrail}</li>)}
            </ul>
          </div>
          <p className="text-xs text-slate-500">Уверенность: {analysis.confidence === 'high' ? 'высокая' : analysis.confidence === 'medium' ? 'средняя' : 'низкая'}.</p>
        </div>
      )}
    </Card>
  );
}
