import { ChatResponse } from '../types/chat';

export const chatService = {
  askQuestion: async (organizationId: number, question: string): Promise<ChatResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          answer: `This is a simulated AI answer to your question: "${question}". The backend will stream the real response later.`,
          sources: [
            { document: 'Employee Handbook.pdf', page: 12 },
            { document: 'Company_Policies.docx', page: 4 }
          ]
        });
      }, 2000);
    });
  }
};
