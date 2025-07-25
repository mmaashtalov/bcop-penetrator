import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge, Button } from "@/components/ui";
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
      <Card>
        <CardHeader>
          <CardTitle>Анализ</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-500 animate-pulse">
            Анализ выполняется...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Анализ</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-500">
            Анализ появится здесь после отправки сообщения.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { vulnerabilities, persuasionTactics, psychologicalPrinciples, dialogueState } = analysis;

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader>
        <CardTitle>Анализ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Обнаруженные уязвимости</h3>
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
        <div>
          <h3 className="font-semibold mb-2">Тактики убеждения</h3>
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
        <div>
          <h3 className="font-semibold mb-2">Психологические принципы</h3>
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
        <div>
          <h3 className="font-semibold mb-2">Состояние диалога</h3>
          <p className="text-sm text-neutral-500">{dialogueState || 'N/A'}</p>
        </div>
        <Button variant="ghost" onClick={() => setOpen(!open)} className="mt-2">Детали</Button>
        {open && analysis.reasoning && (
          <pre className="bg-gray-50 p-2 text-xs mt-2 rounded whitespace-pre-wrap">{analysis.reasoning}</pre>
        )}
      </CardContent>
    </Card>
  );
}