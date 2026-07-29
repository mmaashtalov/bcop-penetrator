import React, { useState } from 'react';
import { ResponseOption } from '../types/response';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { SectionTitle } from '@/components/ui';

interface ResponseSelectProps {
  responses: ResponseOption[];
  onSelectResponse: (response: ResponseOption) => void;
}

export default function ResponseSelect({ responses, onSelectResponse }: ResponseSelectProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = async (response: ResponseOption) => {
    if (!window.navigator.clipboard) return;
    try {
      await window.navigator.clipboard.writeText(response.text);
      setCopiedId(response.id);
      window.setTimeout(() => setCopiedId(null), 1_500);
    } catch {
      setCopiedId(null);
    }
  };

  if (!responses.length) {
    return (
      <Card className="bg-white p-4 shadow-sm dark:bg-slate-900">
        <SectionTitle>Варианты ответа</SectionTitle>
        <p className="text-sm text-slate-500">После анализа здесь появятся три безопасных черновика.</p>
      </Card>
    );
  }

  return (
    <Card className="space-y-3 bg-white p-3 shadow-sm dark:bg-slate-900" role="region" aria-labelledby="responseTitle">
      <SectionTitle>Варианты ответа</SectionTitle>
      <p className="text-xs leading-5 text-slate-500">Выберите черновик: он будет добавлен в историю как ваше сообщение.</p>
      {responses.map((response) => (
        <div key={response.id} className="space-y-2 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <h4 className="font-semibold">{response.label}</h4>
          <p className="whitespace-pre-wrap text-sm leading-6">{response.text}</p>
          <p className="text-xs leading-5 text-slate-500">Зачем: {response.why}</p>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => { void copy(response); }}>
              {copiedId === response.id ? 'Скопировано' : 'Копировать'}
            </Button>
            <Button size="sm" onClick={() => { onSelectResponse(response); }}>Использовать</Button>
          </div>
        </div>
      ))}
    </Card>
  );
}
