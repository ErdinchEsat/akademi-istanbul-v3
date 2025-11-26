
import React, { useState } from 'react';
import { PlayCircle, Clock, BarChart, Zap, Award, Download, ChevronRight, Trophy, ArrowUp, ArrowDown, Minus, Filter } from 'lucide-react';
import { MOCK_COURSES, MOCK_BADGES, MOCK_USERS, MOCK_LEADERBOARD, MOCK_TENANTS } from '@/utils/constants';
import { BarChart as ReBarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';

interface DashboardStudentProps {
  onCourseClick: (courseId: string) => void;
  userTenantId?: string;
}

const data = [
  { name: 'Pzt', saat: 2 },
  { name: 'Sal', saat: 1.5 },
  { name: 'Çar', saat: 3 },
  { name: 'Per', saat: 1 },
  { name: 'Cum', saat: 4 },
  { name: 'Cmt', saat: 2 },
  { name: 'Paz', saat: 0.5 },
];

const DashboardStudent: React.FC<DashboardStudentProps> = ({ onCourseClick, userTenantId }) => {
  const user = MOCK_USERS.student;
  const currentTenant = MOCK_TENANTS.find(t => t.id === userTenantId);

  const myCourses = MOCK_COURSES.filter(c => c.tenantId === userTenantId);
  const otherCourses = MOCK_COURSES.filter(c => c.tenantId !== userTenantId);
  const displayedCourses = userTenantId ? [...myCourses, ...otherCourses] : MOCK_COURSES;

  // Helper to get gradient based on tenant color safely
  const getGradient = () => {
    if (!currentTenant) return 'bg-gradient-to-r from-indigo-900 to-blue-800';
    if (currentTenant.color === 'emerald') return 'bg-gradient-to-r from-emerald-800 to-teal-600';
    if (currentTenant.color === 'blue') return 'bg-gradient-to-r from-blue-800 to-cyan-600';
    if (currentTenant.color === 'violet') return 'bg-gradient-to-r from-violet-800 to-purple-600';
    return 'bg-gradient-to-r from-slate-800 to-slate-600';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-20">

      {/* Welcome Hero Section */}
      <div className={clsx(
        "rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden flex items-center gap-8 transition-all duration-500",
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
              ? `Kurumunuzun size özel atadığı ${myCourses.length} yeni eğitim modülü bulunuyor. Başarılar dileriz.`
              : 'Bugün kendinize ne katmak istersiniz? İlerlemenizi sürdürün.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" /> Haftalık Aktivite
              </h3>
              <p className="text-sm text-gray-500">Ders izleme ve test çözme süreleri</p>
            </div>
            <div className="text-right">
              <span className="block text-2xl font-extrabold text-slate-900">14.5s</span>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+2.5s Artış</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" dy={10} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => [`${value} Saat`, 'Süre']}
                />
                <Bar
                  dataKey="saat"
                  fill={currentTenant ? `var(--color-${currentTenant.color}-500)` : '#6366f1'}
                  radius={[6, 6, 6, 6]}
                  barSize={40}
                  // Use a safer fallback color if variable fails
                  style={{ fill: currentTenant?.color === 'emerald' ? '#10b981' : currentTenant?.color === 'blue' ? '#3b82f6' : '#6366f1' }}
                />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leaderboard Widget */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" /> Sıralama
            </h3>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Tümünü Gör</button>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {MOCK_LEADERBOARD.map((u, idx) => (
              <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${u.name.includes(user.name.split(' ')[0]) ? 'bg-indigo-50 border border-indigo-100 ring-1 ring-indigo-200' : 'hover:bg-gray-50 border border-transparent'}`}>
                <div className={clsx(
                  "w-8 h-8 flex items-center justify-center text-sm font-bold rounded-full shadow-sm",
                  idx === 0 ? "bg-gradient-to-br from-yellow-300 to-yellow-500 text-white" :
                    idx === 1 ? "bg-gradient-to-br from-slate-300 to-slate-400 text-white" :
                      idx === 2 ? "bg-gradient-to-br from-orange-300 to-orange-400 text-white" :
                        "bg-slate-100 text-slate-500"
                )}>
                  {u.rank}
                </div>
                <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{u.name}</p>
                  <p className="text-xs text-slate-500 font-medium">{u.points} Puan</p>
                </div>
                <div>
                  {u.trend === 'up' ? <ArrowUp className="w-4 h-4 text-green-500" /> : u.trend === 'down' ? <ArrowDown className="w-4 h-4 text-red-500" /> : <Minus className="w-4 h-4 text-gray-300" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Kurs Kataloğu</h2>
            <p className="text-slate-500 mt-1">Gelişiminize katkı sağlayacak eğitimler.</p>
          </div>
          {userTenantId && (
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg">
              <Award className="w-4 h-4" />
              {currentTenant?.name} Tarafından Önerilenler
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedCourses.map(course => (
            <div
              key={course.id}
              onClick={() => onCourseClick(course.id)}
              className={clsx(
                "bg-white rounded-2xl border overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full relative transform hover:-translate-y-1",
                course.tenantId === userTenantId ? 'border-indigo-200 shadow-indigo-100' : 'border-gray-100 shadow-sm'
              )}
            >
              <div className="relative h-44 overflow-hidden">
                <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>

                {/* Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                  {course.isLive && (
                    <div className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full animate-pulse shadow-lg flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span> CANLI
                    </div>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                  <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2 py-1 rounded-md border border-white/20 uppercase tracking-wide">
                    {course.category}
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="mb-1">
                  {/* Tenant Badge logic */}
                  {course.tenantId !== userTenantId && (
                    <span className={clsx(
                      "text-[10px] font-bold uppercase tracking-wider mb-2 inline-block",
                      course.tenantId === 'ibb' ? "text-blue-600" : "text-emerald-600"
                    )}>
                      {course.tenantId === 'ibb' ? 'Enstitü İstanbul' : 'Ümraniye Akademi'}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                  <span className="w-1 h-1 bg-slate-400 rounded-full"></span> {course.instructor}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex flex-col gap-1 w-full mr-4">
                    <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                      <span>İlerleme</span>
                      <span>%{course.progress}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>

                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardStudent;
