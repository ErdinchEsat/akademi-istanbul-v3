
import React, { useState } from 'react';
import { 
  ArrowLeft, Mail, Phone, Award, TrendingUp, BookOpen, 
  Clock, CheckCircle, XCircle, AlertTriangle, 
  FileText, PlayCircle, Lock, Unlock, Plus, Send
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import clsx from 'clsx';

interface StudentAnalyticsProps {
  studentId: string | number | null;
  onBack: () => void;
}

const StudentAnalytics: React.FC<StudentAnalyticsProps> = ({ studentId, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'academic' | 'content' | 'actions'>('overview');
  const [isAssignModalOpen, setAssignModalOpen] = useState(false);
  const [isUnlockModalOpen, setUnlockModalOpen] = useState(false);

  // Mock Data specific to this student view
  const studentInfo = {
    name: 'Ali Yılmaz',
    id: studentId || '1',
    email: 'ali.yilmaz@student.com',
    avatar: 'AY',
    enrolledDate: '10.09.2024',
    lastActive: '2 saat önce',
    status: 'Active'
  };

  const academicData = [
    { subject: 'Matematik', quiz: 85, vize: 70, final: 90, attendance: 95 },
    { subject: 'Fizik', quiz: 65, vize: 60, final: 75, attendance: 80 },
    { subject: 'Yazılım', quiz: 95, vize: 90, final: 100, attendance: 100 },
    { subject: 'İngilizce', quiz: 80, vize: 85, final: 82, attendance: 90 },
    { subject: 'Tarih', quiz: 50, vize: 55, final: 60, attendance: 70 },
  ];

  const videoEngagement = [
    { name: 'Hafta 1', watched: 100, total: 100 },
    { name: 'Hafta 2', watched: 100, total: 100 },
    { name: 'Hafta 3', watched: 80, total: 100 },
    { name: 'Hafta 4', watched: 40, total: 100 },
    { name: 'Hafta 5', watched: 0, total: 100 },
  ];

  const contentLog = [
    { title: 'Unity Arayüzü', type: 'Video', status: 'Watched', date: '12.10.2024', score: '-' },
    { title: 'C# Değişkenler', type: 'Video', status: 'Watched', date: '13.10.2024', score: '-' },
    { title: 'Haftalık Quiz 1', type: 'Quiz', status: 'Completed', date: '14.10.2024', score: '85/100' },
    { title: 'Fizik Motoru', type: 'Video', status: 'Incomplete', date: '15.10.2024', score: '-' },
    { title: 'Döngüler', type: 'Video', status: 'Skipped', date: '-', score: '-' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-20">
      {/* Navigation Header */}
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold text-sm">
        <ArrowLeft className="w-4 h-4" /> Öğrenci Listesine Dön
      </button>

      {/* Profile Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold border-4 border-white shadow-lg">
             {studentInfo.avatar}
          </div>
          <div>
             <h1 className="text-2xl font-bold text-slate-900">{studentInfo.name}</h1>
             <p className="text-slate-500 text-sm flex items-center gap-2">
               <Mail className="w-3 h-3" /> {studentInfo.email}
             </p>
             <div className="flex items-center gap-3 mt-2">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Aktif Öğrenci
                </span>
                <span className="text-xs text-gray-400">Katılım: {studentInfo.enrolledDate}</span>
             </div>
          </div>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors">
              <Mail className="w-4 h-4" /> Mesaj At
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors">
              <Phone className="w-4 h-4" /> Ara
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 space-x-6 overflow-x-auto">
         <TabButton label="Genel Bakış" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
         <TabButton label="Akademik Karne" active={activeTab === 'academic'} onClick={() => setActiveTab('academic')} />
         <TabButton label="İçerik Tüketimi" active={activeTab === 'content'} onClick={() => setActiveTab('content')} />
         <TabButton label="Eğitmen Aksiyonları" active={activeTab === 'actions'} onClick={() => setActiveTab('actions')} />
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard title="Genel Ortalama" value="82.5" icon={<TrendingUp className="text-green-600" />} color="green" />
                <KpiCard title="Toplam Ders Saati" value="42s" icon={<Clock className="text-blue-600" />} color="blue" />
                <KpiCard title="Tamamlanan Modül" value="18/24" icon={<CheckCircle className="text-indigo-600" />} color="indigo" />
                <KpiCard title="Devamsızlık" value="%5" icon={<AlertTriangle className="text-orange-600" />} color="orange" />
             </div>

             <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                   <h3 className="font-bold text-slate-900 mb-4">Yetenek Radarı</h3>
                   <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={academicData}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                          <Radar name="Ali" dataKey="final" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                   </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                   <h3 className="font-bold text-slate-900 mb-4">Haftalık İlerleme</h3>
                   <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={videoEngagement}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
                           <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
                           <Tooltip contentStyle={{borderRadius: '8px', border: 'none'}} />
                           <Line type="monotone" dataKey="watched" stroke="#10b981" strokeWidth={3} dot={{r:4}} />
                        </LineChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* ACADEMIC TAB */}
        {activeTab === 'academic' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                   <h3 className="font-bold text-slate-900">Ders Bazlı Not Dökümü</h3>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-slate-500 font-semibold uppercase tracking-wider text-xs">
                         <tr>
                            <th className="px-6 py-4">Ders Adı</th>
                            <th className="px-6 py-4">Quiz Ort.</th>
                            <th className="px-6 py-4">Ara Sınav</th>
                            <th className="px-6 py-4">Final</th>
                            <th className="px-6 py-4">Katılım</th>
                            <th className="px-6 py-4">Durum</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                         {academicData.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                               <td className="px-6 py-4 font-bold text-slate-800">{row.subject}</td>
                               <td className="px-6 py-4">{row.quiz}</td>
                               <td className="px-6 py-4">{row.vize}</td>
                               <td className="px-6 py-4 font-bold text-indigo-600">{row.final}</td>
                               <td className="px-6 py-4">
                                  <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                     <div className="h-full bg-green-500" style={{width: `${row.attendance}%`}}></div>
                                  </div>
                               </td>
                               <td className="px-6 py-4">
                                  {row.final >= 50 ? (
                                     <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded">Geçti</span>
                                  ) : (
                                     <span className="text-red-600 font-bold text-xs bg-red-50 px-2 py-1 rounded">Kaldı</span>
                                  )}
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}

        {/* CONTENT TAB */}
        {activeTab === 'content' && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6">Video İzleme Analizi</h3>
                    <div className="h-64">
                       <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={videoEngagement}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                             <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
                             <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
                             <Bar dataKey="watched" fill="#6366f1" radius={[4, 4, 0, 0]} />
                          </BarChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <h3 className="font-bold text-slate-900 mb-4">Son Aktiviteler</h3>
                    <div className="space-y-4">
                       {contentLog.map((log, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-50">
                             <div className="flex items-center gap-3">
                                <div className={clsx(
                                   "p-2 rounded-lg",
                                   log.type === 'Video' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                                )}>
                                   {log.type === 'Video' ? <PlayCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-slate-800">{log.title}</p>
                                   <p className="text-xs text-gray-400">{log.date}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <span className={clsx(
                                   "text-xs font-bold px-2 py-0.5 rounded",
                                   log.status === 'Watched' || log.status === 'Completed' ? "bg-green-100 text-green-700" : 
                                   log.status === 'Skipped' ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                                )}>
                                   {log.status}
                                </span>
                                {log.score !== '-' && <p className="text-xs font-bold text-slate-700 mt-1">{log.score}</p>}
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* ACTIONS TAB */}
        {activeTab === 'actions' && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl text-orange-800 text-sm mb-6 flex gap-3 items-start">
                 <AlertTriangle className="w-5 h-5 shrink-0" />
                 <p>Bu alanda yapacağınız işlemler öğrencinin müfredatını ve erişim yetkilerini doğrudan etkileyecektir.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-indigo-300 transition-all">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                       <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Ek Ödev Ata</h3>
                    <p className="text-sm text-slate-500 mt-2 mb-6">Öğrencinin eksik olduğu konularda pekiştirme yapması için özel ödev tanımlayın.</p>
                    <button 
                      onClick={() => setAssignModalOpen(true)}
                      className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                       Ödev Oluştur
                    </button>
                 </div>

                 <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-green-300 transition-all">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
                       <Unlock className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Ders/Modül Kilidi Aç</h3>
                    <p className="text-sm text-slate-500 mt-2 mb-6">Normal müfredat akışında henüz erişemediği ileri seviye modülleri bu öğrenci için erkenden açın.</p>
                    <button 
                      onClick={() => setUnlockModalOpen(true)}
                      className="w-full py-3 bg-white border border-gray-200 text-slate-700 rounded-xl font-bold hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors"
                    >
                       Modül Seç ve Aç
                    </button>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* MODALS */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <h3 className="font-bold text-slate-800">Özel Ödev Tanımla</h3>
                 <button onClick={() => setAssignModalOpen(false)} className="text-gray-400 hover:text-gray-600"><XCircle className="w-6 h-6" /></button>
              </div>
              <div className="p-6 space-y-4">
                 <div>
                    <label className="text-sm font-bold text-slate-700 block mb-1">Ödev Başlığı</label>
                    <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Örn: Fizik Vektörler Ek Çalışma" />
                 </div>
                 <div>
                    <label className="text-sm font-bold text-slate-700 block mb-1">Açıklama</label>
                    <textarea className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none" placeholder="Öğrenciye notunuz..."></textarea>
                 </div>
                 <div className="flex gap-4">
                    <div className="flex-1">
                       <label className="text-sm font-bold text-slate-700 block mb-1">Son Teslim</label>
                       <input type="date" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="flex-1">
                       <label className="text-sm font-bold text-slate-700 block mb-1">Dosya Ekle</label>
                       <button className="w-full px-4 py-2 bg-white border border-dashed border-gray-300 rounded-xl text-gray-500 text-sm hover:bg-gray-50">Dosya Seç</button>
                    </div>
                 </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                 <button onClick={() => setAssignModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold">İptal</button>
                 <button onClick={() => setAssignModalOpen(false)} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700">Ödevi Gönder</button>
              </div>
           </div>
        </div>
      )}

      {isUnlockModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <h3 className="font-bold text-slate-800">Modül Kilidi Aç</h3>
                 <button onClick={() => setUnlockModalOpen(false)} className="text-gray-400 hover:text-gray-600"><XCircle className="w-6 h-6" /></button>
              </div>
              <div className="p-6">
                 <p className="text-sm text-slate-500 mb-4">Aşağıdaki listeden öğrencinin erişimine açmak istediğiniz kilitli modülleri seçin.</p>
                 <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {[1,2,3,4].map(i => (
                       <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center gap-3">
                             <Lock className="w-4 h-4 text-gray-400" />
                             <span className="font-bold text-slate-700 text-sm">İleri Seviye React Patterns - Bölüm {i}</span>
                          </div>
                          <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                       </div>
                    ))}
                 </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                 <button onClick={() => setUnlockModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold">İptal</button>
                 <button onClick={() => setUnlockModalOpen(false)} className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700">Seçilenleri Aç</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

const KpiCard = ({ title, value, icon, color }: any) => (
   <div className={`bg-white p-5 rounded-2xl border border-gray-200 shadow-sm border-l-4 border-l-${color}-500`}>
      <div className="flex justify-between items-start">
         <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{title}</p>
            <h4 className="text-2xl font-black text-slate-800 mt-1">{value}</h4>
         </div>
         <div className={`p-2 bg-${color}-50 rounded-lg`}>{icon}</div>
      </div>
   </div>
);

const TabButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
   <button
      onClick={onClick}
      className={clsx(
         "px-4 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors",
         active ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800 hover:border-gray-200"
      )}
   >
      {label}
   </button>
);

export default StudentAnalytics;
