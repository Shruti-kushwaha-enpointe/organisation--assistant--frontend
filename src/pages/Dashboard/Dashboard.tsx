import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building2, FileText, MessageSquare, Plus, Upload } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { organizationService } from '../../services/organization.service';
import { documentService } from '../../services/document.service';
import { chatService } from '../../services/chat.service';

const Dashboard = () => {
  const { user } = useAuthStore();

  const { data: organizations, isLoading: orgsLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: organizationService.getOrganizations,
  });

  const { data: documents, isLoading: docsLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentService.getDocuments(1), // Mock org id
  });

  const { data: conversations, isLoading: chatsLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => chatService.askQuestion(1, ''), // Mock
  });

  const totalOrgs = organizations?.length || 0;
  const totalDocs = documents?.length || 0;
  const unreadMessages = 5; // Mock since chat structure changed

  const isLoading = orgsLoading || docsLoading || chatsLoading;

  return (
    <div className="max-w-[1200px] mx-auto p-8 flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-12 text-white shadow-md relative overflow-hidden">
        <h1 className="text-3xl font-bold mb-2 text-white relative z-10">Welcome back, {user?.name || 'User'}!</h1>
        <p className="text-lg text-white/80 m-0 relative z-10">Here is an overview of your knowledge base.</p>
      </div>

      {/* Stats Overview */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-text-main">Overview</h2>
        {isLoading ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
            <div className="w-full h-[100px] bg-gradient-to-r from-border via-slate-100 to-border bg-[length:200%_100%] animate-pulse rounded-lg"></div>
            <div className="w-full h-[100px] bg-gradient-to-r from-border via-slate-100 to-border bg-[length:200%_100%] animate-pulse rounded-lg"></div>
            <div className="w-full h-[100px] bg-gradient-to-r from-border via-slate-100 to-border bg-[length:200%_100%] animate-pulse rounded-lg"></div>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
            <div className="bg-cards border border-border rounded-lg p-6 flex items-start gap-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="w-12 h-12 rounded-md flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                <Building2 size={24} />
              </div>
              <div className="flex-1">
                <div className="text-3xl font-bold text-text-main leading-none mb-1">{totalOrgs}</div>
                <div className="text-sm text-text-muted">Organizations</div>
              </div>
            </div>

            <div className="bg-cards border border-border rounded-lg p-6 flex items-start gap-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="w-12 h-12 rounded-md flex items-center justify-center shrink-0 bg-accent/10 text-accent">
                <FileText size={24} />
              </div>
              <div className="flex-1">
                <div className="text-3xl font-bold text-text-main leading-none mb-1">{totalDocs}</div>
                <div className="text-sm text-text-muted">Indexed Documents</div>
              </div>
            </div>

            <div className="bg-cards border border-border rounded-lg p-6 flex items-start gap-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="w-12 h-12 rounded-md flex items-center justify-center shrink-0 bg-success/10 text-success">
                <MessageSquare size={24} />
              </div>
              <div className="flex-1">
                <div className="text-3xl font-bold text-text-main leading-none mb-1">12</div>
                <div className="text-sm text-text-muted">AI Queries</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-text-main">Quick Actions</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          <Link to="/organizations/new" className="flex items-center gap-2 p-4 bg-cards border border-border rounded-md text-text-main font-medium transition-colors hover:border-primary hover:text-primary hover:bg-blue-600/5">
            <Plus size={20} className="text-primary" />
            Create Organization
          </Link>
          <Link to="/documents/upload" className="flex items-center gap-2 p-4 bg-cards border border-border rounded-md text-text-main font-medium transition-colors hover:border-primary hover:text-primary hover:bg-blue-600/5">
            <Upload size={20} className="text-accent" />
            Upload Document
          </Link>
          <Link to="/chat" className="flex items-center gap-2 p-4 bg-cards border border-border rounded-md text-text-main font-medium transition-colors hover:border-primary hover:text-primary hover:bg-blue-600/5">
            <MessageSquare size={20} className="text-success" />
            Ask Assistant
          </Link>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
        <div className="bg-cards border border-border rounded-lg p-8 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <h3 className="text-lg font-semibold text-text-main m-0">Recent Documents</h3>
            <Link to="/documents" className="text-sm text-primary font-medium hover:underline">View All</Link>
          </div>
          <div className="flex flex-col">
            {docsLoading ? (
               <div className="text-center text-text-muted py-6 text-sm">Loading...</div>
            ) : documents && documents.length > 0 ? (
              documents.slice(0, 4).map(doc => (
                <div key={doc.id} className="flex items-center gap-4 py-4 border-b border-border last:border-b-0">
                  <div className="w-10 h-10 rounded-md flex items-center justify-center bg-background text-text-muted">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-text-main mb-[2px]">{doc.name}</div>
                    <div className="text-xs text-text-muted">
                      Uploaded {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'recently'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-text-muted py-6 text-sm">No documents uploaded yet.</div>
            )}
          </div>
        </div>

        <div className="bg-cards border border-border rounded-lg p-8 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <h3 className="text-lg font-semibold text-text-main m-0">Your Organizations</h3>
            <Link to="/organizations" className="text-sm text-primary font-medium hover:underline">View All</Link>
          </div>
          <div className="flex flex-col">
            {orgsLoading ? (
               <div className="text-center text-text-muted py-6 text-sm">Loading...</div>
            ) : organizations && organizations.length > 0 ? (
              organizations.slice(0, 4).map(org => (
                <div key={org.id} className="flex items-center gap-4 py-4 border-b border-border last:border-b-0">
                  <div className="w-10 h-10 rounded-md flex items-center justify-center bg-background text-text-muted">
                    <Building2 size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-text-main mb-[2px]">{org.name}</div>
                    <div className="text-xs text-text-muted">
                      ID: {org.id}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-text-muted py-6 text-sm">No organizations created yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
