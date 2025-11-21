
import React, { useState } from 'react';
import { FileText, Video, MonitorPlay, ClipboardList, HelpCircle, FileCheck2, Download, PlayCircle, Clock, Calendar, ChevronRight, CheckCircle, AlertCircle, FolderOpen, ArrowLeft, Book } from 'lucide-react';
import { MOCK_COURSES } from '../constants';
import { UserRole } from '../types';
import LiveClassroom from './LiveClassroom';
import clsx from 'clsx';

export type EducationCategory = 'ebooks' | 'videos' | 'live' | 'assignments' | 'quizzes' | 'exams';

interface MyEducationProps {
  category: EducationCategory;
  onCourseClick: (courseId: string) => void;
}

const MyEducation: React.FC<MyEducationProps> = ({ category, onCourseClick }) => {
  
  // Header Config based on Category
  const config = {
    ebooks: { title: 'E-Kitapçıklar', icon: <FileText className="w-8 h-8 text-orange-500" />, desc: 'Ders notları, kaynak kitaplar ve yardımcı dokümanlar.' },
    videos: { title: 'Ders Videoları', icon: <Video className="w-8 h-8 text-blue-500" />, desc: 'Tekrar izleyebileceğiniz geçmiş ders kayıtları ve eğitim videoları.' },
    live: { title: 'Canlı Dersler', icon: <MonitorPlay className="w-8 h-8 text-red-500" />, desc: 'Eğitmeninizle birebir etkileşim kurabileceğiniz canlı oturumlar.' },
    assignments: { title: 'Ödevler', icon: <ClipboardList className="w-8 h-8 text-purple-500" />, desc: 'Teslim bekleyen ve tamamlanan projeleriniz.' },
    quizzes: { title: 'Quizler', icon: <HelpCircle className="w-8 h-8 text-teal-500" />, desc: 'Konu tarama testleri ve pratik çalışmaları.' },
    exams: { title: 'Sınavlar', icon: <FileCheck2 className="w-8 h-8 text-indigo-500" />, desc: 'Sertifika ve bitirme sınavları.' },
  }[category];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-20 h-full flex flex-col">
      {/* Header (Only show if not in full-screen live mode which might be handled inside sub-components) */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6 shrink-0">
        <div className="p-4 bg-slate-50 rounded-2xl shadow-inner">
          {config.icon}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{config.title}</h1>
          <p className="text-slate-500 mt-1">{config.desc}</p>
        </div>
      </div>

      {/* Dynamic Content */}
      <div className="flex-1">
        {category === 'ebooks' && <EbooksList />}
        {category === 'videos' && <VideosList onCourseClick={onCourseClick} />}
        {category === 'live' && <LiveList />}
        {category === 'assignments' && <AssignmentsList />}
        {category === 'quizzes' && <QuizzesList />}
        {category === 'exams' && <ExamsList />}
      </div>
    </div>
  );
};

// --- Sub Components ---

const EbooksList = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Mock structure grouping files by course
  const ebookCourses = [
    { 
      id: 'c1', 
      title: 'Unity 101: Oyun Geliştirme', 
      icon: '🎮',
      weeks: [
        { id: 'w1', title: '1. Hafta: Unity Arayüzü ve Kurulum', files: [{ name: 'Kurulum Rehberi.pdf', size: '1.2 MB' }, { name: 'Arayüz Kısayolları.pdf', size: '0.5 MB' }] },
        { id: 'w2', title: '2. Hafta: C# Temelleri', files: [{ name: 'C# Giriş Notları.pdf', size: '2.4 MB' }] },
        { id: 'w3', title: '3. Hafta: Fizik Motoru', files: [{ name: 'Rigidbody ve Collider.pdf', size: '3.1 MB' }, { name: 'Fizik Materyalleri.pdf', size: '1.8 MB' }] },
      ]
    },
    { 
      id: 'c2', 
      title: 'Web Tasarım ve Kodlama', 
      icon: '🌐',
      weeks: [
        { id: 'w1', title: '1. Hafta: HTML5 Yapısı', files: [{ name: 'HTML Etiketleri.pdf', size: '0.8 MB' }] },
        { id: 'w2', title: '2. Hafta: CSS3 ile Stil Verme', files: [{ name: 'CSS Seçiciler.pdf', size: '1.5 MB' }, { name: 'Flexbox Cheatsheet.pdf', size: '2.0 MB' }] },
      ]
    },
    { 
      id: 'c3', 
      title: 'SEO Uzmanlığı Eğitimi', 
      icon: '🚀',
      weeks: [
        { id: 'w1', title: '1. Hafta: SEO Nedir?', files: [{ name: 'SEO Terimleri Sözlüğü.pdf', size: '5.0 MB' }] },
        { id: 'w2', title: '2. Hafta: Anahtar Kelime Analizi', files: [] },
      ]
    }
  ];

  const selectedCourse = ebookCourses.find(c => c.id === selectedCourseId);

  if (selectedCourseId && selectedCourse) {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <button 
          onClick={() => setSelectedCourseId(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Tüm Kurslara Dön
        </button>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
            {selectedCourse.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{selectedCourse.title}</h2>
            <p className="text-slate-500">Ders Materyalleri ve E-Kitapçıklar</p>
          </div>
        </div>

        <div className="space-y-6">
          {selectedCourse.weeks.map((week) => (
            <div key={week.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-3 border-b border-gray-200 font-bold text-slate-700 flex items-center gap-2">
                <Book className="w-4 h-4 text-orange-500" />
                {week.title}
              </div>
              <div className="divide-y divide-gray-100">
                {week.files.length > 0 ? week.files.map((file, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-orange-50/30 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-100 text-red-600 p-2 rounded-lg">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 group-hover:text-orange-600 transition-colors">{file.name}</p>
                        <p className="text-xs text-gray-400">{file.size}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-sm">
                      <Download className="w-4 h-4" /> İndir
                    </button>
                  </div>
                )) : (
                  <div className="p-6 text-center text-slate-400 text-sm italic">
                    Bu hafta için henüz materyal eklenmemiş.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
      {ebookCourses.map(course => (
        <div 
          key={course.id}
          onClick={() => setSelectedCourseId(course.id)}
          className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110">
            <FolderOpen className="w-24 h-24 text-orange-500" />
          </div>
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-orange-50 text-3xl rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors shadow-sm">
              {course.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors mb-2">{course.title}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <span className="bg-gray-100 px-2 py-1 rounded-md">{course.weeks.length} Hafta</span>
              <span className="bg-gray-100 px-2 py-1 rounded-md">{course.weeks.reduce((acc, w) => acc + w.files.length, 0)} Dosya</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const VideosList = ({ onCourseClick }: { onCourseClick: (id: string) => void }) => {
  // Using MOCK_COURSES but visualizing them as video playlists
  return (
    <div className="space-y-6">
       <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>Video dersleri izlemek ve haftalık içeriklere erişmek için aşağıdaki eğitimlerden birini seçiniz.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_COURSES.map(course => (
          <div 
            key={course.id} 
            onClick={() => onCourseClick(course.id)}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all group cursor-pointer flex flex-col"
          >
             <div className="relative h-48">
                <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                   <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 shadow-lg group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-6 h-6 fill-current" />
                   </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                   <Video className="w-3 h-3" /> {course.totalModules} Video
                </div>
             </div>
             <div className="p-5 flex flex-col flex-1">
                <div className="mb-2">
                   <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                     {course.category}
                   </span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">{course.title}</h3>
                <p className="text-xs text-gray-500 mb-4">{course.instructor}</p>
                
                <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                   <div className="flex flex-col w-full mr-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Tamamlanan</span>
                        <span className="font-bold text-blue-600">%{course.progress || 0}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{width: `${course.progress || 0}%`}}></div>
                      </div>
                   </div>
                   <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LiveList = () => {
  const [activeSession, setActiveSession] = useState(false);

  if (activeSession) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in zoom-in duration-300">
        <div className="flex-1 relative">
          <LiveClassroom 
             title="Matematik: İntegral Soru Çözümü"
             instructor="Dr. Ahmet Yılmaz"
             userRole={UserRole.STUDENT}
             onEndCall={() => setActiveSession(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
       <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-3xl text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden">
          {/* Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="flex items-center gap-6 relative z-10">
             <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
                <div className="p-4 bg-red-600 rounded-full shadow-lg shadow-red-900/50">
                  <MonitorPlay className="w-8 h-8 text-white" />
                </div>
             </div>
             <div>
                <div className="flex items-center gap-2 mb-2">
                   <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm animate-pulse">ŞU AN YAYINDA</span>
                   <span className="text-slate-300 text-xs border border-slate-600 px-2 py-0.5 rounded">Soru Çözüm Kampı</span>
                </div>
                <h3 className="text-2xl font-bold">Matematik: İntegral Soru Çözümü</h3>
                <p className="text-slate-300 text-sm mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span> Eğitmen: Dr. Ahmet Yılmaz
                </p>
             </div>
          </div>
          <button 
             onClick={() => setActiveSession(true)}
             className="relative z-10 bg-white text-red-600 hover:bg-red-50 px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:scale-105 flex items-center gap-2"
          >
             <PlayCircle className="w-5 h-5" /> Derse Katıl
          </button>
       </div>

       <div className="mt-8">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-indigo-600" /> Gelecek Canlı Dersler
          </h3>
          
          <div className="grid gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between hover:shadow-md transition-shadow gap-4">
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    <div className="text-center bg-indigo-50 p-3 rounded-xl min-w-[70px] border border-indigo-100">
                        <div className="text-xs text-indigo-500 font-bold uppercase">Ekim</div>
                        <div className="text-2xl font-black text-slate-800">2{4+i}</div>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-lg">React Hooks & State Yönetimi</h4>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Clock className="w-3.5 h-3.5" /> 14:00 - 15:30 • Online
                        </p>
                    </div>
                  </div>
                  <button className="w-full sm:w-auto text-indigo-600 border border-indigo-200 hover:bg-indigo-50 text-sm font-bold px-6 py-3 rounded-xl transition-colors">
                    Takvime Ekle
                  </button>
              </div>
            ))}
          </div>
       </div>
    </div>
  );
};

const AssignmentsList = () => {
   return (
     <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
       <div className="bg-white p-6 rounded-xl border-l-4 border-purple-500 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
             <div>
                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">Teslim Bekliyor</span>
                <h3 className="font-bold text-lg text-slate-900 mt-2">E-Ticaret Sitesi Tasarımı</h3>
                <p className="text-sm text-slate-500 mt-1">Figma veya Adobe XD kullanarak anasayfa tasarımı.</p>
                <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                   <span className="flex items-center gap-1 font-medium text-orange-500"><Clock size={14}/> Son Teslim: 3 Gün Kaldı</span>
                   <span className="flex items-center gap-1"><FileText size={14}/> Dosya Tipi: .fig, .pdf</span>
                </div>
             </div>
             <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-600 transition-colors">
                Ödev Yükle
             </button>
          </div>
       </div>

       <div className="bg-white p-6 rounded-xl border-l-4 border-green-500 shadow-sm opacity-75 hover:opacity-100 transition-opacity">
          <div className="flex justify-between items-center">
             <div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded flex items-center w-fit gap-1"><CheckCircle size={12} /> Tamamlandı</span>
                <h3 className="font-bold text-lg text-slate-900 mt-2">Javascript Algoritma Soruları</h3>
                <p className="text-sm text-slate-500 mt-1">Verilen 5 algoritma sorusunun çözümü.</p>
             </div>
             <div className="text-right">
                <div className="text-2xl font-bold text-green-600">95/100</div>
                <div className="text-xs text-gray-400">Puan</div>
             </div>
          </div>
       </div>
     </div>
   );
};

const QuizzesList = () => {
  return (
    <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4">
       {[1, 2, 3].map((i) => (
         <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 hover:border-teal-300 transition-all flex items-center justify-between group hover:shadow-md">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-110 transition-transform">
                  Q{i}
               </div>
               <div>
                  <h4 className="font-bold text-slate-800 text-lg">Modül {i}: Konu Tarama Testi</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                     <HelpCircle className="w-3 h-3" /> 10 Soru • 15 Dakika
                  </p>
               </div>
            </div>
            <button className="flex items-center gap-2 text-sm font-bold text-teal-600 bg-teal-50 px-6 py-3 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm">
               Başla <ChevronRight size={16} />
            </button>
         </div>
       ))}
    </div>
  );
};

const ExamsList = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
       <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100 relative overflow-hidden">
          <div className="relative z-10 flex items-start gap-6">
             <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
               <AlertCircle className="w-8 h-8" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-indigo-900">Yaklaşan Sınav: React Bitirme Projesi</h3>
                <p className="text-sm text-indigo-700 mt-2 leading-relaxed max-w-2xl">
                   Bu sınav sertifika almaya hak kazanmanız için gereklidir. Sınav süresi 120 dakikadır ve tek giriş hakkınız bulunmaktadır.
                   Lütfen internet bağlantınızı kontrol ediniz.
                </p>
                <div className="mt-6 flex gap-4">
                   <div className="bg-white px-6 py-3 rounded-xl border border-indigo-100 shadow-sm text-center min-w-[100px]">
                      <div className="text-xs text-gray-500 uppercase font-bold mb-1">Tarih</div>
                      <div className="font-bold text-indigo-600 text-lg">25 Ekim</div>
                   </div>
                   <div className="bg-white px-6 py-3 rounded-xl border border-indigo-100 shadow-sm text-center min-w-[100px]">
                      <div className="text-xs text-gray-500 uppercase font-bold mb-1">Saat</div>
                      <div className="font-bold text-indigo-600 text-lg">14:00</div>
                   </div>
                </div>
             </div>
          </div>
       </div>

       <h3 className="font-bold text-slate-800 text-lg mt-8">Geçmiş Sınavlar</h3>
       <div className="bg-white p-6 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-green-50 rounded-full text-green-600">
                <FileCheck2 className="w-6 h-6" />
             </div>
             <div>
               <h4 className="font-bold text-slate-800">HTML & CSS Temelleri</h4>
               <p className="text-xs text-gray-500 mt-0.5">Tamamlanma Tarihi: 10 Eylül 2024</p>
             </div>
          </div>
          <span className="text-green-700 font-bold bg-green-100 px-4 py-2 rounded-lg border border-green-200">Başarılı (%88)</span>
       </div>
    </div>
  );
};

export default MyEducation;
