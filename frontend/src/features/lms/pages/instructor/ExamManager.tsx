import React, { useState, useEffect } from 'react';
import {
  Plus, X, FileCheck2, Calendar, Clock, Save, Edit2, Trash2,
  Users, Award, Shield, AlertCircle
} from 'lucide-react';
import { lmsService } from '../../../../services/lmsService';
import { Course } from '../../../../types/lms';
import clsx from 'clsx';

interface Exam {
  id: number;
  title: string;
  course_id: number;
  course_name: string;
  exam_date: string;
  duration_minutes: number;
  passing_score: number;
  question_count: number;
  attempts_count: number;
  is_certificate_exam: boolean;
}

const ExamManager: React.FC = () => {
  // Data State
  const [courses, setCourses] = useState<Course[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter State
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterType, setFilterType] = useState<'all' | 'certificate' | 'regular'>('all');
  
  // Modal State
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    course_id: '',
    exam_date: '',
    exam_time: '14:00',
    duration_minutes: 60,
    passing_score: 70,
    is_certificate_exam: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const coursesData = await lmsService.getMyCourses();
      setCourses(coursesData);
      
      // Mock data
      setExams([
        {
          id: 1,
          title: 'React Geliştirme Bitirme Sınavı',
          course_id: 1,
          course_name: 'React Geliştirme',
          exam_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          duration_minutes: 120,
          passing_score: 70,
          question_count: 50,
          attempts_count: 0,
          is_certificate_exam: true
        },
        {
          id: 2,
          title: 'Web Tasarım Ara Sınav',
          course_id: 2,
          course_name: 'Web Tasarım',
          exam_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          duration_minutes: 60,
          passing_score: 60,
          question_count: 30,
          attempts_count: 15,
          is_certificate_exam: false
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const isPast = (date: string) => new Date(date) < new Date();

  const filteredExams = exams.filter(exam => {
    const matchesCourse = filterCourse === 'all' || exam.course_id.toString() === filterCourse;
    const matchesType = filterType === 'all' || 
      (filterType === 'certificate' && exam.is_certificate_exam) ||
      (filterType === 'regular' && !exam.is_certificate_exam);
    return matchesCourse && matchesType;
  });

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      course_id: '',
      exam_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      exam_time: '14:00',
      duration_minutes: 60,
      passing_score: 70,
      is_certificate_exam: false
    });
    setModalOpen(true);
  };

  const openEditModal = (exam: Exam) => {
    const examDate = new Date(exam.exam_date);
    setEditingId(exam.id);
    setFormData({
      title: exam.title,
      course_id: exam.course_id.toString(),
      exam_date: examDate.toISOString().split('T')[0],
      exam_time: examDate.toTimeString().slice(0, 5),
      duration_minutes: exam.duration_minutes,
      passing_score: exam.passing_score,
      is_certificate_exam: exam.is_certificate_exam
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.course_id) return;

    try {
      // TODO: Create exam via API
      // For now, just mock add
      const newExam: Exam = {
        id: Date.now(),
        title: formData.title,
        course_id: Number(formData.course_id),
        course_name: courses.find(c => c.id.toString() === formData.course_id)?.title || '',
        exam_date: new Date(`${formData.exam_date}T${formData.exam_time}`).toISOString(),
        duration_minutes: formData.duration_minutes,
        passing_score: formData.passing_score,
        question_count: 0,
        attempts_count: 0,
        is_certificate_exam: formData.is_certificate_exam
      };

      if (editingId) {
        setExams(prev => prev.map(e => e.id === editingId ? { ...newExam, id: editingId } : e));
      } else {
        setExams(prev => [...prev, newExam]);
      }

      setModalOpen(false);
    } catch (error) {
      console.error('Failed to save exam', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu sınavı silmek istediğinizden emin misiniz?')) return;
    setExams(prev => prev.filter(e => e.id !== id));
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const getDaysUntil = (date: string) => {
    const diff = new Date(date).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-2xl"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-20 bg-gray-200 rounded-xl"></div>
          <div className="h-20 bg-gray-200 rounded-xl"></div>
          <div className="h-20 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="h-96 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl text-white shadow-lg shadow-indigo-200">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Sınav Yönetimi</h1>
              <p className="text-slate-500 text-sm">Sertifika ve bitirme sınavlarını yapılandırın</p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <Plus className="w-5 h-5" />
            Yeni Sınav
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{exams.length}</div>
              <div className="text-xs text-gray-500">Toplam Sınav</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">
                {exams.filter(e => e.is_certificate_exam).length}
              </div>
              <div className="text-xs text-gray-500">Sertifika Sınavı</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">
                {exams.filter(e => !isPast(e.exam_date)).length}
              </div>
              <div className="text-xs text-gray-500">Yaklaşan</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">
                {exams.reduce((acc, e) => acc + e.attempts_count, 0)}
              </div>
              <div className="text-xs text-gray-500">Toplam Katılım</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Tüm Kurslar</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'certificate' | 'regular')}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Tüm Tipler</option>
              <option value="certificate">Sertifika Sınavları</option>
              <option value="regular">Normal Sınavlar</option>
            </select>
          </div>

          <div className="text-sm text-gray-500">
            {filteredExams.length} sınav
          </div>
        </div>

        {/* Exams List */}
        <div className="divide-y divide-gray-100">
          {filteredExams.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <FileCheck2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Henüz sınav bulunmuyor</p>
            </div>
          ) : (
            filteredExams.map(exam => {
              const daysUntil = getDaysUntil(exam.exam_date);
              const past = isPast(exam.exam_date);
              
              return (
                <div key={exam.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={clsx(
                        "p-3 rounded-xl",
                        exam.is_certificate_exam 
                          ? "bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600"
                          : past 
                            ? "bg-gray-100 text-gray-500"
                            : "bg-indigo-100 text-indigo-600"
                      )}>
                        {exam.is_certificate_exam ? <Award className="w-5 h-5" /> : <FileCheck2 className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-slate-800">{exam.title}</h3>
                          {exam.is_certificate_exam && (
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              Sertifika
                            </span>
                          )}
                          {past ? (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              Tamamlandı
                            </span>
                          ) : daysUntil <= 3 ? (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {daysUntil} gün kaldı
                            </span>
                          ) : (
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                              Yaklaşıyor
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-3">{exam.course_name}</p>
                        
                        <div className="flex items-center gap-6 text-xs text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(exam.exam_date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(exam.exam_date)} • {exam.duration_minutes} dk
                          </span>
                          <span className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            %{exam.passing_score} geçme notu
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {exam.attempts_count} katılım
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(exam)}
                        className="p-2 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(exam.id)}
                        className="p-2 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-indigo-500" />
                {editingId ? 'Sınav Düzenle' : 'Yeni Sınav Oluştur'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sınav Başlığı</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Örn: React Bitirme Sınavı"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kurs</label>
                <select
                  value={formData.course_id}
                  onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">Seçiniz</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sınav Tarihi</label>
                  <input
                    type="date"
                    value={formData.exam_date}
                    onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Saati</label>
                  <input
                    type="time"
                    value={formData.exam_time}
                    onChange={(e) => setFormData({ ...formData, exam_time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Süre (dakika)</label>
                  <select
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value={30}>30 dakika</option>
                    <option value={45}>45 dakika</option>
                    <option value={60}>60 dakika</option>
                    <option value={90}>90 dakika</option>
                    <option value={120}>120 dakika</option>
                    <option value={180}>180 dakika</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Geçme Notu (%)</label>
                  <input
                    type="number"
                    value={formData.passing_score}
                    onChange={(e) => setFormData({ ...formData, passing_score: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="1"
                    max="100"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <input
                  type="checkbox"
                  id="certificate"
                  checked={formData.is_certificate_exam}
                  onChange={(e) => setFormData({ ...formData, is_certificate_exam: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                />
                <label htmlFor="certificate" className="flex items-center gap-2 text-sm font-medium text-amber-800 cursor-pointer">
                  <Award className="w-4 h-4" />
                  Bu sınav sertifika almak için gereklidir
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamManager;

