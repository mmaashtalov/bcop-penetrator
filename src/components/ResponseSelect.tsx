import React, { useState } from 'react';
import { GeneratedResponses } from '../types/response';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { SectionTitle } from '@/components/ui';
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
  const copy = (text: string) => {
    if (typeof window !== 'undefined' && window.navigator?.clipboard) {
      window.navigator.clipboard.writeText(text);
    }
  };
  
  const onRegenerate = (style: string) => {
    // TODO: implement regeneration
    console.log('Regenerate', style);
  };
  
  if (!responses) return <Skeleton className="h-32 w-full" />;
  const parsed = typeof responses === 'string' ? safeParse(responses) : responses;
  if (!parsed) return <p className="text-red-600 text-sm">Invalid response format</p>;
  
  return (
    <Card className="space-y-6 bg-white p-4 shadow-lg">
      <SectionTitle>Response Generation</SectionTitle>
      {Object.entries(parsed).map(([style, text]) => (
        <div key={style}>
          <h4 className="font-semibold">{style.charAt(0).toUpperCase() + style.slice(1)}</h4>
          <p className="text-sm mt-2">{text}</p>
          <div className="flex justify-end mt-2 space-x-2">
            <Button variant="ghost" onClick={() => copy(text)}>Copy</Button>
            <Button onClick={() => onSelectResponse(text)}>Use</Button>
            <Button variant="ghost" onClick={() => onRegenerate(style)}>⟳</Button>
          </div>
        </div>
      ))}
    </Card>
  );
}