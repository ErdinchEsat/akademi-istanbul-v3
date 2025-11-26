
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import AccessibilityWidget from '../components/ui/AccessibilityWidget';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';

const DashboardLayout: React.FC = () => {
    const { user, logout, loading } = useAuth();
    const { currentTenant } = useTenant();
    const location = useLocation();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        navigate('/');
        return null;
    }

    return (
        <div className="flex h-screen bg-gray-50 text-slate-800 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Sidebar
                user={user}
                onLogout={logout}
            />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Header user={user} currentTenant={currentTenant} />

                <main className="flex-1 overflow-y-auto scroll-smooth relative">
                    <Outlet />
                </main>

                <AccessibilityWidget />
            </div>
        </div>
    );
};

export default DashboardLayout;
