import React from 'react';
import { useDialogHistory } from '../store/useDialogHistory';
import { Link } from 'react-router-dom';

export default function HistoryPage() {
  const { sessions, setCurrentSession } = useDialogHistory();

  return (
    <div style={{ padding: '24px', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>🕑 История диалогов</h1>
      {sessions.length === 0 ? (
        <p style={{ color: '#6b7280' }}>История пуста.</p>
      ) : (
        <div style={{ display: 'grid', gap: '16px', maxWidth: '600px' }}>
          {sessions.map((s) => (
            <Link
              key={s.id}
              to="/"
              onClick={() => setCurrentSession(s.id)}
              style={{
                display: 'block',
                padding: '16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#111827',
                background: '#ffffff',
              }}
            >
              <div style={{ fontSize: '14px', marginBottom: '4px' }}>{s.title || 'Без названия'}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>{new Date(s.startTime).toLocaleString()}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 