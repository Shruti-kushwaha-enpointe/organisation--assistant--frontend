import api from './axios';

export interface SourceCitation {
  document: string;
  page?: number | null;
}

export interface ChatResponse {
  answer: string;
  sources: SourceCitation[];
}

export interface ChatHistoryItem {
  id: number | string;
  organization_id?: number;
  question: string;
  answer: string;
  sources?: SourceCitation[];
  created_at?: string;
}

export type ChatHistoryResponse = ChatHistoryItem[];

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

  // GET /api/v1/chat/history/{organization_id}
  getHistory: async (organizationId: number): Promise<ChatHistoryResponse> => {
    const response = await api.get(`/chat/history/${organizationId}`);
    return response.data;
  },
};
