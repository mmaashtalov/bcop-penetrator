import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DialogMessage {
  id: string;
  timestamp: number;
  author: 'user' | 'collector' | 'assistant';
  text: string;
  analysis?: any; // JSON результат анализа
  responses?: {
    legal: string;
    professional: string;
    sarcastic: string;
  };
  goal?: 'defensive' | 'aggressive' | 'informational';
}

export interface DialogSession {
  id: string;
  title: string;
  startTime: number;
  messages: DialogMessage[];
  goal: 'defensive' | 'aggressive' | 'informational';
}

interface HistoryStore {
  sessions: DialogSession[];
  currentSession: DialogSession | null;
  
  // Actions
  createSession: (goal: 'defensive' | 'aggressive' | 'informational') => void;
  addMessage: (message: Omit<DialogMessage, 'id' | 'timestamp'>) => void;
  setCurrentSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  clearHistory: () => void;
  updateSessionGoal: (sessionId: string, goal: 'defensive' | 'aggressive' | 'informational') => void;
}

export const useDialogHistory = create<HistoryStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSession: null,

      createSession: (goal) => {
        const newSession: DialogSession = {
          id: `session_${Date.now()}`,
          title: `Диалог ${new Date().toLocaleString('ru-RU')}`,
          startTime: Date.now(),
          messages: [],
          goal
        };
        
        set(state => ({
          sessions: [newSession, ...state.sessions],
          currentSession: newSession
        }));
      },

      addMessage: (messageData) => {
        const message: DialogMessage = {
          ...messageData,
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now()
        };

        set(state => {
          if (!state.currentSession) return state;
          
          const updatedSession = {
            ...state.currentSession,
            messages: [...state.currentSession.messages, message]
          };
          
          return {
            currentSession: updatedSession,
            sessions: state.sessions.map(s => 
              s.id === state.currentSession?.id ? updatedSession : s
            )
          };
        });
      },

      setCurrentSession: (sessionId) => {
        const session = get().sessions.find(s => s.id === sessionId);
        if (session) {
          set({ currentSession: session });
        }
      },

      deleteSession: (sessionId) => {
        set(state => ({
          sessions: state.sessions.filter(s => s.id !== sessionId),
          currentSession: state.currentSession?.id === sessionId ? null : state.currentSession
        }));
      },

      clearHistory: () => {
        set({ sessions: [], currentSession: null });
      },

      updateSessionGoal: (sessionId, goal) => {
        set(state => {
          const updatedSessions = state.sessions.map(s => 
            s.id === sessionId ? { ...s, goal } : s
          );
          
          return {
            sessions: updatedSessions,
            currentSession: state.currentSession?.id === sessionId 
              ? { ...state.currentSession, goal }
              : state.currentSession
          };
        });
      }
    }),
    {
      name: 'bcop-dialog-history', // Ключ для localStorage
      version: 1, // Версия для миграций
    }
  )
);