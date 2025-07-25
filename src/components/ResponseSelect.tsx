import React, { useState } from 'react';
import { GeneratedResponses } from '../types/response';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Skeleton } from '@/components/ui';

function safeParse(responses: string): GeneratedResponses | null {
  try {
    return JSON.parse(responses);
  } catch {
    return null;
  }
}

interface ResponseSelectProps {
  responses: GeneratedResponses | string | null;
  onSelectResponse: (response: string) => void;
}

export default function ResponseSelect({ responses, onSelectResponse }: ResponseSelectProps) {
  const [active, setActive] = useState<string | null>(null);
  if (!responses) return <Skeleton className="h-32 w-full" />;
  const parsed = typeof responses === 'string' ? safeParse(responses) : responses;
  if (!parsed) return <p className="text-red-600 text-sm">Invalid response format</p>;
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Варианты ответов</h2>
      {Object.entries(parsed).map(([category, response]) => {
        let responseArray;
        if (Array.isArray(response)) {
          responseArray = response.map((r) => (typeof r === 'string' ? { text: r } : r));
        } else if (typeof response === 'string') {
          responseArray = [{ text: response }];
        } else if (typeof response === 'object' && response !== null) {
          responseArray = [response];
        } else {
          responseArray = [];
        }
        return (
          <div key={category}>
            <h3 className="text-md font-semibold capitalize text-neutral-600 dark:text-neutral-300 mb-2">{category}</h3>
            <div className="space-y-2">
              {responseArray.length === 0 ? (
                <div className="text-sm text-neutral-400">Нет вариантов</div>
              ) : (
                responseArray.map((resp: any, index: number) => (
                  <Card key={index} className={`p-3 bg-neutral-100 dark:bg-neutral-800 ${active === resp.text ? 'ring-2 ring-blue-500' : ''}`}>
                    <p className="text-sm dark:text-neutral-200">{resp.text || resp}</p>
                    <div className="flex justify-end mt-2">
                      <Button size="sm" variant="outline" onClick={() => { onSelectResponse(resp.text || resp); setActive(resp.text || resp); }}>
                        Использовать
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  );
}