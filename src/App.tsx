import React, { useState } from 'react';
import { analyzeMessage } from './analysis/analysis-engine-core';

function App() {
  const [txt, setTxt] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!txt.trim()) return;

    try {
      setResult({ loading: true });
      const analysisResult = await analyzeMessage(txt);
      setResult(analysisResult);
    } catch (error) {
      console.error('Error during analysis:', error);
      setResult({ error: 'Ошибка анализа: ' + String(error) });
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        padding: '24px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#2563eb',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          BCOP Penetrator
        </h1>

        <textarea
          style={{
            width: '100%',
            minHeight: '120px',
            padding: '12px',
            border: '2px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '16px',
            resize: 'vertical',
            boxSizing: 'border-box'
          }}
          value={txt}
          onChange={e => setTxt(e.target.value)}
          placeholder="Введите текст для анализа..."
        />

        <button
          style={{
            marginTop: '16px',
            padding: '12px 24px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500'
          }}
          onClick={handleAnalyze}
        >
          Analyze
        </button>

        {result && (
          <div style={{
            marginTop: '16px',
            padding: '16px',
            backgroundColor: result.loading ? '#eff6ff' : '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            overflow: 'auto'
          }}>
            {result.loading ? (
              <div style={{ color: '#2563eb', fontWeight: 'bold' }}>
                🔄 Анализирую текст...
              </div>
            ) : (
              <pre style={{ margin: 0, fontFamily: 'inherit' }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
