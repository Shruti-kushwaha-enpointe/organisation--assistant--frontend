import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FileText, Upload, Filter, Loader2 } from 'lucide-react';
import { organizationService } from '../../services/organization.service';
import { documentService } from '../../services/document.service';

const Documents = () => {
  const [selectedOrgId, setSelectedOrgId] = useState<number | ''>('');

  const { data: organizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: organizationService.getOrganizations,
  });

  // Automatically select the first organization if none is selected
  useEffect(() => {
    if (organizations && organizations.length > 0 && selectedOrgId === '') {
      setSelectedOrgId(organizations[0].id);
    }
  }, [organizations, selectedOrgId]);

  const { data: documents, isLoading: docsLoading } = useQuery({
    queryKey: ['documents', selectedOrgId],
    queryFn: () => selectedOrgId ? documentService.getDocuments(selectedOrgId as number) : Promise.resolve([]),
    enabled: selectedOrgId !== '',
  });

  return (
    <div className="max-w-[1200px] mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text-main">Documents</h1>
        <Link to="/documents/upload" className="bg-primary text-white px-6 py-3 rounded-md font-semibold text-base flex items-center gap-2 transition-colors hover:bg-blue-700">
          <Upload size={20} />
          Upload Document
        </Link>
      </div>

      <div className="flex gap-4 mb-6 items-center">
        <Filter size={18} color="var(--color-text-muted)" />
        <select 
          className="px-4 py-2 border border-border rounded-md text-sm bg-cards text-text-main min-w-[250px]"
          value={selectedOrgId}
          onChange={(e) => setSelectedOrgId(e.target.value === '' ? '' : Number(e.target.value))}
        >
          <option value="">-- All Organizations --</option>
          {organizations?.map((org) => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-cards border border-border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="bg-black/5 py-4 px-6 text-left font-semibold text-sm text-text-muted border-b border-border">File Name</th>
              <th className="bg-black/5 py-4 px-6 text-left font-semibold text-sm text-text-muted border-b border-border">Upload Date</th>
              <th className="bg-black/5 py-4 px-6 text-left font-semibold text-sm text-text-muted border-b border-border">Status</th>
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
                      <FileText className="text-accent" size={20} />
                      <span className="font-medium text-text-main">{doc.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 border-b border-border align-middle">
                    <span className="text-text-muted text-sm">
                      {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-6 border-b border-border align-middle">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-success">Indexed</span>
                  </td>
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
  );
};

export default Documents;
