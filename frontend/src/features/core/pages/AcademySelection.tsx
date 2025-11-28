import React, { useState } from 'react';
import { Building2, Briefcase, ArrowRight, GraduationCap, Globe, Zap, Search, Filter, X, Ticket } from 'lucide-react';
import { MOCK_TENANTS } from '@/utils/constants';
import { Tenant, User } from '@/types';
import clsx from 'clsx';

interface AcademySelectionProps {
  user: User;
  onSelectTenant: (tenant: Tenant) => void;
  onSelectCareerCenter: () => void;
}

const AcademySelection: React.FC<AcademySelectionProps> = ({ user, onSelectTenant, onSelectCareerCenter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [activationCode, setActivationCode] = useState('');

  const alphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");

  const filteredTenants = MOCK_TENANTS.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase());
    // Basic letter filtering - in a real app, might need more robust locale comparison
    const matchesLetter = selectedLetter ? tenant.name.toLocaleUpperCase('tr-TR').startsWith(selectedLetter) : true;
    return matchesSearch && matchesLetter;
  });

  const handleActivate = async () => {
    if (!activationCode.trim()) {
      alert('Lütfen aktivasyon kodunu girin.');
      return;
    }

    try {
      // TODO: API call to validate and apply activation code
      // For now, simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      if (activationCode === 'VALIDCODE') { // Example valid code
        alert('Aktivasyon başarılı!');
        // After successful activation, could show a success message or redirect
      } else {
        throw new Error('Invalid code');
      }
    } catch (error) {
      alert('Aktivasyon kodu geçersiz!');
    }
  };

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

        {/* Activation Code Section */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-6 rounded-2xl shadow-xl text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Aktivasyon Kodu</h3>
                <p className="text-indigo-100 text-sm">Belediyenizden aldığınız kodu girerek eğitimlere erişin.</p>
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Kodu giriniz..."
                className="bg-white/10 border border-white/20 placeholder-white/40 text-white text-sm rounded-xl px-4 py-3 focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:border-white/50 w-full md:w-64 transition-all backdrop-blur-sm"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleActivate()}
              />
              <button
                onClick={handleActivate}
                disabled={!activationCode.trim()}
                className="bg-white text-indigo-600 text-sm font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 hover:scale-105 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Etkinleştir
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Academies Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-slate-400 uppercase tracking-wider text-sm font-bold">
              <Building2 className="w-4 h-4" /> Akademilerim
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Akademi ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-1 justify-center">
                <button
                  onClick={() => setSelectedLetter(null)}
                  className={clsx(
                    "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                    selectedLetter === null ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  )}
                >
                  Tümü
                </button>
                {alphabet.map(letter => (
                  <button
                    key={letter}
                    onClick={() => setSelectedLetter(letter === selectedLetter ? null : letter)}
                    className={clsx(
                      "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                      selectedLetter === letter ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    )}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {filteredTenants.length > 0 ? (
                filteredTenants.map((tenant, idx) => (
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
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
                  <p>Aradığınız kriterlere uygun akademi bulunamadı.</p>
                  <button onClick={() => { setSearchQuery(''); setSelectedLetter(null); }} className="text-indigo-600 font-bold mt-2 hover:underline">Filtreleri Temizle</button>
                </div>
              )}
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
