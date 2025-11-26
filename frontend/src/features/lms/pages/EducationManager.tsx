
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Upload, Trash2, Edit2, Calendar, Clock,
  FileText, Video, MonitorPlay, ClipboardList, HelpCircle, FileCheck2,
  X, MoreHorizontal, CheckCircle2, AlertCircle, ChevronRight, PlayCircle
} from 'lucide-react';
import { EducationCategory } from './MyEducation';
import { CourseWizard } from '../components/CourseWizard';
import { lmsService } from '../../../services/lmsService';
import { Course, Category } from '../../../types/lms';
import clsx from 'clsx';

interface EducationManagerProps {
  category: EducationCategory;
}

const EducationManager: React.FC<EducationManagerProps> = ({ category: initialCategory }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  // Update activeCategory when prop changes
  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  const [isWizardOpen, setWizardOpen] = useState(false);
  const [isContentModalOpen, setContentModalOpen] = useState(false);

  // Real Data State
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection State
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedWeek, setSelectedWeek] = useState<string>('');

  // Content Form State
  const [contentData, setContentData] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesData, categoriesData] = await Promise.all([
        lmsService.getMyCourses(),
        lmsService.getCategories()
      ]);
      setCourses(coursesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCourseData = courses.find(c => c.id.toString() === selectedCourseId);

  // Config based on Category
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
  }[activeCategory];

  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);

  const handleContentSubmit = async () => {
    if (!selectedCourseId || !selectedWeek || !contentData.title) return;

    setLoading(true);
    try {
      const lessonData: any = {
        title: contentData.title,
        resourcetype: activeCategory === 'videos' ? 'VideoLesson' :
          activeCategory === 'ebooks' ? 'PDFLesson' :
            activeCategory === 'live' ? 'LiveLesson' :
              activeCategory === 'quizzes' ? 'QuizLesson' :
                activeCategory === 'assignments' ? 'Assignment' : 'HTMLLesson'
      };

      // Add category specific fields
      if (activeCategory === 'videos') {
        if (contentData.useUrl && contentData.video_url) {
          lessonData.video_url = contentData.video_url;
        } else if (contentData.file) {
          lessonData.source_file = contentData.file;
        }
      } else if (activeCategory === 'ebooks' && contentData.file) {
        lessonData.file = contentData.file;
      } else if (activeCategory === 'live') {
        lessonData.start_time = contentData.start_time;
        lessonData.meeting_link = contentData.meeting_link;
        lessonData.duration = contentData.duration;
      } else if (activeCategory === 'quizzes') {
        lessonData.duration_minutes = Number(contentData.duration_minutes);
        lessonData.passing_score = Number(contentData.passing_score);
      }

      if (editingLessonId) {
        await lmsService.updateLesson(editingLessonId, lessonData);
      } else {
        lessonData.order = 1; // Default order for new
        await lmsService.createLesson(Number(selectedWeek), lessonData);
      }

      // Success
      setContentModalOpen(false);
      setContentData({});
      setEditingLessonId(null);

      // Refresh data
      if (editingCourse) {
        const updatedCourse = await lmsService.getCourse(editingCourse.id);
        setEditingCourse(updatedCourse);
        setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
      } else {
        fetchData();
      }

      alert(editingLessonId ? 'İçerik güncellendi!' : 'İçerik başarıyla eklendi!');
    } catch (error) {
      console.error('Content save failed', error);
      alert('İşlem sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // ... existing code ...



  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setWizardOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await lmsService.deleteCourse(id);
      setDeletingId(null);
      fetchData();
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      await lmsService.updateCourse(course.id, { is_published: !course.is_published });
      fetchData();
    } catch (error) {
      console.error('Failed to update publish status', error);
      alert('Durum güncellenirken bir hata oluştu.');
    }
  };

  return (
    <>
      {isWizardOpen ? (
        <CourseWizard
          categories={categories}
          initialData={editingCourse}
          onComplete={() => {
            setWizardOpen(false);
            setEditingCourse(null);
            fetchData(); // Refresh list
          }}
          onCancel={() => {
            setWizardOpen(false);
            setEditingCourse(null);
          }}
          onCourseUpdated={(updatedCourse) => {
            setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
            setEditingCourse(updatedCourse);
          }}
          onAddContent={(moduleId) => {
            if (editingCourse) {
              setSelectedCourseId(editingCourse.id.toString());
              setSelectedWeek(moduleId.toString());
              setContentModalOpen(true);
            }
          }}
          onDeleteContent={async (lessonId) => {
            if (confirm('Bu içeriği silmek istediğinize emin misiniz?')) {
              try {
                await lmsService.deleteLesson(lessonId);
                // Refresh course data to update the UI
                if (editingCourse) {
                  const updatedCourse = await lmsService.getCourse(editingCourse.id);
                  setEditingCourse(updatedCourse);
                  setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
                }
              } catch (error) {
                console.error('Failed to delete lesson', error);
                alert('İçerik silinirken bir hata oluştu.');
              }
            }
          }}
          onEditContent={(lesson, courseId) => {
            // Use passed courseId or fallback to editingCourse.id
            const cId = courseId || editingCourse?.id;

            if (cId) {
              setEditingLessonId(lesson.id);
              setSelectedCourseId(cId.toString());

              // Find the course object to find the module
              // If editingCourse is set and matches, use it. Otherwise find in courses list.
              const currentCourse = (editingCourse && editingCourse.id === cId)
                ? editingCourse
                : courses.find(c => c.id === cId);

              if (currentCourse) {
                // Find which module this lesson belongs to
                const module = currentCourse.modules?.find(m => m.lessons?.some(l => l.id === lesson.id));
                if (module) setSelectedWeek(module.id!.toString());
              }

              // Populate form data
              const newData: any = {
                title: lesson.title,
              };

              if (lesson.resourcetype === 'VideoLesson') {
                setActiveCategory('videos');
                if (lesson.video_url) {
                  newData.useUrl = true;
                  newData.video_url = lesson.video_url;
                } else {
                  newData.useUrl = false;
                }
              } else if (lesson.resourcetype === 'PDFLesson') {
                setActiveCategory('ebooks');
                // PDF specific data if needed
              } else if (lesson.resourcetype === 'LiveLesson') {
                setActiveCategory('live');
                newData.start_time = lesson.start_time;
                newData.meeting_link = lesson.meeting_link;
                newData.duration = lesson.duration;
              } else if (lesson.resourcetype === 'QuizLesson') {
                setActiveCategory('quizzes');
                newData.duration_minutes = lesson.duration_minutes;
                newData.passing_score = lesson.passing_score;
              } else if (lesson.resourcetype === 'Assignment') {
                setActiveCategory('assignments');
              }

              setContentData(newData);
              setContentModalOpen(true);
            }
          }}
        />
      ) : (
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
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditingCourse(null);
                  setWizardOpen(true);
                }}
                className="flex items-center gap-2 bg-white border border-gray-200 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                <Plus className="w-5 h-5" />
                Eğitim Oluştur
              </button>
              <button
                onClick={() => setContentModalOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                {config.actionText}
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-xs font-bold text-gray-500 uppercase">Toplam Eğitim</div>
              <div className="text-2xl font-black text-slate-800 mt-1">{courses.length}</div>
            </div>
            {/* More stats can be added here */}
          </div>

          {/* Content Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-1 overflow-hidden flex flex-col">
            {courses.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="bg-gray-50 p-6 rounded-full mb-4">
                  <ClipboardList className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">Henüz İçerik Yok</h3>
                <p className="text-slate-500 max-w-sm mt-2">
                  Bu kategoride henüz bir içerik oluşturulmamış. Yukarıdaki butonları kullanarak yeni içerik ekleyebilirsiniz.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase">Eğitim</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase">Kategori</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase">Durum</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {courses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                              {course.image ? (
                                <img
                                  src={typeof course.image === 'string' && !course.image.startsWith('http')
                                    ? `http://localhost:8001${course.image}`
                                    : course.image instanceof File
                                      ? URL.createObjectURL(course.image)
                                      : course.image}
                                  alt={course.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <FileText size={20} />
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800">{course.title}</h4>
                              <p className="text-xs text-slate-500 line-clamp-1">{course.description || 'Açıklama yok'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                            {course.category_name || 'Genel'}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleTogglePublish(course)}
                            className={clsx(
                              "text-xs font-bold px-2 py-1 rounded-full transition-all hover:scale-105 active:scale-95",
                              course.is_published
                                ? "bg-green-100 text-green-600 hover:bg-green-200"
                                : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                            )}
                            title={course.is_published ? "Yayından Kaldır" : "Yayınla"}
                          >
                            {course.is_published ? 'Yayında' : 'Taslak'}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(course)}
                              className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
                              title="Düzenle"
                            >
                              <Edit2 size={18} />
                            </button>

                            {deletingId === course.id ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleDelete(course.id)}
                                  className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600"
                                >
                                  Sil
                                </button>
                                <button
                                  onClick={() => setDeletingId(null)}
                                  className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-300"
                                >
                                  İptal
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeletingId(course.id)}
                                className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                                title="Sil"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setSelectedCourseId(course.id.toString());
                                setContentModalOpen(true);
                              }}
                              className="p-2 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
                              title="İçerik Ekle"
                            >
                              <ChevronRight size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Student View Preview Section */}
          <div className="mt-12 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <MonitorPlay className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Öğrenci Görünümü (Önizleme)</h2>
                <p className="text-slate-500 text-sm">Öğrencilerinizin eğitimleri nasıl gördüğünü buradan inceleyebilirsiniz.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map(course => (
                <div
                  key={course.id}
                  onClick={() => navigate(`/egitim/oynatici/${course.id}`)}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
                >
                  <div className="relative aspect-video bg-slate-100 overflow-hidden">
                    <img
                      src={course.image
                        ? (typeof course.image === 'string' && course.image.startsWith('http')
                          ? course.image
                          : `http://localhost:8001${course.image}`)
                        : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 shadow-lg">
                        <PlayCircle className="w-6 h-6 text-indigo-600 fill-current" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={clsx(
                        "text-xs font-bold px-2 py-1 rounded-full shadow-sm",
                        course.is_published ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                      )}>
                        {course.is_published ? 'Yayında' : 'Taslak'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                        {course.category_name || 'Genel'}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Video size={12} /> {course.total_modules || 0} Modül
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {course.title}
                    </h3>

                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                      {course.description || 'Açıklama bulunmuyor.'}
                    </p>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                          {course.instructor?.first_name?.[0] || 'E'}
                        </div>
                        <span className="text-xs font-medium text-slate-600">
                          {course.instructor?.first_name} {course.instructor?.last_name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        İzle <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {courses.length === 0 && (
                <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-slate-500">Henüz oluşturulmuş bir eğitim bulunmuyor.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Modal */}
      {isContentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-800">{config.actionText}</h3>
              <button onClick={() => setContentModalOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>

            <div className="space-y-4">
              {/* Course Selection */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Hangi Ders İçin?</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Ders Seçiniz...</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              {/* Module Selection */}
              {selectedCourseId && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Hangi Hafta/Modül?</label>
                  <select
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Modül Seçiniz...</option>
                    {courses.find(c => c.id.toString() === selectedCourseId)?.modules?.map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                  {(!courses.find(c => c.id.toString() === selectedCourseId)?.modules?.length) && (
                    <p className="text-xs text-red-500">Bu derse ait modül bulunamadı. Önce dersi düzenleyip modül ekleyin.</p>
                  )}
                </div>
              )}

              {/* Common: Title */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">İçerik Başlığı</label>
                <input
                  type="text"
                  value={contentData.title || ''}
                  onChange={e => setContentData({ ...contentData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Örn: React Giriş Dersi"
                />
              </div>

              {/* Category Specific Fields */}
              {activeCategory === 'videos' && (
                <div className="space-y-4">
                  <div className="flex gap-4 border-b border-gray-100">
                    <button
                      className={clsx("pb-2 text-sm font-bold border-b-2 transition-colors", !contentData.useUrl ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-400")}
                      onClick={() => setContentData({ ...contentData, useUrl: false })}
                    >
                      Dosya Yükle
                    </button>
                    <button
                      className={clsx("pb-2 text-sm font-bold border-b-2 transition-colors", contentData.useUrl ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-400")}
                      onClick={() => setContentData({ ...contentData, useUrl: true })}
                    >
                      Video Linki
                    </button>
                  </div>

                  {!contentData.useUrl ? (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Video Dosyası (MP4)</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                        <input
                          type="file"
                          accept="video/mp4"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={e => setContentData({ ...contentData, file: e.target.files?.[0] })}
                        />
                        <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          {contentData.file ? contentData.file.name : "MP4 yüklemek için tıklayın veya sürükleyin"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Video URL</label>
                      <input
                        type="url"
                        value={contentData.video_url || ''}
                        onChange={e => setContentData({ ...contentData, video_url: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="https://..."
                      />
                    </div>
                  )}
                </div>
              )}

              {activeCategory === 'ebooks' && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">PDF Dosyası</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept=".pdf"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={e => setContentData({ ...contentData, file: e.target.files?.[0] })}
                    />
                    <FileText className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      {contentData.file ? contentData.file.name : "PDF yüklemek için tıklayın veya sürükleyin"}
                    </p>
                  </div>
                </div>
              )}

              {activeCategory === 'live' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Başlangıç Tarihi</label>
                      <input
                        type="datetime-local"
                        value={contentData.start_time || ''}
                        onChange={e => setContentData({ ...contentData, start_time: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Süre (Dakika)</label>
                      <input
                        type="number"
                        value={contentData.duration || ''}
                        onChange={e => setContentData({ ...contentData, duration: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Toplantı Linki</label>
                    <input
                      type="url"
                      value={contentData.meeting_link || ''}
                      onChange={e => setContentData({ ...contentData, meeting_link: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://zoom.us/j/..."
                    />
                  </div>
                </>
              )}

              {activeCategory === 'quizzes' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Süre (Dakika)</label>
                    <input
                      type="number"
                      value={contentData.duration_minutes || ''}
                      onChange={e => setContentData({ ...contentData, duration_minutes: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Geçme Notu</label>
                    <input
                      type="number"
                      value={contentData.passing_score || ''}
                      onChange={e => setContentData({ ...contentData, passing_score: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => {
                  setContentModalOpen(false);
                  setContentData({});
                  setSelectedCourseId('');
                  setSelectedWeek('');
                }}
                className="px-6 py-2.5 text-slate-600 font-bold hover:bg-gray-100 rounded-xl"
              >
                İptal
              </button>
              <button
                onClick={handleContentSubmit}
                disabled={loading || !selectedCourseId || !selectedWeek || !contentData.title}
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EducationManager;
