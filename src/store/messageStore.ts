import { create } from 'zustand';
import { AnalysisMessage } from '../types/response';

interface MessageStore {
  messages: AnalysisMessage[];
  currentMessage: AnalysisMessage | null;
  
  addMessage: (message: AnalysisMessage) => void;
  setCurrentMessage: (message: AnalysisMessage | null) => void;
  updateMessage: (id: string, updates: Partial<AnalysisMessage>) => void;
  clearMessages: () => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  currentMessage: null,
  
  addMessage: (message) => set((state) => ({
    messages: [message, ...state.messages],
    currentMessage: message
  })),
  
  setCurrentMessage: (message) => set({ currentMessage: message }),
  
  updateMessage: (id, updates) => set((state) => ({
    messages: state.messages.map(msg => 
      msg.id === id ? { ...msg, ...updates } : msg
    ),
    currentMessage: state.currentMessage?.id === id 
      ? { ...state.currentMessage, ...updates } 
      : state.currentMessage
  })),
  
  clearMessages: () => set({ messages: [], currentMessage: null })
}));