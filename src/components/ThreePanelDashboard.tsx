import React, { useState, useEffect } from 'react';
import { useMessageStore } from '@/store/messageStore';
import { useDialogHistory } from '@/store/useDialogHistory';
import { analyzeMessage } from '@/analysis/analysis-engine-core';
import { generateResponses } from '@/analysis/response-generator';
import { adaptAnalysisForGoal } from '@/goal-engine';
import ResponseSelect from './ResponseSelect';
import { AnalysisMessage } from '@/types/response';

export default function ThreePanelDashboard() {
  const { messages, currentMessage, addMessage, setCurrentMessage, updateMessage } = useMessageStore();
  const { 
    currentSession, 
    addMessage: addDialogMessage, 
    createSession 
  } = useDialogHistory();
  
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedAnalysis, setExpandedAnalysis] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Создаем сессию по умолчанию если её нет
  useEffect(() => {
    if (!currentSession) {
      createSession('defensive'); // Создаем защитную сессию по умолчанию
    }
  }, [currentSession, createSession]);

  // Показываем загрузку пока сессия не создана
  if (!currentSession) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f3f4f6'
      }}>
        <div style={{ textAlign: 'center', padding: '32px' }}>
          <p style={{ color: '#2563eb', fontWeight: '500' }}>🔄 Инициализация системы анализа...</p>
        </div>
      </div>
    );
  }

  const handleAnalyze = async () => {
    if (!inputText.trim() || !currentSession) return;

    setError(null);
    setIsAnalyzing(true);
    
    // Добавляем сообщение коллектора в историю
    addDialogMessage({
      author: 'collector',
      text: inputText,
      goal: currentSession.goal
    });

    try {
      const analysis = await analyzeMessage(inputText);
      
      // Адаптируем анализ под цель сессии
      const adaptedAnalysis = adaptAnalysisForGoal(analysis, currentSession.goal);
      
      const newMessage: AnalysisMessage = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        originalText: inputText,
        analysis: adaptedAnalysis
      };

      addMessage(newMessage);
      setInputText('');
      
      await handleGenerateResponses(newMessage);
    } catch (err: any) {
      console.error('Error during analysis:', err);
      let errorMessage = 'Ошибка анализа';
      
      if (err.status === 401) {
        errorMessage = '🔑 Ошибка авторизации: Проверьте API ключ OpenAI в файле .env';
      } else if (err.message?.includes('ERR_TIMED_OUT') || err.message?.includes('timeout')) {
        errorMessage = '⏱️ Таймаут соединения. Повторите попытку через несколько секунд.';
      } else if (err.message?.includes('ERR_CONNECTION_CLOSED') || err.message?.includes('Connection error')) {
        errorMessage = '🔌 Соединение прервано. Проверьте интернет и попробуйте снова.';
      } else if (err.message?.includes('Failed to fetch')) {
        errorMessage = '🌐 Проблема с сетью. Убедитесь, что интернет работает.';
      } else {
        errorMessage = `❌ ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateResponses = async (message: AnalysisMessage) => {
    if (!currentSession) return;
    
    setIsGenerating(true);
    try {
      // Используем цель текущей сессии для генерации ответов
      const responses = await generateResponses({
        goal: `Стратегия: ${currentSession.goal} - адаптировать ответы под выбранную тактику`,
        analysisResult: message.analysis
      });

      updateMessage(message.id, { responses });
      
      // Добавляем сгенерированные ответы в историю диалога
      addDialogMessage({
        author: 'assistant',
        text: `Предложенные ответы: ${JSON.stringify(responses)}`,
        responses: responses,
        analysis: message.analysis,
        goal: currentSession.goal
      });
      
    } catch (err: any) {
      console.error('Error generating responses:', err);
      setError(`Ошибка генерации ответов: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseResponse = (response: string) => {
    // Добавляем выбранный ответ пользователя в историю
    if (currentSession) {
      addDialogMessage({
        author: 'user',
        text: response,
        goal: currentSession.goal
      });
    }
    
    setInputText(response);
    document.getElementById('message-input')?.focus();
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: '16px', 
      padding: '16px',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6'
    }}>
      
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        maxHeight: '100vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#374151' }}>
            📝 История анализов
          </h2>
          {currentSession && (
            <div style={{
              padding: '4px 8px',
              backgroundColor: currentSession.goal === 'defensive' ? '#dbeafe' : 
                              currentSession.goal === 'aggressive' ? '#fee2e2' : '#dcfce7',
              color: currentSession.goal === 'defensive' ? '#1e40af' : 
                     currentSession.goal === 'aggressive' ? '#dc2626' : '#166534',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {currentSession.goal === 'defensive' ? '🛡️ Защитная' : 
               currentSession.goal === 'aggressive' ? '⚔️ Агрессивная' : '📋 Информационная'}
            </div>
          )}
        </div>

        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '6px',
            color: '#b91c1c',
            marginBottom: '16px',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
          💬 Анализ сообщения коллектора
        </h3>
        
        <div style={{ marginBottom: '16px' }}>
          <textarea
            id="message-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Введите сообщение от коллектора для анализа..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              border: '2px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !inputText.trim()}
            style={{
              marginTop: '8px',
              width: '100%',
              padding: '10px',
              backgroundColor: isAnalyzing ? '#9ca3af' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isAnalyzing ? 'not-allowed' : 'pointer',
              fontWeight: '500'
            }}
          >
            {isAnalyzing ? '🔄 Анализирую...' : '🔍 Анализировать'}
          </button>
        </div>

        <div>
          {messages.length === 0 ? (
            <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center' }}>
              Пока нет анализов
            </p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                onClick={() => setCurrentMessage(message)}
                style={{
                  padding: '12px',
                  border: currentMessage?.id === message.id ? '2px solid #2563eb' : '1px solid #e5e7eb',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginBottom: '8px',
                  backgroundColor: currentMessage?.id === message.id ? '#eff6ff' : '#fafafa'
                }}
              >
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                  {new Date(message.timestamp).toLocaleString()}
                </p>
                <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.4' }}>
                  {message.originalText.substring(0, 100)}
                  {message.originalText.length > 100 ? '...' : ''}
                </p>
                {message.responses && (
                  <span style={{ fontSize: '12px', color: '#059669', fontWeight: '500' }}>
                    ✅ Ответы готовы
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        maxHeight: '100vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#374151' }}>
            🔍 Детальный анализ
          </h2>
          {currentMessage && (
            <button
              onClick={() => setExpandedAnalysis(!expandedAnalysis)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {expandedAnalysis ? '📕 Свернуть' : '📖 Развернуть'}
            </button>
          )}
        </div>

        {!currentMessage ? (
          <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center' }}>
            Выберите сообщение для просмотра анализа
          </p>
        ) : (
          <div>
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                Исходное сообщение:
              </h4>
              <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.5' }}>
                {currentMessage.originalText}
              </p>
            </div>

            <div style={{ 
              backgroundColor: expandedAnalysis ? '#fffbeb' : '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              padding: '12px'
            }}>
              {expandedAnalysis ? (
                <pre style={{ 
                  margin: 0, 
                  fontFamily: 'Monaco, Consolas, monospace',
                  fontSize: '12px',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.4',
                  color: '#374151'
                }}>
                  {JSON.stringify(currentMessage.analysis, null, 2)}
                </pre>
              ) : (
                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                  Анализ свернут. Нажмите "Развернуть" для просмотра.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        maxHeight: '100vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
          💬 Варианты ответов
        </h2>

        {isGenerating ? (
          <div style={{ textAlign: 'center', padding: '32px' }}>
            <p style={{ color: '#2563eb', fontWeight: '500' }}>🔄 Генерирую ответы...</p>
          </div>
        ) : !currentMessage?.responses ? (
          <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center' }}>
            {currentMessage ? 'Ответы не сгенерированы' : 'Выберите сообщение для генерации ответов'}
          </p>
        ) : (
          <ResponseSelect
            responses={currentMessage.responses}
            onUseResponse={handleUseResponse}
          />
        )}
      </div>
    </div>
  );
}