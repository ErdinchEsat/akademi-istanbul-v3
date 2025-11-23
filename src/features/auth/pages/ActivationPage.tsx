import React, { useState } from 'react';
import ActivationCodeInput from '../components/ActivationCodeInput';
import { Building2, GraduationCap } from 'lucide-react';
import AuthModal from '../components/AuthModal';
import { UserRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const ActivationPage: React.FC = () => {
    const { login } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [activatedTenant, setActivatedTenant] = useState<string | null>(null);

    const handleActivationSuccess = (tenantId: string) => {
        setActivatedTenant(tenantId);
        setShowAuthModal(true);
    };

    const handleLogin = async (role: UserRole) => {
        // Gerçek senaryoda burada tenantId ile kayıt/giriş işlemi yapılır
        await login(role); // Mock login
        // App.tsx handles redirection based on auth state
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 z-0"></div>
            <div className="absolute top-0 right-0 w-1/2 h-96 bg-indigo-600/20 blur-3xl rounded-full translate-x-1/3 -translate-y-1/2"></div>

            {/* Header */}
            <header className="relative z-10 px-6 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/20">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-lg leading-none">Akademi</h1>
                        <span className="text-indigo-300 text-xs font-medium tracking-widest uppercase">İstanbul</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4 relative z-10 -mt-20">
                <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8 md:p-12 w-full max-w-2xl border border-slate-100">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                            <Building2 className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">Hesabınızı Etkinleştirin</h2>
                        <p className="text-slate-500 text-lg max-w-md mx-auto">
                            Size verilen aktivasyon kodunu girerek kurumunuzun eğitim platformuna anında erişim sağlayın.
                        </p>
                    </div>

                    <ActivationCodeInput onSuccess={handleActivationSuccess} />
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center text-slate-400 text-sm relative z-10">
                &copy; 2024 İstanbul Büyükşehir Belediyesi. Tüm hakları saklıdır.
            </footer>

            {/* Auth Modal Triggered after Code Validation */}
            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    onLogin={handleLogin}
                />
            )}
        </div>
    );
};

export default ActivationPage;
