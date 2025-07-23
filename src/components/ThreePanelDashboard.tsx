import { useState } from "react";
import { useMessageStore } from "@/store/messageStore";
import { useDialogHistory } from "@/store/useDialogHistory";
import { analyzeMessage } from "@/analysis/analysis-engine-core";
import { generateResponseOptions } from "@/analysis/response-generator";
import { adaptAnalysisForGoal } from '@/goal-engine';
import ResponseSelect from './ResponseSelect';
import { DialogSidebar } from "./DialogSidebar";
import MessageInput from "./MessageInput";

export default function ThreePanelDashboard() {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [responseOptions, setResponseOptions] = useState<string[]>([]);
  const addMessage = useMessageStore((state) => state.addMessage);
  const { addDialog } = useDialogHistory();

  const handleSendMessage = async (message: string) => {
    const analysis = analyzeMessage(message);
    const goal = 'neutral'; // Or determine dynamically
    const adaptedAnalysis = adaptAnalysisForGoal(analysis, goal);
    setAnalysisResult(adaptedAnalysis);

    const options = await generateResponseOptions(adaptedAnalysis);
    setResponseOptions(options);

    addMessage({
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    });

    if (analysis) {
      addDialog(message, analysis);
    }
  };

  return (
    <main className="grid h-screen overflow-hidden
        sm:grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr_300px] xl:grid-cols-[240px_1fr_300px_360px]">
      {/* Left sidebar */}
      <aside className="h-full overflow-y-auto border-r dark:border-neutral-700">
        <DialogSidebar />
      </aside>

      {/* Chat dialog */}
      <section className="h-full overflow-y-auto">
        <div className="p-4">
          <MessageInput onSendMessage={handleSendMessage} />
          {/* Dialog history will be rendered here */}
        </div>
      </section>

      {/* Analysis / Response panel */}
      <aside className="hidden lg:block h-full overflow-y-auto border-l dark:border-neutral-700">
        <div className="p-4">
          {analysisResult && (
            <div>
              <h2 className="text-lg font-bold">Анализ сообщения</h2>
              <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(analysisResult, null, 2)}</pre>
            </div>
          )}
          {responseOptions.length > 0 && (
            <ResponseSelect
              options={responseOptions}
              onSelect={(option) => console.log('Selected:', option)}
            />
          )}
        </div>
      </aside>
    </main>
  );
}