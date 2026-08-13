import { Organization } from '../types/organization';
import { organizationsApi } from '../api/organizations';

export const organizationService = {

  //create new org name 
  createOrganization: async (name: string): Promise<Organization> => {
    return await organizationsApi.create({ name });
  },
 
  //read/list all org names
  getOrganizations: async (): Promise<Organization[]> => {
    return await organizationsApi.getAll();
  },

  //update org name
  updateOrganization: async (id: number, name: string): Promise<Organization> => {
    return await organizationsApi.update(id, { name });
  },

  //delete an org 
  deleteOrganization: async (id: number): Promise<void> => {
    return await organizationsApi.delete(id);
  },
};
