import { DialogueGoal } from './types/response';

export interface GoalOption {
  id: DialogueGoal;
  label: string;
  description: string;
}

export const GOAL_OPTIONS: GoalOption[] = [
  {
    id: 'gather_info',
    label: 'Получить информацию',
    description: 'Запросить основания, документы и расчёт.',
  },
  {
    id: 'reduce_pressure',
    label: 'Снизить давление',
    description: 'Перевести разговор в спокойную деловую форму.',
  },
  {
    id: 'buy_time',
    label: 'Выиграть время',
    description: 'Ответить без признания требований и обещаний.',
  },
  {
    id: 'end_contact',
    label: 'Прекратить контакт',
    description: 'Обозначить границы текущего канала общения.',
  },
];

export function getGoalLabel(goal: DialogueGoal): string {
  return GOAL_OPTIONS.find((option) => option.id === goal)?.label ?? 'Получить информацию';
}
