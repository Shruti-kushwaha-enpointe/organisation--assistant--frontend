import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Upload, Filter, Loader2, Trash2, Edit2 } from 'lucide-react';
import { organizationService } from '../../services/organization.service';
import { documentService } from '../../services/document.service';
import { useAuthStore } from '../../store/authStore';
import { getVisibleOrganizations } from '../../utils/rbac';

const Documents = () => {
  const [selectedOrgId, setSelectedOrgId] = useState<number | ''>('');
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: organizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: organizationService.getOrganizations,
  });

  const visibleOrganizations = getVisibleOrganizations(organizations, user);

  // Automatically select the first organization if none is selected
  useEffect(() => {
    if (visibleOrganizations && visibleOrganizations.length > 0 && selectedOrgId === '') {
      setSelectedOrgId(visibleOrganizations[0].id);
    }
  }, [visibleOrganizations, selectedOrgId]);

  const { data: documents, isLoading: docsLoading } = useQuery({
    queryKey: ['documents', selectedOrgId],
    queryFn: () => selectedOrgId ? documentService.getDocuments(selectedOrgId as number) : Promise.resolve([]),
    enabled: selectedOrgId !== '',
  });

  const deleteMutation = useMutation({
    mutationFn: ({ orgId, docId }: { orgId: number; docId: number }) =>
      documentService.deleteDocument(orgId, docId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', selectedOrgId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ orgId, docId, fileName }: { orgId: number; docId: number, fileName: string }) =>
      documentService.updateDocument(orgId, docId, fileName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', selectedOrgId] });
    },
  });

  const handleDelete = (docId: number) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      if (selectedOrgId) {
        deleteMutation.mutate({ orgId: selectedOrgId as number, docId });
      }
    }
  };

  const handleUpdate = (docId: number, currentName: string) => {
    const newName = window.prompt('Enter new filename:', currentName);
    if (newName && newName.trim() !== '' && newName !== currentName) {
      if (selectedOrgId) {
        updateMutation.mutate({ orgId: selectedOrgId as number, docId, fileName: newName.trim() });
      }
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text-main">Documents</h1>
        {user?.role === 'superadmin' && (
          <Link to="/documents/upload" className="bg-primary text-white px-6 py-3 rounded-md font-semibold text-base flex items-center gap-2 transition-colors hover:bg-emerald-700">
            <Upload size={20} />
            Upload Document
          </Link>
        )}
      </div>

      <div className="flex gap-4 mb-6 items-center">
        <Filter size={18} color="var(--color-text-muted)" />
        <select
          className="px-4 py-2 border border-border rounded-md text-sm bg-cards text-text-main min-w-[250px]"
          value={selectedOrgId}
          onChange={(e) => setSelectedOrgId(e.target.value === '' ? '' : Number(e.target.value))}
        >
          {user?.role === 'superadmin' && <option value="">All Organizations</option>}
          {visibleOrganizations?.map((org) => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-cards border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                <th className="bg-black/5 py-4 px-6 text-left font-semibold text-sm text-text-muted border-b border-border">File Name</th>
                <th className="bg-black/5 py-4 px-6 text-left font-semibold text-sm text-text-muted border-b border-border">Upload Date</th>
                <th className="bg-black/5 py-4 px-6 text-left font-semibold text-sm text-text-muted border-b border-border">Status</th>
                {user?.role === 'superadmin' && (
                  <th className="bg-black/5 py-4 px-6 text-right font-semibold text-sm text-text-muted border-b border-border">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {docsLoading ? (
              <tr>
                <td colSpan={3}>
                  <div className="p-12 text-center text-text-muted flex items-center justify-center gap-4">
                    <Loader2 size={24} className="animate-spin text-primary" />
                    Loading documents...
                  </div>
                </td>
              </tr>
            ) : documents && documents.length > 0 ? (
              documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-black/5">
                  <td className="py-4 px-6 border-b border-border align-middle">
                    <div className="flex items-center gap-4">
                      <FileText className="text-primary" size={20} />
                      <span className="font-medium text-text-main">{doc.file_name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 border-b border-border align-middle">
                    <span className="text-text-muted text-sm">
                      {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-6 border-b border-border align-middle">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-success">Indexed</span>
                  </td>
                  {user?.role === 'superadmin' && (
                    <td className="py-4 px-6 border-b border-border align-middle text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleUpdate(doc.id, doc.file_name)}
                          disabled={updateMutation.isPending}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all shadow-sm disabled:opacity-50"
                          title="Rename document"
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          disabled={deleteMutation.isPending}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm disabled:opacity-50"
                          title="Delete document"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>
                  <div className="p-12 text-center text-text-muted">
                    {selectedOrgId === ''
                      ? 'Please select an organization to view its documents.'
                      : 'No documents found for this organization.'}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default Documents;
