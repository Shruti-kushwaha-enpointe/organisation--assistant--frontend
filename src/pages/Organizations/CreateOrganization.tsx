import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrgSchema, CreateOrgFormData } from '../../utils/validations';
import { organizationService } from '../../services/organization.service';

const CreateOrganization = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrgFormData>({
    resolver: zodResolver(createOrgSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: CreateOrgFormData) => organizationService.createOrganization(data.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      navigate('/organizations');
    },
    onError: () => {
      setServerError('Failed to create organization. Please try again.');
    },
  });

  const onSubmit = (data: CreateOrgFormData) => {
    setServerError(null);
    mutation.mutate(data);
  };

  const inputClass = "px-4 py-3 border rounded-md text-base bg-background text-text-main transition-all focus:outline-none focus:ring-[3px]";
  const defaultInputClass = `${inputClass} border-border focus:border-primary focus:ring-primary/10`;
  const errorInputClass = `${inputClass} !border-error focus:!border-error focus:!ring-error/10`;

  return (
    <div className="max-w-[600px] mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-[1.75rem] font-bold text-text-main mb-2">Create Organization</h1>
        <p className="text-text-muted">Set up a new workspace to start indexing your documents.</p>
      </div>

      <div className="bg-cards border border-border rounded-lg p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-medium text-text-main">Organization Name</label>
            <input
              type="text"
              placeholder="e.g. Acme Corporation"
              className={errors.name ? errorInputClass : defaultInputClass}
              {...register('name')}
            />
            {errors.name && <span className="text-sm text-error">{errors.name.message}</span>}
          </div>

          {serverError && <div className="text-sm text-error">{serverError}</div>}

          <div className="flex gap-4 justify-end">
            <Link to="/organizations" className="bg-transparent text-text-main px-6 py-3 border border-border rounded-md font-medium text-base transition-all cursor-pointer hover:bg-border">
              Cancel
            </Link>
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 border-none rounded-md font-semibold text-base flex justify-center items-center transition-colors cursor-pointer hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed" 
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Creating...' : 'Create Organization'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrganization;
