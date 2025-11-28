
import React, { Suspense } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import AccessibilityWidget from '../components/ui/AccessibilityWidget';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';

const PageSkeleton = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
    </div>
);

const AuthLayout: React.FC = () => {
    const { user, loading } = useAuth();
    const { currentTenant } = useTenant();

    // Show loading spinner while checking auth
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

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/?login=true" replace />;
    }

    return (
        <div className="flex h-screen bg-gray-50 text-slate-800 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Header user={user} currentTenant={currentTenant} />

                <main className="flex-1 overflow-y-auto scroll-smooth relative">
                    <Suspense fallback={<PageSkeleton />}>
                        <Outlet />
                    </Suspense>
                </main>

                <AccessibilityWidget />
            </div>
        </div>
    );
};

export default AuthLayout;
