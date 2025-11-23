
import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageSquare, Mail, Phone, Send, HelpCircle, FileQuestion, Video } from 'lucide-react';

const FAQS = [
  {
    category: "Genel",
    questions: [
      { q: "Akademi İstanbul nedir?", a: "Akademi İstanbul, İstanbul'daki belediyeler, üniversiteler ve kurumları tek bir çatı altında toplayan, çok paydaşlı bir öğrenme ve kariyer platformudur." },
      { q: "Üyelik ücretli mi?", a: "Platforma kayıt olmak tamamen ücretsizdir. Çoğu eğitim belediyeler tarafından ücretsiz sunulmaktadır, ancak bazı özel sertifika programları ücretli olabilir." },
    ]
  },
  {
    category: "Sertifikalar",
    questions: [
      { q: "Sertifikamı ne zaman alabilirim?", a: "Bir eğitimi %100 tamamlayıp, varsa bitirme sınavından en az 70 puan aldığınızda sertifikanız otomatik olarak üretilir ve profilinize eklenir." },
      { q: "Sertifikalarım resmi olarak geçerli mi?", a: "Evet, sertifikalarımız Blockchain altyapısı ile doğrulanabilir ve CV'nizde kullanabileceğiniz geçerliliğe sahiptir." },
    ]
  },
  {
    category: "Teknik Sorunlar",
    questions: [
      { q: "Canlı derslere katılamıyorum, ne yapmalıyım?", a: "Öncelikle internet bağlantınızı kontrol edin. Tarayıcınızın kamera ve mikrofon izinlerini verdiğinizden emin olun. Sorun devam ederse farklı bir tarayıcı (Chrome, Edge) deneyin." },
      { q: "Şifremi unuttum, nasıl sıfırlarım?", a: "Giriş ekranında bulunan 'Şifremi Unuttum' bağlantısına tıklayarak e-posta adresinize sıfırlama linki gönderebilirsiniz." },
    ]
  }
];

const SupportFAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("Genel");
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-12 pb-20">
       {/* Hero Search */}
       <div className="bg-indigo-600 rounded-3xl p-10 text-center text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
             <h1 className="text-3xl font-bold">Size nasıl yardımcı olabiliriz?</h1>
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Sorunuzu arayın (örn. sertifika, canlı ders...)" 
                  className="w-full px-6 py-4 rounded-2xl text-slate-800 text-sm focus:ring-4 focus:ring-indigo-400/50 outline-none shadow-lg"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* FAQ Section */}
          <div className="lg:col-span-2 space-y-8">
             <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-slate-900">Sıkça Sorulan Sorular</h2>
             </div>

             {/* Category Tabs */}
             <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {FAQS.map(cat => (
                  <button
                    key={cat.category}
                    onClick={() => { setActiveCategory(cat.category); setOpenQuestion(null); }}
                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat.category ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-gray-200 hover:bg-gray-50'}`}
                  >
                    {cat.category}
                  </button>
                ))}
             </div>

             {/* Accordion */}
             <div className="space-y-4">
                {FAQS.find(c => c.category === activeCategory)?.questions.map((item, idx) => (
                   <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <button 
                        onClick={() => toggleQuestion(idx)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                         <span className="font-bold text-slate-800">{item.q}</span>
                         {openQuestion === idx ? <ChevronUp className="text-indigo-600 w-5 h-5" /> : <ChevronDown className="text-gray-400 w-5 h-5" />}
                      </button>
                      {openQuestion === idx && (
                         <div className="px-5 pb-5 pt-0 text-slate-600 text-sm leading-relaxed animate-in slide-in-from-top-2 duration-200 border-t border-gray-50 mt-2 pt-4">
                            {item.a}
                         </div>
                      )}
                   </div>
                ))}
             </div>

             {/* Still Need Help Banner */}
             <div className="bg-indigo-50 rounded-2xl p-6 flex items-center justify-between border border-indigo-100">
                <div className="flex items-center gap-4">
                   <div className="bg-white p-3 rounded-full shadow-sm text-indigo-600">
                      <MessageSquare className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="font-bold text-indigo-900">Aradığınızı bulamadınız mı?</h4>
                      <p className="text-indigo-700 text-sm">Destek ekibimiz size yardımcı olmak için hazır.</p>
                   </div>
                </div>
                <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md">
                  Bize Ulaşın
                </button>
             </div>
          </div>

          {/* Contact Sidebar */}
          <div className="space-y-6">
             <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                   <Mail className="w-5 h-5 text-indigo-600" /> Destek Talebi Oluştur
                </h3>
                <form className="space-y-4">
                   <div>
                      <label className="text-xs font-bold text-slate-700 uppercase">Konu</label>
                      <select className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 transition-all">
                         <option>Teknik Sorun</option>
                         <option>Hesap İşlemleri</option>
                         <option>Öneri / Şikayet</option>
                         <option>Diğer</option>
                      </select>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-700 uppercase">Mesajınız</label>
                      <textarea className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 h-32 resize-none transition-all" placeholder="Sorununuzu detaylıca açıklayın..."></textarea>
                   </div>
                   <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" /> Gönder
                   </button>
                </form>
             </div>

             <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">İletişim Kanalları</h3>
                <div className="space-y-3">
                   <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                      <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                         <Phone className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600">Çağrı Merkezi</p>
                         <p className="text-xs text-gray-500">153 Beyaz Masa</p>
                      </div>
                   </a>
                   <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                         <Mail className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600">E-posta</p>
                         <p className="text-xs text-gray-500">destek@akademi.istanbul</p>
                      </div>
                   </a>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default SupportFAQ;