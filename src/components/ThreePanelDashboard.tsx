import React, { useState } from 'react';
import { useMessageStore } from '@/store/messageStore';
import { analyzeMessage } from '@/analysis/analysis-engine-core';
import { generateResponses } from '@/analysis/response-generator';
import ResponseSelect from './ResponseSelect';
import { AnalysisMessage } from '@/types/response';

export default function ThreePanelDashboard() {
  const { messages, currentMessage, addMessage, setCurrentMessage, updateMessage } = useMessageStore();
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedAnalysis, setExpandedAnalysis] = useState(true);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeMessage(inputText);
      
      const newMessage: AnalysisMessage = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        originalText: inputText,
        analysis
      };

      addMessage(newMessage);
      setInputText('');
      
      // Автоматически генерируем ответы
      await handleGenerateResponses(newMessage);
    } catch (error) {
      console.error('Error during analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateResponses = async (message: AnalysisMessage) => {
    setIsGenerating(true);
    try {
      const responses = await generateResponses({
        goal: 'Защитить права клиента и дать корректный ответ',
        analysisResult: message.analysis
      });

      updateMessage(message.id, { responses });
    } catch (error) {
      console.error('Error generating responses:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseResponse = (response: string) => {
    setInputText(response);
    // Автоматически скроллим к input
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
      
      {/* Левая панель - История сообщений */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        maxHeight: '100vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
          📝 История анализов
        </h2>

        {/* Форма ввода */}
        <div style={{ marginBottom: '16px' }}>
          <textarea
            id="message-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Введите сообщение от оператора для анализа..."
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

        {/* История сообщений */}
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

      {/* Центральная панель - Анализ */}
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

      {/* Правая панель - Варианты ответов */}
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
