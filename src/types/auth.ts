export interface User {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'user';
  assignedOrganizationId?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, orgId?: number) => Promise<void>;
  register: (name: string, email: string, password: string, orgId?: number) => Promise<void>;
  logout: () => void;
}
