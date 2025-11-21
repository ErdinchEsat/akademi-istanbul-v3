import React from 'react';
import { GraduationCap, Users, Building2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MOCK_TENANTS } from '../constants';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-900">
            <GraduationCap className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold tracking-tight">Akademi İstanbul</span>
          </div>
          <div className="flex gap-4">
            <button onClick={onLoginClick} className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">Giriş Yap</button>
            <button onClick={onLoginClick} className="text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
              Kayıt Ol
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-indigo-50 py-20 lg:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-100/40 skew-x-12 transform origin-top translate-x-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-indigo-100 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">İstanbul'un Öğrenme Merkezi</span>
              </div>
              <h1 className="text-5xl font-extrabold text-slate-900 leading-tight">
                Şehir Ölçekli <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Geleceğin Eğitimi</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                Belediyeler, üniversiteler ve kurumlar için ortak öğrenme platformu. 
                Mesleki eğitimden sınav hazırlığa, sertifikasyonlardan kariyer planlamasına kadar her şey tek bir çatıda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={onLoginClick} className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Hemen Başla <ArrowRight className="w-5 h-5" />
                </button>
                <button className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-gray-200 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all">
                  Kurumsal Başvuru
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 relative z-10">
                 <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" 
                  alt="Students learning" 
                  className="rounded-xl mb-4 w-full h-64 object-cover"
                />
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-indigo-50 p-4 rounded-xl">
                      <h3 className="font-bold text-2xl text-indigo-600">50+</h3>
                      <p className="text-sm text-gray-600">Aktif Akademi</p>
                   </div>
                   <div className="bg-indigo-50 p-4 rounded-xl">
                      <h3 className="font-bold text-2xl text-indigo-600">100k</h3>
                      <p className="text-sm text-gray-600">Öğrenci</p>
                   </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-400 rounded-full blur-2xl opacity-20"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners/Tenants Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Paydaşlarımız</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Akademi İstanbul Ekosistemi
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_TENANTS.map((tenant) => (
              <div key={tenant.id} className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-${tenant.color}-50 text-${tenant.color}-600`}>
                    {tenant.type === 'Municipality' ? <Building2 className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tenant.name}</h3>
                <p className="text-gray-500 text-sm mb-4">
                  {tenant.type === 'Municipality' ? 'Yerel yönetim destekli ücretsiz eğitimler.' : 'Sektör profesyonellerinden uzmanlık eğitimleri.'}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 group-hover:underline">
                  Akademiye Git
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* Features Summary */}
       <section className="py-16 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
               <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">Neden Akademi İstanbul?</h2>
                  <ul className="space-y-4">
                    {[
                      'Çoklu Kurum Desteği ile Tek Platform',
                      'Zoom & Teams ile Entegre Canlı Dersler',
                      'Yapay Zeka Destekli Kişisel Gelişim Raporları',
                      'Blockchain Tabanlı Doğrulanabilir Sertifikalar',
                      'WCAG 2.2 Uyumlu Erişilebilir Arayüz'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
               </div>
               <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                     Video Tanıtımı Placeholder
                  </div>
               </div>
            </div>
         </div>
       </section>
    </div>
  );
};

export default LandingPage;
