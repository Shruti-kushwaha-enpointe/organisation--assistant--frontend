import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { signupSchema, SignupFormData } from '../../utils/validations';
import { useAuthStore } from '../../store/authStore';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      await registerUser(data.name, data.email, data.password);
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const inputClass = "p-3 border rounded-md font-inherit text-sm outline-none transition-all focus:ring-2";
  const defaultInputClass = `${inputClass} border-border focus:border-primary focus:ring-primary/20`;
  const errorInputClass = `${inputClass} border-error focus:border-error focus:ring-error/20 !border-error`;

  return (
    <div className="w-full max-w-[450px] mx-auto">
      <div className="text-center mb-6">
        <div className="flex justify-center items-center w-12 h-12 bg-primary text-white rounded-md mx-auto mb-4">
          <Building2 size={24} />
        </div>
        <h1 className="text-2xl font-bold text-text-main mb-1">Create an account</h1>
        <p className="text-text-muted text-sm">Get started with your new organization</p>
      </div>

      <div className="bg-cards rounded-lg shadow-md border border-border p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-main">Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              className={errors.name ? errorInputClass : defaultInputClass}
              {...register('name')} 
            />
            {errors.name && <span className="text-error text-xs">{errors.name.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-main">Email</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              className={errors.email ? errorInputClass : defaultInputClass}
              {...register('email')} 
            />
            {errors.email && <span className="text-error text-xs">{errors.email.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-main">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className={errors.password ? errorInputClass : defaultInputClass}
              {...register('password')} 
            />
            {errors.password && <span className="text-error text-xs">{errors.password.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-main">Confirm Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className={errors.confirmPassword ? errorInputClass : defaultInputClass}
              {...register('confirmPassword')} 
            />
            {errors.confirmPassword && <span className="text-error text-xs">{errors.confirmPassword.message}</span>}
          </div>

          <button type="submit" className="mt-2 w-full p-3 bg-primary text-white border-none rounded-md font-semibold text-base cursor-pointer transition-colors hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed" disabled={isLoading}>
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
          
          <div className="text-center mt-4 text-sm text-text-muted">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
