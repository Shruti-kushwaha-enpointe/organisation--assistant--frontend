import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, FileText, X } from 'lucide-react';
import { organizationService } from '../../services/organization.service';
import { documentService } from '../../services/document.service';

const UploadDocuments = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedOrg, setSelectedOrg] = useState<number | ''>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: organizations, isLoading: orgsLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: organizationService.getOrganizations,
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ orgId, file }: { orgId: number; file: File }) => {
      return documentService.uploadDocument(orgId, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      navigate('/documents');
    },
    onError: () => {
      setError('Failed to upload document. Please try again.');
    },
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = () => {
    if (!selectedOrg) {
      setError('Please select an organization first.');
      return;
    }
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    uploadMutation.mutate({ orgId: Number(selectedOrg), file: selectedFile });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-[800px] mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-[1.75rem] font-bold text-text-main mb-2">Upload Document</h1>
        <p className="text-text-muted">Index a new document into your organization's knowledge base.</p>
      </div>

      <div className="bg-cards border border-border rounded-lg p-8 shadow-sm">
        <div className="flex flex-col gap-2 mb-8">
          <label className="font-medium text-text-main">Select Organization</label>
          <select
            className="px-4 py-3 border border-border rounded-md text-base bg-background text-text-main transition-all focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10"
            value={selectedOrg}
            onChange={(e) => {
              setSelectedOrg(e.target.value === '' ? '' : Number(e.target.value));
              setError(null);
            }}
            disabled={orgsLoading}
          >
            <option value="">Choose Organization</option>
            {organizations?.map((org) => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>

        {!selectedFile ? (
          <div
            className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center gap-4 cursor-pointer bg-background transition-all hover:border-primary hover:bg-emerald-50"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="text-text-muted w-12 h-12" />
            <div className="text-lg font-medium text-text-main text-center">Click or drag file to this area to upload</div>
            <div className="text-sm text-text-muted text-center">Support for a single PDF or DOCX file</div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-2">
            <div className="flex items-center justify-between p-4 bg-background border border-border rounded-md">
              <div className="flex items-center gap-4">
                <FileText className="text-primary" size={24} />
                <div>
                  <div className="font-medium text-text-main">{selectedFile.name}</div>
                  <div className="text-sm text-text-muted">{formatFileSize(selectedFile.size)}</div>
                </div>
              </div>
              <button
                className="bg-transparent border-none text-error cursor-pointer p-1 rounded-sm flex items-center justify-center transition-colors hover:bg-error/10"
                onClick={() => setSelectedFile(null)}
                disabled={uploadMutation.isPending}
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {error && <div className="mt-4 p-4 bg-error/10 rounded-md text-error text-sm">{error}</div>}

        <div className="flex justify-end gap-4 mt-8">
          <Link to="/documents" className="bg-transparent text-text-main px-6 py-3 border border-border rounded-md font-medium text-base cursor-pointer no-underline transition-all hover:bg-border">
            Cancel
          </Link>
          <button
            className="bg-primary text-white px-6 py-3 border-none rounded-md font-semibold text-base cursor-pointer transition-colors hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={handleUpload}
            disabled={!selectedOrg || !selectedFile || uploadMutation.isPending}
          >
            {uploadMutation.isPending ? 'Uploading...' : 'Start Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDocuments;
