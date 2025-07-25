import React from 'react';
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
    <Card className="space-y-3 bg-white p-3 shadow-lg" role="region" aria-labelledby="responseTitle">
      <h3 id="responseTitle" className="sr-only">Response Generation</h3>
      <SectionTitle>Response Generation</SectionTitle>
      {Object.entries(parsed).map(([style, text]) => (
        <div key={style}>
          <h4 className="font-semibold">{style.charAt(0).toUpperCase() + style.slice(1)}</h4>
          <p className="text-sm mt-2">{text}</p>
          <div className="flex justify-end mt-2 space-x-2">
            <Button 
              variant="ghost" 
              onClick={() => copy(text)}
              aria-label={`Copy ${style} response`}
            >
              Copy
            </Button>
            <Button 
              onClick={() => onSelectResponse(text)}
              aria-label={`Use ${style} response`}
            >
              Use
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => onRegenerate(style)}
              aria-label={`Regenerate ${style} response`}
            >
              ⟳
            </Button>
          </div>
        </div>
      ))}
    </Card>
  );
}