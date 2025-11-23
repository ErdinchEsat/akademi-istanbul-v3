
import React from 'react';
import { Users, BookOpen, Award, TrendingUp, MoreVertical, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardAdminProps {
  isInstructor?: boolean;
}

const data = [
  { name: 'Oca', students: 400, active: 240 },
  { name: 'Şub', students: 600, active: 380 },
  { name: 'Mar', students: 900, active: 600 },
  { name: 'Nis', students: 1200, active: 950 },
  { name: 'May', students: 1500, active: 1100 },
  { name: 'Haz', students: 2000, active: 1600 },
];

const DashboardAdmin: React.FC<DashboardAdminProps> = ({ isInstructor = false }) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{isInstructor ? 'Eğitmen Paneli' : 'Yönetim Paneli'}</h1>
          <p className="text-slate-500">{isInstructor ? 'Kurslarınızı ve öğrencilerinizi yönetin.' : 'Akademi genel durumu ve istatistikler.'}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
            <Filter className="w-4 h-4" /> Filtrele
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">
            Rapor İndir
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard icon={<Users />} label="Toplam Öğrenci" value="2,543" trend="+12%" color="blue" />
        <KpiCard icon={<BookOpen />} label="Aktif Kurs" value={isInstructor ? "8" : "142"} trend="+4" color="emerald" />
        <KpiCard icon={<Award />} label="Verilen Sertifika" value="856" trend="+28%" color="violet" />
        <KpiCard icon={<TrendingUp />} label="Tamamlama Oranı" value="%68" trend="+5%" color="orange" />
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-6">Öğrenci Katılım Grafiği</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip 
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
              />
              <Line type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table Simulation */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-slate-800">Son Kayıt Olan Öğrenciler</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Öğrenci Adı</th>
                <th className="px-6 py-4">Kayıtlı Kurs</th>
                <th className="px-6 py-4">İlerleme</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">Öğrenci Adı {i}</td>
                  <td className="px-6 py-4 text-slate-600">YKS Matematik Hazırlık</td>
                  <td className="px-6 py-4">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{width: `${Math.random() * 100}%`}}></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Aktif
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ icon, label, value, trend, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
      <span className="text-xs font-medium text-green-600 flex items-center mt-2">
        {trend} <span className="text-gray-400 ml-1 font-normal">geçen aya göre</span>
      </span>
    </div>
    <div className={`p-3 rounded-lg bg-${color}-50 text-${color}-600`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
  </div>
);

export default DashboardAdmin;
