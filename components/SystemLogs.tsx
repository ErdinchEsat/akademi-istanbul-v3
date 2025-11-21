
import React, { useState } from 'react';
import { Search, Filter, Activity, User, PlusCircle, Trash2, Edit, LogIn, AlertCircle, CheckCircle, Clock, Download, Shield, School, BookOpen, Building2, Globe } from 'lucide-react';
import { UserRole } from '../types';
import { MOCK_TENANTS } from '../constants';
import clsx from 'clsx';

interface SystemLogsProps {
  userRole?: UserRole;
  userTenantId?: string;
}

interface LogEntry {
  id: string;
  user: string;
  role: 'Admin' | 'Instructor' | 'Student' | 'Super Admin';
  actionType: 'Create' | 'Update' | 'Delete' | 'Login' | 'Error' | 'Complete';
  description: string;
  target: string;
  timestamp: string;
  ip: string;
  tenantId: string; // Which academy does this log belong to?
}

// Enhanced Mock Logs with Tenant IDs
const MOCK_LOGS: LogEntry[] = [
  { id: 'L001', user: 'Süper Admin', role: 'Super Admin', actionType: 'Update', description: 'Platform genel ayarları güncellendi', target: 'Sistem', timestamp: 'Şimdi', ip: '192.168.1.1', tenantId: 'global' },
  { id: 'L002', user: 'Mehmet Hoca', role: 'Instructor', actionType: 'Create', description: 'Yeni ders videosu eklendi', target: 'Unity 101', timestamp: '5 dk önce', ip: '176.24.12.55', tenantId: 'tech' }, // Tech Academy
  { id: 'L003', user: 'Ali Yılmaz', role: 'Student', actionType: 'Complete', description: 'Quiz tamamlandı', target: 'React Temelleri', timestamp: '12 dk önce', ip: '88.12.43.12', tenantId: 'tech' },
  { id: 'L004', user: 'Zeynep Demir', role: 'Instructor', actionType: 'Create', description: 'Yeni sınav oluşturuldu', target: 'C# Vize Sınavı', timestamp: '25 dk önce', ip: '176.24.12.90', tenantId: 'tech' },
  { id: 'L005', user: 'Can Öztürk', role: 'Student', actionType: 'Login', description: 'Sisteme giriş yapıldı', target: 'Oturum', timestamp: '40 dk önce', ip: '92.11.33.21', tenantId: 'umraniye' }, // Umraniye
  { id: 'L006', user: 'Selin Y.', role: 'Student', actionType: 'Error', description: 'Başarısız giriş denemesi', target: 'Oturum', timestamp: '1 saat önce', ip: '145.22.11.99', tenantId: 'ibb' }, // IBB
  { id: 'L007', user: 'Ayşe Yönetici', role: 'Admin', actionType: 'Delete', description: 'Eski duyuru silindi', target: 'Duyurular', timestamp: '2 saat önce', ip: '192.168.1.1', tenantId: 'umraniye' },
  { id: 'L008', user: 'Mehmet Hoca', role: 'Instructor', actionType: 'Update', description: 'Ders içeriği düzenlendi', target: 'Oyun Tasarımı', timestamp: '3 saat önce', ip: '176.24.12.55', tenantId: 'tech' },
  { id: 'L009', user: 'Burak Ö.', role: 'Student', actionType: 'Complete', description: 'Modül tamamlandı', target: 'SEO Giriş', timestamp: '4 saat önce', ip: '77.12.55.11', tenantId: 'ibb' },
  { id: 'L010', user: 'Ahmet Y.', role: 'Admin', actionType: 'Create', description: 'Yeni kullanıcı eklendi', target: 'Kullanıcılar', timestamp: '5 saat önce', ip: '192.168.1.1', tenantId: 'ibb' },
];

const SystemLogs: React.FC<SystemLogsProps> = ({ userRole, userTenantId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'All' | 'Admin' | 'Instructor' | 'Student'>('All');
  // Only used if Super Admin
  const [selectedTenantFilter, setSelectedTenantFilter] = useState<string>('All');

  const isSuperAdmin = userRole === UserRole.ADMIN;

  const filteredLogs = MOCK_LOGS.filter(log => {
    // 1. Search Filter
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.target.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Role Filter
    const matchesRole = selectedRole === 'All' || log.role === selectedRole || (selectedRole === 'Admin' && log.role === 'Super Admin');

    // 3. Tenant Filter (Critical Logic)
    let matchesTenant = false;
    if (isSuperAdmin) {
        // Super Admin can see everything, or filter by specific tenant
        matchesTenant = selectedTenantFilter === 'All' || log.tenantId === selectedTenantFilter;
    } else {
        // Tenant Admin can ONLY see their own tenant's logs
        matchesTenant = log.tenantId === userTenantId;
    }

    return matchesSearch && matchesRole && matchesTenant;
  });

  const getActionIcon = (type: string) => {
    switch(type) {
      case 'Create': return <PlusCircle className="w-4 h-4 text-green-600" />;
      case 'Update': return <Edit className="w-4 h-4 text-blue-600" />;
      case 'Delete': return <Trash2 className="w-4 h-4 text-red-600" />;
      case 'Login': return <LogIn className="w-4 h-4 text-purple-600" />;
      case 'Error': return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'Complete': return <CheckCircle className="w-4 h-4 text-teal-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = (type: string) => {
    switch(type) {
      case 'Create': return 'bg-green-50 border-green-100 text-green-700';
      case 'Update': return 'bg-blue-50 border-blue-100 text-blue-700';
      case 'Delete': return 'bg-red-50 border-red-100 text-red-700';
      case 'Login': return 'bg-purple-50 border-purple-100 text-purple-700';
      case 'Error': return 'bg-orange-50 border-orange-100 text-orange-700';
      case 'Complete': return 'bg-teal-50 border-teal-100 text-teal-700';
      default: return 'bg-gray-50 border-gray-100 text-gray-700';
    }
  };

  const getTenantName = (id: string) => {
    if (id === 'global') return 'Platform Geneli';
    const tenant = MOCK_TENANTS.find(t => t.id === id);
    return tenant ? tenant.name : id;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-slate-900 rounded-xl text-white shadow-lg">
              <Activity className="w-8 h-8" />
           </div>
           <div>
              <h1 className="text-2xl font-bold text-slate-900">
                 {isSuperAdmin ? 'Platform Logları (Super Admin)' : 'Akademi Kayıtları'}
              </h1>
              <p className="text-slate-500 text-sm">
                 {isSuperAdmin 
                    ? 'Tüm akademilerin ve sistemin hareket dökümü.' 
                    : 'Akademinizdeki öğrenci ve eğitmen aktiviteleri.'}
              </p>
           </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-slate-600 rounded-lg font-bold hover:bg-gray-50 hover:text-slate-800 transition-colors shadow-sm">
           <Download className="w-4 h-4" /> Rapor İndir
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-center sticky top-4 z-20">
         
         <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Role Filter */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                {['All', 'Admin', 'Instructor', 'Student'].map((role) => (
                <button
                    key={role}
                    onClick={() => setSelectedRole(role as any)}
                    className={clsx(
                        "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                        selectedRole === role ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    {role === 'All' && <Activity size={14} />}
                    {role === 'Admin' && <Shield size={14} />}
                    {role === 'Instructor' && <School size={14} />}
                    {role === 'Student' && <BookOpen size={14} />}
                    
                    {role === 'All' ? 'Tümü' : role === 'Admin' ? 'Yöneticiler' : role === 'Instructor' ? 'Eğitmenler' : 'Öğrenciler'}
                </button>
                ))}
            </div>

            {/* Academy Filter (SUPER ADMIN ONLY) */}
            {isSuperAdmin && (
                <div className="relative min-w-[200px]">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                        <Building2 size={14} />
                    </div>
                    <select 
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer hover:bg-white transition-colors"
                        value={selectedTenantFilter}
                        onChange={(e) => setSelectedTenantFilter(e.target.value)}
                    >
                        <option value="All">Tüm Akademiler</option>
                        <option value="global">Platform Geneli (Sistem)</option>
                        <option disabled>──────────</option>
                        {MOCK_TENANTS.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>
            )}
         </div>

         {/* Search Bar */}
         <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Kullanıcı, işlem veya hedef ara..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-slate-200 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-gray-50 text-slate-500 font-semibold uppercase tracking-wider text-xs">
                  <tr>
                     <th className="px-6 py-4">Zaman</th>
                     {/* Show Tenant Column only if Super Admin watching All */}
                     {isSuperAdmin && selectedTenantFilter === 'All' && (
                        <th className="px-6 py-4">Akademi / Kaynak</th>
                     )}
                     <th className="px-6 py-4">Kullanıcı</th>
                     <th className="px-6 py-4">İşlem Türü</th>
                     <th className="px-6 py-4">Açıklama</th>
                     <th className="px-6 py-4">Hedef</th>
                     <th className="px-6 py-4">IP Adresi</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {filteredLogs.map((log) => (
                     <tr key={log.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap font-mono text-xs">
                           <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3" /> {log.timestamp}
                           </div>
                        </td>
                        
                        {isSuperAdmin && selectedTenantFilter === 'All' && (
                            <td className="px-6 py-4">
                                <span className={clsx(
                                    "text-[10px] font-bold px-2 py-1 rounded border",
                                    log.tenantId === 'global' ? "bg-slate-800 text-white border-slate-700" :
                                    log.tenantId === 'ibb' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                    log.tenantId === 'umraniye' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                    "bg-purple-50 text-purple-700 border-purple-200"
                                )}>
                                    {getTenantName(log.tenantId)}
                                </span>
                            </td>
                        )}

                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className={clsx(
                                 "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs",
                                 log.role === 'Super Admin' ? "bg-slate-900 text-white ring-2 ring-indigo-500" : 
                                 log.role === 'Admin' ? "bg-indigo-600 text-white" : 
                                 log.role === 'Instructor' ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"
                              )}>
                                 {log.role === 'Super Admin' ? <Globe size={14} /> : log.user.charAt(0)}
                              </div>
                              <div>
                                 <div className="font-bold text-slate-900">{log.user}</div>
                                 <div className="text-[10px] text-slate-500 uppercase tracking-wide font-bold">{log.role}</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border", getActionColor(log.actionType))}>
                              {getActionIcon(log.actionType)}
                              {log.actionType}
                           </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700">
                           {log.description}
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                           <span className="bg-gray-100 border border-gray-200 rounded px-2 py-0.5">
                             {log.target}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-xs font-mono">
                           {log.ip}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
            {filteredLogs.length === 0 && (
               <div className="p-12 text-center text-gray-400">
                  <Filter className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Kriterlere uygun kayıt bulunamadı.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default SystemLogs;
