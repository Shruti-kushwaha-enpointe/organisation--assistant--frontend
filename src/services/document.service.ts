import { documentsApi, DocumentResponse as Document } from '../api/documents';

export const documentService = {
  //uploade file to an org
  uploadDocument: async (organizationId: number, file: File): Promise<Document> => {
    return await documentsApi.upload(organizationId, file);
  },

  //get document of an org
  getDocuments: async (organizationId: number): Promise<Document[]> => {
    return await documentsApi.getAll(organizationId);
  },

  //delete file from an org
  deleteDocument: async (organizationId: number, documentId: number): Promise<void> => {
    return await documentsApi.delete(organizationId, documentId);
  },

  //update filename of a document
  updateDocument: async (organizationId: number, documentId: number, fileName: string): Promise<Document> => {
    return await documentsApi.update(organizationId, documentId, { file_name: fileName });
  },
};
