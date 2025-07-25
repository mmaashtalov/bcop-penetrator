import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { AnalysisMessage } from '../types/response';

export interface DialogSession {
  id: string;
  startTime: number;
  messages: AnalysisMessage[];
}

interface Dialog { id: string; title: string; messages: any[] }
interface HistoryState {
  dialogs: Dialog[];
  activeId?: string;
  searchTerm: string;
  currentGoal: string;
  setSearch: (s: string) => void;
  setGoal: (g: string) => void;
  sessions: DialogSession[];
  currentSession: DialogSession | null;
  setCurrentSession: (id: string) => void;
  createNewSession: () => void;
  addMessageToCurrentSession: (message: AnalysisMessage) => void;
}

export const useDialogHistory = create<HistoryState>((set, get) => ({
  dialogs: [],
  activeId: undefined,
  searchTerm: '',
  currentGoal: 'gather_info',
  setSearch: (s) => set({ searchTerm: s }),
  setGoal: (g) => set({ currentGoal: g }),
  sessions: [],
  currentSession: null,
  setCurrentSession: (id) => {
    const session = get().sessions.find((s) => s.id === id) || null;
    set({ currentSession: session });
  },
  createNewSession: () => {
    const newSession: DialogSession = {
      id: uuidv4(),
      startTime: Date.now(),
      messages: [],
    };
    const updatedSessions = [...get().sessions, newSession];
    set({ sessions: updatedSessions, currentSession: newSession });
  },
  addMessageToCurrentSession: (message: AnalysisMessage) => {
    // Реализация добавления сообщения в текущую сессию
  },
}));