import React, { useEffect, useMemo, useRef, useState } from 'react';
import { analyzeDialogue } from '../analysis/analysis-engine-core';
import { useDialogHistory } from '../store/useDialogHistory';
import { AnalysisMessage, DialogueAnalysis, ResponseOption } from '../types/response';
import DialogSidebar from './DialogSidebar';
import HeaderBar from './HeaderBar';
import ChatMessage from './ChatMessage';
import ControlPanel from './ControlPanel';
import ResponseSelect from './ResponseSelect';
import MessageInput from './MessageInput';
import { Card } from './ui/Card';

function createId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') return globalThis.crypto.randomUUID();
  return `message-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function ThreePanelDashboard() {
  const {
    sessions,
    currentSessionId,
    currentGoal,
    createNewSession,
    appendMessage,
    updateMessage,
    clearCurrentSession,
  } = useDialogHistory();
  const currentSession = useMemo(
    () => sessions.find((session) => session.id === currentSessionId) ?? null,
    [sessions, currentSessionId],
  );

  const [analysis, setAnalysis] = useState<DialogueAnalysis | null>(null);
  const [responses, setResponses] = useState<ResponseOption[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mode, setMode] = useState<'ai' | 'demo' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!currentSessionId) createNewSession();
  }, [currentSessionId, createNewSession]);

  useEffect(() => {
    const latestAnalyzed = [...(currentSession?.messages ?? [])]
      .reverse()
      .find((message) => message.analysis);
    const nextAnalysis = latestAnalyzed?.analysis ?? null;
    setAnalysis(nextAnalysis);
    setResponses(nextAnalysis?.response_options ?? []);
    setErrorMessage(null);
  }, [currentSession]);

  const handleSendMessage = async (text: string) => {
    const incomingMessage: AnalysisMessage = {
      id: createId(),
      originalText: text,
      author: 'counterparty',
      timestamp: Date.now(),
      analysis: null,
    };
    const previousMessages = currentSession?.messages ?? [];
    appendMessage(incomingMessage);
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const result = await analyzeDialogue({
        goal: currentGoal,
        incomingMessage: text,
        history: previousMessages,
      });
      updateMessage(incomingMessage.id, { analysis: result.analysis });
      setAnalysis(result.analysis);
      setResponses(result.analysis.response_options);
      setMode(result.mode);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось выполнить анализ.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectResponse = (response: ResponseOption) => {
    const selectedMessage: AnalysisMessage = {
      id: createId(),
      originalText: response.text,
      author: 'user',
      timestamp: Date.now(),
      analysis: null,
      selectedResponse: response.id,
    };
    appendMessage(selectedMessage);
  };

  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages.length, isAnalyzing]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <HeaderBar />
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 p-2 lg:grid-cols-[250px_minmax(0,1fr)_370px] lg:p-3">
        <aside className="order-2 flex min-w-0 flex-col gap-3 lg:order-1">
          <DialogSidebar messageCount={currentSession?.messages.length ?? 0} sessionCount={sessions.length} />
          <button
            type="button"
            onClick={() => createNewSession()}
            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800 transition hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-200"
          >
            + Новый диалог
          </button>
          <button
            type="button"
            onClick={clearCurrentSession}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            Очистить текущий диалог
          </button>
        </aside>

        <main className="order-1 flex min-h-[58vh] min-w-0 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:order-2 lg:min-h-0 lg:p-3">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <Card className="min-h-full space-y-3 overflow-y-auto bg-slate-50 px-2 py-3 dark:bg-slate-950/50">
              {currentSession?.messages.length ? (
                currentSession.messages.map((message) => <ChatMessage key={message.id} message={message} />)
              ) : (
                <div className="flex min-h-[300px] items-center justify-center px-6 text-center text-sm text-slate-500">
                  Вставьте новое сообщение банка или коллектора. BCOP учтёт историю диалога и выбранную цель.
                </div>
              )}
              {isAnalyzing && (
                <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200" aria-live="polite">
                  Анализирую новое сообщение с учётом истории…
                </div>
              )}
              <div ref={chatEndRef} />
            </Card>
          </div>
          <MessageInput onSendMessage={(text) => { void handleSendMessage(text); }} disabled={isAnalyzing} />
        </main>

        <aside className="order-3 flex min-w-0 flex-col gap-3">
          <ControlPanel analysis={analysis} isAnalyzing={isAnalyzing} mode={mode} />
          <ResponseSelect responses={responses} onSelectResponse={handleSelectResponse} />
          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200" role="alert">
              {errorMessage}
            </div>
          )}
          <p className="px-1 text-xs leading-5 text-slate-500">
            Варианты ответа — черновики. Перед отправкой проверьте факты, документы и тональность.
          </p>
        </aside>
      </div>
    </div>
  );
}
