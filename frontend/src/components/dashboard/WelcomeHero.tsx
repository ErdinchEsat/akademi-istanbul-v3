import React, { useState } from 'react';
import { Zap, Ticket } from 'lucide-react';
import clsx from 'clsx';
import { User, Tenant } from '../../types/auth';
import { Course } from '../../types/course';

interface WelcomeHeroProps {
    user: User;
    currentTenant?: Tenant;
    myCoursesCount: number;
}

const WelcomeHero: React.FC<WelcomeHeroProps> = ({ user, currentTenant, myCoursesCount }) => {
    const [activationCode, setActivationCode] = useState('');

    const getGradient = () => {
        if (!currentTenant) return 'bg-gradient-to-r from-indigo-900 to-blue-800';
        if (currentTenant.color === 'emerald') return 'bg-gradient-to-r from-emerald-800 to-teal-600';
        if (currentTenant.color === 'blue') return 'bg-gradient-to-r from-blue-800 to-cyan-600';
        if (currentTenant.color === 'violet') return 'bg-gradient-to-r from-violet-800 to-purple-600';
        return 'bg-gradient-to-r from-slate-800 to-slate-600';
    };

    return (
        <div className={clsx(
            "rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 transition-all duration-500",
            getGradient()
        )}>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/4"></div>

            <div className="relative z-10 space-y-4 max-w-2xl">
                <div className="flex items-center gap-4">
                    {currentTenant ? (
                        <div className="p-1 bg-white/20 backdrop-blur-sm rounded-xl">
                            <img src={currentTenant.logo} className="w-12 h-12 rounded-lg object-cover" alt="logo" />
                        </div>
                    ) : (
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                            <Zap className="w-8 h-8 text-yellow-300" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Merhaba, {user.name.split(' ')[0]}! 👋</h1>
                        <p className="text-indigo-100 text-sm font-medium opacity-90">
                            {currentTenant ? `${currentTenant.name} Öğrenim Platformu` : 'Akademi İstanbul'}
                        </p>
                    </div>
                </div>
                <p className="text-lg text-white/90 leading-relaxed">
                    {currentTenant
                        ? `Kurumunuzun size özel atadığı ${myCoursesCount} yeni eğitim modülü bulunuyor. Başarılar dileriz.`
                        : 'Bugün kendinize ne katmak istersiniz? İlerlemenizi sürdürün.'}
                </p>
            </div>

            {/* Activation Code Box */}
            <div className="relative z-10 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 flex flex-col gap-3 w-full md:w-80 shadow-lg">
                <div className="flex items-center gap-2 text-white/90">
                    <Ticket className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Aktivasyon Kodu</span>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Kodu giriniz..."
                        className="bg-black/20 border border-white/10 placeholder-white/40 text-white text-sm rounded-xl px-4 py-2.5 focus:bg-black/30 focus:ring-1 focus:ring-white/50 focus:border-white/50 w-full transition-all"
                        value={activationCode}
                        onChange={(e) => setActivationCode(e.target.value)}
                    />
                    <button className="bg-white text-slate-900 text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-indigo-50 hover:scale-105 transition-all shadow-md">
                        Ekle
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomeHero;
