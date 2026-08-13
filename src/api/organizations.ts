import api from './axios';

// Types defining what our API returns based on the Swagger documentation
export interface Organization {
  id: number;
  name: string;
  created_at?: string | null;
}

export interface OrganizationCreate {
  name: string;
}

// The API service object containing all our fetching functions
export const organizationsApi = {
  // GET /api/v1/organizations/
  getAll: async (): Promise<Organization[]> => {
    const response = await api.get('/organizations/');
    return response.data;
  },

  // GET /api/v1/organizations/{id}
  getById: async (id: number): Promise<Organization> => {
    const response = await api.get(`/organizations/${id}`);
    return response.data;
  },

  // POST /api/v1/organizations/
  create: async (data: OrganizationCreate): Promise<Organization> => {
    const response = await api.post('/organizations/', data);
    return response.data;
  },

  // PUT /api/v1/organizations/{id}
  update: async (id: number, data: OrganizationCreate): Promise<Organization> => {
    const response = await api.put(`/organizations/${id}`, data);
    return response.data;
  },

  // DELETE /api/v1/organizations/{id}
  delete: async (id: number): Promise<void> => {
    await api.delete(`/organizations/${id}`);
  },
};
