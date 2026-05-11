import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Patients from './pages/Patients';
import AddPatient from './pages/AddPatient';
import PatientProfile from './pages/PatientProfile';
import Appointments from './pages/Appointments';
import BookAppointment from './pages/BookAppointment';
import Staff from './pages/Staff';
import AddStaff from './pages/AddStaff';
import Emr from './pages/Emr';
import Billing from './pages/Billing';
import CreateInvoice from './pages/CreateInvoice';
import Insurance from './pages/Insurance';
import Inventory from './pages/Inventory';
import AddInventory from './pages/AddInventory';
import Lab from './pages/Lab';
import Analytics from './pages/Analytics';
import AiInsights from './pages/AiInsights';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Queue from './pages/Queue';
import DischargeSummary from './pages/DischargeSummary';

// Role-Based Route Wrapper
const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen bg-slate-50">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p className="text-gray-500 font-medium">Verifying sessions...</p>
    </div>
  </div>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Redirect unauthorized to home
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<RoleRoute><Layout /></RoleRoute>}>
            <Route path="/" element={<Dashboard />} />

            {/* Clinical Routes */}
            <Route path="/patients" element={<RoleRoute allowedRoles={['admin', 'doctor', 'nurse', 'receptionist', 'executive']}><Patients /></RoleRoute>} />
            <Route path="/patients/add" element={<RoleRoute allowedRoles={['admin', 'receptionist', 'executive']}><AddPatient /></RoleRoute>} />
            <Route path="/patients/:id" element={<RoleRoute allowedRoles={['admin', 'doctor', 'nurse', 'executive']}><PatientProfile /></RoleRoute>} />

            <Route path="/appointments" element={<RoleRoute allowedRoles={['admin', 'doctor', 'nurse', 'receptionist', 'executive']}><Appointments /></RoleRoute>} />
            <Route path="/appointments/new" element={<RoleRoute allowedRoles={['admin', 'receptionist', 'executive']}><BookAppointment /></RoleRoute>} />

            <Route path="/emr" element={<RoleRoute allowedRoles={['admin', 'doctor', 'nurse', 'executive']}><Emr /></RoleRoute>} />
            <Route path="/lab" element={<RoleRoute allowedRoles={['admin', 'doctor', 'nurse', 'executive']}><Lab /></RoleRoute>} />
            <Route path="/ai-insights" element={<RoleRoute allowedRoles={['admin', 'doctor', 'executive']}><AiInsights /></RoleRoute>} />

            {/* Financial/Admin Routes */}
            <Route path="/staff" element={<RoleRoute allowedRoles={['admin', 'receptionist', 'executive']}><Staff /></RoleRoute>} />
            <Route path="/staff/new" element={<RoleRoute allowedRoles={['admin', 'executive']}><AddStaff /></RoleRoute>} />

            <Route path="/billing" element={<RoleRoute allowedRoles={['admin', 'billing', 'executive']}><Billing /></RoleRoute>} />
            <Route path="/billing/new" element={<RoleRoute allowedRoles={['admin', 'billing', 'executive']}><CreateInvoice /></RoleRoute>} />
            <Route path="/insurance" element={<RoleRoute allowedRoles={['admin', 'billing', 'executive']}><Insurance /></RoleRoute>} />
            <Route path="/inventory" element={<RoleRoute allowedRoles={['admin', 'billing', 'executive']}><Inventory /></RoleRoute>} />
            <Route path="/inventory/new" element={<RoleRoute allowedRoles={['admin', 'billing', 'executive']}><AddInventory /></RoleRoute>} />

            <Route path="/analytics" element={<RoleRoute allowedRoles={['admin', 'doctor', 'billing', 'executive']}><Analytics /></RoleRoute>} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/discharge/:id" element={<RoleRoute allowedRoles={['admin', 'doctor', 'executive']}><DischargeSummary /></RoleRoute>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
