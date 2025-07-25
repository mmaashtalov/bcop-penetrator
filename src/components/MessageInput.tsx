import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

export default function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
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
        value={input}
        onChange={(e) => setInput((e.target as HTMLTextAreaElement).value)}
        onKeyPress={handleKeyPress}
        placeholder="Введите сообщение..."
        className="min-h-[60px] w-full resize-none rounded-lg border border-neutral-300 bg-white p-3 pr-16 text-sm shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        disabled={disabled}
      />
      <Button
        type="submit"
        size="icon"
        className="absolute bottom-3 right-3"
        onClick={handleSend}
        disabled={disabled || !input.trim()}
      >
        <PaperAirplaneIcon className="h-5 w-5" />
        <span className="sr-only">Отправить</span>
      </Button>
    </div>
  );
}