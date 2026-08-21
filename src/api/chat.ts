import { text } from 'stream/consumers';
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

export interface StreamChunk {
  text?: string;
  sources?: SourceCitation[];
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

  // POST /api/v1/chat/stream
  askStream: async (
    organizationId: number, 
    question: string,
    onChunk: (chunk: StreamChunk) => void,
    selectedDocumentIds?: number[] | null
  ): Promise<void> => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const apiKey = import.meta.env.VITE_API_KEY || '';

    const response = await fetch(`${baseURL}/api/v1/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'X-API-Key': apiKey }),
      },
      body: JSON.stringify({
        organizationId,
        question,
        selectedDocumentIds: selectedDocumentIds || null
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Streaming not supported');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.trim().startsWith('data:')) {
          const dataStr = line.substring(line.indexOf('data:') + 5).trim();
          if (dataStr === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.error) {
              const errMsg = parsed.error.message || JSON.stringify(parsed.error);
              onChunk({ text: `**System Error:** The backend AI service reported an error: ${errMsg}` });
              continue;
            }

            const textVal = parsed.text ?? parsed.answer ?? parsed.content ?? parsed.message ?? parsed.delta;
            
            if (textVal !== undefined) {
              onChunk({ text: textVal });
            } else if (!parsed.sources && typeof parsed === 'object') {
              // DEBUG: If it's an object we don't recognize, dump it to the screen so we can see the keys!
              onChunk({ text: JSON.stringify(parsed) });
            }
            
            if (parsed.sources) {
              const sources = parsed.sources.map((s: any) => ({
                document: s.file_name || s.document,
                page: s.page
              }));
              onChunk({ sources });
            }
          } catch (e) {
            console.error('Failed to parse SSE data', dataStr, e);
            // DEBUG: if it fails to parse, dump the raw string
            onChunk({ text: dataStr });
          }
        }
      }
    }
  },

  // GET /api/v1/chat/history/{organization_id}
  getHistory: async (organizationId: number): Promise<ChatHistoryResponse> => {
    const response = await api.get(`/chat/history/${organizationId}`);
    return response.data;
  },
};
