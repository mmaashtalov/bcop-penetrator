import React from 'react';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSendMessage: () => void;
  disabled: boolean;
}

export default function MessageInput({ value, onChange, onSendMessage, disabled }: MessageInputProps) {
  const handleSend = () => {
    if (value.trim()) onSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent<unknown>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative">
      <Textarea
        value={value}
        onChange={(e) => onChange((e.target as HTMLTextAreaElement).value)}
        onKeyPress={handleKeyPress}
        placeholder="Вставьте новое сообщение банка или коллектора…"
        className="min-h-[60px] w-full resize-none rounded-lg border border-neutral-300 bg-white p-3 pr-16 text-sm shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        disabled={disabled}
      />
      <Button
        type="submit"
        size="icon"
        className="absolute bottom-3 right-3"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
      >
        <PaperAirplaneIcon className="h-5 w-5" />
        <span className="sr-only">Отправить</span>
      </Button>
      <p className="mt-2 px-1 text-xs leading-5 text-slate-500">
        Перед передачей появится обезличенная копия текста для проверки.
      </p>
    </div>
  );
}
