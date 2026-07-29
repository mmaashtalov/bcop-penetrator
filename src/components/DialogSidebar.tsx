import React from 'react';
import { Button, SectionTitle } from '@/components/ui';
import { GOAL_OPTIONS } from '../goal-engine';
import { useDialogHistory } from '../store/useDialogHistory';

interface DialogSidebarProps {
  messageCount: number;
  sessionCount: number;
  onDeleteAll: () => void;
}

export default function DialogSidebar({ messageCount, sessionCount, onDeleteAll }: DialogSidebarProps) {
  const { currentGoal, setGoal, persistHistory, setPersistHistory } = useDialogHistory();

  return (
    <aside className="space-y-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900" role="complementary" aria-labelledby="sidebarTitle">
      <h3 id="sidebarTitle" className="sr-only">Управление диалогом</h3>
      <SectionTitle>Цель диалога</SectionTitle>
      <div className="space-y-2">
        <label htmlFor="dialogue-goal" className="text-xs font-medium text-slate-500">Что нужно получить сейчас?</label>
        <select
          id="dialogue-goal"
          value={currentGoal}
          onChange={(event) => setGoal(event.target.value as typeof currentGoal)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-800"
        >
          {GOAL_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>{option.label}</option>
          ))}
        </select>
        <p className="text-xs leading-5 text-slate-500">
          {GOAL_OPTIONS.find((option) => option.id === currentGoal)?.description}
        </p>
      </div>

      <SectionTitle>Состояние</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800">
          <p className="text-2xl font-bold">{messageCount}</p>
          <p className="text-xs text-slate-500">Сообщений</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800">
          <p className="text-2xl font-bold">{sessionCount}</p>
          <p className="text-xs text-slate-500">Диалогов</p>
        </div>
      </div>

      <SectionTitle>Правила помощника</SectionTitle>
      <ul className="space-y-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
        <li>• анализирует историю, а не только последнюю фразу;</li>
        <li>• отделяет факт от предположения;</li>
        <li>• не предлагает угрозы, оскорбления и обман;</li>
        <li>• сохраняет выбранный ответ в текущем диалоге.</li>
      </ul>

      <SectionTitle>Приватность</SectionTitle>
      <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-slate-200 p-2 text-xs leading-5 text-slate-600 dark:border-slate-700 dark:text-slate-300">
        <input
          type="checkbox"
          checked={persistHistory}
          onChange={(event) => setPersistHistory(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <span>
          <strong className="block text-slate-800 dark:text-slate-100">Сохранять историю на этом устройстве</strong>
          По умолчанию сообщения остаются только в памяти вкладки и исчезнут после её закрытия или обновления.
        </span>
      </label>
      <Button variant="danger" className="w-full" onClick={onDeleteAll}>
        Удалить все диалоги
      </Button>

      <Button variant="ghost" className="w-full" onClick={() => setGoal('gather_info')}>
        Сбросить цель к запросу информации
      </Button>
    </aside>
  );
}
