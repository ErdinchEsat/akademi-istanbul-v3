
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
  FileClock,
  Menu,
  X,
  ShoppingBag,
  Lightbulb,
  Calendar,
  Search
} from 'lucide-react';
import { User, UserRole } from '@/types';
import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [isEducationMenuOpen, setIsEducationMenuOpen] = useState(true);
  const [isCommerceMenuOpen, setIsCommerceMenuOpen] = useState(false);

  const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.TENANT_ADMIN;
  const isInstructor = user.role === UserRole.INSTRUCTOR;
  const isStudent = user.role === UserRole.STUDENT;

  const isEducationView = currentPath.startsWith('/egitimlerim') || currentPath.startsWith('/studyo-rezervasyon');
  const isCommerceView = ['/sepet', '/faturalar'].includes(currentPath);
  const isCareerView = currentPath.startsWith('/kariyer');

  const menuItems = [
    {
      id: 'dashboard',
      label: isAdmin ? "Yönetim Paneli" : (isInstructor ? "Eğitmen Paneli" : "Eğitim Paneli"),
      icon: LayoutDashboard,
      path: isAdmin ? '/yonetim' : '/dashboard',
      roles: [UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.TENANT_ADMIN]
    },
    {
      id: 'education',
      label: isInstructor ? 'İçerik Yönetimi' : 'Eğitimlerim',
      icon: BookOpen,
      isCollapsible: true,
      isOpen: isEducationMenuOpen,
      toggleOpen: setIsEducationMenuOpen,
      paths: [
        '/egitimlerim/kitaplar',
        '/egitimlerim/videolar',
        '/egitimlerim/canli',
        '/egitimlerim/odevler',
        '/egitimlerim/quizler',
        '/egitimlerim/sinavlar',
      ],
      subItems: [
        { id: 'ebooks', label: 'E-Kitapçık', icon: FileText, path: '/egitimlerim/kitaplar' },
        { id: 'videos', label: 'Ders Videoları', icon: Video, path: '/egitimlerim/videolar' },
        { id: 'live', label: 'Canlı Dersler', icon: MonitorPlay, path: '/egitimlerim/canli', badge: isInstructor ? undefined : "Canlı" },
        { id: 'assignments', label: 'Ödevler', icon: ClipboardList, path: '/egitimlerim/odevler' },
        { id: 'quizzes', label: 'Quizler', icon: HelpCircle, path: '/egitimlerim/quizler' },
        { id: 'exams', label: 'Sınavlar', icon: FileCheck2, path: '/egitimlerim/sinavlar' },
      ],
      roles: [UserRole.STUDENT, UserRole.INSTRUCTOR]
    },
    {
      id: 'studioBooking',
      label: 'Stüdyo Rezervasyon',
      icon: Calendar,
      path: '/studyo-rezervasyon',
      roles: [UserRole.INSTRUCTOR]
    },
    {
      id: 'certificates',
      label: 'Sertifikalarım',
      icon: Award,
      path: '/sertifikalarim',
      roles: [UserRole.STUDENT]
    },
    {
      id: 'careerCenter',
      label: 'Kariyer Merkezi',
      icon: Briefcase,
      path: '/kariyer',
      roles: [UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN]
    },
    {
      id: 'grants',
      label: 'Fırsatlar & Hibeler',
      icon: Lightbulb,
      path: '/kariyer/hibeler',
      roles: [UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN]
    },
    {
      id: 'userManagement',
      label: 'Öğrenci Listesi',
      icon: Users,
      path: '/yonetim/kullanicilar',
      roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.TENANT_ADMIN]
    },
    {
      id: 'reports',
      label: 'Raporlar & Analitik',
      icon: BarChart3,
      path: '/yonetim/raporlar',
      roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.TENANT_ADMIN]
    },
    {
      id: 'systemLogs',
      label: 'Sistem Logları',
      icon: FileClock,
      path: '/yonetim/loglar',
      badge: "Yeni",
      roles: [UserRole.ADMIN, UserRole.TENANT_ADMIN]
    },
    {
      id: 'support',
      label: 'Destek & SSS',
      icon: LifeBuoy,
      path: '/destek',
      roles: [UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.TENANT_ADMIN]
    },
    {
      id: 'settings',
      label: 'Ayarlar',
      icon: Settings,
      path: '/ayarlar',
      roles: [UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.TENANT_ADMIN]
    }
  ];

  const careerMenuItems = [
    {
      id: 'career-home',
      label: 'Kariyer Merkezi',
      icon: Briefcase,
      path: '/kariyer',
    },
    {
      id: 'grants',
      label: 'Fırsatlar & Hibeler',
      icon: Lightbulb,
      path: '/kariyer/hibeler',
    },
    {
      id: 'jobs',
      label: 'İş İlanları',
      icon: Search,
      path: '/kariyer/is-ilanlari',
    },
    {
      id: 'cv-portfolio',
      label: 'CV & Portfolyo',
      icon: FileText,
      path: '/kariyer/cv-portfolyo',
      badge: 'Yakında'
    }
  ];

  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col h-full shrink-0 transition-all duration-300 border-r border-slate-800 z-30 hidden md:flex shadow-2xl">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm justify-between">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/akademi-secimi')}>
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
          onClick={() => navigate('/akademi-secimi')}
          className="flex items-center gap-2 w-full px-4 py-3 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-xl transition-all font-medium text-sm group border border-slate-700 hover:border-indigo-500"
        >
          <LayoutGrid className="w-4 h-4 group-hover:rotate-0 transition-transform" />
          <span>Platforma Dön</span>
        </button>
      </div>

      <div className="flex-1 py-4 px-4 space-y-8 overflow-y-auto custom-scrollbar">
        {isCareerView ? (
          // Career Mode Sidebar
          <div>
            <div className="mb-6 px-2">
              <div className="bg-indigo-500/10 text-indigo-400 p-3 rounded-xl border border-indigo-500/20">
                <h3 className="font-bold text-sm mb-1">Kariyer Modu</h3>
                <p className="text-[10px] text-indigo-300/80">Kariyer hedeflerinize odaklanın.</p>
              </div>
            </div>

            <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Kariyer Menüsü</p>
            <div className="space-y-1">
              {careerMenuItems.map((item) => (
                <NavItem
                  key={item.id}
                  icon={<item.icon size={20} />}
                  label={item.label}
                  active={currentPath === item.path}
                  onClick={() => navigate(item.path)}
                  badge={item.badge}
                />
              ))}
            </div>
          </div>
        ) : (
          // Standard Sidebar
          <>
            <div>
              <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Ana Menü</p>
              <div className="space-y-1">
                <NavItem
                  icon={<LayoutDashboard size={20} />}
                  label={isAdmin ? "Yönetim Paneli" : (isInstructor ? "Eğitmen Paneli" : "Eğitim Paneli")}
                  active={currentPath === (isAdmin ? '/yonetim' : '/dashboard')}
                  onClick={() => navigate(isAdmin ? '/yonetim' : '/dashboard')}
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
                          {menuItems.find(i => i.id === 'education')?.subItems?.map(sub => (
                            <SubNavItem
                              key={sub.id}
                              icon={<sub.icon size={16} />}
                              label={sub.label}
                              active={currentPath === sub.path}
                              onClick={() => navigate(sub.path)}
                              badge={sub.badge}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {isInstructor && (
                      <NavItem
                        icon={<Calendar size={20} />}
                        label="Stüdyo Rezervasyon"
                        active={currentPath === '/studyo-rezervasyon'}
                        onClick={() => navigate('/studyo-rezervasyon')}
                      />
                    )}

                    {!isInstructor && (
                      <NavItem
                        icon={<Award size={20} />}
                        label="Sertifikalarım"
                        active={currentPath === '/sertifikalarim'}
                        onClick={() => navigate('/sertifikalarim')}
                      />
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Commerce Section */}
            <div>
              <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Mağaza</p>
              <div className="space-y-1">
                <button
                  onClick={() => setIsCommerceMenuOpen(!isCommerceMenuOpen)}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-200 text-sm font-medium group relative overflow-hidden justify-between",
                    isCommerceView ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={20} className={isCommerceView ? "text-indigo-400" : ""} />
                    <span>Mağaza & Ödeme</span>
                  </div>
                  {isCommerceMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {isCommerceMenuOpen && (
                  <div className="pl-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    <SubNavItem
                      icon={<ShoppingBag size={16} />}
                      label="Sepetim"
                      active={currentPath === '/sepet'}
                      onClick={() => navigate('/sepet')}
                    />
                    <SubNavItem
                      icon={<FileText size={16} />}
                      label="Faturalar"
                      active={currentPath === '/faturalar'}
                      onClick={() => navigate('/faturalar')}
                    />
                  </div>
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
                    active={currentPath === '/yonetim/kullanicilar'}
                    onClick={() => navigate('/yonetim/kullanicilar')}
                  />
                  <NavItem
                    icon={<BarChart3 size={20} />}
                    label="Raporlar & Analitik"
                    active={currentPath === '/yonetim/raporlar'}
                    onClick={() => navigate('/yonetim/raporlar')}
                  />
                  {isAdmin && (
                    <NavItem
                      icon={<FileClock size={20} />}
                      label="Sistem Logları"
                      active={currentPath === '/yonetim/loglar'}
                      onClick={() => navigate('/yonetim/loglar')}
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
                  active={currentPath === '/destek'}
                  onClick={() => navigate('/destek')}
                />
                <NavItem
                  icon={<Settings size={20} />}
                  label="Ayarlar"
                  active={currentPath === '/ayarlar'}
                  onClick={() => navigate('/ayarlar')}
                />
              </div>
            </div>
          </>
        )}
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

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick, badge }) => (
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

const SubNavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick, badge }) => (
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