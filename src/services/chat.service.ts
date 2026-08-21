import { chatApi, ChatResponse, ChatHistoryResponse, StreamChunk } from '../api/chat';

export const chatService = {
  //ask quetions to an org
  askQuestion: 
  async (organizationId: number, question: string, selectedDocumentIds?: number[]): Promise<ChatResponse> => {
    return await chatApi.ask(organizationId, question, selectedDocumentIds);
  },
  
  // stream questions to an org
  askQuestionStream: async (
    organizationId: number, 
    question: string,
    onChunk: (chunk: StreamChunk) => void,
    selectedDocumentIds?: number[]
  ): Promise<void> => {
    return await chatApi.askStream(organizationId, question, onChunk, selectedDocumentIds);
  },
  
  // get chat history for an org
  getHistory: async (organizationId: number, userEmail?: string): Promise<ChatHistoryResponse> => {
    if (userEmail) {
      // Use purely local history scoped to the user to prevent cross-user data leakage
      const localStr = localStorage.getItem(`chat_history_${userEmail}_${organizationId}`);
      if (localStr) return JSON.parse(localStr);
      return [];
    }
    return await chatApi.getHistory(organizationId);
  },

  saveLocalHistory: (organizationId: number, userEmail: string, question: string, answer: string, sources?: any[]) => {
    const key = `chat_history_${userEmail}_${organizationId}`;
    const existingStr = localStorage.getItem(key);
    const existing = existingStr ? JSON.parse(existingStr) : [];
    
    const newItem = {
      id: Date.now().toString(),
      organization_id: organizationId,
      question,
      answer,
      sources,
      created_at: new Date().toISOString()
    };
    
    localStorage.setItem(key, JSON.stringify([newItem, ...existing]));
  }
};
