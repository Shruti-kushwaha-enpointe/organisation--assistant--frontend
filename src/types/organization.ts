export interface Member {
  id: string;
  email: string;
  role: 'admin' | 'member';
}

export interface Organization {
  id: string;
  name: string;
  description?: string;
  adminEmail: string;
  createdAt: string;
  memberCount: number;
  members: Member[];
}
