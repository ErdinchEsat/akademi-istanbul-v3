
import React, { useState } from 'react';
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
  Briefcase,
  LayoutGrid,
  ChevronDown,
  ChevronRight,
  Video,
  FileText,
  MonitorPlay,
  ClipboardList,
  HelpCircle,
  FileCheck2,
  PenTool,
  FileClock
} from 'lucide-react';
import { User, UserRole, ViewState } from '../types';
import clsx from 'clsx';

interface SidebarProps {
  user: User;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, currentView, onNavigate, onLogout }) => {
  const [isEducationMenuOpen, setIsEducationMenuOpen] = useState(true);
  
  const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.TENANT_ADMIN;
  const isInstructor = user.role === UserRole.INSTRUCTOR;

  const isEducationView = [
    ViewState.EDUCATION_EBOOKS,
    ViewState.EDUCATION_VIDEOS,
    ViewState.EDUCATION_LIVE,
    ViewState.EDUCATION_ASSIGNMENTS,
    ViewState.EDUCATION_QUIZZES,
    ViewState.EDUCATION_EXAMS
  ].includes(currentView);

  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col h-full shrink-0 transition-all duration-300 border-r border-slate-800 z-30 hidden md:flex shadow-2xl">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm justify-between">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => onNavigate(ViewState.ACADEMY_SELECTION)}>
          <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
             <h1 className="font-bold text-lg tracking-tight text-white leading-none">Akademi</h1>
             <span className="text-[10px] font-medium text-indigo-300 tracking-widest uppercase">İstanbul</span>
          </div>
        </div>
      </div>

      {/* Return to Platform Button */}
      <div className="px-4 pt-6 pb-2">
        <button 
          onClick={() => onNavigate(ViewState.ACADEMY_SELECTION)}
          className="flex items-center gap-2 w-full px-4 py-3 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-xl transition-all font-medium text-sm group border border-slate-700 hover:border-indigo-500"
        >
           <LayoutGrid className="w-4 h-4 group-hover:rotate-0 transition-transform" />
           <span>Platforma Dön</span>
        </button>
      </div>

      <div className="flex-1 py-4 px-4 space-y-8 overflow-y-auto custom-scrollbar">
        <div>
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Ana Menü</p>
          <div className="space-y-1">
            <NavItem 
              icon={<LayoutDashboard size={20} />} 
              label={isAdmin ? "Yönetim Paneli" : (isInstructor ? "Eğitmen Paneli" : "Eğitim Paneli")} 
              active={currentView === (isAdmin ? ViewState.ADMIN_PANEL : ViewState.DASHBOARD)}
              onClick={() => onNavigate(isAdmin ? ViewState.ADMIN_PANEL : ViewState.DASHBOARD)}
            />
            
            {!isAdmin && (
              <>
                {/* Collapsible Education Menu */}
                <div className="space-y-1">
                  <button
                    onClick={() => setIsEducationMenuOpen(!isEducationMenuOpen)}
                    className={clsx(
                      "flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-200 text-sm font-medium group relative overflow-hidden justify-between",
                      isEducationView ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen size={20} className={isEducationView ? "text-indigo-400" : ""} />
                      <span>{isInstructor ? 'İçerik Yönetimi' : 'Eğitimlerim'}</span>
                    </div>
                    {isEducationMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  {isEducationMenuOpen && (
                    <div className="pl-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                      <SubNavItem 
                        icon={<FileText size={16} />} 
                        label="E-Kitapçık" 
                        active={currentView === ViewState.EDUCATION_EBOOKS}
                        onClick={() => onNavigate(ViewState.EDUCATION_EBOOKS)}
                      />
                      <SubNavItem 
                        icon={<Video size={16} />} 
                        label="Ders Videoları" 
                        active={currentView === ViewState.EDUCATION_VIDEOS}
                        onClick={() => onNavigate(ViewState.EDUCATION_VIDEOS)}
                      />
                      <SubNavItem 
                        icon={<MonitorPlay size={16} />} 
                        label="Canlı Dersler" 
                        active={currentView === ViewState.EDUCATION_LIVE}
                        onClick={() => onNavigate(ViewState.EDUCATION_LIVE)}
                        badge={isInstructor ? undefined : "Canlı"}
                      />
                      <SubNavItem 
                        icon={<ClipboardList size={16} />} 
                        label="Ödevler" 
                        active={currentView === ViewState.EDUCATION_ASSIGNMENTS}
                        onClick={() => onNavigate(ViewState.EDUCATION_ASSIGNMENTS)}
                      />
                      <SubNavItem 
                        icon={<HelpCircle size={16} />} 
                        label="Quizler" 
                        active={currentView === ViewState.EDUCATION_QUIZZES}
                        onClick={() => onNavigate(ViewState.EDUCATION_QUIZZES)}
                      />
                      <SubNavItem 
                        icon={<FileCheck2 size={16} />} 
                        label="Sınavlar" 
                        active={currentView === ViewState.EDUCATION_EXAMS}
                        onClick={() => onNavigate(ViewState.EDUCATION_EXAMS)}
                      />
                    </div>
                  )}
                </div>

                {!isInstructor && (
                  <NavItem 
                    icon={<Award size={20} />} 
                    label="Sertifikalarım" 
                    active={currentView === ViewState.CERTIFICATES}
                    onClick={() => onNavigate(ViewState.CERTIFICATES)}
                  />
                )}
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
                label="Öğrenci Listesi" 
                active={currentView === ViewState.USER_MANAGEMENT}
                onClick={() => onNavigate(ViewState.USER_MANAGEMENT)}
              />
               <NavItem 
                icon={<BarChart3 size={20} />} 
                label="Raporlar & Analitik" 
                active={currentView === ViewState.REPORTS}
                onClick={() => onNavigate(ViewState.REPORTS)}
              />
              {isAdmin && (
                <NavItem 
                  icon={<FileClock size={20} />} 
                  label="Sistem Logları" 
                  active={currentView === ViewState.SYSTEM_LOGS}
                  onClick={() => onNavigate(ViewState.SYSTEM_LOGS)}
                  badge="Yeni"
                />
              )}
            </div>
          </div>
        )}
        
        <div>
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Sistem</p>
          <div className="space-y-1">
             <NavItem 
                icon={<LifeBuoy size={20} />} 
                label="Destek & SSS" 
                active={currentView === ViewState.SUPPORT}
                onClick={() => onNavigate(ViewState.SUPPORT)}
             />
             <NavItem 
                icon={<Settings size={20} />} 
                label="Ayarlar" 
                active={currentView === ViewState.SETTINGS}
                onClick={() => onNavigate(ViewState.SETTINGS)}
             />
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

const NavItem = ({ icon, label, active, onClick, badge }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void, badge?: string }) => (
  <button
    onClick={onClick}
    className={clsx(
      "flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-200 text-sm font-medium group relative overflow-hidden",
      active 
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20" 
        : "text-slate-400 hover:text-white hover:bg-slate-800"
    )}
  >
    {/* Active Glow Effect */}
    {active && <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>}
    
    <span className={clsx("transition-colors relative z-10", active ? "text-white" : "text-slate-500 group-hover:text-white")}>
      {icon}
    </span>
    <span className="flex-1 text-left relative z-10">{label}</span>
    {badge && (
      <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500 text-white rounded-md shadow-sm relative z-10 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
        {badge}
      </span>
    )}
  </button>
);

const SubNavItem = ({ icon, label, active, onClick, badge }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void, badge?: string }) => (
  <button
    onClick={onClick}
    className={clsx(
      "flex items-center gap-3 px-4 py-2.5 w-full rounded-lg transition-all duration-200 text-xs font-medium group relative",
      active 
        ? "text-indigo-400 bg-slate-800/50" 
        : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
    )}
  >
    <div className={clsx("w-1 h-full absolute left-0 top-0 rounded-full transition-all", active ? "bg-indigo-50" : "bg-transparent")}></div>
    <span className={clsx("transition-colors", active ? "text-indigo-400" : "group-hover:text-slate-300")}>
      {icon}
    </span>
    <span className="flex-1 text-left">{label}</span>
    {badge && (
      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-500 text-white rounded shadow-sm animate-pulse">
        {badge}
      </span>
    )}
  </button>
);

export default Sidebar;