import api from './axios';

export interface DocumentResponse {
  id: number;
  organization_id: number;
  file_name: string;
  file_type: string;
  created_at?: string | null;
}

export const documentsApi = {
  // GET /api/v1/organizations/{organization_id}/documents
  getAll: async (organizationId: number): Promise<DocumentResponse[]> => {
    const response = await api.get(`/organizations/${organizationId}/documents`);
    return response.data;
  },

  // POST /api/v1/organizations/{organization_id}/documents
  upload: async (organizationId: number, file: File): Promise<DocumentResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/organizations/${organizationId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  // DELETE /api/v1/organizations/{organization_id}/documents/{document_id}
  delete: async (organizationId: number, documentId: number): Promise<void> => {
    await api.delete(`/organizations/${organizationId}/documents/${documentId}`);
  },
  // PUT /api/v1/organizations/{organization_id}/documents/{document_id}
  update: async (organizationId: number, documentId: number, data: { file_name: string }): Promise<DocumentResponse> => {
    const response = await api.put(`/organizations/${organizationId}/documents/${documentId}`, data);
    return response.data;
  },
};
