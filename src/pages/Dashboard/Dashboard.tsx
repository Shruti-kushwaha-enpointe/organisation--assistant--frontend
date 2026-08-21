import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building2, FileText, MessageSquare, Plus, Upload, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { organizationService } from '../../services/organization.service';
import { documentService } from '../../services/document.service';
import { getVisibleOrganizations } from '../../utils/rbac';

const Dashboard = () => {
  const { user } = useAuthStore();

  const { data: organizations, isLoading: orgsLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: organizationService.getOrganizations,
  });

  const visibleOrganizations = getVisibleOrganizations(organizations, user);

  const { data: documents, isLoading: docsLoading } = useQuery({
    queryKey: ['documents', visibleOrganizations?.[0]?.id],
    queryFn: () => documentService.getDocuments(visibleOrganizations![0].id),
    enabled: !!visibleOrganizations && visibleOrganizations.length > 0,
  });

  const totalOrgs = visibleOrganizations?.length || 0;
  const totalDocs = documents?.length || 0;

  const isLoading = orgsLoading || docsLoading;

  return (
    <div className="max-w-[1300px] mx-auto p-8 flex flex-col gap-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-400 rounded-3xl p-12 text-white shadow-xl shadow-emerald-600/20 flex flex-col md:flex-row items-start md:items-center gap-8 border border-emerald-400/30 transition-all">
        {/* Light overlay orbs for premium feel */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-10 w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl backdrop-blur-md border border-white/30 shrink-0 shadow-inner">
          👋
        </div>
        <div className="relative z-10 flex-1">
          <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-sm">Welcome back, {user?.name || 'User'}!</h1>
          <p className="text-lg text-emerald-50 m-0 font-medium drop-shadow-sm">Here is an overview of your knowledge base.</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div>
        <h2 className="text-xl font-bold mb-5 text-slate-900">Overview</h2>
        {isLoading ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
            <div className="w-full h-[140px] bg-slate-200 animate-pulse rounded-2xl"></div>
            <div className="w-full h-[140px] bg-slate-200 animate-pulse rounded-2xl"></div>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
            <div className="bg-white/90 backdrop-blur-xl border border-slate-100 rounded-3xl p-8 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] group">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50 text-emerald-600 shadow-inner border border-emerald-100 transition-transform duration-500 group-hover:scale-110">
                  <Building2 size={32} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <div className="text-4xl font-bold text-slate-900 leading-none mb-1">{totalOrgs}</div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Organizations</div>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity">
                <TrendingUp size={24} strokeWidth={1.5} />
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xl border border-slate-100 rounded-3xl p-8 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] group">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50 text-emerald-600 shadow-inner border border-emerald-100 transition-transform duration-500 group-hover:scale-110">
                  <FileText size={32} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <div className="text-4xl font-bold text-slate-900 leading-none mb-1">{totalDocs}</div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Indexed Documents</div>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity">
                <Clock size={24} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-5 text-slate-900">Quick Actions</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
          {user?.role === 'superadmin' && (
            <>
              <Link to="/organizations/new" className="flex items-center gap-5 p-6 bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] group">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <Plus size={24} strokeWidth={2} />
                </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                <div className="flex-1">
                  <div className="font-bold text-slate-900 text-base mb-0.5">Create Organization</div>
                  <div className="text-sm text-slate-500">Add a new organization</div>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-600 transition-colors group-hover:translate-x-1 duration-300" />
              </Link>
              
              <Link to="/documents/upload" className="flex items-center gap-5 p-6 bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] group">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Upload size={24} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 text-base mb-0.5">Upload Document</div>
                  <div clLassName="text-sm text-slate-500">Upload new documents</div>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors group-hover:translate-x-1 duration-300" />
              </Link>                                     
            </>               
          )}
          
          <Link to="/chat" className="flex items-center gap-5 p-6 bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] group">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-inner group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
              <MessageSquare size={24} strokeWidth={2} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900 text-base mb-0.5">Ask Assistant</div>
              <div className="text-sm text-slate-500">Get AI-powered answers</div>
            </div>
            <ChevronRight size={20} className="text-slate-300 group-hover:text-orange-500 transition-colors group-hover:translate-x-1 duration-300" />
          </Link>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-4">
        <div className="bg-white border-t-4 border-t-emerald-600 border-x border-b border-slate-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-6 relative overflow-hidden">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 m-0">Recent Documents</h3>
            <Link to="/documents" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">View All &rarr;</Link>
          </div>
          <div className="flex flex-col gap-2">
            {docsLoading ? (
              <div className="text-center text-slate-400 py-8 font-medium">Loading documents...</div>
            ) : documents && documents.length > 0 ? (
              documents.slice(0, 4).map(doc => (
                <div key={doc.id} className="flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 shadow-inner group-hover:scale-105 transition-transform">
                    <FileText size={22} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-[15px] mb-1">{doc.file_name}</div>
                    <div className="text-sm font-medium text-slate-500">
                      Uploaded {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'recently'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 py-8 font-medium">No documents uploaded yet.</div>
            )}
          </div>
        </div>

        <div className="bg-white border-t-4 border-t-emerald-600 border-x border-b border-slate-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-6 relative overflow-hidden">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 m-0">Your Organizations</h3>
            <Link to="/organizations" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">View All &rarr;</Link>
          </div>
          <div className="flex flex-col gap-2">
            {orgsLoading ? (
              <div className="text-center text-slate-400 py-8 font-medium">Loading organizations...</div>
            ) : visibleOrganizations && visibleOrganizations.length > 0 ? (
              visibleOrganizations.slice(0, 4).map(org => (
                <div key={org.id} className="flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 shadow-inner group-hover:scale-105 transition-transform">
                    <Building2 size={22} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-[15px] mb-1">{org.name}</div>
                    <div className="text-sm font-medium text-slate-500">
                      ID: {org.id}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 py-8 font-medium">No organizations created yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
