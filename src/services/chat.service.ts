import { chatApi, ChatResponse } from '../api/chat';

export const chatService = {
  //ask quetions to an org
  askQuestion: 
  async (organizationId: number, question: string, selectedDocumentIds?: number[]): Promise<ChatResponse> => {
    return await chatApi.ask(organizationId, question, selectedDocumentIds);
  }
};
