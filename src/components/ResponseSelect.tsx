import React, { useState } from 'react';
import { GeneratedResponses } from '@/types/response';

interface ResponseSelectProps {
  responses: GeneratedResponses;
  onUseResponse: (response: string) => void;
}

export default function ResponseSelect({ responses, onUseResponse }: ResponseSelectProps) {
  const [selectedStyle, setSelectedStyle] = useState<keyof GeneratedResponses>('professional');

  const styles = {
    legal: { label: '⚖️ Юридический', color: 'bg-blue-100 border-blue-300' },
    professional: { label: '🤝 Профессиональный', color: 'bg-green-100 border-green-300' },
    sarcastic: { label: '😏 Саркастичный', color: 'bg-orange-100 border-orange-300' }
  };

  return (
    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
        Варианты ответов
      </h3>
      
      {/* Табы стилей */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {Object.entries(styles).map(([style, config]) => (
          <button
            key={style}
            onClick={() => setSelectedStyle(style as keyof GeneratedResponses)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: selectedStyle === style ? '#3b82f6' : '#f3f4f6',
              color: selectedStyle === style ? 'white' : '#374151',
              transition: 'all 0.2s'
            }}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Текст выбранного ответа */}
      <div style={{ 
        padding: '16px', 
        borderRadius: '8px', 
        border: '2px solid #d1d5db',
        backgroundColor: 'white',
        marginBottom: '16px'
      }}>
        <p style={{ 
          color: '#374151', 
          whiteSpace: 'pre-wrap', 
          lineHeight: '1.6',
          margin: 0
        }}>
          {responses[selectedStyle]}
        </p>
      </div>

      {/* Кнопка использования */}
      <button
        onClick={() => onUseResponse(responses[selectedStyle])}
        style={{
          width: '100%',
          padding: '12px 16px',
          backgroundColor: '#2563eb',
          color: 'white',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: '500',
          fontSize: '16px',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
      >
        📋 Использовать этот ответ
      </button>

      {/* Мини-превью других стилей */}
      <div style={{ marginTop: '16px' }}>
        <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', marginBottom: '8px' }}>
          Быстрый просмотр:
        </p>
        {Object.entries(styles).map(([style, config]) => {
          if (style === selectedStyle) return null;
          return (
            <div key={style} style={{ 
              fontSize: '12px', 
              padding: '8px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '4px',
              borderLeft: '4px solid #d1d5db',
              marginBottom: '4px'
            }}>
              <span style={{ fontWeight: '500', color: '#4b5563' }}>{config.label}:</span>
              <span style={{ color: '#6b7280', marginLeft: '8px' }}>
                {responses[style as keyof GeneratedResponses].substring(0, 80)}...
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
