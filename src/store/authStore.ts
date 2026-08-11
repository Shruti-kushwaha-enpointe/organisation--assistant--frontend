import { create } from 'zustand';
import { AuthState, User } from '../types/auth';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string) => {
    set({ isLoading: true });
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock user data
    const mockUser: User = {
      id: 'usr_123',
      email: email,
      name: email.split('@')[0] || 'User',
      role: 'admin',
    };

    set({ 
      user: mockUser, 
      isAuthenticated: true, 
      isLoading: false 
    });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
