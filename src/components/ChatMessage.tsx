import { AnalysisMessage } from '../types/response';
import clsx from 'clsx';

interface ChatMessageProps {
  message: AnalysisMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.author === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className={clsx('flex w-full', {
        'justify-end': isUser,
        'justify-start': !isUser,
      })}
    >
      <div
        className={clsx(
          'relative max-w-[75%] px-4 py-2 rounded-lg shadow-lg text-sm whitespace-pre-wrap transition-all duration-200',
          {
            'bg-blue-600 text-white rounded-br-none animate-fadeIn': isUser,
            'bg-white dark:bg-neutral-700 text-black dark:text-white rounded-bl-none animate-fadeIn': !isUser,
          }
        )}
      >
        <div className="mb-1 flex items-center gap-2">
          <span className={clsx('text-xs font-semibold', isUser ? 'text-blue-200' : 'text-neutral-500 dark:text-neutral-300')}>{isUser ? 'Вы' : 'Ассистент'}</span>
          <span className="text-[10px] text-neutral-400">{time}</span>
        </div>
        <div>{message.originalText}</div>
      </div>
    </div>
  );
}