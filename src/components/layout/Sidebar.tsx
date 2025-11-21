import React from 'react';
import {
    LayoutDashboard,
    BookOpen,
    Award,
    Settings,
    LogOut,
    Users,
    BarChart3,
    GraduationCap,
    LifeBuoy,
    Briefcase
} from 'lucide-react';
import { User, UserRole } from '../../types/auth';
import { ViewState } from '../../types/ui';
import NavItem from './NavItem';

interface SidebarProps {
    user: User;
    currentView: ViewState;
    onNavigate: (view: ViewState) => void;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, currentView, onNavigate, onLogout }) => {

    const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.TENANT_ADMIN;
    const isInstructor = user.role === UserRole.INSTRUCTOR;

    return (
        <aside className="w-72 bg-slate-900 text-white flex flex-col h-full shrink-0 transition-all duration-300 border-r border-slate-800 z-30 hidden md:flex shadow-2xl">
            <div className="h-20 flex items-center px-6 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight text-white leading-none">Akademi</h1>
                        <span className="text-[10px] font-medium text-indigo-300 tracking-widest uppercase">İstanbul</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 py-8 px-4 space-y-8 overflow-y-auto custom-scrollbar">
                <div>
                    <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Ana Menü</p>
                    <div className="space-y-1">
                        <NavItem
                            icon={<LayoutDashboard size={20} />}
                            label={isAdmin ? "Yönetim Paneli" : "Öğrenci Paneli"}
                            active={currentView === (isAdmin ? ViewState.ADMIN_PANEL : ViewState.DASHBOARD)}
                            onClick={() => onNavigate(isAdmin ? ViewState.ADMIN_PANEL : ViewState.DASHBOARD)}
                        />
                        {!isAdmin && (
                            <>
                                <NavItem
                                    icon={<BookOpen size={20} />}
                                    label="Kurslarım & Katalog"
                                    active={currentView === ViewState.CATALOG}
                                    onClick={() => onNavigate(ViewState.CATALOG)}
                                />
                                <NavItem
                                    icon={<Briefcase size={20} />}
                                    label="Kariyer Merkezi"
                                    active={currentView === ViewState.CAREER_CENTER}
                                    onClick={() => onNavigate(ViewState.CAREER_CENTER)}
                                    badge="Yeni"
                                />
                                <NavItem
                                    icon={<Award size={20} />}
                                    label="Sertifikalarım"
                                    active={currentView === ViewState.CERTIFICATES}
                                    onClick={() => onNavigate(ViewState.CERTIFICATES)}
                                />
                            </>
                        )}
                    </div>
                </div>

                {(isAdmin || isInstructor) && (
                    <div>
                        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Yönetim</p>
                        <div className="space-y-1">
                            <NavItem
                                icon={<Users size={20} />}
                                label="Kullanıcı Yönetimi"
                                active={false}
                            />
                            <NavItem
                                icon={<BarChart3 size={20} />}
                                label="Raporlar & Analitik"
                                active={false}
                            />
                        </div>
                    </div>
                )}

                <div>
                    <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Sistem</p>
                    <div className="space-y-1">
                        <NavItem icon={<LifeBuoy size={20} />} label="Destek & SSS" />
                        <NavItem icon={<Settings size={20} />} label="Ayarlar" />
                    </div>
                </div>
            </div>

            {/* User Mini Profile in Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/30">
                <div className="flex items-center gap-3 mb-4 px-2 p-2 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer group">
                    <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-slate-700 group-hover:border-indigo-500 transition-colors" alt="avatar" />
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate text-white group-hover:text-indigo-300 transition-colors">{user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate font-medium">{user.role}</p>
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 w-full text-slate-400 hover:text-white hover:bg-red-600/20 hover:border-red-600/30 border border-transparent rounded-xl transition-all text-xs font-bold"
                >
                    <LogOut size={16} />
                    <span>Oturumu Kapat</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
