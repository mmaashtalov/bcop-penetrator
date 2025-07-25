import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid'; // <--- ДОБАВЬТЕ ЭТУ СТРОКУ
import { useMessageStore } from '../store/messageStore';
import { useDialogHistory } from '../store/useDialogHistory';
import { GeneratedResponses, AnalysisMessage } from '../types/response';
// ... остальной код импортов
import { analyzeMessage } from '../analysis/analysis-engine-core';
import { generateResponses } from '../analysis/response-generator';
import { adaptAnalysisForGoal } from '../goal-engine';
import DialogSidebar from './DialogSidebar';
import HeaderBar from './HeaderBar';
import ChatMessage from './ChatMessage';
import ControlPanel from './ControlPanel';
import ResponseSelect from './ResponseSelect';
import MessageInput from './MessageInput';
import { Card } from './ui/Card';

export default function ThreePanelDashboard() {
  const {
    messages,
    addMessage,
    updateMessage,
  } = useMessageStore();

  const {
    currentSession,
    setCurrentSession,
  } = useDialogHistory();
  
  const [analysis, setAnalysis] = useState<any>(null);
  const [responses, setResponses] = useState<GeneratedResponses | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!currentSession) {
      const newSessionId = uuidv4();
      setCurrentSession(newSessionId);
    }
  }, [currentSession, setCurrentSession]);

  const handleSendMessage = async (text: string) => {
    setIsAnalyzing(true);
    setAnalysis(null);
    setResponses(null);

    const newMessage: AnalysisMessage = {
      id: uuidv4(),
      originalText: text,
      author: 'user',
      timestamp: Date.now(),
      analysis: null,
      responses: undefined,
    };

    addMessage(newMessage);

    try {
      const rawAnalysis = await analyzeMessage(text);
      const adaptedAnalysis = adaptAnalysisForGoal(rawAnalysis as any, 'defensive');
      const generatedResponses = await generateResponses({
        goal: 'defensive',
        analysisResult: adaptedAnalysis,
      });

      setAnalysis(adaptedAnalysis);
      setResponses(generatedResponses);

      const updatedFields = {
        analysis: adaptedAnalysis,
        responses: generatedResponses,
      };

      updateMessage(newMessage.id, updatedFields);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectResponse = (response: string) => {
    const newMessage: AnalysisMessage = {
      id: uuidv4(),
      originalText: response,
      author: 'assistant',
      timestamp: Date.now(),
      analysis: null,
      responses: undefined,
    };
    addMessage(newMessage);
  };

  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  return (
    <div className="flex h-screen flex-col bg-neutral-100 dark:bg-neutral-900">
      <HeaderBar />
      <div className="grid flex-1 grid-cols-[320px_1fr_480px] gap-3 p-3">
        {/* Sidebar */}
        <aside className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="animate-fadeIn duration-300">
            <DialogSidebar />
          </div>
        </aside>

        {/* Main Chat */}
        <main className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="flex-1 overflow-y-auto">
            <Card className="h-full px-3 py-2 overflow-y-auto space-y-3">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              <div ref={chatEndRef} />
            </Card>
          </div>
          <MessageInput onSendMessage={handleSendMessage} disabled={isAnalyzing} />
        </main>

        {/* Analysis Panel */}
        <aside className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="animate-fadeIn duration-300">
            <ControlPanel analysis={analysis} isAnalyzing={isAnalyzing} />
            <ResponseSelect responses={responses} onSelectResponse={handleSelectResponse} />
          </div>
        </aside>
      </div>
    </div>
  );
}