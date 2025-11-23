
import React from 'react';
import { Award, Download, Share2, Lock, ShieldCheck, Calendar, CheckCircle2, Hexagon } from 'lucide-react';
import { MOCK_BADGES, MOCK_COURSES, MOCK_USERS } from '../constants';
import clsx from 'clsx';

const Certificates: React.FC = () => {
  const user = MOCK_USERS.student;
  
  // Filter logic
  const earnedCertificates = MOCK_COURSES.filter(c => c.progress === 100);
  const inProgressCourses = MOCK_COURSES.filter(c => (c.progress || 0) > 0 && (c.progress || 0) < 100);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-12 pb-20">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
             <Award className="w-12 h-12 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Başarılarım ve Sertifikalarım</h1>
            <p className="text-slate-300 max-w-2xl text-lg">
              Akademi İstanbul yolculuğunuzdaki kazanımlarınız. Tüm sertifikalar Blockchain üzerinde doğrulanabilir.
            </p>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Hexagon className="w-6 h-6 text-indigo-600 fill-indigo-100" />
          <h2 className="text-2xl font-bold text-slate-900">Kazanılan Rozetler</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_BADGES.map((badge) => (
            <div key={badge.id} className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all group text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                {badge.icon}
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{badge.name}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">{badge.description}</p>
              <div className="text-[10px] font-medium text-indigo-600 bg-indigo-50 inline-block px-2 py-1 rounded-full">
                {badge.earnedAt ? new Date(badge.earnedAt).toLocaleDateString('tr-TR', {year: 'numeric', month: 'long', day: 'numeric'}) : 'Kazanıldı'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certificates Grid */}
      <div className="grid lg:grid-cols-2 gap-12">
        
        {/* Earned Certificates */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-slate-900">Sertifikalarım</h2>
          </div>
          <div className="space-y-6">
            {earnedCertificates.map(cert => (
              <div key={cert.id} className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Decorative Certificate Border */}
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-yellow-400 to-yellow-600"></div>
                
                <div className="p-6 pl-8">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Blockchain ID: #8293-AFK2</span>
                        <h3 className="font-bold text-xl text-slate-900 mt-1">{cert.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{cert.instructor} • {cert.totalModules} Ders</p>
                      </div>
                      <img src={cert.imageUrl} alt="Course" className="w-16 h-16 rounded-lg object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all" />
                   </div>

                   <div className="flex items-center justify-between mt-6 pt-6 border-t border-dashed border-gray-200">
                      <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                         <CheckCircle2 className="w-5 h-5" />
                         Onaylandı
                      </div>
                      <div className="flex gap-3">
                         <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors">
                            <Share2 className="w-4 h-4" />
                         </button>
                         <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-colors shadow-md">
                            <Download className="w-4 h-4" /> İndir
                         </button>
                      </div>
                   </div>
                </div>
                {/* Watermark */}
                <Award className="absolute -bottom-6 -right-6 w-32 h-32 text-gray-50 opacity-50 rotate-12 pointer-events-none" />
              </div>
            ))}
            {earnedCertificates.length === 0 && (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Henüz tamamlanmış bir sertifikanız bulunmuyor.</p>
              </div>
            )}
          </div>
        </section>

        {/* In Progress / Upcoming Certificates */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-slate-400" />
            <h2 className="text-2xl font-bold text-slate-900">Hedeflenen Sertifikalar</h2>
          </div>
          <div className="space-y-6">
            {inProgressCourses.map(course => {
              const remaining = course.totalModules - course.completedModules;
              return (
                <div key={course.id} className="bg-slate-50 rounded-xl border border-slate-200 p-6 relative overflow-hidden opacity-90 hover:opacity-100 transition-opacity">
                  
                  <div className="flex gap-4 items-center mb-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200 shrink-0 shadow-sm">
                       <Lock className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                       <h3 className="font-bold text-slate-800">{course.title}</h3>
                       <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                         <Calendar className="w-3 h-3" /> Tahmini: 15 Kasım 2024
                       </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                     <div className="flex justify-between text-sm mb-2">
                        <span className="font-bold text-indigo-600">Tamamlanma: %{course.progress}</span>
                        <span className="text-slate-500 font-medium">{remaining} ders kaldı</span>
                     </div>
                     <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full relative" style={{width: `${course.progress}%`}}>
                           <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 animate-pulse"></div>
                        </div>
                     </div>
                     <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                        Bu sertifikayı kazanmak için kalan modülleri tamamlayın ve bitirme sınavından en az 70 puan alın.
                     </p>
                  </div>

                </div>
              );
            })}
             {inProgressCourses.length === 0 && (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-500">Devam eden kursunuz bulunmuyor.</p>
              </div>
            )}
          </div>
        </section>

      </div>

    </div>
  );
};

export default Certificates;
