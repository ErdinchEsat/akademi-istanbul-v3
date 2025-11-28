
import React from 'react';
import {
  Plus, Trash2, Edit2,
  FileText, Video, MonitorPlay, ClipboardList, HelpCircle, FileCheck2,
  BookOpen, ChevronUp, ChevronDown, Eye, EyeOff, Layers
} from 'lucide-react';
import { EducationCategory } from './MyEducation';
import { CourseWizard } from '../components/CourseWizard';
import { ContentModal } from '../components/ContentModal';
import { Course } from '../../../types/lms';
import clsx from 'clsx';
import { useEducationManager } from '../../../hooks/useEducationManager';

interface EducationManagerProps {
  category: EducationCategory;
}

const EducationManager: React.FC<EducationManagerProps> = ({ category: initialCategory }) => {
  // Use custom hook for all state and business logic
  const {
    activeCategory,
    isWizardOpen,
    isContentModalOpen,
    courses,
    categories,
    loading,
    selectedCourseId,
    selectedWeek,
    editingCourse,
    editingLessonId,
    deletingId,
    contentData,
    modalContentType,
    setActiveCategory,
    setWizardOpen,
    setContentModalOpen,
    setSelectedCourseId,
    setSelectedWeek,
    setEditingCourse,
    setEditingLessonId,
    setDeletingId,
    setContentData,
    setModalContentType,
    setCourses,
    fetchData,
    handleContentSubmit,
    handleDelete,
    handleTogglePublish,
    handleEditLesson,
    handleDeleteLesson,
    navigate
  } = useEducationManager({ initialCategory });

  const selectedCourseData = courses.find(c => c.id.toString() === selectedCourseId);


  // Config based on Category
  const config = {
    documents: {
      title: 'Ders Materyali Yönetimi',
      icon: <FileText className="w-8 h-8 text-orange-500" />,
      desc: 'PDF, Word, Excel dosyalarınızı yükleyin.',
      actionText: 'Materyal Yükle',
      fields: ['Dosya Adı', 'Ders', 'Hafta', 'Boyut', 'Tür', 'Tarih']
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

  // ... existing code ...



  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setWizardOpen(true);
  };

  // Filtering & Sorting Logic
  const [filterText, setFilterText] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'published' | 'draft'>('all');
  const [sortField, setSortField] = React.useState<'title' | 'category' | 'status'>('title');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const filteredCourses = React.useMemo(() => {
    let result = courses.filter(course => {
      const matchesText = course.title.toLowerCase().includes(filterText.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(filterText.toLowerCase()));

      const matchesCategory = categoryFilter === 'all' || course.category.toString() === categoryFilter;

      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'published' && course.is_published) ||
        (statusFilter === 'draft' && !course.is_published);

      return matchesText && matchesCategory && matchesStatus;
    });

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortField === 'category') {
        comparison = (a.category_name || '').localeCompare(b.category_name || '');
      } else if (sortField === 'status') {
        comparison = (a.is_published ? 1 : 0) - (b.is_published ? 1 : 0);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [courses, filterText, categoryFilter, statusFilter, sortField, sortDirection]);

  const handleSort = (field: 'title' | 'category' | 'status') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: 'title' | 'category' | 'status' }) => {
    if (sortField !== field) return <ChevronUp className="w-4 h-4 opacity-0 group-hover:opacity-30" />;
    return sortDirection === 'asc'
      ? <ChevronUp className="w-4 h-4 text-indigo-600" />
      : <ChevronDown className="w-4 h-4 text-indigo-600" />;
  };

  // Show skeleton while loading
  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-2xl"></div>
        <div className="h-96 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

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
            setSelectedWeek(moduleId.toString());
            setModalContentType(activeCategory);
            setEditingLessonId(null); // CRITICAL: Must be null for CREATE
            setContentModalOpen(true);
          }}
          onDeleteContent={handleDeleteLesson}
          onEditContent={handleEditLesson}
        />
      ) : (
        <div className="p-6 w-full mx-auto space-y-6 h-full flex flex-col pb-20">
          {/* Compact Header */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 shrink-0">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg shadow-indigo-200">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Kurs Yönetimi</h1>
                  <p className="text-slate-500 text-sm">Eğitimlerinizi oluşturun, düzenleyin ve yönetin</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-black text-slate-800">{courses.length}</div>
                  <div className="text-xs text-gray-500">Toplam</div>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div className="text-center">
                  <div className="text-2xl font-black text-green-600">{courses.filter(c => c.is_published).length}</div>
                  <div className="text-xs text-gray-500">Yayında</div>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div className="text-center">
                  <div className="text-2xl font-black text-amber-500">{courses.filter(c => !c.is_published).length}</div>
                  <div className="text-xs text-gray-500">Taslak</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditingCourse(null);
                    setWizardOpen(true);
                  }}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                  Yeni Eğitim
                </button>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-1 overflow-hidden flex flex-col">
            {/* Filter Bar */}
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                {/* Search */}
                <div className="relative flex-1 sm:w-64 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Eğitim ara..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                  </div>
                </div>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Tüm Kategoriler</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="published">Yayında</option>
                  <option value="draft">Taslak</option>
                </select>
              </div>

              <div className="text-sm text-gray-500 font-medium">
                {filteredCourses.length} / {courses.length} kayıt
              </div>
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-auto min-h-0">
              {filteredCourses.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                  <div className="bg-gray-50 p-6 rounded-full mb-4">
                    <BookOpen className="w-12 h-12 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700">
                    {courses.length === 0 ? 'Henüz Eğitim Yok' : 'Sonuç Bulunamadı'}
                  </h3>
                  <p className="text-slate-500 max-w-sm mt-2">
                    {courses.length === 0
                      ? 'Yeni bir eğitim oluşturmak için yukarıdaki butonu kullanın.'
                      : 'Arama kriterlerinize uygun eğitim bulunamadı.'}
                  </p>
                  {courses.length === 0 && (
                    <button
                      onClick={() => {
                        setEditingCourse(null);
                        setWizardOpen(true);
                      }}
                      className="mt-4 flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      İlk Eğitimi Oluştur
                    </button>
                  )}
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-slate-600 text-sm">
                        <button
                          onClick={() => handleSort('title')}
                          className="flex items-center gap-1 group hover:text-indigo-600 transition-colors"
                        >
                          Eğitim Bilgileri
                          <SortIcon field="title" />
                        </button>
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-600 text-sm">
                        <button
                          onClick={() => handleSort('category')}
                          className="flex items-center gap-1 group hover:text-indigo-600 transition-colors"
                        >
                          Kategori
                          <SortIcon field="category" />
                        </button>
                      </th>
                      <th className="text-center py-4 px-4 font-semibold text-slate-600 text-sm">
                        Hafta
                      </th>
                      <th className="text-center py-4 px-4 font-semibold text-slate-600 text-sm">
                        <button
                          onClick={() => handleSort('status')}
                          className="flex items-center gap-1 group hover:text-indigo-600 transition-colors mx-auto"
                        >
                          Durum
                          <SortIcon field="status" />
                        </button>
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-slate-600 text-sm">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCourses.map((course) => (
                      <tr
                        key={course.id}
                        className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                        onClick={() => navigate(`/egitim/oynatici/${course.id}`)}
                      >
                        {/* Course Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex-shrink-0">
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
                                <div className="w-full h-full flex items-center justify-center text-indigo-400">
                                  <BookOpen size={24} />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-semibold text-slate-800 truncate max-w-[300px] group-hover:text-indigo-600 transition-colors">
                                {course.title}
                              </h3>
                              <p className="text-sm text-slate-500 truncate max-w-[300px]">
                                {course.description || 'Açıklama eklenmemiş'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full">
                            <Layers size={12} />
                            {course.category_name || 'Genel'}
                          </span>
                        </td>

                        {/* Module Count */}
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-slate-700 rounded-lg text-sm font-semibold">
                            {course.modules?.length || 0}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleTogglePublish(course)}
                            className={clsx(
                              "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95",
                              course.is_published
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                            )}
                          >
                            {course.is_published ? (
                              <>
                                <Eye size={14} />
                                Yayında
                              </>
                            ) : (
                              <>
                                <EyeOff size={14} />
                                Taslak
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(course)}
                              className="p-2 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
                              title="Düzenle"
                            >
                              <Edit2 size={18} />
                            </button>

                            {deletingId === course.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleDelete(course.id)}
                                  className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600"
                                >
                                  Sil
                                </button>
                                <button
                                  onClick={() => setDeletingId(null)}
                                  className="px-3 py-1.5 bg-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-300"
                                >
                                  İptal
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeletingId(course.id)}
                                className="p-2 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                                title="Sil"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Content Modal */}
      <ContentModal
        isOpen={isContentModalOpen}
        onClose={() => setContentModalOpen(false)}
        modalContentType={modalContentType}
        setModalContentType={setModalContentType}
        contentData={contentData}
        setContentData={setContentData}
        onSubmit={handleContentSubmit}
        courses={courses}
        selectedCourseId={selectedCourseId}
        setSelectedCourseId={setSelectedCourseId}
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
        editingLessonId={editingLessonId}
        setEditingLessonId={setEditingLessonId}
        loading={loading}
        actionText={editingLessonId ? 'İçerik Düzenle' : 'Yeni İçerik Ekle'}
      />
    </>
  );
};

export default EducationManager;
