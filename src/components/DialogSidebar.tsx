import React, { useState } from 'react';
import { useDialogHistory, DialogSession } from '../store/useDialogHistory';
import { exportDialogToPDF, exportDialogToCSV, exportAllHistoryToJSON } from '../utils/export-utils';

export function DialogSidebar() {
  const {
    sessions,
    currentSession,
    createSession,
    setCurrentSession,
    deleteSession,
    clearHistory,
    updateSessionGoal: _updateSessionGoal
  } = useDialogHistory();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleNewSession = (goal: 'defensive' | 'aggressive' | 'informational') => {
    createSession(goal);
  };

  const handleExportSession = (session: DialogSession, format: 'pdf' | 'csv') => {
    if (format === 'pdf') {
      exportDialogToPDF(session);
    } else {
      exportDialogToCSV(session);
    }
    setShowExportMenu(false);
  };

  const getTotalMessages = () => {
    return sessions.reduce((total, session) => total + session.messages.length, 0);
  };

  const getGoalIcon = (goal: string) => {
    switch (goal) {
      case 'defensive': return '🛡️';
      case 'aggressive': return '⚔️';
      case 'informational': return '📋';
      default: return '❓';
    }
  };

  const getGoalColor = (goal: string) => {
    switch (goal) {
      case 'defensive': return 'text-blue-600 bg-blue-50';
      case 'aggressive': return 'text-red-600 bg-red-50';
      case 'informational': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Возвращаем к Tailwind классам
  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${isExpanded ? 'w-80' : 'w-16'}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
            title={isExpanded ? 'Свернуть' : 'Развернуть историю'}
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">📖</span>
              {isExpanded && <span className="font-medium text-gray-900">История</span>}
            </div>
            {isExpanded && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {sessions.length}
              </span>
            )}
          </button>
        </div>

        {/* Остальной код остается без изменений */}
        {isExpanded && (
          <>
            {/* Goals Section */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Новый диалог</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleNewSession('defensive')}
                  className="w-full flex items-center space-x-2 p-2 text-left rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <span>🛡️</span>
                  <span className="text-sm text-blue-700">Защитная тактика</span>
                </button>
                <button
                  onClick={() => handleNewSession('aggressive')}
                  className="w-full flex items-center space-x-2 p-2 text-left rounded-lg hover:bg-red-50 transition-colors"
                >
                  <span>⚔️</span>
                  <span className="text-sm text-red-700">Агрессивная тактика</span>
                </button>
                <button
                  onClick={() => handleNewSession('informational')}
                  className="w-full flex items-center space-x-2 p-2 text-left rounded-lg hover:bg-green-50 transition-colors"
                >
                  <span>📋</span>
                  <span className="text-sm text-green-700">Сбор информации</span>
                </button>
              </div>
            </div>

            {/* Export Section */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="w-full flex items-center justify-between p-2 text-left rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span>📥</span>
                    <span className="text-sm text-gray-700">Экспорт</span>
                  </div>
                  <span className="text-xs text-gray-400">⌄</span>
                </button>

                {showExportMenu && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => exportAllHistoryToJSON(sessions)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                      📄 Вся история (JSON)
                    </button>
                    {currentSession && (
                      <>
                        <button
                          onClick={() => handleExportSession(currentSession, 'pdf')}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                        >
                          📖 Текущий диалог (PDF)
                        </button>
                        <button
                          onClick={() => handleExportSession(currentSession, 'csv')}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                        >
                          📊 Текущий диалог (CSV)
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Статистика</h3>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Диалогов:</span>
                  <span className="font-medium">{sessions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Сообщений:</span>
                  <span className="font-medium">{getTotalMessages()}</span>
                </div>
                {currentSession && (
                  <div className="flex justify-between pt-1 border-t border-gray-100">
                    <span>Текущий:</span>
                    <span className="font-medium">{currentSession.messages.length}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Session List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Диалоги</h3>
                  {sessions.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm('Удалить всю историю?')) {
                          clearHistory();
                        }
                      }}
                      className="text-xs text-red-600 hover:text-red-800 transition-colors"
                      title="Очистить историю"
                    >
                      🗑️
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {sessions.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-4">
                      Диалогов пока нет.<br />
                      Создайте новый диалог выше.
                    </p>
                  ) : (
                    sessions.map((session) => (
                      <div
                        key={session.id}
                        className={`p-3 rounded-lg border transition-all cursor-pointer ${
                          currentSession?.id === session.id
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => setCurrentSession(session.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{getGoalIcon(session.goal)}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getGoalColor(session.goal)}`}>
                              {session.goal}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Удалить этот диалог?')) {
                                deleteSession(session.id);
                              }
                            }}
                            className="text-xs text-gray-400 hover:text-red-600 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                        
                        <p className="text-xs text-gray-600 truncate" title={session.title}>
                          {session.title}
                        </p>
                        
                        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                          <span>{new Date(session.startTime).toLocaleDateString('ru-RU')}</span>
                          <span>{session.messages.length} сообщ.</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
