import { AnalysisMessage } from '../types/response';
import clsx from 'clsx';

interface ChatMessageProps {
  message: AnalysisMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.author === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const label = isUser ? 'Вы' : 'Банк / коллектор';

  return (
    <div className={clsx('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={clsx(
          'relative max-w-[92%] rounded-xl px-4 py-3 text-sm shadow-sm transition-all duration-200 sm:max-w-[82%]',
          isUser
            ? 'rounded-br-none bg-blue-600 text-white'
            : 'rounded-bl-none border border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white',
        )}
      >
        <div className="mb-1 flex items-center gap-2">
          <span className={clsx('text-xs font-semibold', isUser ? 'text-blue-100' : 'text-slate-500 dark:text-slate-300')}>
            {label}
          </span>
          <span className={clsx('text-[10px]', isUser ? 'text-blue-200' : 'text-slate-400')}>{time}</span>
        </div>
        <div className="whitespace-pre-wrap leading-6">{message.originalText}</div>
        {message.selectedResponse && (
          <div className="mt-2 text-[10px] text-blue-100">Черновик выбран в панели ответа</div>
        )}
        {message.analysis && (
          <div className="mt-2 text-[10px] text-slate-400">Сообщение разобрано BCOP</div>
        )}
      </div>
    </div>
  );
}
