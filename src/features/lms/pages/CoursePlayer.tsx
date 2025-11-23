
import React, { useState } from 'react';
import { ChevronLeft, CheckCircle, PlayCircle, FileText, MessageSquare, Download, Video, Settings, Captions, HelpCircle, ThumbsUp, MessageCircle, AlertCircle, Award } from 'lucide-react';
import { MOCK_COURSES, MOCK_FORUM_POSTS, MOCK_USERS } from '@/utils/constants';
import { CourseModule, UserRole } from '@/types';
import LiveClassroom from '../../realtime/components/LiveClassroom';
import clsx from 'clsx';

interface CoursePlayerProps {
  courseId: string | null;
  onBack: () => void;
}

type TabType = 'overview' | 'qa' | 'resources' | 'notes';

const CoursePlayer: React.FC<CoursePlayerProps> = ({ courseId, onBack }) => {
  const course = MOCK_COURSES.find(c => c.id === courseId) || MOCK_COURSES[0];
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeModule, setActiveModule] = useState<CourseModule | undefined>(course.modules?.[0]);

  // Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleModuleClick = (module: CourseModule) => {
    setActiveModule(module);
    setQuizStep(0);
    setQuizFinished(false);
    setQuizScore(0);
    setSelectedOption(null);
  };

  const handleQuizSubmit = () => {
    if (selectedOption === null || !activeModule?.quizData) return;

    const isCorrect = activeModule.quizData[quizStep].correctOption === selectedOption;
    if (isCorrect) setQuizScore(s => s + 1);

    if (quizStep < activeModule.quizData.length - 1) {
      setQuizStep(s => s + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Player Header */}
      <div className="h-16 border-b border-gray-200 flex items-center px-6 bg-white shrink-0 justify-between shadow-sm z-20 sticky top-0">
        <div className="flex items-center gap-4 overflow-hidden">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl text-slate-600 transition-colors border border-transparent hover:border-gray-200">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="border-l border-gray-200 pl-4">
            <h1 className="font-bold text-base sm:text-lg text-slate-800 truncate max-w-[200px] sm:max-w-md">{course.title}</h1>
            <p className="text-xs text-slate-500 hidden sm:block flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span> {course.instructor}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {course.isLive && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-100">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </div>
              CANLI YAYIN
            </div>
          )}
          <div className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            %{course.progress} Tamamlandı
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth custom-scrollbar">
          {/* Layout adjustments based on content type */}
          <div className={clsx("mx-auto space-y-6 transition-all duration-500", activeModule?.type === 'live' ? "max-w-[1600px]" : "max-w-5xl")}>

            {/* Content Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {activeModule?.type === 'live' ? (
                <div className="p-2 bg-slate-950">
                  <LiveClassroom
                    title={activeModule.title}
                    instructor={course.instructor}
                    userRole={UserRole.STUDENT}
                    onEndCall={() => {
                      const nextModule = course.modules?.find(m => m.id === (activeModule.id + 1));
                      if (nextModule) handleModuleClick(nextModule);
                    }}
                  />
                </div>
              ) : activeModule?.type === 'quiz' && activeModule.quizData ? (
                // QUIZ INTERFACE
                <div className="p-8 min-h-[500px] flex flex-col items-center justify-center bg-slate-50/50">
                  {!quizFinished ? (
                    <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                      <div className="flex justify-between items-center mb-8">
                        <div>
                          <span className="text-sm font-bold text-indigo-600 block">Soru {quizStep + 1}</span>
                          <span className="text-xs text-gray-400">Toplam {activeModule.quizData.length} soru</span>
                        </div>
                        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">Orta Seviye</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full mb-8 overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out" style={{ width: `${((quizStep) / activeModule.quizData.length) * 100}%` }}></div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">{activeModule.quizData[quizStep].text}</h3>
                      <div className="space-y-3 mb-8">
                        {activeModule.quizData[quizStep].options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedOption(idx)}
                            className={clsx(
                              "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group",
                              selectedOption === idx
                                ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm"
                                : "border-gray-100 hover:border-indigo-200 hover:bg-white text-slate-700 hover:shadow-sm bg-gray-50/30"
                            )}
                          >
                            <span className="font-medium">{opt}</span>
                            <div className={clsx(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                              selectedOption === idx ? "border-indigo-600 bg-indigo-600" : "border-gray-300 group-hover:border-indigo-300"
                            )}>
                              {selectedOption === idx && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-end pt-4 border-t border-gray-50">
                        <button
                          onClick={handleQuizSubmit}
                          disabled={selectedOption === null}
                          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 active:scale-95"
                        >
                          {quizStep === activeModule.quizData.length - 1 ? 'Sınavı Bitir' : 'Sonraki Soru'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    // QUIZ RESULT
                    <div className="text-center animate-in zoom-in duration-300 max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 ring-8 ring-green-50">
                        <Award className="w-12 h-12" />
                      </div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-2">Tebrikler!</h2>
                      <p className="text-gray-500 mb-8">Modülü başarıyla tamamladınız.</p>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 inline-block w-full mb-8">
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">Başarı Skoru</p>
                        <p className="text-5xl font-black text-indigo-600 tracking-tight">{quizScore} <span className="text-2xl text-gray-400 font-normal">/ {activeModule.quizData.length}</span></p>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setQuizFinished(false)} className="flex-1 py-3 text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl transition-colors">Tekrarla</button>
                        <button onClick={onBack} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">Devam Et</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // VIDEO PLAYER
                <div className="aspect-video bg-slate-900 relative group overflow-hidden">
                  <img src={course.imageUrl} alt="Cover" className="w-full h-full object-cover opacity-40" />

                  {/* Center Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer hover:bg-indigo-600 hover:text-white text-white border border-white/20 shadow-2xl">
                      <PlayCircle className="w-12 h-12 fill-current ml-1" />
                    </div>
                  </div>

                  {/* Bottom Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 pb-4 px-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-full h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer hover:h-2 transition-all">
                      <div className="h-full bg-indigo-500 w-1/3 rounded-full relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-6">
                        <button className="hover:text-indigo-400 transition-colors"><PlayCircle className="w-8 h-8" /></button>
                        <span className="text-sm font-medium font-mono">04:20 / 12:45</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button className="text-xs font-bold bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition border border-white/10" onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1)}>
                          {playbackSpeed}x
                        </button>
                        <button title="Altyazı" className="hover:text-indigo-400"><Captions className="w-6 h-6" /></button>
                        <button className="hover:text-indigo-400"><Settings className="w-6 h-6" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tabs & Content - Hide if Live mode to minimize distractions */}
            {activeModule?.type !== 'live' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[400px]">
                <div className="flex border-b border-gray-100 px-6 pt-2">
                  <TabButton label="Genel Bakış" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                  <TabButton label="Soru & Cevap" active={activeTab === 'qa'} onClick={() => setActiveTab('qa')} />
                  <TabButton label="Kaynaklar" active={activeTab === 'resources'} onClick={() => setActiveTab('resources')} />
                  <TabButton label="Notlarım" active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} />
                </div>

                <div className="p-8">
                  {activeTab === 'overview' && (
                    <div className="prose prose-slate max-w-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">Ders Hakkında</h3>
                      <p className="text-gray-600 leading-relaxed text-lg">{course.description}</p>

                      <h4 className="font-bold mt-8 mb-4 text-slate-900 text-lg">Bu derste neler öğreneceksiniz?</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {['Temel kavramlar ve terminoloji', 'Pratik uygulama örnekleri', 'Sektörel ipuçları', 'Bitirme projesi hazırlığı'].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                            <span className="font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'resources' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
                      <h3 className="font-bold text-slate-900 text-lg mb-6">İndirilebilir Materyaller</h3>
                      <ResourceCard
                        icon={<FileText className="w-6 h-6 text-red-600" />}
                        bgColor="bg-red-50"
                        title="Ders Slaytları (PDF)"
                        size="2.4 MB"
                      />
                      <ResourceCard
                        icon={<FileText className="w-6 h-6 text-blue-600" />}
                        bgColor="bg-blue-50"
                        title="Kaynak Kodlar (ZIP)"
                        size="14 MB"
                      />
                    </div>
                  )}

                  {activeTab === 'qa' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
                      <div className="flex justify-between items-center mb-8">
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">Topluluk Tartışmaları</h3>
                          <p className="text-slate-500 text-sm">Diğer öğrencilerle fikir alışverişinde bulunun.</p>
                        </div>
                        <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
                          Soru Sor
                        </button>
                      </div>
                      <div className="space-y-4">
                        {MOCK_FORUM_POSTS.map(post => (
                          <div key={post.id} className="p-5 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all hover:border-indigo-100">
                            <div className="flex items-start gap-4">
                              <img src={post.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt={post.user} />
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-bold text-slate-900">{post.user}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{post.date}</p>
                                  </div>
                                </div>
                                <p className="text-slate-700 mt-2 leading-relaxed">{post.content}</p>
                                <div className="flex items-center gap-6 mt-4 pt-3 border-t border-gray-100">
                                  <button className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white transition-colors">
                                    <ThumbsUp className="w-4 h-4" /> {post.likes} Beğeni
                                  </button>
                                  <button className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white transition-colors">
                                    <MessageCircle className="w-4 h-4" /> {post.replies} Yanıt
                                  </button>
                                  <button className="text-xs font-bold text-slate-400 hover:text-red-600 flex items-center gap-1.5 ml-auto">
                                    <AlertCircle className="w-4 h-4" /> Raporla
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'notes' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100 mb-6 relative">
                        <div className="absolute -top-3 left-6 bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">İpucu</div>
                        <p className="text-sm text-yellow-800">
                          Not alırken videonun o anki süresi otomatik olarak kaydedilir. Daha sonra notunuza tıklayarak videonun o anına gidebilirsiniz.
                        </p>
                      </div>
                      <textarea
                        className="w-full h-48 p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-700 resize-none shadow-sm"
                        placeholder="Ders notlarınızı buraya almaya başlayın..."
                      ></textarea>
                      <div className="mt-4 flex justify-end">
                        <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
                          Notu Kaydet
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Sidebar (Playlist) */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0 shadow-xl z-10 hidden xl:flex">
          <div className="p-6 border-b border-gray-200 bg-gray-50/30">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
              <Video className="w-4 h-4 text-indigo-600" />
              Ders İçeriği
            </h3>
            <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
              <span>{course.completedModules} / {course.totalModules} Tamamlandı</span>
              <span>%{(course.completedModules / course.totalModules * 100).toFixed(0)}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out" style={{ width: `${(course.completedModules / course.totalModules * 100)}%` }}></div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {course.modules ? course.modules.map((module, idx) => (
              <div
                key={module.id}
                onClick={() => handleModuleClick(module)}
                className={clsx(
                  "group px-5 py-4 cursor-pointer border-l-4 transition-all border-b border-gray-50",
                  activeModule?.id === module.id
                    ? "border-l-indigo-600 bg-indigo-50/60"
                    : "border-l-transparent hover:bg-gray-50 hover:border-l-indigo-200"
                )}
              >
                <div className="flex gap-4">
                  <div className="mt-1 shrink-0">
                    {module.isCompleted ? (
                      <div className="bg-green-100 text-green-600 rounded-full p-0.5"><CheckCircle className="w-4 h-4" /></div>
                    ) : module.type === 'quiz' ? (
                      <div className="bg-orange-100 text-orange-600 rounded-full p-0.5"><HelpCircle className="w-4 h-4" /></div>
                    ) : module.type === 'live' ? (
                      <div className="bg-red-100 text-red-600 rounded-full p-0.5 animate-pulse"><Video className="w-4 h-4" /></div>
                    ) : (
                      <div className={clsx(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold",
                        activeModule?.id === module.id ? "border-indigo-600 text-indigo-600" : "border-gray-300 text-gray-400"
                      )}>{idx + 1}</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={clsx(
                      "text-sm font-bold mb-1 truncate",
                      activeModule?.id === module.id ? 'text-indigo-700' : 'text-slate-700'
                    )}>{module.title}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        {module.type === 'video' ? <PlayCircle size={12} /> : module.type === 'quiz' ? <HelpCircle size={12} /> : module.type === 'live' ? <Video size={12} /> : <FileText size={12} />}
                        {module.duration}
                      </span>
                      {module.type === 'video' && <span className="bg-gray-100 px-1.5 rounded text-[10px]">Video</span>}
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                <span className="text-sm text-gray-500">Yükleniyor...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={clsx(
      "px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2",
      active
        ? 'text-indigo-600 border-indigo-600 bg-indigo-50/30'
        : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-gray-50'
    )}
  >
    {label}
  </button>
);

const ResourceCard = ({ icon, bgColor, title, size }: any) => (
  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group cursor-pointer bg-white">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${bgColor}`}>{icon}</div>
      <div>
        <p className="font-bold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500 font-medium">{size}</p>
      </div>
    </div>
    <button className="p-2 text-gray-400 group-hover:text-indigo-600 group-hover:bg-indigo-100 rounded-lg transition-colors">
      <Download className="w-5 h-5" />
    </button>
  </div>
);

export default CoursePlayer;
