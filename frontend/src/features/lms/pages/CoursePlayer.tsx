
import React, { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle, PlayCircle, FileText, MessageSquare, Download, Video, Settings, Captions, HelpCircle, ThumbsUp, MessageCircle, AlertCircle, Award, MonitorPlay, ClipboardList } from 'lucide-react';
import { lmsService } from '../../../services/lmsService';
import { Course, Module, Lesson } from '../../../types/lms';
import { UserRole } from '@/types';
import LiveClassroom from '../../realtime/components/LiveClassroom';
import clsx from 'clsx';

interface CoursePlayerProps {
  courseId: string | null;
  onBack: () => void;
}

type TabType = 'overview' | 'qa' | 'resources' | 'notes';

const CoursePlayer: React.FC<CoursePlayerProps> = ({ courseId, onBack }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Fetch Course Data
  useEffect(() => {
    if (!courseId) return;
    const fetchCourse = async () => {
      try {
        const data = await lmsService.getCourse(Number(courseId));
        setCourse(data);
        // Set first lesson as active if available
        if (data.modules && data.modules.length > 0 && data.modules[0].lessons && data.modules[0].lessons.length > 0) {
          setActiveLesson(data.modules[0].lessons[0]);
        }
      } catch (error) {
        console.error('Failed to fetch course', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (loading) return <div className="flex items-center justify-center h-full">Yükleniyor...</div>;
  if (!course) return <div className="flex items-center justify-center h-full">Eğitim bulunamadı.</div>;

  const handleLessonClick = (lesson: Lesson) => {
    setActiveLesson(lesson);
  };

  const getVideoSrc = (lesson: Lesson) => {
    if (lesson.video_url) return lesson.video_url;
    // Note: source_file is usually not returned in read serializer unless configured, 
    // but if it is, it might be a URL. 
    // If backend returns 'file' or 'source_file' as URL:
    // We need to check the actual response structure for VideoLesson.
    // Assuming video_url is the primary way for now as per our previous edits.
    return '';
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
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span> {course.instructor?.first_name} {course.instructor?.last_name}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth custom-scrollbar">
          <div className="mx-auto space-y-6 max-w-5xl">

            {/* Content Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
              {activeLesson ? (
                <>
                  {activeLesson.resourcetype === 'VideoLesson' && (
                    <div className="aspect-video bg-slate-900 relative group overflow-hidden flex items-center justify-center">
                      {(() => {
                        const url = activeLesson.video_url || activeLesson.source_file;
                        if (!url) return <div className="text-white">Video kaynağı bulunamadı.</div>;

                        // Check for YouTube
                        const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^#&?]*)/);
                        if (youtubeMatch && youtubeMatch[1]) {
                          return (
                            <iframe
                              src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={activeLesson.title}
                            />
                          );
                        }

                        // Check for Vimeo
                        const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
                        if (vimeoMatch && vimeoMatch[1]) {
                          return (
                            <iframe
                              src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
                              className="w-full h-full"
                              allow="autoplay; fullscreen; picture-in-picture"
                              allowFullScreen
                              title={activeLesson.title}
                            />
                          );
                        }

                        // Fallback to direct file (MP4, etc.)
                        // If it's a relative path (uploaded file), prepend API URL
                        const videoSrc = url.startsWith('http') ? url : `http://localhost:8001${url}`;

                        return (
                          <video
                            controls
                            className="w-full h-full"
                            src={videoSrc}
                          >
                            Tarayıcınız video etiketini desteklemiyor.
                          </video>
                        );
                      })()}
                    </div>
                  )}

                  {activeLesson.resourcetype === 'LiveLesson' && (
                    <div className="p-8 text-center">
                      <MonitorPlay className="w-16 h-16 text-red-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold mb-2">{activeLesson.title}</h2>
                      <p className="text-gray-500 mb-6">Canlı Ders</p>
                      <a
                        href={activeLesson.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
                      >
                        Derse Katıl
                      </a>
                      <p className="mt-4 text-sm text-gray-400">Başlangıç: {new Date(activeLesson.start_time || '').toLocaleString()}</p>
                    </div>
                  )}

                  {activeLesson.resourcetype === 'PDFLesson' && (
                    <div className="p-12 text-center">
                      <FileText className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold mb-2">{activeLesson.title}</h2>
                      <p className="text-gray-500 mb-6">PDF Dokümanı</p>
                      {activeLesson.file && (
                        <a
                          href={activeLesson.file.startsWith('http') ? activeLesson.file : `http://localhost:8001${activeLesson.file}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors"
                        >
                          <Download className="w-5 h-5" /> Dokümanı İndir / Görüntüle
                        </a>
                      )}
                    </div>
                  )}

                  {activeLesson.resourcetype === 'QuizLesson' && (
                    <div className="p-12 text-center">
                      <HelpCircle className="w-16 h-16 text-teal-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold mb-2">{activeLesson.title}</h2>
                      <p className="text-gray-500 mb-6">Quiz</p>
                      <button className="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors">
                        Quize Başla
                      </button>
                    </div>
                  )}

                  {activeLesson.resourcetype === 'Assignment' && (
                    <div className="p-12 text-center">
                      <ClipboardList className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold mb-2">{activeLesson.title}</h2>
                      <p className="text-gray-500 mb-6">Ödev</p>
                      <p className="text-sm text-gray-400 mb-4">Son Teslim: {activeLesson.due_date ? new Date(activeLesson.due_date).toLocaleDateString() : 'Belirtilmemiş'}</p>
                    </div>
                  )}

                  {activeLesson.resourcetype === 'HTMLLesson' && (
                    <div className="p-8 prose max-w-none">
                      <h2 className="text-2xl font-bold mb-4">{activeLesson.title}</h2>
                      <div dangerouslySetInnerHTML={{ __html: activeLesson.content || '' }} />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[400px] text-gray-400">
                  <p>Görüntülemek için soldan bir ders içeriği seçin.</p>
                </div>
              )}
            </div>

            {/* Tabs & Content */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[400px]">
              <div className="flex border-b border-gray-100 px-6 pt-2">
                <TabButton label="Genel Bakış" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                <TabButton label="Soru & Cevap" active={activeTab === 'qa'} onClick={() => setActiveTab('qa')} />
                <TabButton label="Notlarım" active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} />
              </div>

              <div className="p-8">
                {activeTab === 'overview' && (
                  <div className="prose prose-slate max-w-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Ders Hakkında</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">{course.description}</p>
                  </div>
                )}
                {activeTab === 'qa' && <div className="text-center text-gray-500 py-8">Henüz soru sorulmamış.</div>}
                {activeTab === 'notes' && <div className="text-center text-gray-500 py-8">Henüz notunuz yok.</div>}
              </div>
            </div>

          </div>
        </div>

        {/* Sidebar (Playlist) */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0 shadow-xl z-10 hidden xl:flex">
          <div className="p-6 border-b border-gray-200 bg-gray-50/30">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
              <Video className="w-4 h-4 text-indigo-600" />
              Ders İçeriği
            </h3>
            <div className="text-xs text-gray-500">
              {course.modules?.length || 0} Modül
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {course.modules?.map((module, mIdx) => (
              <div key={module.id} className="border-b border-gray-100">
                <div className="px-5 py-3 bg-gray-50 font-bold text-slate-700 text-sm flex justify-between items-center">
                  <span>{module.title}</span>
                  <span className="text-xs text-gray-400">{module.lessons?.length || 0} Ders</span>
                </div>
                <div>
                  {module.lessons?.map((lesson, lIdx) => (
                    <div
                      key={lesson.id}
                      onClick={() => handleLessonClick(lesson)}
                      className={clsx(
                        "px-5 py-3 cursor-pointer transition-colors flex items-center gap-3 text-sm",
                        activeLesson?.id === lesson.id
                          ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600"
                          : "hover:bg-gray-50 text-slate-600 border-l-4 border-transparent"
                      )}
                    >
                      <div className="shrink-0">
                        {lesson.resourcetype === 'VideoLesson' && <PlayCircle size={16} />}
                        {lesson.resourcetype === 'PDFLesson' && <FileText size={16} />}
                        {lesson.resourcetype === 'QuizLesson' && <HelpCircle size={16} />}
                        {lesson.resourcetype === 'LiveLesson' && <MonitorPlay size={16} />}
                        {lesson.resourcetype === 'Assignment' && <ClipboardList size={16} />}
                      </div>
                      <span className="truncate">{lesson.title}</span>
                    </div>
                  ))}
                  {(!module.lessons || module.lessons.length === 0) && (
                    <div className="px-5 py-3 text-xs text-gray-400 italic">Bu modülde henüz ders yok.</div>
                  )}
                </div>
              </div>
            ))}
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

export default CoursePlayer;
