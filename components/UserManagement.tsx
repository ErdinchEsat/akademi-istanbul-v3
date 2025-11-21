
import React, { useState } from 'react';
import { Search, MoreVertical, Filter, Mail, Shield, CheckCircle, XCircle, FileText, BarChart2 } from 'lucide-react';

interface UserManagementProps {
  onStudentSelect?: (id: number | string) => void;
}

const MOCK_STUDENTS = [
  { id: 1, name: 'Ali Yılmaz', email: 'ali.yilmaz@student.com', course: 'YKS Matematik', progress: 75, status: 'Active', lastLogin: '2 saat önce' },
  { id: 2, name: 'Ayşe Demir', email: 'ayse.demir@example.com', course: 'React & Next.js', progress: 12, status: 'Active', lastLogin: '1 gün önce' },
  { id: 3, name: 'Mehmet Kaya', email: 'mehmet.k@example.com', course: 'Dijital Pazarlama', progress: 45, status: 'Inactive', lastLogin: '2 hafta önce' },
  { id: 4, name: 'Zeynep Çelik', email: 'zeynep.c@example.com', course: 'İngilizce A1', progress: 90, status: 'Active', lastLogin: '30 dk önce' },
  { id: 5, name: 'Can Öztürk', email: 'can.oz@example.com', course: 'YKS Matematik', progress: 100, status: 'Active', lastLogin: '5 saat önce' },
  { id: 6, name: 'Elif Su', email: 'elif.su@example.com', course: 'React & Next.js', progress: 0, status: 'Inactive', lastLogin: '1 ay önce' },
];

const UserManagement: React.FC<UserManagementProps> = ({ onStudentSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive'>('All');

  const filteredUsers = MOCK_STUDENTS.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kullanıcı Yönetimi</h1>
          <p className="text-slate-500 mt-1">Öğrencilerinizi, kayıt durumlarını ve erişim yetkilerini yönetin.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
          + Yeni Kullanıcı Ekle
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
           <input 
             type="text" 
             placeholder="İsim, e-posta veya kurs ara..." 
             className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex gap-2">
           <select 
             className="bg-gray-50 border border-gray-200 text-slate-700 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
             value={filterStatus}
             onChange={(e) => setFilterStatus(e.target.value as any)}
           >
             <option value="All">Tüm Durumlar</option>
             <option value="Active">Aktif</option>
             <option value="Inactive">Pasif</option>
           </select>
           <button className="p-2.5 text-slate-500 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100">
             <Filter className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-slate-500 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Öğrenci Bilgisi</th>
                <th className="px-6 py-4">Kayıtlı Kurs</th>
                <th className="px-6 py-4">İlerleme</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4">Son Giriş</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                           {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                           <div className="font-bold text-slate-900">{user.name}</div>
                           <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2 text-slate-700">
                        <FileText className="w-4 h-4 text-gray-400" />
                        {user.course}
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="w-24">
                        <div className="flex justify-between text-xs mb-1 font-medium text-slate-600">
                           <span>%{user.progress}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                           <div 
                             className={`h-full rounded-full ${user.progress === 100 ? 'bg-green-500' : 'bg-indigo-500'}`} 
                             style={{width: `${user.progress}%`}}
                           ></div>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.status === 'Active' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                        <CheckCircle className="w-3 h-3" /> Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                        <XCircle className="w-3 h-3" /> Pasif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onStudentSelect && onStudentSelect(user.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors border border-indigo-100"
                        >
                            <BarChart2 className="w-3 h-3" /> Analiz
                        </button>
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors" title="Mesaj Gönder">
                                <Mail className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors" title="Yetkileri Düzenle">
                                <Shield className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                       </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
             <div className="p-8 text-center text-gray-500">
                Arama kriterlerine uygun öğrenci bulunamadı.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
