import { AnalysisMessage } from '../types/response';
import clsx from 'clsx';

interface ChatMessageProps {
  message: AnalysisMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.author === 'user';

  return (
    <div
      className={clsx('flex', {
        'justify-end': isUser,
        'justify-start': !isUser,
      })}
    >
      <div
        className={clsx(
          'max-w-[75%] px-4 py-2 rounded-lg shadow text-sm whitespace-pre-wrap',
          {
            'bg-blue-600 text-white rounded-br-none': isUser,
            'bg-white dark:bg-neutral-700 text-black dark:text-white rounded-bl-none': !isUser,
          }
        )}
      >
        {message.originalText}
      </div>
    </div>
  );
}