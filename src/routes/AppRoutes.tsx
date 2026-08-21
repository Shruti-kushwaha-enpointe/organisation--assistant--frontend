
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

import ProtectedRoute from './ProtectedRoute';
import RoleProtectedRoute from './RoleProtectedRoute';

// Pages
import Login from '../pages/Login/Login';
import Signup from '../pages/Signup/Signup';
import Dashboard from '../pages/Dashboard/Dashboard';
import Organizations from '../pages/Organizations/Organizations';
import CreateOrganization from '../pages/Organizations/CreateOrganization';

import Documents from '../pages/Documents/Documents';
import UploadDocuments from '../pages/Documents/UploadDocuments';
import Chat from '../pages/Chat/Chat';
import NotFound from '../pages/NotFound/NotFound';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Main App Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/chat" element={<Chat />} />
            
            {/* Superadmin Only Routes */}
            <Route element={<RoleProtectedRoute allowedRoles={['superadmin']} />}>
              <Route path="/organizations/new" element={<CreateOrganization />} />
              <Route path="/documents/upload" element={<UploadDocuments />} />
            </Route>
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
