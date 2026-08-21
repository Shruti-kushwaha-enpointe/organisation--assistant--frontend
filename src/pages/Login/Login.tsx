import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { organizationService } from '../../services/organization.service';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgId, setOrgId] = useState<number | ''>('');
  const [error, setError] = useState('');

  const { data: organizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: organizationService.getOrganizations,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password, orgId === '' ? undefined : orgId);
      navigate('/');
    } catch (err) {
      setError('Failed to login. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-[400px] mx-auto">
      <div className="text-center mb-6">
        {/* <div className="flex justify-center items-center w-12 h-12 bg-primary text-white rounded-md mx-auto mb-4">
          <Building2 size={24} />
        </div> */}
        <h1 className="text-2xl font-bold text-text-main mb-1">Welcome Back</h1>
        <p className="text-text-muted text-sm">Sign in to your organization knowledge base</p>
      </div>

      <div className="bg-cards rounded-lg shadow-md border border-border p-8">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-main">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border border-border rounded-md font-inherit text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-main">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border border-border rounded-md font-inherit text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-main">Organization</label>
            <select
              value={orgId}
              onChange={(e) => setOrgId(e.target.value === '' ? '' : Number(e.target.value))}
              className="p-3 border border-border rounded-md font-inherit text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background"
            >
              <option value="">Let system assign</option>
              {organizations?.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>

          {error && <span className="text-error text-xs">{error}</span>}

          <div className="flex justify-end mt-1">
            <Link to="/forgot-password" className="text-sm text-primary font-medium hover:underline">Forgot password?</Link>
          </div>

          <button type="submit" className="mt-2 w-full p-3 bg-primary text-white border-none rounded-md font-semibold text-base cursor-pointer transition-colors hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="text-center mt-4 text-sm text-text-muted">
            Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
