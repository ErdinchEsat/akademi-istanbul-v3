
import React from 'react';
import { Building2, Briefcase, ArrowRight, GraduationCap, Globe, Zap } from 'lucide-react';
import { MOCK_TENANTS } from '../constants';
import { Tenant, User } from '../types';
import clsx from 'clsx';

interface AcademySelectionProps {
  user: User;
  onSelectTenant: (tenant: Tenant) => void;
  onSelectCareerCenter: () => void;
}

const AcademySelection: React.FC<AcademySelectionProps> = ({ user, onSelectTenant, onSelectCareerCenter }) => {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 animate-in slide-in-from-top-10 duration-500">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-4">
            <GraduationCap className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900">Hoş Geldiniz, {user.name.split(' ')[0]}!</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Bugün hangi alanda gelişmek istersiniz? Kayıtlı olduğunuz akademiyi seçin veya kariyer fırsatlarını inceleyin.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Academies Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-slate-400 uppercase tracking-wider text-sm font-bold">
              <Building2 className="w-4 h-4" /> Akademilerim
            </div>
            <div className="grid gap-4">
              {MOCK_TENANTS.map((tenant, idx) => (
                <button
                  key={tenant.id}
                  onClick={() => onSelectTenant(tenant)}
                  className="group relative bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all text-left overflow-hidden"
                >
                  <div className={clsx("absolute top-0 left-0 w-1 h-full transition-colors", `bg-${tenant.color}-500`)}></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <img src={tenant.logo} alt={tenant.name} className="w-16 h-16 rounded-xl object-cover shadow-sm border border-gray-100 group-hover:scale-105 transition-transform" />
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-700 transition-colors">{tenant.name}</h3>
                        <p className="text-sm text-slate-500">{tenant.type === 'Municipality' ? 'Belediye Akademisi' : 'Kurumsal Eğitim'}</p>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                  {/* Background Decoration */}
                  <div className={clsx("absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-10 transition-transform group-hover:scale-150", `bg-${tenant.color}-500`)}></div>
                </button>
              ))}
               <button className="group border-2 border-dashed border-gray-300 p-6 rounded-2xl text-center hover:border-indigo-400 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-indigo-600">
                  <Globe className="w-6 h-6" />
                  <span className="font-medium">Yeni Akademi Ekle</span>
               </button>
            </div>
          </div>

          {/* Career Center Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-slate-400 uppercase tracking-wider text-sm font-bold">
              <Briefcase className="w-4 h-4" /> Kariyer & Fırsatlar
            </div>
            
            <button 
              onClick={onSelectCareerCenter}
              className="w-full h-full min-h-[300px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group text-left flex flex-col justify-between"
            >
               {/* Decor */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl group-hover:bg-white/10 transition-colors"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl"></div>
               
               <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                     <Briefcase className="w-8 h-8 text-indigo-300" />
                  </div>
                  <h2 className="text-3xl font-extrabold mb-3">Kariyer Merkezi</h2>
                  <p className="text-slate-300 leading-relaxed text-lg">
                    Sertifikalarınızla eşleşen iş ilanları, staj fırsatları ve yapay zeka destekli kariyer danışmanlığı.
                  </p>
               </div>
               
               <div className="relative z-10 mt-8 flex items-center gap-2 text-indigo-300 font-bold group-hover:translate-x-2 transition-transform">
                  Fırsatları İncele <ArrowRight className="w-5 h-5" />
               </div>
            </button>
          </div>

        </div>

        {/* Footer Info */}
        <div className="pt-12 border-t border-gray-200 text-center text-slate-400 text-sm">
          <p>© 2024 Akademi İstanbul Platformu. Tüm hakları saklıdır.</p>
          <div className="flex justify-center gap-4 mt-2">
             <span>Kullanım Şartları</span>
             <span>Gizlilik Politikası</span>
             <span>Yardım</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AcademySelection;
