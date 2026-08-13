import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, Plus, Edit2, Trash2 } from 'lucide-react';
import { organizationService } from '../../services/organization.service';

const Organizations = () => {
  const queryClient = useQueryClient();

  const { data: organizations, isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: organizationService.getOrganizations,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => organizationService.deleteOrganization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => 
      organizationService.updateOrganization(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.preventDefault(); // Prevent navigating to the organization
    if (window.confirm('Are you sure you want to delete this organization? All documents inside will be lost!')) {
      deleteMutation.mutate(id);
    }
  };

  const handleUpdate = (e: React.MouseEvent, id: number, currentName: string) => {
    e.preventDefault(); // Prevent navigating to the organization
    const newName = window.prompt('Enter new organization name:', currentName);
    if (newName && newName.trim() !== '' && newName !== currentName) {
      updateMutation.mutate({ id, name: newName.trim() });
    }
  };

  return (
    <div className="max-w-[1000px] my-16 mx-auto p-12 min-h-[500px] bg-cards border border-border rounded-[24px] shadow-sm">
      <div className="flex justify-between mb-8">
        <h1 className="text-[1.75rem] font-bold text-text-main">Organizations</h1>
        <Link to="/organizations/new" className="bg-primary text-white px-6 py-3 rounded-md font-semibold text-base flex items-center gap-2 transition-colors hover:bg-blue-700">
          <Plus size={20} />
          Create New
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          <div className="h-[140px] rounded-lg bg-gradient-to-r from-border via-background to-border bg-[length:400%_100%] animate-pulse"></div>
          <div className="h-[140px] rounded-lg bg-gradient-to-r from-border via-background to-border bg-[length:400%_100%] animate-pulse"></div>
          <div className="h-[140px] rounded-lg bg-gradient-to-r from-border via-background to-border bg-[length:400%_100%] animate-pulse"></div>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          {organizations && organizations.length > 0 ? (
            organizations.map((org) => (
              <div key={org.id} className="bg-cards border border-border rounded-lg p-6 flex flex-col gap-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-md flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                    <Building2 size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xl font-semibold text-text-main leading-[1.2] mb-1">{org.name}</div>
                    <div className="inline-flex items-center px-2.5 py-1 border border-border rounded-full bg-background text-xs font-medium text-text-muted mt-2">ID: {org.id}</div>
                  </div>
                </div>
                <div className="flex items-center justify-end mt-auto pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleUpdate(e, org.id, org.name)}
                      disabled={updateMutation.isPending}
                      className="text-text-muted hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-50 disabled:opacity-50"
                      title="Rename organization"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, org.id)}
                      disabled={deleteMutation.isPending}
                      className="text-text-muted hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 disabled:opacity-50"
                      title="Delete organization"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full p-12 text-center text-text-muted bg-cards border border-dashed border-border rounded-lg">
              No organizations found. Click "Create New" to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Organizations;
