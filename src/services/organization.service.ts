import { Organization } from '../types/organization';

// Mock data to simulate backend until APIs are ready
let mockOrganizations: Organization[] = [
  { id: 1, name: 'Acme Corporation' },
  { id: 2, name: 'Tech Solutions Inc.' },
];

export const organizationService = {
  createOrganization: async (name: string): Promise<Organization> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newOrg = { id: Date.now(), name };
        mockOrganizations.push(newOrg);
        resolve(newOrg);
      }, 800);
    });
  },

  getOrganizations: async (): Promise<Organization[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockOrganizations]), 500);
    });
  },
};
