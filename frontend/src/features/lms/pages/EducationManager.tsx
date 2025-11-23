
import React, { useState } from 'react';
import { 
  Plus, Upload, Trash2, Edit2, Calendar, Clock, 
  FileText, Video, MonitorPlay, ClipboardList, HelpCircle, FileCheck2,
  X, MoreHorizontal, CheckCircle2, AlertCircle, ChevronRight
} from 'lucide-react';
import { EducationCategory } from './MyEducation';
import clsx from 'clsx';

interface EducationManagerProps {
  category: EducationCategory;
}

// Mock Data for Instructor's Courses and Syllabus
const INSTRUCTOR_COURSES = [
  { 
    id: 'c1', 
    title: 'Unity 101: Oyun Geliştirme', 
    weeks: ['1. Hafta: Kurulum & Arayüz', '2. Hafta: C# Temelleri', '3. Hafta: Fizik Motoru', '4. Hafta: UI Sistemi']
  },
  { 
    id: 'c2', 
    title: 'İleri Seviye C# Programlama', 
    weeks: ['1. Hafta: OOP Prensipleri', '2. Hafta: LINQ & Lambda', '3. Hafta: Design Patterns']
  },
  { 
    id: 'c3', 
    title: 'Oyun Tasarımı Teorisi', 
    weeks: ['1. Hafta: Oyun Mekanikleri', '2. Hafta: Level Design', '3. Hafta: Oyuncu Psikolojisi']
  }
];

const EducationManager: React.FC<EducationManagerProps> = ({ category }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  
  // State for hierarchical selection
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedWeek, setSelectedWeek] = useState<string>('');
  
  // State for Quiz Builder
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState({ text: '', options: ['', '', '', ''], correct: 0 });

  const handleAddQuestion = () => {
    if(currentQuestion.text && currentQuestion.options.every(o => o)) {
      setQuizQuestions([...quizQuestions, { ...currentQuestion, id: Date.now() }]);
      setCurrentQuestion({ text: '', options: ['', '', '', ''], correct: 0 });
    }
  };

  const selectedCourseData = INSTRUCTOR_COURSES.find(c => c.id === selectedCourseId);

  // Config based on Category (For Table View)
  const config = {
    ebooks: { 
      title: 'E-Kitapçık Yönetimi', 
      icon: <FileText className="w-8 h-8 text-orange-500" />, 
      desc: 'Ders notları ve kaynakları yükleyin.',
      actionText: 'Yeni Materyal Yükle',
      fields: ['Dosya Adı', 'Ders', 'Hafta', 'Boyut', 'Tarih']
    },
    videos: { 
      title: 'Video İçerik Yönetimi', 
      icon: <Video className="w-8 h-8 text-blue-500" />, 
      desc: 'Ders videolarını organize edin.',
      actionText: 'Video Ekle',
      fields: ['Video Başlığı', 'Ders', 'Hafta', 'Durum', 'Yüklenme Tarihi']
    },
    live: { 
      title: 'Canlı Ders Planlama', 
      icon: <MonitorPlay className="w-8 h-8 text-red-500" />, 
      desc: 'Yeni bir canlı oturum planlayın veya başlatın.',
      actionText: 'Canlı Ders Aç/Planla',
      fields: ['Ders', 'Konu', 'Tarih', 'Saat', 'Durum']
    },
    assignments: { 
      title: 'Ödev Yönetimi', 
      icon: <ClipboardList className="w-8 h-8 text-purple-500" />, 
      desc: 'Ödev oluşturun ve teslimleri inceleyin.',
      actionText: 'Ödev Oluştur',
      fields: ['Ödev Başlığı', 'Ders', 'Son Teslim', 'Puan', 'Durum']
    },
    quizzes: { 
      title: 'Quiz Oluşturma', 
      icon: <HelpCircle className="w-8 h-8 text-teal-500" />, 
      desc: 'Hızlı tarama testleri hazırlayın.',
      actionText: 'Quiz Hazırla',
      fields: ['Quiz Adı', 'Ders', 'Soru Sayısı', 'Süre', 'Durum']
    },
    exams: { 
      title: 'Sınav Yönetimi', 
      icon: <FileCheck2 className="w-8 h-8 text-indigo-500" />, 
      desc: 'Sertifika ve bitirme sınavlarını yapılandırın.',
      actionText: 'Sınav Oluştur',
      fields: ['Sınav Adı', 'Tip', 'Ders', 'Tarih', 'Süre']
    },
  }[category];

  // Mock Table Data
  const getMockData = () => {
    switch(category) {
      case 'ebooks': return [
        { id: 1, col1: 'Giriş Notları.pdf', col2: 'Unity 101', col3: '1. Hafta', col4: '2.4 MB', col5: '24.10.2024' },
      ];
      case 'videos': return [
        { id: 1, col1: 'Arayüz Tanıtımı', col2: 'Unity 101', col3: '1. Hafta', col4: 'Yayında', col5: '20.10.2024' },
      ];
      case 'live': return [
        { id: 1, col1: 'Unity 101', col2: 'Soru Çözüm Kampı', col3: '26.10.2024', col4: '14:00', col5: 'Planlandı' },
      ];
      case 'assignments': return [
        { id: 1, col1: 'Oyun Prototipi', col2: 'Unity 101', col3: '30.10.2024', col4: '100 Puan', col5: 'Aktif' },
      ];
      case 'quizzes': return [
        { id: 1, col1: 'Haftalık Tarama 1', col2: 'Unity 101', col3: '10', col4: '15 dk', col5: 'Yayında' }
      ];
      case 'exams': return [
        { id: 1, col1: 'Unity Vize Sınavı', col2: 'Ara Sınav', col3: 'Unity 101', col4: '15.11.2024', col5: '60 dk' }
      ];
      default: return [];
    }
  };

  const data = getMockData();

  const renderModalContent = () => {
    return (
      <div className="space-y-6">
        {/* --- COMMON: Course Selection (Except specific contexts) --- */}
        <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Hangi Ders İçin?</label>
            <select 
              value={selectedCourseId}
              onChange={(e) => { setSelectedCourseId(e.target.value); setSelectedWeek(''); }}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="">Ders Seçiniz...</option>
              {INSTRUCTOR_COURSES.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
        </div>

        {/* --- HIERARCHY: Week Selection (For Content) --- */}
        {(category === 'ebooks' || category === 'videos' || category === 'quizzes' || category === 'assignments') && (
          <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">İlgili Hafta / Modül</label>
              <select 
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                disabled={!selectedCourseId}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50"
              >
                <option value="">Hafta Seçiniz...</option>
                {selectedCourseData?.weeks.map((w, i) => (
                  <option key={i} value={w}>{w}</option>
                ))}
              </select>
          </div>
        )}

        {/* --- CATEGORY SPECIFIC FIELDS --- */}

        {/* 1. VIDEOS & EBOOKS */}
        {(category === 'ebooks' || category === 'videos') && (
          <div className="space-y-4 animate-in fade-in">
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">İçerik Başlığı</label>
                <input type="text" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl" placeholder="Örn: Rigidbody Kullanımı" />
             </div>
             <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                   <Upload className="w-6 h-6" />
                </div>
                <p className="font-bold text-slate-700">{category === 'videos' ? 'Video Yükle (MP4, MOV)' : 'Dosya Yükle (PDF, DOCX)'}</p>
                <p className="text-xs text-gray-400 mt-1">Maksimum 1GB</p>
             </div>
          </div>
        )}

        {/* 2. LIVE CLASS */}
        {category === 'live' && (
          <div className="space-y-4 animate-in fade-in">
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Ders Konusu</label>
                <input type="text" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl" placeholder="Örn: Soru Çözümü ve Proje İncelemesi" />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">Tarih</label>
                   <input type="date" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">Saat</label>
                   <input type="time" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl" />
                </div>
             </div>
             <div className="flex gap-3 pt-2">
                <button className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 shadow-md flex justify-center items-center gap-2">
                   <MonitorPlay size={18} /> Şimdi Başlat
                </button>
                <button className="flex-1 bg-white border border-gray-300 text-slate-700 py-3 rounded-xl font-bold hover:bg-gray-50 flex justify-center items-center gap-2">
                   <Calendar size={18} /> İleri Tarihe Planla
                </button>
             </div>
          </div>
        )}

        {/* 3. ASSIGNMENTS */}
        {category === 'assignments' && (
           <div className="space-y-4 animate-in fade-in">
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Ödev Başlığı</label>
                 <input type="text" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl" placeholder="Örn: Oyun Prototipi Geliştirme" />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Açıklama ve Yönergeler</label>
                 <textarea className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl h-32 resize-none" placeholder="Ödev detaylarını buraya yazınız..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Son Teslim Tarihi & Saati</label>
                    <input type="datetime-local" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Puan Değeri</label>
                    <input type="number" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl" placeholder="100" />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Ek Dosyalar (İsteğe Bağlı)</label>
                 <input type="file" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              </div>
           </div>
        )}

        {/* 4. QUIZZES (Enhanced) */}
        {category === 'quizzes' && (
          <div className="space-y-6 animate-in fade-in">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">Quiz Adı</label>
                   <input type="text" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl" placeholder="Tarama Sınavı 1" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">Süre (Dakika)</label>
                   <input type="number" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl" placeholder="15" />
                </div>
             </div>

             {/* Question Builder */}
             <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <HelpCircle size={16} className="text-teal-600" /> Soru Ekle
                </h4>
                
                <div className="space-y-3">
                  <input 
                    type="text" 
                    value={currentQuestion.text}
                    onChange={e => setCurrentQuestion({...currentQuestion, text: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-teal-500" 
                    placeholder="Soru metnini giriniz..." 
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    {currentQuestion.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="correctOption" 
                          checked={currentQuestion.correct === idx} 
                          onChange={() => setCurrentQuestion({...currentQuestion, correct: idx})}
                          className="text-teal-600 focus:ring-teal-500"
                        />
                        <input 
                          type="text" 
                          value={opt}
                          onChange={e => {
                            const newOpts = [...currentQuestion.options];
                            newOpts[idx] = e.target.value;
                            setCurrentQuestion({...currentQuestion, options: newOpts});
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm" 
                          placeholder={`${String.fromCharCode(65+idx)} Seçeneği`} 
                        />
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    onClick={handleAddQuestion}
                    className="w-full py-2 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700 transition-colors mt-2"
                  >
                    + Listeye Ekle
                  </button>
                </div>
             </div>

             {/* Question List Preview */}
             {quizQuestions.length > 0 && (
               <div className="space-y-2">
                 <p className="text-xs font-bold text-slate-500 uppercase">Eklenen Sorular ({quizQuestions.length})</p>
                 {quizQuestions.map((q, i) => (
                   <div key={q.id} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="truncate max-w-[80%] text-sm font-medium text-slate-700">
                        <span className="font-bold mr-2">{i+1}.</span> {q.text}
                      </div>
                      <button onClick={() => setQuizQuestions(quizQuestions.filter(item => item.id !== q.id))} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

        {/* 5. EXAMS (Enhanced) */}
        {category === 'exams' && (
           <div className="space-y-4 animate-in fade-in">
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Sınav Başlığı</label>
                 <input type="text" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl" placeholder="Örn: Unity Final Sınavı" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Sınav Tipi</label>
                    <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl">
                       <option>Ara Sınav (Vize)</option>
                       <option>Final Sınavı</option>
                       <option>Bütünleme</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Ağırlık (%)</label>
                    <input type="number" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl" placeholder="40" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Başlangıç Tarihi</label>
                    <input type="datetime-local" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Bitiş Tarihi</label>
                    <input type="datetime-local" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl" />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Gözetmenlik / Güvenlik</label>
                 <div className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-xl">
                    <label className="flex items-center gap-2 cursor-pointer">
                       <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                       <span className="text-sm text-slate-700">Tarayıcı Kilidi</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                       <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                       <span className="text-sm text-slate-700">Kamera Zorunluluğu</span>
                    </label>
                 </div>
              </div>
           </div>
        )}

      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 h-full flex flex-col pb-20">
      {/* Header */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-slate-50 rounded-2xl shadow-inner border border-gray-100">
            {config.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{config.title}</h1>
            <p className="text-slate-500 mt-1">{config.desc}</p>
          </div>
        </div>
        <button 
          onClick={() => {
             setModalOpen(true);
             // Reset states
             setSelectedCourseId('');
             setSelectedWeek('');
             setQuizQuestions([]);
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          {config.actionText}
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
         <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-xs font-bold text-gray-500 uppercase">Toplam İçerik</div>
            <div className="text-2xl font-black text-slate-800 mt-1">{data.length + 12}</div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-xs font-bold text-gray-500 uppercase">Bu Hafta Eklenen</div>
            <div className="text-2xl font-black text-indigo-600 mt-1">4</div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-xs font-bold text-gray-500 uppercase">Etkileşim</div>
            <div className="text-2xl font-black text-green-600 mt-1">1.2k</div>
         </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-slate-500 font-semibold uppercase tracking-wider text-xs sticky top-0 z-10">
              <tr>
                {config.fields.map((f, i) => (
                  <th key={i} className="px-6 py-4 bg-gray-50">{f}</th>
                ))}
                <th className="px-6 py-4 text-right bg-gray-50">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-800">{item.col1}</td>
                  <td className="px-6 py-4 text-slate-600">{item.col2}</td>
                  <td className="px-6 py-4 text-slate-600">{item.col3}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <StatusBadge status={item.col4} />
                  </td>
                  <td className="px-6 py-4 text-slate-500">{item.col5}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors" title="Düzenle">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors" title="Sil">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                         <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 text-center text-xs text-gray-400 bg-gray-50">
           Toplam {data.length} kayıt listeleniyor.
        </div>
      </div>

      {/* Reusable / Dynamic Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200 custom-scrollbar">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-20">
              <h3 className="font-bold text-lg text-slate-800">{config.actionText}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-8">
               {renderModalContent()}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 z-20">
               <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 text-slate-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">İptal</button>
               <button className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  let styles = "bg-gray-100 text-gray-600";
  if (status === 'Yayında' || status === 'Aktif') styles = "bg-green-100 text-green-700";
  if (status === 'Planlandı' || status === 'İşleniyor') styles = "bg-blue-100 text-blue-700";
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${styles}`}>
      {status}
    </span>
  );
};

export default EducationManager;
