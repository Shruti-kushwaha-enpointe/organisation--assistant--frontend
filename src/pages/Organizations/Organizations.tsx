import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building2, Plus } from 'lucide-react';
import { organizationService } from '../../services/organization.service';

const Organizations = () => {
  const { data: organizations, isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: organizationService.getOrganizations,
  });

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
                <Link to={`/organizations/${org.id}`} className="inline-flex items-center mt-auto text-primary font-medium text-sm transition-all hover:underline">
                  View Organization &rarr;
                </Link>
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
