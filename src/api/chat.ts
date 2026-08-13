import api from './axios';

export interface SourceCitation {
  document: string;
  page?: number | null;
}

export interface ChatResponse {
  answer: string;
  sources: SourceCitation[];
}

export const chatApi = {
  // POST /api/v1/chat
  ask: async (organizationId: number, question: string,
    selectedDocumentIds?: number[] | null): Promise<ChatResponse> => {
    const response = await api.post('/chat', {
      organizationId,
      question,
      selectedDocumentIds: selectedDocumentIds || null
    });
    return response.data;
  },
};
