import React from 'react';
import { Briefcase, MapPin, Clock, Search, Building2, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { MOCK_JOBS } from '../constants';

const CareerCenter: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Kariyer Merkezi</h1>
          <p className="text-indigo-100 max-w-2xl">
            Akademi İstanbul sertifikalarınızla uyumlu iş ve staj fırsatlarını keşfedin. 
            Yapay zeka destekli eşleştirme sistemimiz sizi en uygun pozisyonlarla buluşturur.
          </p>
          <div className="mt-6 flex gap-2 bg-white/10 p-1 rounded-xl w-full max-w-md backdrop-blur-sm border border-white/20">
            <Search className="w-5 h-5 text-indigo-200 ml-3 my-auto" />
            <input 
              type="text" 
              placeholder="Pozisyon, şirket veya yetkinlik ara..." 
              className="bg-transparent border-none text-white placeholder-indigo-200 focus:ring-0 w-full text-sm"
            />
            <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors">
              Ara
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Job List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-xl font-bold text-slate-800">Sizin İçin Önerilenler</h2>
            <span className="text-sm text-slate-500">Profilinize göre sıralandı</span>
          </div>

          {MOCK_JOBS.map((job) => (
            <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-start gap-4">
                <img src={job.logo} alt={job.company} className="w-14 h-14 rounded-lg object-cover border border-gray-100" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                      <p className="text-slate-600 font-medium flex items-center gap-2">
                        <Building2 className="w-4 h-4" /> {job.company}
                      </p>
                    </div>
                    <div className="text-right">
                       <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                         %{job.matchScore} Eşleşme
                       </div>
                       <p className="text-xs text-gray-400 mt-1">{job.postedDate}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.type}</span>
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex gap-2">
                       <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">React</span>
                       <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">Frontend</span>
                       <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">UI/UX</span>
                    </div>
                    <button className="flex items-center gap-2 text-sm font-bold text-white bg-slate-900 px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors">
                      Başvur <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Profile Summary Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Kariyer Profiliniz</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-600">Profil Doluluğu</span>
                 <span className="font-bold text-indigo-600">%85</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-600 w-[85%]"></div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> CV Yüklendi</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Yetkinlik Testleri Tamamlandı</li>
                <li className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div> Portfolio Eksik</li>
              </ul>
              <button className="w-full mt-2 py-2 text-sm text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                Profili Düzenle
              </button>
            </div>
          </div>

          {/* Upcoming Career Events */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Kariyer Etkinlikleri</h3>
            <div className="space-y-4">
               <div className="flex gap-3">
                  <div className="bg-orange-100 text-orange-700 p-2 rounded-lg text-center min-w-[50px]">
                     <div className="text-xs font-bold">EKİ</div>
                     <div className="text-lg font-bold">24</div>
                  </div>
                  <div>
                     <h4 className="font-bold text-sm text-slate-800">CV Hazırlama Atölyesi</h4>
                     <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> 14:00 - Online
                     </p>
                  </div>
               </div>
               <div className="flex gap-3">
                  <div className="bg-blue-100 text-blue-700 p-2 rounded-lg text-center min-w-[50px]">
                     <div className="text-xs font-bold">KAS</div>
                     <div className="text-lg font-bold">02</div>
                  </div>
                  <div>
                     <h4 className="font-bold text-sm text-slate-800">Teknoloji Kariyer Zirvesi</h4>
                     <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> 10:00 - İBB Feshane
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerCenter;