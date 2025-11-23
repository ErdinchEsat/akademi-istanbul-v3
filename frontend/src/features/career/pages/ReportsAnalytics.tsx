
import React from 'react';
import { BarChart3, TrendingUp, Clock, Users, Download, Calendar } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';

const ReportsAnalytics: React.FC = () => {
  
  // Mock Data for Charts
  const engagementData = [
    { name: 'Pzt', views: 4000, unique: 2400 },
    { name: 'Sal', views: 3000, unique: 1398 },
    { name: 'Çar', views: 2000, unique: 9800 },
    { name: 'Per', views: 2780, unique: 3908 },
    { name: 'Cum', views: 1890, unique: 4800 },
    { name: 'Cmt', views: 2390, unique: 3800 },
    { name: 'Paz', views: 3490, unique: 4300 },
  ];

  const completionData = [
    { name: 'Tamamlandı', value: 400, color: '#10b981' },
    { name: 'Devam Ediyor', value: 300, color: '#6366f1' },
    { name: 'Başlanmadı', value: 100, color: '#94a3b8' },
    { name: 'Bırakıldı', value: 50, color: '#ef4444' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Raporlar ve Analitik</h1>
          <p className="text-slate-500 mt-1">Eğitim performansını ve öğrenci verilerini analiz edin.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-slate-600 rounded-lg font-medium hover:bg-gray-50">
             <Calendar className="w-4 h-4" /> Son 30 Gün
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-sm">
             <Download className="w-4 h-4" /> PDF İndir
           </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
           icon={<Users className="w-6 h-6 text-blue-600" />} 
           title="Toplam Kayıt" 
           value="2,543" 
           trend="+12.5%" 
           trendUp={true} 
           bg="bg-blue-50"
        />
        <StatCard 
           icon={<Clock className="w-6 h-6 text-purple-600" />} 
           title="Ortalama İzleme" 
           value="4s 12dk" 
           trend="+5.2%" 
           trendUp={true} 
           bg="bg-purple-50"
        />
        <StatCard 
           icon={<TrendingUp className="w-6 h-6 text-green-600" />} 
           title="Tamamlama Oranı" 
           value="%68" 
           trend="+2.4%" 
           trendUp={true} 
           bg="bg-green-50"
        />
        <StatCard 
           icon={<BarChart3 className="w-6 h-6 text-orange-600" />} 
           title="Sınav Başarısı" 
           value="76/100" 
           trend="-1.2%" 
           trendUp={false} 
           bg="bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
         {/* Engagement Chart */}
         <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Haftalık Etkileşim Analizi</h3>
            <div className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={engagementData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#94a3b8" />
                   <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" />
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <Tooltip 
                     contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                   />
                   <Area type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Completion Pie Chart */}
         <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Kurs Tamamlama Durumu</h3>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {completionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
         </div>

      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, trend, trendUp, bg }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
       <div className={`p-3 rounded-xl ${bg}`}>
         {icon}
       </div>
       <span className={`text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
         {trend}
       </span>
    </div>
    <h4 className="text-slate-500 text-sm font-medium">{title}</h4>
    <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

export default ReportsAnalytics;
