import { chatApi, ChatResponse, ChatHistoryResponse } from '../api/chat';

export const chatService = {
  //ask quetions to an org
  askQuestion: 
  async (organizationId: number, question: string, selectedDocumentIds?: number[]): Promise<ChatResponse> => {
    return await chatApi.ask(organizationId, question, selectedDocumentIds);
  },
  
  // get chat history for an org
  getHistory: async (organizationId: number): Promise<ChatHistoryResponse> => {
    return await chatApi.getHistory(organizationId);
  }
};
