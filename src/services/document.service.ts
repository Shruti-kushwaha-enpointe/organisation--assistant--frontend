import { Document } from '../types/document';

let mockDocuments: Record<number, Document[]> = {
  1: [
    { id: 101, name: 'Employee_Handbook.pdf', createdAt: new Date().toISOString() },
    { id: 102, name: 'Company_Policies.docx', createdAt: new Date().toISOString() }
  ]
};

export const documentService = {
  uploadDocument: async (organizationId: number, file: File): Promise<Document> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newDoc = { id: Date.now(), name: file.name, createdAt: new Date().toISOString() };
        if (!mockDocuments[organizationId]) {
          mockDocuments[organizationId] = [];
        }
        mockDocuments[organizationId].push(newDoc);
        resolve(newDoc);
      }, 1500);
    });
  },

  getDocuments: async (organizationId: number): Promise<Document[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDocuments[organizationId] || []), 500);
    });
  },
};
