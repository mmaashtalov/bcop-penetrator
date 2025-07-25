import React from 'react';
import { Card } from './ui/Card';
import { Badge, Button, SectionTitle, Progress } from "@/components/ui";
import { useState } from 'react';

interface AnalysisDetails {
  vulnerabilities: string[];
  persuasionTactics: string[];
  psychologicalPrinciples: string[];
  dialogueState: string;
  reasoning?: string;
}

interface ControlPanelProps {
  analysis: AnalysisDetails | null;
  isAnalyzing: boolean;
}

export default function ControlPanel({ analysis, isAnalyzing }: ControlPanelProps) {
  const [open, setOpen] = useState(false);

  if (isAnalyzing) {
    return (
      <Card className="space-y-6 bg-white p-4 shadow-lg">
        <SectionTitle>Tactical Analysis</SectionTitle>
        <p className="text-sm text-neutral-500 animate-pulse">
          Анализ выполняется...
        </p>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="space-y-6 bg-white p-4 shadow-lg">
        <SectionTitle>Tactical Analysis</SectionTitle>
        <p className="text-sm text-neutral-500">
          Анализ появится здесь после отправки сообщения.
        </p>
      </Card>
    );
  }

  const { vulnerabilities, persuasionTactics, psychologicalPrinciples, dialogueState } = analysis;

  return (
    <Card className="space-y-3 bg-white p-3 shadow-lg" role="region" aria-labelledby="analysisTitle">
      <h3 id="analysisTitle" className="sr-only">Tactical Analysis</h3>
      <SectionTitle>Tactical Analysis</SectionTitle>
      
      {/* Operator Type */}
      <div className="p-2 border rounded flex flex-col">
        <h4 className="font-semibold">Operator Type</h4>
        <p>{dialogueState || 'N/A'}</p>
        <Progress value={75} />
      </div>
      
      {/* Detected Tactics */}
      <div>
        <h4 className="font-semibold mb-2">Detected Tactics</h4>
        {persuasionTactics && persuasionTactics.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {persuasionTactics.map((t, i) => (
              <Badge key={i} variant="medium">{t}</Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">Не обнаружено</p>
        )}
      </div>
      
      {/* Vulnerabilities */}
      <div>
        <h4 className="font-semibold mb-2">Vulnerabilities</h4>
        {vulnerabilities && vulnerabilities.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {vulnerabilities.map((v, i) => (
              <Badge key={i} variant="risk">{v}</Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">Не обнаружено</p>
        )}
      </div>
      
      {/* Psychological Principles */}
      <div>
        <h4 className="font-semibold mb-2">Psychological Principles</h4>
        {psychologicalPrinciples && psychologicalPrinciples.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {psychologicalPrinciples.map((p, i) => (
              <Badge key={i} variant="neutral">{p}</Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">Не обнаружено</p>
        )}
      </div>
      
      <Button variant="ghost" onClick={() => setOpen(!open)} className="mt-2">Детали</Button>
      {open && analysis.reasoning && (
        <pre className="bg-gray-50 p-2 text-xs mt-2 rounded whitespace-pre-wrap">{analysis.reasoning}</pre>
      )}
    </Card>
  );
}