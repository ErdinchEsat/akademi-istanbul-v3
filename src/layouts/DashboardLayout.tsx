import React, { ReactNode } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';
import { ViewState } from '@/types';

interface DashboardLayoutProps {
    children: ReactNode;
    currentView: ViewState;
    onNavigate: (view: ViewState, courseId?: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, currentView, onNavigate }) => {
    const { user, logout } = useAuth();
    const { currentTenant } = useTenant();

    if (!user) return null;

    return (
        <div className="flex h-screen bg-gray-50 text-slate-800 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Sidebar
                user={user}
                currentView={currentView}
                onNavigate={onNavigate}
                onLogout={logout}
            />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Header user={user} currentTenant={currentTenant} />

                <main className="flex-1 overflow-y-auto scroll-smooth relative">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
