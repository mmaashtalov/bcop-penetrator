import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AnalysisMessage, DialogueGoal } from '../types/response';

export interface DialogSession {
  id: string;
  startTime: number;
  messages: AnalysisMessage[];
}

interface HistoryState {
  sessions: DialogSession[];
  currentSessionId: string | null;
  currentGoal: DialogueGoal;
  persistHistory: boolean;
  setGoal: (goal: DialogueGoal) => void;
  setPersistHistory: (enabled: boolean) => void;
  setCurrentSession: (id: string) => void;
  createNewSession: () => string;
  appendMessage: (message: AnalysisMessage) => void;
  updateMessage: (id: string, updates: Partial<AnalysisMessage>) => void;
  clearCurrentSession: () => void;
  clearAllDialogs: () => void;
}

function createId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') return globalThis.crypto.randomUUID();
  return `bcop-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createSession(): DialogSession {
  return { id: createId(), startTime: Date.now(), messages: [] };
}

function isDialogueGoal(value: unknown): value is DialogueGoal {
  return value === 'gather_info' || value === 'reduce_pressure' || value === 'buy_time' || value === 'end_contact';
}

export const useDialogHistory = create<HistoryState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      currentGoal: 'gather_info',
      persistHistory: false,

      setGoal: (goal) => set({ currentGoal: goal }),
      setPersistHistory: (enabled) => set({ persistHistory: enabled }),

      setCurrentSession: (id) => {
        if (get().sessions.some((session) => session.id === id)) {
          set({ currentSessionId: id });
        }
      },

      createNewSession: () => {
        const session = createSession();
        set((state) => ({
          sessions: [...state.sessions, session],
          currentSessionId: session.id,
        }));
        return session.id;
      },

      appendMessage: (message) => {
        const state = get();
        const sessionId = state.currentSessionId || state.createNewSession();
        set((current) => ({
          sessions: current.sessions.map((session) => (
            session.id === sessionId
              ? { ...session, messages: [...session.messages, message] }
              : session
          )),
          currentSessionId: sessionId,
        }));
      },

      updateMessage: (id, updates) => set((state) => ({
        sessions: state.sessions.map((session) => ({
          ...session,
          messages: session.messages.map((message) => (
            message.id === id ? { ...message, ...updates } : message
          )),
        })),
      })),

      clearCurrentSession: () => set((state) => ({
        sessions: state.sessions.map((session) => (
          session.id === state.currentSessionId ? { ...session, messages: [] } : session
        )),
      })),

      clearAllDialogs: () => set({ sessions: [], currentSessionId: null }),
    }),
    {
      name: 'bcop-dialogue-history-v1',
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persistedState, version) => {
        const previous = persistedState as Partial<HistoryState>;
        if (version < 2) {
          return {
            sessions: [],
            currentSessionId: null,
            currentGoal: isDialogueGoal(previous.currentGoal) ? previous.currentGoal : 'gather_info',
            persistHistory: false,
          };
        }
        return persistedState as HistoryState;
      },
      partialize: (state) => ({
        sessions: state.persistHistory ? state.sessions : [],
        currentSessionId: state.persistHistory ? state.currentSessionId : null,
        currentGoal: state.currentGoal,
        persistHistory: state.persistHistory,
      }),
    },
  ),
);
